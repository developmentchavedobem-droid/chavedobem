import { notFound } from "next/navigation";
import prisma from "@/src/lib/prisma";
import ProgressBar from "@/src/components/campaign/ProgressBar";
import TopUsers from "@/src/components/campaign/TopUsers";
import Countdown from "@/src/components/campaign/Countdown";
import Image from "next/image";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>; // Captura o ID do link se vier via query string
}

export default async function CampaignPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { ref } = await searchParams; // O ID do link de divulgação (referral)

  const campaign = await prisma.campaign.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { tickets: true }
      }
    }
  });

  if (!campaign || campaign.status !== "ACTIVE") {
    return notFound();
  }

  // Lógica de Top Users (mantida conforme seu código)
  const topUsersRaw = await prisma.ticket.groupBy({
    by: ["profileId"],
    where: { campaignId: campaign.id },
    _count: { profileId: true },
    orderBy: { _count: { profileId: "desc" } },
    take: 5
  });

  const topUsers = await Promise.all(
    topUsersRaw.map(async (group) => {
      const profile = await prisma.profile.findUnique({
        where: { id: group.profileId },
        select: { name: true }
      });
      return {
        name: profile?.name || "Usuário Anônimo",
        count: group._count.profileId
      };
    })
  );

  // URL base para os botões de ação, preservando o código de referência se existir
  const nextStepUrl = `/campanha/${campaign.slug}/tutorial${ref ? `?ref=${ref}` : ""}`;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-16 text-gray-800">
      
      {/* HERO SECTION - Integrado com Imagem Real */}
      <section className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="badge bg-green-100 text-green-700 border-none font-bold p-4">
            CAMPANHA ATIVA
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#053B80] leading-tight">
            {campaign.name}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Uma iniciativa da <strong>Chave do Bem</strong> para transformar sua realidade através da solidariedade digital.
          </p>

          <ProgressBar
            current={Number(campaign.currentAmount)}
            goal={Number(campaign.goal)}
          />

          <Countdown />

          <div className="pt-4">
            <a
              href={nextStepUrl}
              className="inline-block bg-green-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-green-700 transition transform hover:scale-105 shadow-2xl"
            >
              Participar agora
            </a>
          </div>
        </div>

        <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl">
          <Image 
            src={campaign.imageUrl || "/placeholder.png"} 
            alt={campaign.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* SOBRE A CAMPANHA */}
      <section className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-3xl font-bold text-[#053B80] flex items-center gap-3">
          <span className="w-2 h-8 bg-amber-400 rounded-full inline-block"></span>
          Sobre o seu sonho
        </h2>
        <div className="prose prose-lg max-w-none text-gray-600">
          <p>{campaign.description || "Esta campanha foi criada para gerar impacto positivo e realizar sonhos através da nossa comunidade."}</p>
          <p>
            Ao participar, você não apenas concorre, mas ajuda a fortalecer a rede da <strong>Chave do Bem</strong>. 
            O processo é 100% gratuito: você assiste aos conteúdos parceiros e resgata seu bilhete da sorte.
          </p>
        </div>
      </section>

      {/* ESTATÍSTICAS E RANKING */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-linear-to-br from-white to-gray-50 p-10 rounded-3xl border border-gray-100 text-center space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-widest text-gray-400">
            Bilhetes Resgatados
          </h3>
          <p className="text-6xl font-black text-[#053B80]">
            {campaign._count.tickets.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-500">Atualizado em tempo real</p>
        </div>

        <TopUsers users={topUsers} />
      </section>

      {/* CTA FINAL - TRANSIÇÃO PARA O TUTORIAL */}
      <section className="text-center py-16 bg-[#053B80] rounded-[3rem] text-white space-y-8 px-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-black italic">
            PRONTO PARA GANHAR?
          </h2>
          <p className="text-lg opacity-80 max-w-xl mx-auto">
            Siga o passo a passo simples, visualize as ofertas dos nossos parceiros e gere seu bilhete numerado agora mesmo.
          </p>
          <a
            href={nextStepUrl}
            className="inline-block bg-white text-[#053B80] px-12 py-5 rounded-full font-black text-xl hover:bg-amber-400 hover:text-white transition-all shadow-xl"
          >
            VER TUTORIAL COMPLETO
          </a>
        </div>
      </section>
    </main>
  );
}