import Link from "next/link";
import prisma from "@/src/lib/prisma";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function getProgressPercentage(current: number, goal: number) {
  if (!goal) return 0;
  return Math.min((current / goal) * 100, 100);
}

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex w-full items-end flex-col gap-4 overflow-x-hidden px-3 pb-4 sm:px-4 lg:px-0">
      <div className="flex w-full max-w-full flex-col gap-3 rounded-2xl bg-gray-100 p-4 lg:w-[80%]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#026D9B]">Campanhas</h1>
            <p className="text-sm text-gray-600">
              Gerencie as campanhas ativas e acompanhe o avanço de cada meta.
            </p>
          </div>

          <Link href="/campanhas/create" className="btn btn-theme-primary w-full sm:w-auto">
            Nova campanha
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <div className="flex min-h-120 flex-col items-center justify-center rounded-2xl border border-dashed border-[#026D9B]/30 bg-white px-6 py-10 text-center">
            <h2 className="text-xl font-bold text-[#026D9B]">Nenhuma campanha cadastrada</h2>
            <p className="mt-2 max-w-md text-sm text-gray-600">
              Crie sua primeira campanha para começar a acompanhar metas, arrecadação e divulgação.
            </p>
            <Link href="/campanhas/create" className="btn btn-theme-primary mt-6">
              Criar campanha
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {campaigns.map((campaign) => {
              const progress = getProgressPercentage(campaign.currentAmount, campaign.goal);

              return (
                <Link
                  key={campaign.id}
                  href={`/campanhas/${campaign.id}`}
                  className="group card min-h-80 overflow-hidden rounded-2xl bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1"
                >
                  <div
                    className="relative flex h-full min-h-80 flex-col justify-end overflow-hidden p-0"
                    style={{
                      backgroundImage: campaign.imageUrl
                        ? `linear-gradient(180deg, rgba(2,109,155,0.12) 0%, rgba(2,109,155,0.88) 100%), url(${campaign.imageUrl})`
                        : "linear-gradient(180deg, #026D9B 0%, #237C7B 100%)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-black/10 transition-colors duration-200 group-hover:bg-black/5" />

                    <div className="relative z-10 mt-auto flex flex-col gap-4 p-5 text-white">
                      <div className="space-y-1">
                        <div className="badge border-0 bg-white/20 text-white">
                          {campaign.status.replaceAll("_", " ")}
                        </div>
                        <h2 className="line-clamp-2 text-2xl font-bold">{campaign.name}</h2>
                        <p className="line-clamp-2 text-sm text-white/90">
                          {campaign.description || "Campanha pronta para receber divulgação e arrecadação."}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white/16 p-4 backdrop-blur-[2px]">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold">Meta da campanha</span>
                          <span className="text-sm font-bold">{progress.toFixed(0)}%</span>
                        </div>
                        <progress
                          className="progress h-3 w-full overflow-hidden [&::-webkit-progress-bar]:bg-white/30 [&::-webkit-progress-value]:bg-white [&::-moz-progress-bar]:bg-white"
                          value={progress}
                          max="100"
                        />
                        <div className="mt-3 flex items-end justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-white/75">Arrecadado</p>
                            <p className="text-lg font-bold">
                              {currencyFormatter.format(campaign.currentAmount)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs uppercase tracking-wide text-white/75">Meta</p>
                            <p className="text-lg font-bold">
                              {currencyFormatter.format(campaign.goal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
