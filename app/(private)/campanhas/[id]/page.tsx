import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/src/lib/prisma";

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

  return (
    <div className="flex w-full max-w-full flex-col gap-4 overflow-x-hidden px-3 pb-4 sm:px-4 lg:px-0">
      <div className="w-full max-w-full overflow-hidden rounded-2xl bg-gray-100 lg:w-[80%]">
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
          <div className="max-w-2xl space-y-2">
            <div className="badge border-0 bg-white/20 text-white">
              {campaign.status.replaceAll("_", " ")}
            </div>
            <h1 className="text-3xl font-bold">{campaign.name}</h1>
            <p className="text-sm text-white/90">
              {campaign.description || "Sem descrição cadastrada para esta campanha."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-4">
            <p className="text-sm text-gray-500">Arrecadado</p>
            <p className="text-3xl font-bold text-[#026D9B]">
              {currencyFormatter.format(campaign.currentAmount)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4">
            <p className="text-sm text-gray-500">Meta</p>
            <p className="text-3xl font-bold text-[#026D9B]">
              {currencyFormatter.format(campaign.goal)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4">
            <p className="text-sm text-gray-500">Progresso</p>
            <p className="text-3xl font-bold text-[#026D9B]">{progress.toFixed(0)}%</p>
          </div>
        </div>

        <div className="p-4 pt-0">
          <Link href="/campanhas" className="btn btn-theme-primary">
            Voltar para campanhas
          </Link>
        </div>
      </div>
    </div>
  );
}
