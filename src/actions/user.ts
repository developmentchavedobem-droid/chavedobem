'use server'

import prisma from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Configuração expandida das plataformas conforme solicitado
const PLATFORMS_CONFIG = [
  { name: "Instagram", code: "ig" },
  { name: "WhatsApp", code: "wa" },
  { name: "Facebook", code: "fb" },
  { name: "TikTok", code: "tk" },
  { name: "X (Twitter)", code: "x" },
  { name: "LinkedIn", code: "in" },
  { name: "YouTube", code: "yt" },
  { name: "Geral", code: "gr" }
];

export async function createStaffUserAction(formData: FormData) {
  // 1. Verificação de Segurança (Session & Role)
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = token ? (jwt.verify(token, process.env.JWT_SECRET!) as any) : null;

  if (!decoded || decoded.role !== "ADMIN") {
    return { error: "Ação não autorizada." };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // USANDO TRANSACTION PARA CRIAR A ESTRUTURA COMPLETA
    await prisma.$transaction(async (tx) => {
      // 1. Criar Usuário (USER)
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "USER", 
          // 2. Criar o Profile vinculado
          profile: {
            create: {
              name,
              // 3. Criar a Carteira (Wallet) vinculada ao Profile
              wallet: { create: { balance: 0, pending: 0 } },
              // 4. Criar os ReferralLinks para TODAS as redes sociais solicitadas
              links: {
                create: PLATFORMS_CONFIG.map(p => ({
                  platform: p.name,
                  // Gera um código único amigável: prefixo-aleatorio
                  // Ex: yt-k3j9n2
                  code: `${p.code}-${Math.random().toString(36).substring(2, 8)}`,
                }))
              }
            }
          }
        }
      });
    });

    revalidatePath("/usuarios");
    return { success: true };

  } catch (error: any) {
    console.error("Erro na transação:", error);
    return { error: "Erro ao criar usuário e gerar os links de divulgação." };
  }
}
export async function updateUserAction(userId: number, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const register_number = formData.get("register_number") as string;
  const phone_number = formData.get("phone_number") as string;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        profile: {
          update: {
            name,
            register_number,
            phone_number,
          }
        }
      }
    });

    revalidatePath("/usuarios");
    return { success: true };
  } catch (error) {
    return { error: "Falha ao atualizar usuário." };
  }
}

export async function deleteUserAction(userId: number) {
  try {
    // Devido ao onDelete: Cascade no seu schema, 
    // deletar o User deletará Profile, Wallet e Links automaticamente.
    await prisma.user.delete({
      where: { id: userId }
    });

    revalidatePath("/usuarios");
    return { success: true };
  } catch (error) {
    return { error: "Erro ao excluir usuário." };
  }
}