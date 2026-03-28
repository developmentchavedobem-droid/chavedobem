'use server'

import prisma from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// --- ACTION DE CADASTRO (Já existente, mantendo sua regra de role) ---
export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const register_number = formData.get("register_number") as string; // Nome ajustado para bater com o DB
  const phone_number = formData.get("phone_number") as string;    // Nome ajustado para bater com o DB
  const birthdate = formData.get("birthdate") as string;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "E-mail já cadastrado no sistema." };

    const hashedPassword = await bcrypt.hash(password, 10);
    const cookieStore = await cookies();
    const refCode = cookieStore.get("chave_ref")?.value; // Pegamos o código (ex: tk-cp3544)

    // 1. Precisamos encontrar o ID do ReferralLink se ele existir
    let referralLinkId = null;
    if (refCode) {
      const link = await prisma.referralLink.findUnique({ where: { code: refCode } });
      if (link) referralLinkId = link.id;
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "CUSTOMER",
        profile: {
          create: {
            name,
            register_number, // Agora bate com o schema.prisma
            phone_number,    // Agora bate com o schema.prisma
            birthdate: birthdate ? new Date(birthdate) : null,
            
            // Nota: O seu schema Profile NÃO tem referredBy/originSource como Strings.
            // Se você quiser salvar isso, precisa adicionar no schema.prisma.
            // Por enquanto, criamos a carteira:
            wallet: {
              create: {
                balance: 0,
                pending: 0,
                totalEarned: 0
              }
            }
          }
        }
      }
    });

    return { success: true, userId: newUser.id };
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return { error: "Falha ao processar cadastro." };
  }
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