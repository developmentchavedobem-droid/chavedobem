import React from "react";
import {
  FaInfoCircle,
  FaUserPlus,
  FaEnvelopeOpenText,
  FaUnlockAlt,
  FaShieldAlt,
  FaBalanceScale,
  FaQuestionCircle,
  FaGift,
  FaCheckCircle,
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

  const nextStepUrl = `/campanha/${slug}/tutorial${
    ref ? `?ref=${ref}` : ""
  }`;

  const content = buildCampaignContent({
    ...campaign,
    ticketsCount: campaign._count.tickets,
  });

  return (
    <div className="min-h-screen bg-zinc-100 py-20 font-sans text-gray-800">
      <AdPageVisitTracker slug={slug} page="instructions" refCode={ref} />

      {/* HERO */}
      <div className="w-full bg-gradient-to-b from-[#053B80] to-[#04295A] text-white pt-16 pb-24 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-semibold">
            <FaGift className="text-emerald-400" />
            Campanha Oficial Chave do Bem
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight">
            Antes de participar,
            <br />
            leia as orientações
          </h1>

          <p className="max-w-3xl mx-auto text-base md:text-lg text-white/80 leading-relaxed">
            Esta etapa reúne informações importantes sobre validação de
            participação, segurança da campanha, funcionamento das transmissões
            e critérios utilizados para garantir uma experiência transparente
            para todos os participantes.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-zinc-200">
          {/* ADSENSE TOPO */}
          {/* <div className="w-full border-b bg-zinc-50 px-4 py-6">
            <AdSenseBlock className="mx-auto min-h-24 max-w-[728px]" />
          </div> */}

          <div className="p-6 md:p-12 space-y-12">
            {/* INTRO */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#053B80] text-white flex items-center justify-center text-2xl shadow-lg">
                  <FaInfoCircle />
                </div>

                <div>
                  <h2 className="text-3xl font-black text-[#053B80] uppercase tracking-tight">
                    Como funciona a campanha
                  </h2>
                  <p className="text-sm text-gray-500">
                    Informações importantes antes do cadastro
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-gray-600 leading-relaxed">
                <div className="space-y-4">
                  <p>
                    As campanhas publicadas pela <strong>Chave do Bem</strong>{" "}
                    funcionam através de transmissões ao vivo realizadas nos
                    canais oficiais do projeto.
                  </p>

                  <p>
                    Durante as lives, participantes cadastrados podem ser
                    chamados para participar de dinâmicas simples envolvendo
                    perguntas de conhecimentos gerais, curiosidades populares e
                    temas do cotidiano.
                  </p>

                  <p>
                    Caso o participante conclua corretamente a dinâmica, a
                    equipe realiza a confirmação oficial da premiação.
                  </p>
                </div>

                <div className="space-y-4">
                  <p>
                    A plataforma não realiza cobranças para cadastro,
                    participação ou liberação de campanhas.
                  </p>

                  <p>
                    Nosso objetivo é manter um ambiente organizado, seguro e com
                    critérios transparentes para reduzir fraudes, cadastros
                    duplicados e tentativas automatizadas.
                  </p>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 font-semibold text-emerald-700">
                    Toda participação é gratuita e ocorre exclusivamente pelos
                    canais oficiais da Chave do Bem.
                  </div>
                </div>
              </div>
            </section>

            {/* CARDS */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-7 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#053B80] flex items-center justify-center text-2xl">
                  <FaUserPlus />
                </div>

                <h3 className="text-xl font-black text-[#053B80]">
                  Cadastro Correto
                </h3>

                <p className="text-gray-600 text-sm leading-6">
                  Utilize informações reais e atualizadas durante o cadastro.
                  Dados inconsistentes podem dificultar validações futuras e
                  impedir contato da equipe oficial.
                </p>
              </div>

              <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-7 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl">
                  <FaEnvelopeOpenText />
                </div>

                <h3 className="text-xl font-black text-[#053B80]">
                  Comunicação Oficial
                </h3>

                <p className="text-gray-600 text-sm leading-6">
                  A equipe entra em contato apenas através dos canais oficiais
                  da plataforma. Nunca compartilhamos links de cobrança ou
                  solicitamos pagamentos antecipados.
                </p>
              </div>

              <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-7 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center text-2xl">
                  <FaShieldAlt />
                </div>

                <h3 className="text-xl font-black text-[#053B80]">
                  Participação Segura
                </h3>

                <p className="text-gray-600 text-sm leading-6">
                  O sistema monitora atividades suspeitas, acessos duplicados e
                  inconsistências para proteger campanhas e melhorar a
                  confiabilidade das participações.
                </p>
              </div>
            </section>

            {/* ETAPAS */}
            <section className="space-y-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-[#053B80] uppercase tracking-tight">
                  Etapas da participação
                </h2>

                <p className="text-gray-500">
                  Entenda como funciona o processo antes da transmissão oficial.
                </p>
              </div>

              <div className="space-y-10">
                <Step
                  icon={<FaUserPlus />}
                  title="1. Faça seu cadastro"
                  desc="Preencha corretamente suas informações no formulário oficial da campanha. Utilize telefone, e-mail e dados atualizados para evitar problemas de validação."
                />

                <Step
                  icon={<FaEnvelopeOpenText />}
                  title="2. Aguarde a transmissão"
                  desc="Após atingir a meta de inscrições válidas, a equipe divulgará oficialmente a data da live. Acompanhar os canais oficiais aumenta suas chances de não perder avisos importantes."
                />

                <Step
                  icon={<FaUnlockAlt />}
                  title="3. Participe ao vivo"
                  desc="Durante a transmissão, participantes poderão ser chamados para responder perguntas rápidas e simples. Caso a dinâmica seja concluída corretamente, a equipe confirma oficialmente a premiação."
                />
              </div>
            </section>

            {/* BLOCO ESCURO */}
            <section className="bg-zinc-900 text-white rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl"></div>

              <div className="relative z-10 space-y-8">
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tight text-emerald-400">
                    Regras importantes
                  </h3>

                  <p className="text-white/70 mt-2 leading-relaxed">
                    Algumas práticas podem impedir a validação da participação e
                    comprometer o funcionamento da campanha.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {content.disqualificationItems.map((item) => (
                    <div
                      key={item}
                      className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-3 items-start"
                    >
                      <FaCheckCircle className="text-emerald-400 mt-1 shrink-0" />

                      <p className="text-sm text-white/80 leading-6">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SEGURANÇA */}
            <section className="rounded-[2rem] border border-zinc-200 bg-zinc-50 p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#053B80] text-white flex items-center justify-center text-3xl">
                  <FaBalanceScale />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-[#053B80] uppercase tracking-tight">
                    Transparência e segurança
                  </h3>

                  <p className="text-gray-500 text-sm">
                    Informações sobre proteção e validação da plataforma
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 text-gray-600 leading-relaxed">
                <div className="space-y-4">
                  <p>
                    A plataforma utiliza mecanismos de segurança para registrar
                    acessos, proteger contas e reduzir atividades automatizadas
                    ou fraudulentas.
                  </p>

                  <p>
                    Dados técnicos necessários para autenticação e validação
                    podem ser utilizados para auditoria interna e integridade
                    das campanhas.
                  </p>
                </div>

                <div className="space-y-4">
                  <p>
                    Toda interação oficial ocorre exclusivamente dentro dos
                    canais verificados da Chave do Bem.
                  </p>

                  <p>
                    Nunca solicitamos pagamentos, depósitos, transferências ou
                    senhas para liberar campanhas ou confirmar participação.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="space-y-8">
              <div>
                <h3 className="text-3xl font-black text-[#053B80] uppercase tracking-tight">
                  Perguntas frequentes
                </h3>

                <p className="text-gray-500 mt-2">
                  Dúvidas comuns sobre participação e funcionamento das
                  campanhas.
                </p>
              </div>

              <div className="space-y-4">
                <details className="group rounded-2xl border border-zinc-200 bg-white p-5">
                  <summary className="cursor-pointer list-none font-bold flex justify-between items-center text-[#053B80]">
                    Preciso pagar para participar?
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>

                  <p className="mt-4 text-sm text-gray-600 leading-6">
                    Não. As campanhas da Chave do Bem são gratuitas e não
                    exigem pagamentos para cadastro ou participação.
                  </p>
                </details>

                <details className="group rounded-2xl border border-zinc-200 bg-white p-5">
                  <summary className="cursor-pointer list-none font-bold flex justify-between items-center text-[#053B80]">
                    Como saberei se fui chamado?
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>

                  <p className="mt-4 text-sm text-gray-600 leading-6">
                    O principal contato acontece durante a transmissão ao vivo.
                    Em algumas situações, a equipe também poderá utilizar os
                    dados cadastrados para comunicação complementar.
                  </p>
                </details>

                <details className="group rounded-2xl border border-zinc-200 bg-white p-5">
                  <summary className="cursor-pointer list-none font-bold flex justify-between items-center text-[#053B80]">
                    Posso utilizar dados de terceiros?
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>

                  <p className="mt-4 text-sm text-gray-600 leading-6">
                    Não. O cadastro deve pertencer à própria pessoa
                    participante. Informações inconsistentes podem impedir
                    validações futuras.
                  </p>
                </details>

                <details className="group rounded-2xl border border-zinc-200 bg-white p-5">
                  <summary className="cursor-pointer list-none font-bold flex justify-between items-center text-[#053B80]">
                    O que fazer em caso de abordagem suspeita?
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>

                  <p className="mt-4 text-sm text-gray-600 leading-6">
                    Ignore cobranças, links suspeitos e pedidos de pagamento.
                    Procure imediatamente os canais oficiais da Chave do Bem
                    para confirmar qualquer informação.
                  </p>
                </details>
              </div>
            </section>

            {/* ADSENSE MEIO */}
            {/* <AdSenseBlock className="min-h-48" /> */}

            {/* CTA */}
            <section className="border-t border-zinc-100 pt-10">
              <div className="bg-gradient-to-r from-[#053B80] to-[#04295A] text-white rounded-[2rem] p-8 md:p-10 text-center space-y-6">
                <div className="space-y-3">
                  <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                    Tudo pronto?
                  </h3>

                  <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
                    Revise as informações acima e siga para a próxima etapa para
                    continuar sua participação na campanha oficial.
                  </p>
                </div>

                <div className="flex justify-center pt-2">
                  <NextStepButton
                    nextStepUrl={nextStepUrl}
                    label="CONTINUAR CADASTRO"
                    className="w-full md:w-auto md:px-20 bg-emerald-500 hover:bg-emerald-600 text-white text-center py-5 rounded-2xl font-black text-xl shadow-lg transition-all hover:scale-105 active:scale-95"
                  />
                </div>
              </div>
            </section>
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
      <div className="w-16 h-16 rounded-3xl bg-[#053B80] text-white flex items-center justify-center shrink-0 shadow-lg text-2xl">
        {icon}
      </div>

      <div className="space-y-2">
        <h3 className="font-black text-2xl text-[#053B80] uppercase tracking-tight">
          {title}
        </h3>

        <p className="text-gray-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}