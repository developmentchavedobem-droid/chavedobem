import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// O Next.js exige que a função seja exportada com o nome do método HTTP em MAIÚSCULO
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const refCode = cookieStore.get("chave_ref")?.value;

    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = Number(decoded.sub);
    const { campaignId } = await req.json();
    const normalizedCampaignId = Number(campaignId);

    if (!normalizedCampaignId) {
      return NextResponse.json({ error: "Campanha invÃ¡lida" }, { status: 400 });
    }

    // 1. Buscar o perfil do usuário logado (quem está clicando)
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });

    // 2. Buscar o ID do Link de Referência através do código do cookie
    let referralLinkId: number | null = null;
    if (refCode) {
      const refLink = await prisma.referralLink.findUnique({
        where: { code: refCode }
      });
      if (refLink) {
        referralLinkId = refLink.id;
      }
    }

    // 3. Verificar Trava de 3 Horas GLOBAL (em qualquer campanha)
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

    const lastTicketGlobal = await prisma.ticket.findFirst({
      where: {
        profileId: profile.id,
        createdAt: { gte: threeHoursAgo }
      },
      orderBy: { createdAt: 'desc' } // Pega o mais recente
    });

    if (lastTicketGlobal) {
      return NextResponse.json({ 
        error: "Você precisa aguardar 3 horas entre cada resgate em nossa plataforma.",
        userLastTicketDate: lastTicketGlobal.createdAt 
      }, { status: 429 });
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: normalizedCampaignId },
      select: { id: true, status: true }
    });

    if (!campaign || campaign.status !== "ACTIVE") {
      return NextResponse.json({ error: "Campanha indisponÃ­vel" }, { status: 404 });
    }

    // 4. Criar o ticket real e atualizar o contador da campanha juntos
    const ticket = await prisma.$transaction(async (tx) => {
      const createdTicket = await tx.ticket.create({
        data: {
          campaignId: normalizedCampaignId,
          profileId: profile.id,
          referralLinkId,
        },
        select: { createdAt: true },
      });

      await tx.campaign.update({
        where: { id: normalizedCampaignId },
        data: { currentTickets: { increment: 1 } }
      });

      return createdTicket;
    });

    return NextResponse.json({ success: true, userLastTicketDate: ticket.createdAt });

  } catch (error) {
    console.error("Erro no Claim:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// Opcional: Impedir que outros métodos (GET, PUT) retornem 404 e sim 405 de forma amigável
export async function GET() {
  return NextResponse.json({ error: "Método não permitido." }, { status: 405 });
}
