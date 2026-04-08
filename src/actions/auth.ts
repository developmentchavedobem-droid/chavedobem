'use server'

import prisma from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { ResendService } from "../services/resend.service";
import { confirmEmailTemplate, forgotPasswordTemplate } from "../constants/sample-email";

const mailService = new ResendService();

// --- ACTION DE CADASTRO (Já existente, mantendo sua regra de role) ---
export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const register_number = formData.get("register_number") as string; // Nome ajustado para bater com o DB
  const phone_number = formData.get("phone_number") as string;    // Nome ajustado para bater com o DB
  const birthdate = formData.get("birthdate") as string;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const cookieStore = await cookies();
    
    // Capturamos os cookies que foram setados quando o usuário clicou no link de indicação
    const refCode = cookieStore.get("chave_ref")?.value; 

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "CUSTOMER",
        profile: {
          create: {
            name,
            register_number,
            phone_number,
            birthdate: birthdate ? new Date(birthdate) : null,
            // Opcional: Se quiser salvar de quem ele é "filho" permanentemente no perfil
            // referredBy: refCode || "direto", 
            wallet: { create: { balance: 0, pending: 0 } }
          }
        }
      }
    });

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.verificationToken.create({
       data: {
         identifier: email,
         token,
         type: 'EMAIL_VERIFICATION',
         expiresAt
       }
     });

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;
    console.log("Link de verificação gerado:", verificationUrl);

    await mailService.sendEmail(
       email, 
       "Ative sua conta - Chave do Bem", 
       confirmEmailTemplate(verificationUrl)
     );

    return { success: true, userId: newUser.id };
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return { error: "Falha ao processar cadastro." };
  }
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) return { success: true }; // Por segurança, não confirmamos se e-mail existe

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await prisma.verificationToken.deleteMany({ where: { identifier: email, type: 'PASSWORD_RESET' } });
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      code,
      type: 'PASSWORD_RESET',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 min
    }
  });

  await mailService.sendEmail(email, "Seu código de recuperação", forgotPasswordTemplate(code));
  return { success: true };
}

// --- NOVA ACTION: LOGIN EXCLUSIVO PARA CUSTOMER ---
export async function customerLoginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    // 1. Busca o usuário
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // 2. Validações básicas e Trava de Role
    if (!user || user.role !== "CUSTOMER") {
      // Retornamos erro genérico por segurança, mas sabemos que barrou ADMIN/USER aqui
      return { error: "Credenciais inválidas ou acesso não permitido." };
    }

    // 3. Verifica senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: "E-mail ou senha incorretos." };
    }

    if (user.role === "CUSTOMER" && !user.emailVerified) {
      return { 
        error: "Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada para liberar seu acesso." 
      };
    }

    // 4. Gera o Token JWT (Igual ao que sua API faz)
    const token = jwt.sign(
      {
        sub: String(user.id),
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // 5. Salva o Cookie HTTP-Only
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 dias
    });

    return { success: true };
  } catch (error) {
    console.error("Erro no login do cliente:", error);
    return { error: "Erro interno ao realizar login." };
  }
}

export async function resendVerificationEmailAction(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "Usuário não encontrado." };
    if (user.emailVerified) return { error: "Este e-mail já está verificado." };

    await prisma.verificationToken.deleteMany({
      where: { identifier: email, type: 'EMAIL_VERIFICATION' }
    });

    const token = crypto.randomUUID();
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        type: 'EMAIL_VERIFICATION',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;

    // CHAMADA REAL PARA O RESEND
    await mailService.sendEmail(
      email, 
      "Novo Link de Ativação - Chave do Bem", 
      confirmEmailTemplate(verificationUrl)
    );

    return { success: true };
  } catch (error) {
    return { error: "Falha ao processar reenvio." };
  }
}

export async function resetPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  const code = formData.get("code") as string;
  const newPassword = formData.get("password") as string;

  try {
    // Busca o token/código no banco
    const vToken = await prisma.verificationToken.findFirst({
      where: { identifier: email, code, type: 'PASSWORD_RESET' }
    });

    if (!vToken || vToken.expiresAt < new Date()) {
      return { error: "Código inválido ou expirado." };
    }

    // Criptografa a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza o usuário e limpa o token
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    await prisma.verificationToken.delete({ where: { id: vToken.id } });

    return { success: true };
  } catch (error) {
    return { error: "Erro ao redefinir senha." };
  }
}