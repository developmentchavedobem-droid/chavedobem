import prisma from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { FaClock, FaCheckCircle } from "react-icons/fa";
import NextStepButton from "@/src/components/campaign/NextStepButton";

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

          <div className="w-full bg-gray-50 border-b py-6 flex flex-col items-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">
              Publicidade
            </span>
            <div className="w-full max-w-[728px] h-[90px] bg-gray-200/50 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 mx-4 rounded-lg">
              Slot AdSense (Banner de Topo)
            </div>
          </div>

          <div className="p-6 md:p-12 space-y-8 text-lg leading-relaxed">
            <section className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#053B80] leading-tight">
                Descubra como participar desta iniciativa e transformar seus
                planos
              </h2>
              <p className="text-gray-600">{campaign.description}</p>
              <p className="text-gray-600">
                Esta pagina foi preparada para reunir as informacoes principais
                da campanha antes do cadastro. Aqui voce encontra um resumo da
                proposta, entende como o ingresso gratuito e gerado e confere os
                cuidados recomendados para participar de forma consciente. A
                Chave do Bem acredita que uma boa experiencia comeca antes do
                clique: o participante deve saber o que esta fazendo, quais dados
                serao utilizados e por que cada etapa existe.
              </p>
              <p className="text-gray-600">
                Recomendamos que voce leia todo o conteudo antes de avancar para
                as instrucoes. A leitura ajuda a evitar erros de cadastro,
                reduz duvidas sobre prazos e melhora a seguranca do processo. A
                participacao e gratuita, individual e vinculada ao perfil criado
                na plataforma, por isso dados reais e atualizados sao essenciais
                para qualquer contato futuro.
              </p>
            </section>

            <section className="space-y-6 rounded-3xl border border-[#053B80]/10 bg-[#053B80]/5 p-6 md:p-10">
              <h3 className="text-2xl font-black text-[#053B80]">
                O que voce deve saber antes de participar
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-black uppercase text-gray-800">
                    Participacao sem custo
                  </h4>
                  <p className="text-base text-gray-600">
                    A campanha nao exige pagamento para cadastro, retirada de
                    ingresso ou consulta de informacoes. Caso alguem solicite
                    Pix, transferencia, deposito, compra de produto ou taxa de
                    liberacao usando o nome da Chave do Bem, desconsidere a
                    mensagem e procure nossos canais oficiais.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-black uppercase text-gray-800">
                    Dados corretos importam
                  </h4>
                  <p className="text-base text-gray-600">
                    Nome, e-mail e telefone devem ser preenchidos com atencao.
                    Essas informacoes permitem validar o participante, enviar
                    comunicados importantes e consultar a conta quando houver
                    necessidade de suporte. Informacoes incompletas podem
                    dificultar contato e verificacoes.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-black uppercase text-gray-800">
                    Regras publicas
                  </h4>
                  <p className="text-base text-gray-600">
                    As instrucoes de cada campanha ficam disponiveis no proprio
                    site. O participante deve observar limites de resgate,
                    validacao por e-mail, autenticacao e demais orientacoes
                    exibidas durante a jornada. Essas regras existem para manter
                    um processo organizado e mais justo.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-black uppercase text-gray-800">
                    Consulta posterior
                  </h4>
                  <p className="text-base text-gray-600">
                    Depois do cadastro, seus ingressos ficam vinculados ao seu
                    perfil. Isso permite consultar participacoes, acompanhar
                    campanhas e manter um historico organizado. Sempre que
                    possivel, acesse sua conta pelo mesmo e-mail utilizado no
                    primeiro cadastro.
                  </p>
                </div>
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
                  "Sistema de ranking Top 5",
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
            </section>

            <div className="w-full py-6 flex flex-col items-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">
                Publicidade
              </span>
              <div className="w-full max-w-[728px] h-[90px] bg-gray-200/50 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 mx-4 rounded-lg">
                Slot AdSense (Banner do meio)
              </div>
            </div>

            <section className="grid grid-cols-1 gap-8 pt-4">
              <div className="space-y-4">
                <h3 className="text-xl font-black text-[#053B80] uppercase flex items-center gap-2">
                  <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                  Transparência e Resultados
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
                      A Chave do Bem é sustentada por parcerias publicitárias.
                      Isso significa que você nunca será solicitado a fazer
                      transferências, pagamentos via PIX ou comprar qualquer
                      produto para participar. Sua única moeda de troca é o
                      seu tempo e engajamento.
                    </p>
                  </div>

                  <div className="border-l-4 border-zinc-200 pl-4">
                    <p>
                      <strong className="text-gray-800">Ranking Top 5:</strong>{" "}
                      Valorizamos quem compartilha o bem. Nosso sistema de
                      ranking bonifica os usuários mais ativos e aqueles que
                      convidam novos participantes. Quanto maior sua posição no
                      ranking, maiores são as bonificações acumuladas em sua
                      carteira digital.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 rounded-3xl bg-white p-6 ring-1 ring-zinc-100 md:p-10">
                <h3 className="text-2xl font-black text-[#053B80]">
                  Por que existe uma etapa de leitura antes do cadastro?
                </h3>
                <p className="text-base leading-7 text-gray-600">
                  Muitas pessoas chegam a uma campanha por meio de redes sociais,
                  indicacoes ou links compartilhados. Por isso, esta pagina
                  funciona como uma camada de orientacao. Antes de informar dados
                  pessoais ou gerar um ingresso, o visitante consegue entender a
                  natureza da iniciativa, confirmar que esta no dominio correto e
                  conhecer o caminho oficial de participacao.
                </p>
                <p className="text-base leading-7 text-gray-600">
                  Essa organizacao tambem reduz erros comuns, como criar contas
                  duplicadas, usar e-mails inacessiveis ou tentar participar com
                  dados de terceiros. A Chave do Bem busca manter campanhas com
                  informacoes claras, linguagem simples e regras visiveis para
                  que a experiencia seja util tanto para novos visitantes quanto
                  para participantes recorrentes.
                </p>
                <p className="text-base leading-7 text-gray-600">
                  Ao avancar para a proxima etapa, voce sera direcionado para as
                  instrucoes oficiais da campanha. Elas explicam o cadastro, a
                  verificacao de e-mail, o resgate gratuito e os cuidados de
                  seguranca. Leia com calma e so prossiga quando estiver seguro
                  de que compreendeu o fluxo.
                </p>
              </div>

              <div className="bg-[#053B80]/5 p-6 rounded-2xl border border-[#053B80]/10 italic text-sm text-[#053B80] font-medium">
                * Importante: Lembre-se de manter seus dados de contato sempre
                atualizados. Caso você seja um dos selecionados, nossa equipe
                entrará em contato via WhatsApp ou E-mail cadastrado para
                realizar a entrega da premiação ou auxílio.
              </div>
            </section>

            <div className="w-full flex flex-col items-center py-4">
              <span className="text-[10px] text-gray-400 uppercase mb-2 font-bold">
                Publicidade
              </span>
              <div className="w-full h-64 bg-gray-50 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded-2xl">
                Slot AdSense (Bloco de Conteúdo)
              </div>
            </div>

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
