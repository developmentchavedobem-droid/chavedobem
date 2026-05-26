import prisma from "@/src/lib/prisma";
import Card from "@/src/components/Card";

export const dynamic = "force-dynamic";

export default async function Donates() {
  const campaigns = await prisma.campaign.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { tickets: true } } }
  });

  return (
    <section className="bg-zinc-100 pt-32 pb-20 flex flex-col px-4">
      <header className="max-w-3xl mx-auto w-full mb-10">
        <h2 className="text-[#053B80] text-2xl font-black uppercase tracking-tight border-b-4 border-emerald-500 w-fit pb-1">
          Doações Disponíveis
        </h2>
      </header>

      {/* LISTA DE ITENS HORIZONTAIS */}
      <div className="flex flex-col w-full max-w-3xl mx-auto gap-4">
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <Card 
              key={campaign.id} 
              campaign={campaign} 
            />
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200">
             <p className="text-zinc-400 font-bold">Nenhuma campanha disponível.</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center mt-12">
        <button className="text-[#053B80] font-black uppercase tracking-widest text-xs hover:underline">
          Ver campanhas encerradas
        </button>
      </div>
    </section>
  );
}
