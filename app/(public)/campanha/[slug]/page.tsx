import prisma from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaClock, FaCheckCircle, FaGift } from "react-icons/fa";
import NextStepButton from "@/src/components/campaign/NextStepButton";

export default async function CampaignArticlePage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ ref?: string }> 
}) {
  const { slug } = await params;
  const { ref } = await searchParams;
  
  const campaign = await prisma.campaign.findUnique({ 
    where: { slug },
    include: { _count: { select: { tickets: true } } }
  });

  if (!campaign || campaign.status !== "ACTIVE") notFound();

  const nextStep = `/campanha/${slug}/instrucoes${ref ? `?ref=${ref}` : ""}`;

  return (
    <div className="min-h-screen bg-zinc-100 pb-20 font-sans text-gray-800">
      {/* HEADER DA CAMPANHA */}
      <div className="w-full bg-[#053B80] text-white pt-16 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
            <FaCheckCircle className="text-emerald-400" />
            Campanha Oficial Chave do Bem
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight uppercase">
            {campaign.name}
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm opacity-80 font-medium">
            <span className="flex items-center gap-2"><FaClock /> {new Date().toLocaleDateString('pt-BR')}</span>
            <span className="flex items-center gap-2"><FaGift /> {campaign._count.tickets.toLocaleString('pt-BR')} Participantes</span>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
          
          <div className="relative h-64 md:h-[450px] w-full bg-zinc-200">
            <Image 
              src={campaign.imageUrl || "/placeholder.png"} 
              fill 
              className="object-cover" 
              alt={campaign.name} 
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
          </div>

          <div className="w-full bg-gray-50 border-b py-6 flex flex-col items-center">
             <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">Publicidade</span>
             <div className="w-full max-w-[728px] h-[90px] bg-gray-200/50 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 mx-4 rounded-lg">
                Slot AdSense (Banner de Topo)
             </div>
          </div>

          <div className="p-6 md:p-12 space-y-8 text-lg leading-relaxed">
            <section className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#053B80] leading-tight">
                Descubra como participar desta iniciativa e transformar seus planos
              </h2>
              <p className="text-gray-600">{campaign.description}</p>
            </section>

            {/* BOTÃO CENTRAL COM ADOVERLAY */}
            <div className="flex flex-col items-center py-4">
              <NextStepButton 
                nextStepUrl={nextStep}
                label="CADASTRE-SE AGORA"
                className="w-full md:w-auto md:px-20 bg-emerald-500 hover:bg-emerald-600 text-white text-center py-5 rounded-2xl font-black text-xl shadow-lg transition-all hover:scale-105 active:scale-95"
              />
              <span className="text-xs text-gray-400 mt-4 font-medium uppercase tracking-tighter italic">
                Inscrição Grátis • Processo Seguro • Chave do Bem
              </span>
            </div>

            <section className="bg-zinc-50 p-6 md:p-10 rounded-3xl border border-zinc-100 space-y-6">
              <h3 className="text-2xl font-black text-[#053B80] border-b border-zinc-200 pb-4">
                Como funciona na prática?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Transmissão ao vivo via YouTube",
                  "Resgate de ticket instantâneo",
                  "Sem custos de participação",
                  "Sistema de ranking Top 5"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-xs border border-zinc-100 font-bold text-sm text-gray-700">
                    <FaCheckCircle className="text-emerald-500 shrink-0" /> {text}
                  </div>
                ))}
              </div>
            </section>

            <div className="w-full flex flex-col items-center py-4">
               <span className="text-[10px] text-gray-400 uppercase mb-2 font-bold">Publicidade</span>
               <div className="w-full h-64 bg-gray-50 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded-2xl">
                  Slot AdSense (Bloco de Conteúdo)
               </div>
            </div>

            {/* BOTÃO FINAL COM ADOVERLAY */}
            <div className="pt-8 border-t border-zinc-100 flex flex-col gap-6">
              <p className="text-center text-gray-500 text-base">
                Ao clicar abaixo, você será levado para a página de instruções detalhadas para gerar seu ingresso.
              </p>
              <NextStepButton 
                nextStepUrl={nextStep}
                label="PRÓXIMO PASSO"
                showIcon={true}
                className="flex items-center justify-center gap-3 bg-[#053B80] hover:bg-sky-900 text-white text-center py-6 rounded-2xl font-black text-2xl shadow-2xl transition-all active:scale-95"
              />
              <Link 
                href="/sorteios" 
                className="text-center text-[#053B80] font-bold text-sm hover:underline uppercase tracking-widest"
              >
                Ver campanhas disponíveis
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}