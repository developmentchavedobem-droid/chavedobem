import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/src/lib/prisma";
import { FaCopy, FaEdit, FaTrash } from "react-icons/fa";
import DeleteCampaignButton from "@/src/components/campaign/DeleteCampaignButton";

export default async function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({ where: { id: Number(id) } });

  if (!campaign) notFound();

  const progress = campaign.goal ? Math.min((campaign.currentAmount / campaign.goal) * 100, 100) : 0;
  const platforms = [{ name: "Instagram", code: "ig" }, { name: "TikTok", code: "tk" }, { name: "WhatsApp", code: "wa" }, { name: "Geral", code: "gr" }];

  return (
    <div className="flex w-full max-w-full items-end flex-col gap-4 px-3 pb-4 sm:px-4 lg:px-0">
      <div className="w-full max-w-full overflow-hidden rounded-2xl bg-gray-100 lg:w-[80%]">
        <div className="flex min-h-72 flex-col justify-end p-6 text-white relative" style={{ backgroundImage: `linear-gradient(180deg, rgba(2,109,155,0.12) 0%, rgba(2,109,155,0.88) 100%), url(${campaign.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="max-w-2xl space-y-2 relative z-10">
            <div className="badge border-0 bg-white/20">{campaign.status}</div>
            <h1 className="text-3xl font-bold">{campaign.name}</h1>
            <p className="text-sm opacity-80 italic">Slug: {campaign.slug}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Tickets Coletados</p>
            <p className="text-3xl font-bold text-[#026D9B]">{campaign.currentTickets}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Meta de Tickets</p>
            <p className="text-3xl font-bold text-[#026D9B]">{campaign.ticketGoal}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Progresso</p>
            <p className="text-3xl font-bold text-[#026D9B]">{progress.toFixed(0)}%</p>
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div className="p-4 pt-0 flex justify-between items-center bg-white/50 border-t border-gray-200">
          <div className="flex gap-2 p-2">
            <Link href="/campanhas" className="btn btn-sm btn-ghost text-black">Voltar</Link>
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