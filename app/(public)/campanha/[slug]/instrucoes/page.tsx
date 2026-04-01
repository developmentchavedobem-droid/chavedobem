import React from "react";
import Link from "next/link";
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

export default async function InstructionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { slug } = await params;
  const { ref } = await searchParams;

  const nextStepUrl = `/campanha/${slug}/tutorial${ref ? `?ref=${ref}` : ""}`;

  return (
    <div className="min-h-screen bg-zinc-100 pb-20 font-sans text-gray-800">
      {/* HEADER ROBUSTO */}
      <div className="w-full bg-[#053B80] text-white pt-16 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
            <FaBalanceScale className="text-emerald-400" />
            Regulamento e Instruções Oficiais
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight uppercase tracking-tight">
            Como Garantir sua Participação
          </h1>
          <p className="opacity-90 max-w-2xl mx-auto font-medium leading-relaxed">
            A <strong>Chave do Bem</strong> preza pela transparência e
            conformidade em todas as campanhas. Leia atentamente as etapas e
            diretrizes para que sua inscrição seja validada corretamente pelo
            nosso sistema.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-zinc-200">
          {/* ADSENSE SUPERIOR */}
          <div className="w-full bg-gray-50 border-b flex flex-col items-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">
              Publicidade
            </span>
            <div className="w-full max-w-[728px] h-[90px] bg-gray-200/50 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 mx-4 rounded-lg text-[10px] text-center px-4">
              Anúncio Responsivo (Google AdSense)
            </div>
          </div>

          <div className="p-6 md:p-12 space-y-2">
            {/* TEXTO DE INTRODUÇÃO PARA O ADSENSE */}
            <section className="prose prose-zinc max-w-none">
              <h2 className="text-2xl font-black text-[#053B80] flex items-center gap-2">
                <FaInfoCircle size={20} className="text-blue-500" />
                Compromisso com a Veracidade
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Nossa plataforma utiliza um sistema de verificação em duas
                etapas para assegurar que cada ingresso resgatado pertença a um
                usuário real e único. Isso garante que as doações e prêmios da{" "}
                <strong>Chave do Bem</strong> cheguem a quem realmente precisa,
                mantendo a integridade da nossa comunidade de apoiadores.
              </p>
            </section>
            {/* PASSOS DETALHADOS */}
            <div className="grid grid-cols-1 gap-10">
              <Step
                icon={<FaUserPlus />}
                title="1. Registro de Perfil Único"
                desc="Para iniciar, você deve criar um perfil utilizando dados válidos. O uso de informações falsas ou duplicadas resultará na anulação automática de qualquer ingresso vinculado. Precisamos do seu WhatsApp e E-mail para comunicações urgentes sobre o status da campanha."
              />
              <Step
                icon={<FaEnvelopeOpenText />}
                title="2. Verificação de Identidade Digital"
                desc="Após o cadastro, um link de confirmação será enviado para o seu endereço de e-mail. Esta etapa é crucial para evitar bots e garantir que você tenha acesso à sua conta para futuras consultas de ingressos e resultados das transmissões."
              />
              <Step
                icon={<FaUnlockAlt />}
                title="3. Resgate de Ingresso Numerado"
                desc="Com a conta ativa, você poderá navegar até a página da campanha desejada e realizar o resgate. Cada ingresso gera um código alfanumérico exclusivo que será utilizado no momento da dinâmica ao vivo."
              />
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

            <div className="w-full bg-gray-50 border-b flex flex-col items-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">
                Publicidade
              </span>
              <div className="w-full max-w-[728px] h-[90px] bg-gray-200/50 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 mx-4 rounded-lg text-[10px] text-center px-4">
                Anúncio Responsivo (Google AdSense)
              </div>
            </div>

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
                      Muitos usuários nos questionam como conseguimos manter uma
                      estrutura robusta e premiar nossa comunidade sem cobrar
                      taxas de inscrição. A resposta é simples:{" "}
                      <strong>Economia de Atenção</strong>.
                    </p>
                    <p>
                      Através das exibições publicitárias que você visualiza em
                      nosso portal, geramos o faturamento necessário para cobrir
                      custos operacionais, servidores de alta performance e,
                      claro, o fundo de doações de cada campanha ativa.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p>
                      Ao seguir as instruções desta página, você nos ajuda a
                      manter um ecossistema saudável e auditável. Cada clique e
                      cada verificação realizada garante que o prêmio final seja
                      entregue a uma pessoa real, combatendo fraudes e perfis
                      automatizados.
                    </p>
                    <div className="bg-[#053B80]/5 p-4 rounded-xl border-l-4 border-[#053B80] font-bold text-[#053B80]">
                      Nosso objetivo é democratizar o acesso a oportunidades
                      reais através da tecnologia e do marketing digital ético.
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD DE VERIFICAÇÃO FINAL ANTES DO FAQ */}
              <div className="bg-zinc-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="relative z-10 space-y-4">
                  <h4 className="text-xl font-black uppercase tracking-tight text-emerald-400">
                    Critérios de Desclassificação
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm opacity-90">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500">●</span> Cadastro de
                      CPF gerado ou inválido.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500">●</span> Uso de VPN ou
                      proxies para mascarar localização.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500">●</span> Múltiplas
                      contas acessadas pelo mesmo dispositivo.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500">●</span> Tentativas de
                      script para burlar o cronômetro de resgate.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500">●</span> Usuário menor de 18 anos.
                    </li>
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
                    Sim. A Chave do Bem é sustentada por parcerias
                    publicitárias, o que permite que o usuário não tenha custos
                    diretos para participar e concorrer aos prêmios das
                    campanhas.
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
              </div>
            </section>
            {/* ADSENSE MEIO */}
            <div className="w-full flex flex-col items-center">
              <span className="text-[10px] text-gray-400 uppercase mb-2 font-bold">
                Publicidade
              </span>
              <div className="w-full h-48 bg-gray-50 border border-dashed rounded-2xl flex items-center justify-center text-zinc-400 text-xs uppercase font-bold text-center px-10">
                Anúncio de Conteúdo (Google AdSense)
              </div>
            </div>
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

              <NextStepButton
                nextStepUrl={nextStepUrl}
                label="CADASTRE-SE AGORA!"
                showIcon={true}
                className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white text-center rounded-2xl font-black text-2xl shadow-2xl transition-all active:scale-95"
              />
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
