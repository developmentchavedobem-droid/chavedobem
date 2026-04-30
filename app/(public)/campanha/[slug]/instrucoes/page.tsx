import React from "react";
import {
  FaInfoCircle,
  FaUserPlus,
  FaEnvelopeOpenText,
  FaUnlockAlt,
  FaShieldAlt,
  FaBalanceScale,
  FaQuestionCircle,
} from "react-icons/fa";
import NextStepButton from "@/src/components/campaign/NextStepButton";
import AdPageVisitTracker from "@/src/components/campaign/AdPageVisitTracker";
import AdSenseBlock from "@/src/components/AdsenseBlock";
import prisma from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import { buildCampaignContent } from "@/src/utils/campaign-content";

export default async function InstructionsPage({
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

  const nextStepUrl = `/campanha/${slug}/tutorial${ref ? `?ref=${ref}` : ""}`;
  const content = buildCampaignContent({
    ...campaign,
    ticketsCount: campaign._count.tickets,
  });

  return (
    <div className="min-h-screen bg-zinc-100 pb-20 font-sans text-gray-800">
      <AdPageVisitTracker slug={slug} page="instructions" refCode={ref} />

      {/* HEADER ROBUSTO */}
      <div className="w-full bg-[#053B80] text-white pt-16 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
            <FaBalanceScale className="text-emerald-400" />
            Regulamento e Instruções Oficiais
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight uppercase tracking-tight">
            Regras antes do cadastro
          </h1>
          <p className="opacity-90 max-w-2xl mx-auto font-medium leading-relaxed">
            Esta etapa resume criterios de validacao, limites de uso e cuidados
            especificos antes de voce seguir para o tutorial.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-zinc-200">
          {/* ADSENSE SUPERIOR */}
          <div className="w-full border-b bg-gray-50 px-4 py-6">
            <AdSenseBlock className="mx-auto min-h-24 max-w-[728px]" />
          </div>

          <div className="p-6 md:p-12 space-y-2">
            {/* TEXTO DE INTRODUÇÃO PARA O ADSENSE */}
            <section className="prose prose-zinc max-w-none">
              <h2 className="text-2xl font-black text-[#053B80] flex items-center gap-2">
                <FaInfoCircle size={20} className="text-blue-500" />
                Compromisso com a Veracidade
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {content.instructionIntro}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {content.instructionTrust}
              </p>
              <p className="text-gray-600 leading-relaxed">
                A Chave do Bem nao solicita pagamentos para liberar ingressos,
                nao envia links encurtados para cobranca e nao pede senhas por
                mensagens privadas. Sempre confirme se voce esta navegando no
                site oficial antes de inserir qualquer informacao pessoal.
              </p>
            </section>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {content.instructionCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-3xl border border-zinc-100 bg-zinc-50 p-6"
                >
                  <h3 className="mb-3 text-lg font-black text-[#053B80]">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-6 text-gray-600">
                    {card.body}
                  </p>
                </div>
              ))}
            </section>
            {/* PASSOS DETALHADOS */}
            <div className="grid grid-cols-1 gap-10">
              {content.instructionSteps.map((step, index) => (
                <Step
                  key={step.title}
                  icon={
                    index === 0 ? (
                      <FaUserPlus />
                    ) : index === 1 ? (
                      <FaEnvelopeOpenText />
                    ) : (
                      <FaUnlockAlt />
                    )
                  }
                  title={step.title}
                  desc={step.body}
                />
              ))}
            </div>
            {/* SEÇÃO DE SEGURANÇA (IMPORTANTE PARA ADSENSE) */}
            <section className="bg-zinc-50 p-6 md:p-8 rounded-3xl border border-zinc-100 flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-white p-4 rounded-2xl shadow-sm text-[#053B80]">
                <FaShieldAlt size={40} />
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-[#053B80] text-lg uppercase tracking-tight">
                  Privacidade e Proteção de Dados
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Seus dados são protegidos por criptografia de ponta a ponta e
                  processados de acordo com a LGPD. A{" "}
                  <strong>Chave do Bem</strong> nunca solicitará pagamentos,
                  transferências ou senhas através de aplicativos de terceiros.
                  Toda a interação oficial ocorre dentro deste domínio seguro.
                </p>
              </div>
            </section>

            <AdSenseBlock className="mx-auto my-8 min-h-24 max-w-[728px]" />

            {/* SEÇÃO DE TRANSPARÊNCIA E SUSTENTABILIDADE */}
            <section className="space-y-8 pt-4">
              <div className="flex flex-col gap-6">
                <h3 className="text-2xl font-black text-[#053B80] uppercase italic tracking-tighter flex items-center gap-3">
                  <div className="w-10 h-1 bg-emerald-500"></div>
                  Transparência e Sustentabilidade
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-600 leading-relaxed text-sm md:text-base">
                  <div className="space-y-4">
                    <p>
                      A Chave do Bem mantem uma estrutura digital para publicar
                      campanhas, orientar participantes e registrar ingressos de
                      forma organizada. A participacao nas campanhas publicadas
                      no site nao depende de pagamento, compra de produto ou
                      transferencia para terceiros.
                    </p>
                    <p>
                      A sustentabilidade da plataforma envolve custos de
                      tecnologia, atendimento, comunicacao e auditoria. Por
                      isso, as paginas priorizam informacao clara, navegacao
                      segura e canais oficiais de suporte.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p>
                      Ao seguir as instrucoes desta pagina, voce ajuda a manter
                      um processo saudavel e auditavel. Cadastro consistente,
                      e-mail confirmado e uso de conta individual reduzem
                      fraudes e perfis automatizados.
                    </p>
                    <div className="bg-[#053B80]/5 p-4 rounded-xl border-l-4 border-[#053B80] font-bold text-[#053B80]">
                      Nosso objetivo é democratizar o acesso a oportunidades
                      reais através da tecnologia e do marketing digital ético.
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[#053B80]/10 bg-[#053B80]/5 p-6 md:p-8">
                <h3 className="text-2xl font-black text-[#053B80]">
                  Como avaliamos uma participacao valida
                </h3>
                <div className="mt-5 grid grid-cols-1 gap-5 text-sm leading-6 text-gray-600 md:grid-cols-2">
                  <p>
                    Uma participacao valida combina cadastro consistente,
                    confirmacao de e-mail, respeito ao intervalo de resgate e
                    uso correto da conta. Esses fatores ajudam a diferenciar
                    usuarios reais de tentativas automatizadas ou duplicadas.
                  </p>
                  <p>
                    O sistema registra informacoes tecnicas necessarias para
                    seguranca, como horario de acesso e vinculacao do ingresso
                    ao perfil autenticado. Esses dados auxiliam auditorias
                    internas e melhoram a confiabilidade das campanhas.
                  </p>
                  <p>
                    Caso voce perceba qualquer divergencia no seu cadastro,
                    atualize seus dados antes de retirar novos ingressos. Um
                    telefone antigo ou e-mail sem acesso pode atrasar avisos
                    importantes e dificultar suporte.
                  </p>
                  <p>
                    As regras nao existem para dificultar a participacao, mas
                    para proteger o processo. Quanto mais claro e verificavel for
                    o cadastro, maior a qualidade da campanha para todos os
                    envolvidos.
                  </p>
                </div>
              </div>

              {/* CARD DE VERIFICAÇÃO FINAL ANTES DO FAQ */}
              <div className="bg-zinc-900 text-white p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group mb-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="relative z-10 space-y-4">
                  <h4 className="text-xl font-black uppercase tracking-tight text-emerald-400">
                    Critérios de Desclassificação
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm opacity-90">
                    {content.disqualificationItems.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-emerald-500">-</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* PERGUNTAS FREQUENTES (TEXTO EXTRA PARA SEO/ADSENSE) */}
            <section className="space-y-6">
              <h3 className="text-xl font-black text-[#053B80] flex items-center gap-2 italic underline decoration-emerald-400">
                <FaQuestionCircle className="text-emerald-500" /> FAQ Rápido
              </h3>
              <div className="space-y-4">
                <details className="group border-b border-zinc-100 pb-4">
                  <summary className="font-bold text-gray-700 cursor-pointer list-none flex justify-between items-center">
                    A participação é realmente gratuita?
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="text-sm text-gray-500 mt-2">
                    Sim. A Chave do Bem nao cobra taxa de cadastro ou de
                    retirada de ingresso do participante. A operacao da
                    plataforma e mantida por processos internos, parcerias e
                    estrutura propria.
                  </p>
                </details>
                <details className="group border-b border-zinc-100 pb-4">
                  <summary className="font-bold text-gray-700 cursor-pointer list-none flex justify-between items-center">
                    Como recebo o aviso se ganhar?
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="text-sm text-gray-500 mt-2">
                    O aviso principal ocorre durante a transmissão ao vivo. Caso
                    o vencedor não seja localizado no chat, nossa equipe entrará
                    em contato via WhatsApp e E-mail cadastrados em até 24
                    horas.
                  </p>
                </details>
                <details className="group border-b border-zinc-100 pb-4">
                  <summary className="font-bold text-gray-700 cursor-pointer list-none flex justify-between items-center">
                    Posso usar o cadastro de outra pessoa?
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="text-sm text-gray-500 mt-2">
                    Nao. O cadastro deve representar a pessoa que esta
                    participando. Usar documentos, telefone ou e-mail de
                    terceiros pode gerar inconsistencias e impedir a validacao do
                    ingresso.
                  </p>
                </details>
                <details className="group border-b border-zinc-100 pb-4">
                  <summary className="font-bold text-gray-700 cursor-pointer list-none flex justify-between items-center">
                    O que devo fazer se receber uma cobranca?
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="text-sm text-gray-500 mt-2">
                    Interrompa a conversa e procure os canais oficiais da Chave
                    do Bem. A participacao nas campanhas publicadas no site nao
                    exige pagamento para cadastro ou retirada de ingresso.
                  </p>
                </details>
              </div>
            </section>
            {/* ADSENSE MEIO */}
            <AdSenseBlock className="min-h-48" />
            {/* BOTÃO FINAL COM ADOVERLAY */}
            <div className="pt-8 border-t border-zinc-100 flex flex-col gap-6">
              <div className="text-center space-y-2">
                <p className="text-gray-500 font-medium">
                  Tudo pronto para começar?
                </p>
                <p className="text-xs text-gray-400">
                  Ao clicar abaixo, você confirma estar de acordo com nossas
                  diretrizes.
                </p>
              </div>
              <div className="flex flex-col items-center py-4">
                <NextStepButton
                  nextStepUrl={nextStepUrl}
                  label="CADASTRE-SE AGORA!"
                  className="w-full md:w-auto md:px-20 bg-emerald-500 hover:bg-emerald-600 text-white text-center py-5 rounded-2xl font-black text-xl shadow-lg transition-all hover:scale-105 active:scale-95"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Step({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-6 items-start">
      <div className="w-14 h-14 rounded-2xl bg-[#053B80] text-white flex items-center justify-center shrink-0 shadow-lg text-2xl border-4 border-zinc-50">
        {icon}
      </div>
      <div className="space-y-1 pt-1">
        <h3 className="font-black text-xl text-[#053B80] leading-tight uppercase tracking-tight">
          {title}
        </h3>
        <p className="text-gray-600 text-base leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
