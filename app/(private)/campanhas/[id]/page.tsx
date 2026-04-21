import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import prisma from "@/src/lib/prisma";
import { FaEdit } from "react-icons/fa";
import DeleteCampaignButton from "@/src/components/campaign/DeleteCampaignButton";
import CampaignDrawPanel from "@/src/components/campaign/CampaignDrawPanel";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const numberFormatter = new Intl.NumberFormat("pt-BR");

export default async function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = token ? (jwt.decode(token) as any) : null;

  if (!decoded || decoded.role !== "ADMIN") {
    redirect("/home");
  }

  const { id } = await params;
  const campaignId = Number(id);
  const [campaign, earnings, participants] = await Promise.all([
    prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        _count: { select: { visits: true, tickets: true } },
        draws: {
          orderBy: { createdAt: "desc" },
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
        },
      },
    }),
    prisma.promoterDailyEarning.aggregate({
      where: { campaignId },
      _sum: {
        grossRevenue: true,
        promoterShare: true,
        platformShare: true,
        validVisits: true,
        tickets: true,
      },
    }),
    prisma.ticket.groupBy({
      by: ["profileId"],
      where: { campaignId },
    }),
  ]);

  if (!campaign) notFound();

  const grossRevenue = Number(earnings._sum.grossRevenue || 0);
  const promoterShare = Number(earnings._sum.promoterShare || 0);
  const platformShare = Number(earnings._sum.platformShare || 0);
  const visits = Number(earnings._sum.validVisits || campaign._count.visits || 0);
  const tickets = Number(earnings._sum.tickets || campaign._count.tickets || campaign.currentTickets || 0);
  const revenueProgress = campaign.goal ? Math.min((grossRevenue / campaign.goal) * 100, 100) : 0;
  const ticketProgress = campaign.ticketGoal ? Math.min((tickets / campaign.ticketGoal) * 100, 100) : 0;
  const isReadyToDraw =
    (campaign.goal > 0 && grossRevenue >= campaign.goal) ||
    (campaign.ticketGoal > 0 && tickets >= campaign.ticketGoal) ||
    campaign.status === "READY_TO_DRAW" ||
    campaign.status === "FINISHED";
  const draws = campaign.draws.map((draw) => ({
    id: draw.id,
    requestedWinners: draw.requestedWinners,
    totalParticipants: draw.totalParticipants,
    seed: draw.seed,
    createdAt: draw.createdAt.toISOString(),
    winners: draw.winners.map((winner) => ({
      id: winner.id,
      position: winner.position,
      profile: winner.profile,
      ticket: {
        id: winner.ticket.id,
        createdAt: winner.ticket.createdAt.toISOString(),
      },
    })),
  }));

  return (
    <div className="flex w-full max-w-full flex-col items-end gap-4 px-3 pb-4 sm:px-4 lg:px-0">
      <div className="w-full max-w-full overflow-hidden rounded-2xl bg-gray-100 lg:w-[80%]">
        <div
          className="relative flex min-h-72 flex-col justify-end p-6 text-white"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(2,109,155,0.12) 0%, rgba(2,109,155,0.88) 100%), url(${campaign.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="badge border-0 bg-white/20">{campaign.status}</div>
            <h1 className="text-3xl font-bold">{campaign.name}</h1>
            <p className="text-sm italic opacity-80">Slug: {campaign.slug}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-4">
          <MetricCard label="Arrecadado" value={currencyFormatter.format(grossRevenue)} />
          <MetricCard label="Meta de renda" value={currencyFormatter.format(campaign.goal)} />
          <MetricCard label="Visitas validas" value={numberFormatter.format(visits)} />
          <MetricCard label="Tickets" value={`${numberFormatter.format(tickets)} / ${numberFormatter.format(campaign.ticketGoal)}`} />
        </div>

        <div className="grid grid-cols-1 gap-4 px-4 pb-4 lg:grid-cols-3">
          <ProgressCard label="Progresso financeiro" value={revenueProgress} helper={`${currencyFormatter.format(grossRevenue)} de ${currencyFormatter.format(campaign.goal)}`} />
          <ProgressCard label="Progresso de tickets" value={ticketProgress} helper={`${numberFormatter.format(tickets)} de ${numberFormatter.format(campaign.ticketGoal)}`} />
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm font-bold text-gray-500">Divisao da receita</p>
            <div className="mt-3 space-y-2 text-sm font-bold text-zinc-600">
              <div className="flex justify-between">
                <span>Divulgadores</span>
                <span className="text-[#026D9B]">{currencyFormatter.format(promoterShare)}</span>
              </div>
              <div className="flex justify-between">
                <span>Plataforma</span>
                <span className="text-[#026D9B]">{currencyFormatter.format(platformShare)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4">
          <CampaignDrawPanel
            campaignId={campaign.id}
            isReadyToDraw={isReadyToDraw}
            uniqueParticipants={participants.length}
            draws={draws}
          />
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 bg-white/50 p-4 pt-0">
          <div className="flex gap-2 p-2">
            <Link href="/campanhas" className="btn btn-sm btn-ghost text-black">
              Voltar
            </Link>
          </div>
          <div className="flex gap-2 p-2">
            <DeleteCampaignButton id={campaign.id} />
            <Link href={`/campanhas/${campaign.id}/edit`} className="btn btn-sm btn-theme-primary gap-2">
              <FaEdit /> Editar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-[#026D9B]">{value}</p>
    </div>
  );
}

function ProgressCard({ label, value, helper }: { label: string; value: number; helper: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-2 flex justify-between text-sm font-bold text-gray-500">
        <span>{label}</span>
        <span>{value.toFixed(0)}%</span>
      </div>
      <progress className="progress progress-info h-3 w-full" value={value} max="100" />
      <p className="mt-2 text-xs font-semibold text-zinc-500">{helper}</p>
    </div>
  );
}
