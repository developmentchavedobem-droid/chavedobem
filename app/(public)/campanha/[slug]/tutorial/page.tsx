import React from "react";
import { FaUserPlus, FaEnvelopeOpenText, FaUnlockAlt, FaCheckCircle, FaInbox, FaMousePointer, FaLock } from "react-icons/fa";
import NextStepButton from "@/src/components/campaign/NextStepButton";
import AdPageVisitTracker from "@/src/components/campaign/AdPageVisitTracker";
import prisma from "@/src/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function TutorialPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ ref?: string }> 
}) {
  const { slug } = await params;
  const { ref } = await searchParams;

  const campaign = await prisma.campaign.findUnique({ where: { slug } });
  if (!campaign) notFound();

  const nextStepUrl = `/campanha/${slug}/participar${ref ? `?ref=${ref}` : ""}`;

  return (
    <div className="min-h-screen bg-zinc-100 pb-20 font-sans text-gray-800">
      <AdPageVisitTracker slug={slug} page="tutorial" refCode={ref} />
      
      {/* HEADER */}
      <div className="w-full bg-[#053B80] text-white pt-16 pb-24 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10 text-emerald-400">
            <FaCheckCircle /> Tutorial de Resgate
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight uppercase tracking-tight">
            Guia de Participação
          </h1>
          <p className="opacity-90 max-w-2xl mx-auto font-medium">
            Siga o fluxo visual abaixo para garantir que seu ingresso seja gerado corretamente.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-zinc-200">

          <div className="w-full bg-gray-50 border-b py-6 flex flex-col items-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">
              Publicidade
            </span>
            <div className="w-full max-w-[728px] h-[90px] bg-gray-200/50 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 mx-4 rounded-lg text-[10px] text-center px-4">
              Anúncio Responsivo (Google AdSense)
            </div>
          </div>
          
          <div className="p-6 md:p-12 space-y-32">
            
            {/* ETAPA 1: O FORMULÁRIO */}
            <section className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-14 h-14 bg-[#053B80] text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg text-2xl">
                  <FaUserPlus />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-[#053B80] uppercase">1. Preenchimento do Cadastro</h2>
                  <p className="text-gray-600">Informe seus dados reais. O CPF/CNPJ e data de nascimento são essenciais para a auditoria de ganhadores.</p>
                  
                  {/* TEXTO ADICIONADO */}
                  <p className="text-sm text-gray-500 leading-relaxed">
                    É fundamental que os dados inseridos sejam idênticos aos seus documentos oficiais. Nosso sistema utiliza uma camada de proteção que valida a autenticidade das informações para garantir que cada participante seja uma pessoa real. Dados incorretos ou incompletos podem impossibilitar a entrega de futuras premiações, por isso, revise cada campo antes de prosseguir.
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    O cadastro tambem serve para organizar sua jornada dentro da
                    plataforma. Com uma conta ativa, seus ingressos ficam
                    vinculados ao perfil correto, suas participacoes podem ser
                    consultadas posteriormente e a equipe consegue localizar suas
                    informacoes caso seja necessario prestar suporte. Evite usar
                    e-mails temporarios, numeros de telefone de terceiros ou
                    dados que voce nao consiga comprovar.
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Antes de enviar o formulario, confira se o nome esta escrito
                    corretamente, se o documento nao possui erro de digitacao e
                    se o WhatsApp informado esta ativo. Pequenos erros nessa
                    etapa podem gerar atrasos em validacoes futuras ou impedir
                    que comunicados importantes cheguem ate voce.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 md:p-10 space-y-6 shadow-inner max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MockInputStatic label="Nome Completo" val="Valéria Almeida" />
                  <MockInputStatic label="CPF / CNPJ" val="000.000.000-00" />
                  <MockInputStatic label="WhatsApp" val="(11) 99999-9999" />
                  <MockInputStatic label="Data de Nascimento" val="01/01/1990" />
                </div>
                <MockInputStatic label="E-mail" val="contato@exemplo.com" />
                <div className="flex gap-3 bg-white p-4 rounded-xl border border-zinc-200">
                  <input type="checkbox" checked readOnly className="checkbox checkbox-primary checkbox-sm" />
                  <p className="text-xs text-gray-500 italic">Eu declaro ser maior de 18 anos e aceito os termos e políticas.</p>
                </div>
              </div>
            </section>

            <div className="w-full py-6 flex flex-col items-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">
                Publicidade
              </span>
              <div className="w-full max-w-[728px] h-[90px] bg-gray-200/50 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 mx-4 rounded-lg text-[10px] text-center px-4">
                Anúncio Responsivo (Google AdSense)
              </div>
            </div>

            {/* ETAPA 2: SEGURANÇA (EMAIL) */}
            <section className="space-y-12">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg text-2xl">
                  <FaEnvelopeOpenText />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-[#053B80] uppercase">2. Validação de Segurança</h2>
                  <p className="text-gray-600">Verifique seu e-mail para ativar sua conta. Sem esta etapa, o resgate não é liberado.</p>
                  
                  {/* TEXTO ADICIONADO */}
                  <p className="text-sm text-gray-500 leading-relaxed">
                    A verificação de e-mail é uma etapa obrigatória de segurança. Ela serve para confirmar que você tem acesso ao meio de contato informado e para evitar a criação de contas automatizadas (bots). Caso não encontre a mensagem em sua caixa de entrada principal em alguns instantes, verifique as pastas de Spam ou Lixo Eletrônico.
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Essa confirmacao tambem protege sua conta contra cadastros
                    feitos com e-mails digitados por engano. Somente depois da
                    validacao o sistema considera que voce tem controle sobre o
                    canal informado. Por isso, nao compartilhe o link de
                    confirmacao com outras pessoas e nao envie codigos recebidos
                    por e-mail para contatos externos.
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Se o e-mail nao chegar, aguarde alguns minutos antes de
                    tentar novamente. Provedores diferentes podem ter tempos de
                    entrega variados. Verifique tambem se sua caixa esta cheia,
                    se o dominio nao foi bloqueado e se o endereco usado no
                    cadastro foi escrito corretamente.
                  </p>
                </div>
              </div>

              <div className="grid gap-8">
                {/* Visualização: Caixa de Entrada */}
                <div className="space-y-4 md:mx-30">
                  <p className="text-xs font-bold text-center text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                    <FaInbox /> Sua Caixa de Entrada
                  </p>
                  <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-red-600 p-3 text-white font-bold text-xs">Gmail / Outlook</div>
                    <div className="p-4 bg-blue-50/50 border-b flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px]">CB</div>
                      <div className="flex-1">
                        <p className="text-[11px] font-black">Chave do Bem</p>
                        <p className="text-[10px] text-gray-600">Confirmação de Cadastro - Olá Valéria!</p>
                      </div>
                      <span className="text-[9px] text-gray-400 font-bold">10:30</span>
                    </div>
                  </div>
                </div>

                {/* Visualização: Conteúdo do Email */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-center text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                    <FaEnvelopeOpenText /> Dentro do E-mail
                  </p>
                  <div className="bg-white border rounded-2xl p-6 shadow-sm text-center space-y-4">
                    <div className="w-12 h-12 bg-zinc-100 rounded-xl mx-auto flex items-center justify-center text-blue-600">
                      <FaCheckCircle size={24} />
                    </div>
                    <h4 className="text-sm font-black">Confirme seu E-mail</h4>
                    <p className="text-[10px] text-gray-500">Olá Valéria, clique no botão abaixo para validar sua identidade e prosseguir com o sorteio.</p>
                    <button className="btn btn-sm btn-block bg-blue-600 text-white border-none text-[10px] rounded-lg">
                      CONFIRMAR AGORA
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ETAPA 3: ACESSO E RESGATE */}
            <section className="space-y-12">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg text-2xl">
                  <FaUnlockAlt />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-[#053B80] uppercase">3. Acesso e Resgate Final</h2>
                  <p className="text-gray-600">Faça o login e resgate seu cupom na página da campanha desejada.</p>
                  
                  {/* TEXTO ADICIONADO */}
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Com seu e-mail validado, você terá acesso total à plataforma. Basta realizar o login para ser direcionado novamente à página da campanha. Lá, você encontrará o botão de resgate liberado. Ao clicar, o sistema gerará instantaneamente o seu número da sorte, que ficará salvo em seu perfil para consulta a qualquer momento.
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    O resgate deve ser feito apenas quando voce estiver logado
                    na sua propria conta. Isso garante que o ingresso seja salvo
                    no perfil correto e evita confusao quando mais de uma pessoa
                    utiliza o mesmo aparelho. Apos resgatar, confira seu perfil
                    para confirmar se a participacao foi registrada.
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Algumas campanhas possuem intervalo minimo entre resgates.
                    Esse limite ajuda a proteger a plataforma contra uso
                    automatizado e torna a distribuicao de ingressos mais
                    equilibrada. Caso apareca um contador, aguarde o tempo
                    indicado antes de tentar novamente.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Visualização: Tela de Login */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-center text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                    <FaLock /> Tela de Login
                  </p>
                  <div className="bg-zinc-50 border rounded-2xl p-6 shadow-sm space-y-3">
                    <div className="w-8 h-8 bg-[#053B80] rounded-lg mx-auto mb-4"></div>
                    <MockInputStatic label="E-mail" val="contato@exemplo.com" />
                    <MockInputStatic label="Sua Senha" val="********" />
                    <button className="btn btn-sm btn-block bg-[#053B80] text-white border-none mt-2">ENTRAR</button>
                  </div>
                </div>

                {/* Visualização: Tela da Campanha Real */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-center text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                    <FaMousePointer /> Resgate do Cupom
                  </p>
                  <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                    <div className="relative h-44 w-full bg-zinc-200">
                      <Image src={campaign.imageUrl || "/placeholder.png"} fill className="object-cover" alt="Preview" />
                    </div>
                    <div className="p-4 text-center space-y-3">
                       <h5 className="text-[11px] font-black text-[#053B80] leading-tight uppercase">{campaign.name}</h5>
                       <button className="btn btn-sm btn-block bg-emerald-500 hover:bg-emerald-600 text-white border-none font-black text-[10px] animate-bounce">
                         RESGATAR MEU CUPOM
                       </button>
                       <p className="text-[9px] text-gray-400 italic">Sua chance começa agora!</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="w-full py-2 flex flex-col items-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">
                Publicidade
              </span>
              <div className="w-full max-w-[728px] h-[90px] bg-gray-200/50 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 mx-4 rounded-lg text-[10px] text-center px-4">
                Anúncio Responsivo (Google AdSense)
              </div>
            </div>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-zinc-100 bg-zinc-50 p-6">
                <h3 className="text-xl font-black text-[#053B80]">
                  Boas praticas para concluir o tutorial
                </h3>
                <div className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
                  <p>
                    Use uma conexao estavel durante o cadastro e evite atualizar
                    a pagina enquanto estiver enviando informacoes. Em redes
                    lentas, aguarde a resposta do sistema antes de clicar
                    novamente em botoes de envio.
                  </p>
                  <p>
                    Mantenha documentos e telefone por perto. Se for necessario
                    corrigir algum campo, faca isso antes de avancar para a etapa
                    de resgate. A revisao antecipada economiza tempo e reduz
                    solicitacoes de suporte.
                  </p>
                  <p>
                    Sempre que tiver duvida, volte uma etapa e releia as
                    instrucoes. O objetivo do tutorial e justamente tornar o
                    processo previsivel, simples e seguro para novos
                    participantes.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-[#053B80]/10 bg-[#053B80]/5 p-6">
                <h3 className="text-xl font-black text-[#053B80]">
                  O que acontece depois do ingresso?
                </h3>
                <div className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
                  <p>
                    Depois do resgate, o ingresso passa a fazer parte do seu
                    historico de participacao. Ele pode ser usado para consulta
                    interna da campanha e para confirmar que a etapa foi
                    concluida corretamente.
                  </p>
                  <p>
                    Continue acompanhando os canais oficiais e mantenha sua
                    conta acessivel. Caso a campanha tenha comunicados
                    posteriores, eles dependerao dos dados informados no
                    cadastro.
                  </p>
                  <p>
                    A Chave do Bem recomenda que voce salve seus dados de acesso
                    com seguranca e nao compartilhe sua conta. O uso individual
                    ajuda a preservar a confiabilidade das campanhas.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA FINAL */}
            <div className="pt-10 border-t border-zinc-100 text-center space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#053B80] uppercase tracking-tighter italic">Tudo Entendido?</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">Ao clicar abaixo você será direcionado para iniciar o cadastro real.</p>
              </div>
              
              <NextStepButton 
                nextStepUrl={nextStepUrl}
                label="RESGATAR INGRESSO GRÁTIS"
                showIcon={false}
                className="w-full md:w-auto md:px-24 bg-emerald-500 hover:bg-emerald-600 text-white text-center py-6 rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-95"
              />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function MockInputStatic({ label, val }: { label: string, val: string }) {
  return (
    <div className="space-y-1 text-left w-full">
      <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">{label}</label>
      <div className="w-full h-10 bg-white border border-zinc-200 rounded-xl px-4 flex items-center text-xs font-medium text-gray-400 italic">
        {val}
      </div>
    </div>
  );
}
