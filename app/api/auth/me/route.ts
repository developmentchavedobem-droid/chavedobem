import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/src/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // 1. Decodificar o token
    // O erro 'payload is never used' acontecia porque você não extraía os dados dele
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // 2. Extrair o ID do usuário (Geralmente salvo no campo 'sub' do JWT)
    // O erro 'Cannot find name userId' resolvemos definindo a variável aqui
    const userId = Number(payload.sub);

    if (!userId) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    // 3. Buscar usuário com Profile e Tickets incluídos
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        profile: {
          include: {
            tickets: {
              include: {
                campaign: {
                  select: {
                    id: true,
                    name: true,
                    status: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Retornamos os dados limpos
    return NextResponse.json(user);

  } catch (err) {
    // O erro 'error is defined but never used' resolvemos logando ou removendo o nome da var
    console.error("Erro na rota /me:", err);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}