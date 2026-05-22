import React from "react";
import {
  FaUserPlus,
  FaEnvelopeOpenText,
  FaUnlockAlt,
  FaCheckCircle,
  FaInbox,
  FaMousePointer,
  FaLock,
  FaGift,
  FaShieldAlt,
  FaPlayCircle,
} from "react-icons/fa";
import NextStepButton from "@/src/components/campaign/NextStepButton";
import AdPageVisitTracker from "@/src/components/campaign/AdPageVisitTracker";
import prisma from "@/src/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import AdSenseBlock from "@/src/components/AdsenseBlock";
import { buildCampaignContent } from "@/src/utils/campaign-content";

export default async function TutorialPage({
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
  });

  if (!campaign) notFound();

  const nextStepUrl = `/campanha/${slug}/participar${
    ref ? `?ref=${ref}` : ""
  }`;

  const content = buildCampaignContent(campaign);

  return (
    <div className="min-h-screen bg-zinc-100 py-20 font-sans text-gray-800">
      <AdPageVisitTracker slug={slug} page="tutorial" refCode={ref} />

      {/* HERO */}
      <div className="w-full bg-gradient-to-b from-[#053B80] to-[#04295A] text-white pt-16 pb-28 px-4 text-center">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full text-sm font-semibold border border-white/10 backdrop-blur-sm text-emerald-400">
            <FaPlayCircle />
            Tutorial Oficial da Campanha
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight">
            Veja como participar
            <br />
            da campanha
          </h1>

          <p className="max-w-3xl mx-auto text-white/80 text-base md:text-lg leading-relaxed">
            Antes de concluir sua participação, siga as etapas abaixo para
            entender como funciona o cadastro, a validação da conta e o resgate
            do ingresso gratuito.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 -mt-16">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-zinc-200">
          {/* ADSENSE TOPO */}
          {/* <div className="w-full border-b bg-gray-50 px-4 py-6">
            <AdSenseBlock className="mx-auto min-h-24 max-w-[728px]" />
          </div> */}

          <div className="p-6 md:p-12 space-y-28">
            {/* INTRO */}
            <section className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 rounded-3xl bg-[#053B80] text-white flex items-center justify-center text-3xl shadow-xl shrink-0">
                  <FaGift />
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-[#053B80] uppercase tracking-tight">
                    Entenda o processo
                  </h2>

                  <p className="text-gray-600 leading-relaxed">
                    A participação nas campanhas da{" "}
                    <strong>Chave do Bem</strong> acontece através de um processo
                    simples, gratuito e organizado para garantir segurança e
                    transparência para todos os participantes.
                  </p>

                  <p className="text-gray-600 leading-relaxed">
                    O tutorial abaixo mostra exatamente como funciona o
                    preenchimento do cadastro, a confirmação de identidade e o
                    acesso ao ingresso da campanha.
                  </p>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-emerald-700 font-semibold">
                    Leia todas as etapas com atenção antes de continuar.
                  </div>
                </div>
              </div>
            </section>

            {/* ETAPA 1 */}
            <section className="space-y-10">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-[#053B80] text-white rounded-3xl flex items-center justify-center shrink-0 shadow-xl text-3xl">
                  <FaUserPlus />
                </div>

                <div className="space-y-4">
                  <span className="inline-flex items-center gap-2 bg-[#053B80]/10 text-[#053B80] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Etapa 01
                  </span>

                  <h2 className="text-3xl font-black text-[#053B80] uppercase tracking-tight">
                    Faça seu cadastro
                  </h2>

                  <p className="text-gray-600 leading-relaxed">
                    Preencha suas informações corretamente utilizando dados reais
                    e atualizados. Essas informações serão utilizadas para
                    identificação da conta e eventual contato da equipe oficial.
                  </p>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    Evite abreviações, números incorretos ou e-mails sem acesso.
                    Informações inconsistentes podem impedir futuras validações.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 rounded-[2rem] p-6 md:p-10 space-y-6 shadow-inner max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MockInputStatic
                    label="Nome Completo"
                    val="Valéria Almeida"
                  />

                  <MockInputStatic
                    label="CPF / CNPJ"
                    val="000.000.000-00"
                  />

                  <MockInputStatic
                    label="WhatsApp"
                    val="(11) 99999-9999"
                  />

                  <MockInputStatic
                    label="Data de Nascimento"
                    val="01/01/1990"
                  />
                </div>

                <MockInputStatic
                  label="E-mail"
                  val="contato@exemplo.com"
                />

                <div className="flex gap-3 bg-white border border-zinc-200 rounded-2xl p-4">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="checkbox checkbox-primary checkbox-sm"
                  />

                  <p className="text-xs text-gray-500 italic">
                    Declaro que li as diretrizes da campanha e aceito os termos
                    da plataforma.
                  </p>
                </div>
              </div>
            </section>

            {/* ADSENSE */}
            {/* <AdSenseBlock className="mx-auto min-h-24 max-w-[728px]" /> */}

            {/* ETAPA 2 */}
            <section className="space-y-12">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-red-600 text-white rounded-3xl flex items-center justify-center shrink-0 shadow-xl text-3xl">
                  <FaEnvelopeOpenText />
                </div>

                <div className="space-y-4">
                  <span className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Etapa 02
                  </span>

                  <h2 className="text-3xl font-black text-[#053B80] uppercase tracking-tight">
                    Confirme sua conta
                  </h2>

                  <p className="text-gray-600 leading-relaxed">
                    Após concluir o cadastro, um e-mail de confirmação será
                    enviado automaticamente para ativar sua conta.
                  </p>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    Essa validação ajuda a proteger campanhas contra contas
                    falsas, acessos automatizados e registros inválidos.
                  </p>
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {/* EMAIL */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-center text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                    <FaInbox />
                    Caixa de Entrada
                  </p>

                  <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
                    <div className="bg-red-600 p-4 text-white font-bold text-xs">
                      Gmail / Outlook
                    </div>

                    <div className="p-5 bg-blue-50/50 border-b flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">
                        CB
                      </div>

                      <div className="flex-1">
                        <p className="text-xs font-black">
                          Chave do Bem
                        </p>

                        <p className="text-[11px] text-gray-600">
                          Confirmação de cadastro enviada com sucesso
                        </p>
                      </div>

                      <span className="text-[10px] text-gray-400 font-bold">
                        10:30
                      </span>
                    </div>
                  </div>
                </div>

                {/* CONTEUDO */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-center text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                    <FaEnvelopeOpenText />
                    Confirmação
                  </p>

                  <div className="bg-white border rounded-3xl p-8 shadow-sm text-center space-y-5">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-100 mx-auto flex items-center justify-center text-blue-600">
                      <FaCheckCircle size={28} />
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-black text-lg">
                        Ative sua conta
                      </h4>

                      <p className="text-xs text-gray-500 leading-relaxed">
                        Clique no botão abaixo para validar seu cadastro e
                        continuar participando da campanha.
                      </p>
                    </div>

                    <button className="btn btn-sm btn-block bg-blue-600 text-white border-none rounded-xl">
                      CONFIRMAR E-MAIL
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ETAPA 3 */}
            <section className="space-y-12">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-3xl flex items-center justify-center shrink-0 shadow-xl text-3xl">
                  <FaUnlockAlt />
                </div>

                <div className="space-y-4">
                  <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Etapa 03
                  </span>

                  <h2 className="text-3xl font-black text-[#053B80] uppercase tracking-tight">
                    Resgate seu ingresso
                  </h2>

                  <p className="text-gray-600 leading-relaxed">
                    Depois da validação da conta, faça login normalmente e
                    acesse a página oficial da campanha para concluir o resgate
                    do ingresso gratuito.
                  </p>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    Algumas campanhas podem possuir limite de tempo entre novos
                    resgates. Aguarde o contador finalizar antes de tentar
                    novamente.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* LOGIN */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-center text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                    <FaLock />
                    Tela de Login
                  </p>

                  <div className="bg-zinc-50 border rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="w-10 h-10 bg-[#053B80] rounded-xl mx-auto"></div>

                    <MockInputStatic
                      label="E-mail"
                      val="contato@exemplo.com"
                    />

                    <MockInputStatic
                      label="Senha"
                      val="********"
                    />

                    <button className="btn btn-sm btn-block bg-[#053B80] text-white border-none rounded-xl">
                      ENTRAR
                    </button>
                  </div>
                </div>

                {/* CAMPANHA */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-center text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                    <FaMousePointer />
                    Página da Campanha
                  </p>

                  <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
                    <div className="relative h-48 w-full bg-zinc-200">
                      <Image
                        src={campaign.imageUrl || "/placeholder.png"}
                        fill
                        className="object-cover"
                        alt="Preview"
                      />
                    </div>

                    <div className="p-5 text-center space-y-4">
                      <h5 className="text-sm font-black text-[#053B80] uppercase leading-tight">
                        {campaign.name}
                      </h5>

                      <button className="btn btn-sm btn-block bg-emerald-500 hover:bg-emerald-600 text-white border-none font-black animate-bounce rounded-xl">
                        RESGATAR INGRESSO
                      </button>

                      <p className="text-[10px] text-gray-400 italic">
                        Sua participação começa aqui.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* <AdSenseBlock className="mx-auto min-h-24 max-w-[728px]" /> */}

            {/* BLOCO EXTRA */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-50 border border-zinc-200 rounded-[2rem] p-7 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#053B80] text-white flex items-center justify-center text-xl">
                    <FaShieldAlt />
                  </div>

                  <h3 className="text-2xl font-black text-[#053B80]">
                    Boas práticas
                  </h3>
                </div>

                <div className="space-y-4 text-sm text-gray-600 leading-6">
                  <p>
                    Utilize apenas seus próprios dados durante o cadastro.
                  </p>

                  <p>
                    Não compartilhe sua conta com terceiros.
                  </p>

                  <p>
                    Verifique frequentemente seu e-mail e telefone cadastrados.
                  </p>

                  <p>
                    Evite clicar em links suspeitos enviados fora dos canais
                    oficiais da plataforma.
                  </p>
                </div>
              </div>

              <div className="bg-[#053B80]/5 border border-[#053B80]/10 rounded-[2rem] p-7 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl">
                    <FaGift />
                  </div>

                  <h3 className="text-2xl font-black text-[#053B80]">
                    Depois do ingresso
                  </h3>
                </div>

                <div className="space-y-4 text-sm text-gray-600 leading-6">
                  <p>
                    Continue acompanhando os canais oficiais da campanha para
                    não perder futuras transmissões e comunicados importantes.
                  </p>

                  <p>
                    Caso seu nome seja chamado durante uma live, a equipe poderá
                    utilizar os dados cadastrados para contato complementar.
                  </p>

                  <p>
                    Manter sua conta ativa e acessível ajuda na validação rápida
                    das participações.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="border-t border-zinc-100 pt-12 text-center space-y-8">
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-[#053B80] uppercase tracking-tight">
                  Tudo pronto?
                </h3>

                <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
                  Agora que você já entendeu como funciona a participação, siga
                  para a próxima etapa para acessar o cadastro oficial da
                  campanha.
                </p>
              </div>

              <NextStepButton
                nextStepUrl={nextStepUrl}
                label="CONTINUAR PARTICIPAÇÃO"
                showIcon={false}
                className="w-full md:w-auto md:px-24 bg-emerald-500 hover:bg-emerald-600 text-white text-center py-6 rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-95"
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function MockInputStatic({
  label,
  val,
}: {
  label: string;
  val: string;
}) {
  return (
    <div className="space-y-1 text-left w-full">
      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wide">
        {label}
      </label>

      <div className="w-full h-11 bg-white border border-zinc-200 rounded-2xl px-4 flex items-center text-sm font-medium text-gray-400 italic">
        {val}
      </div>
    </div>
  );
}