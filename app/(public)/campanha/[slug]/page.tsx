import prisma from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { FaClock, FaCheckCircle } from "react-icons/fa";
import NextStepButton from "@/src/components/campaign/NextStepButton";
import AdPageVisitTracker from "@/src/components/campaign/AdPageVisitTracker";
import AdSenseBlock from "@/src/components/AdsenseBlock";
import { buildCampaignContent } from "@/src/utils/campaign-content";

export default async function CampaignArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { slug } = await params;
  const { ref } = await searchParams;

  const campaign = await prisma.campaign.findUnique({
    where: { slug },
    include: { _count: { select: { tickets: true } } },
  });

  if (!campaign || campaign.status !== "ACTIVE") notFound();

  const nextStep = `/campanha/${slug}/instrucoes${ref ? `?ref=${ref}` : ""}`;
  const content = buildCampaignContent({
    ...campaign,
    ticketsCount: campaign._count.tickets,
  });

  return (
    <div className="min-h-screen bg-zinc-100 pb-20 font-sans text-gray-800">
      <AdPageVisitTracker slug={slug} page="campaign" refCode={ref} />

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
            <span className="flex items-center gap-2">
              <FaClock /> {new Date().toLocaleDateString("pt-BR")}
            </span>
            {/* <span className="flex items-center gap-2"><FaGift /> {campaign._count.tickets.toLocaleString('pt-BR')} Participantes</span> */}
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

          <div className="w-full border-b bg-gray-50 px-4 py-6">
            <AdSenseBlock className="mx-auto min-h-24 max-w-[728px]" />
          </div>

          <div className="p-6 md:p-12 space-y-8 text-lg leading-relaxed">
            <section className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#053B80] leading-tight">
                Entenda a proposta antes de gerar seu ingresso
              </h2>
              <p className="text-gray-600">{content.summary}</p>
              <p className="text-gray-600">
                {content.articleIntro}
              </p>
              <p className="text-gray-600">
                {content.articleContext}
              </p>
            </section>

            <section className="space-y-6 rounded-3xl border border-[#053B80]/10 bg-[#053B80]/5 p-6 md:p-10">
              <h3 className="text-2xl font-black text-[#053B80]">
                Pontos principais desta campanha
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {content.overviewCards.map((card) => (
                  <div key={card.title} className="space-y-3">
                    <h4 className="font-black uppercase text-gray-800">
                      {card.title}
                    </h4>
                    <p className="text-base text-gray-600">{card.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-zinc-50 p-6 md:p-10 rounded-3xl border border-zinc-100 space-y-6">
              <h3 className="text-2xl font-black text-[#053B80] border-b border-zinc-200 pb-4">
                Como funciona na prática?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Transmissão ao vivo via YouTube",
                  "Resgate de ticket instantâneo",
                  "Sem custos de participação",
                  "Acompanhamento pelo perfil",
                ].map((text, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-xs border border-zinc-100 font-bold text-sm text-gray-700"
                  >
                    <FaCheckCircle className="text-emerald-500 shrink-0" />{" "}
                    {text}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-3 text-sm leading-6 text-gray-600">
                {content.processNotes.map((detail) => (
                  <p key={detail} className="rounded-2xl bg-white p-4">
                    {detail}
                  </p>
                ))}
              </div>
            </section>

            <AdSenseBlock className="mx-auto min-h-24 max-w-[728px]" />

            <section className="grid grid-cols-1 gap-8 pt-4">
              <div className="space-y-4">
                <h3 className="text-xl font-black text-[#053B80] uppercase flex items-center gap-2">
                  <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                  Transparência e acompanhamento
                </h3>
                <div className="space-y-6 text-gray-600 text-base md:text-lg">
                  <div className="border-l-4 border-zinc-200 pl-4">
                    <p>
                      <strong className="text-gray-800">
                        Transmissão ao Vivo:
                      </strong>{" "}
                      Todas as nossas apurações são realizadas em tempo real
                      através do nosso canal oficial no YouTube. Isso garante
                      que cada participante acompanhe o processo de seleção de
                      forma auditável e transparente, eliminando qualquer dúvida
                      sobre a integridade da campanha.
                    </p>
                  </div>

                  <div className="border-l-4 border-zinc-200 pl-4">
                    <p>
                      <strong className="text-gray-800">
                        Resgate Instantâneo:
                      </strong>{" "}
                      Ao concluir as etapas de interação e validação, seu ticket
                      numérico é gerado imediatamente pelo sistema. Você não
                      precisa esperar e-mails de confirmação; o comprovante de
                      participação aparece na sua tela e fica salvo em seu
                      perfil pessoal.
                    </p>
                  </div>

                  <div className="border-l-4 border-zinc-200 pl-4">
                    <p>
                      <strong className="text-gray-800">
                        Custo Zero (100% Grátis):
                      </strong>{" "}
                      A Chave do Bem nunca solicita transferências, pagamentos
                      via PIX ou compra de produtos para liberar a participação.
                      Caso alguém prometa vantagem mediante pagamento, a
                      orientação é interromper a conversa e procurar os canais
                      oficiais.
                    </p>
                  </div>

                  <div className="border-l-4 border-zinc-200 pl-4">
                    <p>
                      <strong className="text-gray-800">Ranking Top 5:</strong>{" "}
                      A equipe acompanha a origem dos acessos e os cadastros
                      concluidos para entender quais canais estao ajudando a
                      divulgar a campanha. Esse controle serve para suporte,
                      auditoria e melhoria da comunicacao.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 rounded-3xl bg-white p-6 ring-1 ring-zinc-100 md:p-10">
                <h3 className="text-2xl font-black text-[#053B80]">
                  Por que existe uma etapa de leitura antes do cadastro?
                </h3>
                <p className="text-base leading-7 text-gray-600">
                  Muitas pessoas chegam por links compartilhados, videos curtos
                  ou indicacoes diretas. Por isso, esta etapa apresenta o
                  contexto da campanha antes de qualquer formulario, evitando que
                  o visitante informe dados sem reconhecer a iniciativa.
                </p>
                <p className="text-base leading-7 text-gray-600">
                  Aqui o foco e decisao informada: conferir a proposta, entender
                  o fluxo e perceber sinais de seguranca. Regras operacionais
                  mais detalhadas aparecem na proxima etapa.
                </p>
                <p className="text-base leading-7 text-gray-600">
                  Ao avancar, voce entra na area de instrucoes. Ela explica os
                  criterios de validacao e prepara o caminho para o tutorial de
                  cadastro.
                </p>
              </div>

              <div className="bg-[#053B80]/5 p-6 rounded-2xl border border-[#053B80]/10 italic text-sm text-[#053B80] font-medium">
                * Importante: Lembre-se de manter seus dados de contato sempre
                atualizados. Caso você seja um dos selecionados, nossa equipe
                entrará em contato via WhatsApp ou E-mail cadastrado para
                realizar a entrega da premiação ou auxílio.
              </div>
            </section>

            <AdSenseBlock className="min-h-64" />

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
          </div>
        </div>
      </main>
    </div>
  );
}
