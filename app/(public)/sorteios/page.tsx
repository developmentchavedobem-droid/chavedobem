import HorizontalCard from "@/src/components/HorizontalCard";
import { Campaign } from "@/app/generated/prisma/client";
import prisma from "@/src/lib/prisma";

// Forçamos a página a ser dinâmica para evitar falhas de conexão com banco no build estático
export const dynamic = "force-dynamic";

interface CampaignsProps {
  campaigns?: Campaign[];
}

export default async function CampaignsPage({ campaigns }: CampaignsProps) {
  // 1. Lógica de fallback: se não recebeu via props (build/acesso direto), busca no Prisma
  const list = campaigns ?? await prisma.campaign.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" }
  });

  // 2. Garantimos que 'list' seja pelo menos um array vazio para o .length não quebrar
  const safeList = list || [];

  return (
    <div className="min-h-75 w-full bg-zinc-100 font-sans pb-20">
      <div className="w-full sm:max-w-5xl h-full mx-auto flex flex-col items-center px-5">
        <h3 className="text-[#053B80] text-2xl font-bold mb-8">Participe conosco!</h3>
        
        {safeList.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Nenhuma campanha disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {safeList.map((campaign) => (
              <HorizontalCard 
                key={campaign.id} 
                campaign={campaign} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}