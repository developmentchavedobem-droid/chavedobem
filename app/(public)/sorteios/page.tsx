import { Campaign } from "@/app/generated/prisma/client";
import prisma from "@/src/lib/prisma";
import Card from "@/src/components/Card";

export const dynamic = "force-dynamic";

interface CampaignsProps {
  campaigns?: Campaign[];
}

export default async function CampaignsPage({ campaigns }: CampaignsProps) {
  const list =
    campaigns ??
    (await prisma.campaign.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    }));

  const safeList = list || [];

  return (
    <div className="min-h-screen w-full bg-zinc-100 px-4 pb-20 pt-10 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center">
        <h3 className="mb-8 text-center text-2xl font-black uppercase tracking-wide text-[#053B80] sm:text-3xl">
          Participe conosco!
        </h3>

        {safeList.length === 0 ? (
          <div className="max-w-3xl rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-black uppercase tracking-widest text-emerald-600">
              Campanhas em preparacao
            </p>
            <h1 className="mt-3 text-2xl font-black text-[#053B80]">
              Nenhuma campanha disponivel no momento
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              A Chave do Bem publica apenas campanhas com informacoes revisadas,
              regras claras e fluxo de participacao gratuito. Enquanto novas
              oportunidades sao preparadas, voce pode consultar as paginas
              institucionais para entender como a plataforma funciona, quais
              cuidados de seguranca adotamos e como entrar em contato com a
              equipe oficial.
            </p>
          </div>
        ) : (
          <div className="flex w-full max-w-3xl flex-col gap-4">
            {safeList.map((campaign) => (
              <Card key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
