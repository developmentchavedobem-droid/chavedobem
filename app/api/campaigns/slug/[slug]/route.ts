import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // 1. Tentar identificar o usuário logado via Cookie/JWT
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    let loggedUserId: number | null = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        loggedUserId = Number(decoded.sub);
      } catch (e) {
        // Token inválido, ignoramos o ID (usuário será tratado como visitante)
      }
    }

    // 2. Buscar os dados da Campanha
    const campaign = await prisma.campaign.findUnique({
      where: { slug: slug },
      include: {
        _count: {
          select: { tickets: true },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campanha não encontrada" }, { status: 404 });
    }

    // 3. Buscar o último ticket GLOBAL do usuário (em qualquer campanha)
    // Isso garante que se ele resgatou na "Campanha A", a trava apareça na "Campanha B"
    let userLastTicketDate = null;
    
    if (loggedUserId) {
      const lastTicket = await prisma.ticket.findFirst({
        where: {
          profile: { userId: loggedUserId }
        },
        orderBy: {
          createdAt: 'desc' // Pega o resgate mais recente de todos
        },
        select: {
          createdAt: true
        }
      });
      
      userLastTicketDate = lastTicket?.createdAt || null;
    }

    // 4. Retornar os dados da campanha + a data do último resgate global
    return NextResponse.json({
      ...campaign,
      userLastTicketDate
    });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}