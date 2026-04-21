import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import prisma from "@/src/lib/prisma";

function shuffle<T>(items: T[], seed: string) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const hash = crypto.createHash("sha256").update(`${seed}:${index}`).digest("hex");
    const random = parseInt(hash.slice(0, 12), 16) / 0xffffffffffff;
    const target = Math.floor(random * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }

  return copy;
}

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string; role?: string };
    return decoded.role === "ADMIN" ? decoded : null;
  } catch {
    return null;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin(request);

  if (!session) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const campaignId = Number(id);
    const body = await request.json();
    const requestedWinners = Math.max(1, Math.floor(Number(body.winners || 1)));

    if (!Number.isFinite(campaignId)) {
      return NextResponse.json({ error: "Campanha invalida." }, { status: 400 });
    }

    const [campaign, earnings, tickets] = await Promise.all([
      prisma.campaign.findUnique({
        where: { id: campaignId },
        select: { id: true, name: true, goal: true, ticketGoal: true, status: true },
      }),
      prisma.promoterDailyEarning.aggregate({
        where: { campaignId },
        _sum: { grossRevenue: true, tickets: true },
      }),
      prisma.ticket.findMany({
        where: { campaignId },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          profileId: true,
          createdAt: true,
          profile: {
            select: {
              name: true,
              phone_number: true,
              user: { select: { email: true } },
            },
          },
        },
      }),
    ]);

    if (!campaign) {
      return NextResponse.json({ error: "Campanha nao encontrada." }, { status: 404 });
    }

    const grossRevenue = Number(earnings._sum.grossRevenue || 0);
    const ticketCount = Number(earnings._sum.tickets || tickets.length);
    const reachedRevenueGoal = campaign.goal > 0 && grossRevenue >= campaign.goal;
    const reachedTicketGoal = campaign.ticketGoal > 0 && ticketCount >= campaign.ticketGoal;

    if (!reachedRevenueGoal && !reachedTicketGoal) {
      return NextResponse.json(
        { error: "A campanha ainda nao atingiu a meta de renda ou de tickets." },
        { status: 400 }
      );
    }

    const participantsByProfile = new Map<number, (typeof tickets)[number]>();

    for (const ticket of tickets) {
      if (!participantsByProfile.has(ticket.profileId)) {
        participantsByProfile.set(ticket.profileId, ticket);
      }
    }

    const participants = Array.from(participantsByProfile.values());

    if (participants.length === 0) {
      return NextResponse.json({ error: "Nenhum participante com ticket foi encontrado." }, { status: 400 });
    }

    if (requestedWinners > participants.length) {
      return NextResponse.json(
        { error: `A campanha possui apenas ${participants.length} participante(s) unico(s).` },
        { status: 400 }
      );
    }

    const seed = crypto.randomUUID();
    const selected = shuffle(participants, seed).slice(0, requestedWinners);

    const draw = await prisma.$transaction(async (tx) => {
      const createdDraw = await tx.campaignDraw.create({
        data: {
          campaignId,
          requestedWinners,
          totalParticipants: participants.length,
          seed,
          createdByUserId: Number(session.sub),
        },
      });

      await tx.campaignWinner.createMany({
        data: selected.map((ticket, index) => ({
          drawId: createdDraw.id,
          campaignId,
          profileId: ticket.profileId,
          ticketId: ticket.id,
          position: index + 1,
        })),
      });

      await tx.campaign.update({
        where: { id: campaignId },
        data: { status: "FINISHED" },
      });

      return tx.campaignDraw.findUniqueOrThrow({
        where: { id: createdDraw.id },
        include: {
          winners: {
            orderBy: { position: "asc" },
            include: {
              profile: {
                select: {
                  name: true,
                  phone_number: true,
                  user: { select: { email: true } },
                },
              },
              ticket: { select: { id: true, createdAt: true } },
            },
          },
        },
      });
    });

    return NextResponse.json({ success: true, draw });
  } catch (error: any) {
    console.error("Erro ao sortear ganhadores:", error);
    return NextResponse.json({ error: error?.message || "Erro interno ao sortear ganhadores." }, { status: 500 });
  }
}
