import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/src/lib/prisma";
import { FaCopy } from "react-icons/fa";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default async function CampaignDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!campaign) {
    notFound();
  }

  const progress = campaign.goal
    ? Math.min((campaign.currentAmount / campaign.goal) * 100, 100)
    : 0;

  // Mock de plataformas para os links (isso viria do banco no futuro)
  const platforms = [
    { name: "Instagram", code: "ig" },
    { name: "TikTok", code: "tk" },
    { name: "WhatsApp", code: "wa" },
    { name: "Geral", code: "gr" },
  ];

  return (
    <div className="flex w-full max-w-full flex-col gap-4 overflow-x-hidden px-3 pb-4 sm:px-4 lg:px-0">
      <div className="w-full max-w-full overflow-hidden rounded-2xl bg-gray-100 lg:w-[80%]">
        
        {/* Header com Imagem */}
        <div
          className="flex min-h-72 flex-col justify-end p-6 text-white"
          style={{
            backgroundImage: campaign.imageUrl
              ? `linear-gradient(180deg, rgba(2,109,155,0.12) 0%, rgba(2,109,155,0.88) 100%), url(${campaign.imageUrl})`
              : "linear-gradient(180deg, #026D9B 0%, #237C7B 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-2xl space-y-2 relative z-10">
            <div className="badge border-0 bg-white/20 text-white">
              {campaign.status.replaceAll("_", " ")}
            </div>
            <h1 className="text-3xl font-bold">{campaign.name}</h1>
            <p className="text-sm text-white/90 italic">
              Slug: {campaign.slug}
            </p>
            <p className="text-sm text-white/90">
              {campaign.description || "Sem descrição cadastrada para esta campanha."}
            </p>
          </div>
        </div>

        {/* Grid de Métricas */}
        <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Arrecadado</p>
            <p className="text-3xl font-bold text-[#026D9B]">
              {currencyFormatter.format(campaign.currentAmount)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Meta</p>
            <p className="text-3xl font-bold text-[#026D9B]">
              {currencyFormatter.format(campaign.goal)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Progresso</p>
            <p className="text-3xl font-bold text-[#026D9B]">{progress.toFixed(0)}%</p>
          </div>
        </div>

        {/* SEÇÃO NOVA: Links de Divulgação (Para Divulgadores/Admin) */}
        <div className="px-4 pb-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-blue-100">
            <h2 className="text-lg font-bold text-[#026D9B] mb-4">Seus Links de Divulgação</h2>
            <p className="text-sm text-gray-600 mb-6">
              Use os links abaixo para divulgar esta campanha. Cada link rastreia de onde vem o seu tráfego.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platforms.map((platform) => (
                <div key={platform.code} className="flex flex-col gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-gray-700">{platform.name}</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">Ativo</span>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      readOnly 
                      value={`chavedobem.com/${platform.code}_123/campanha/${campaign.slug}`}
                      className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 text-gray-500 truncate"
                    />
                    <button className="btn btn-sm bg-[#026D9B] hover:bg-[#024d6d] text-white border-none">
                      <FaCopy size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-4 pt-0 flex gap-2">
          <Link href="/campanhas" className="btn btn-ghost border-gray-300">
            Voltar
          </Link>
          <button className="btn btn-theme-primary gap-2">
            Editar Campanha
          </button>
        </div>
      </div>
    </div>
  );
}