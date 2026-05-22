import prisma from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import NextStepButton from "@/src/components/campaign/NextStepButton";
import AdPageVisitTracker from "@/src/components/campaign/AdPageVisitTracker";
import { buildCampaignContent } from "@/src/utils/campaign-content";
import { sanitizeCampaignHtml, stripHtml } from "@/src/utils/html-content";

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

  const relatedCampaigns = await prisma.campaign.findMany({
    where: {
      status: "ACTIVE",
      id: { not: campaign.id },
    },
    orderBy: { createdAt: "desc" },
    take: 2,
  });

  const nextStep = `/campanha/${slug}/instrucoes${ref ? `?ref=${ref}` : ""}`;
  const content = buildCampaignContent({
    ...campaign,
    ticketsCount: campaign._count.tickets,
  });
  const campaignArticleHtml = sanitizeCampaignHtml(campaign.description);
  const hasCampaignArticle = Boolean(stripHtml(campaignArticleHtml));

  return (
    <div className="min-h-screen bg-zinc-100 py-20 font-sans text-gray-800">
      <AdPageVisitTracker slug={slug} page="campaign" refCode={ref} />

      <div className="w-full bg-[#053B80] px-4 pb-24 pt-16 text-white">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur-sm">
            <FaCheckCircle className="text-emerald-400" />
            Campanha Oficial Chave do Bem
          </div>
          <h1 className="text-3xl font-black uppercase leading-tight md:text-5xl">
            {campaign.name}
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm font-medium opacity-80">
            <span className="flex items-center gap-2">
              <FaClock /> {new Date(campaign.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>
      </div>

      <main className="-mt-12 mx-auto max-w-4xl px-4">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
          <div className="relative h-64 w-full bg-zinc-200 md:h-[450px]">
            <Image
              src={campaign.imageUrl || "/placeholder.png"}
              fill
              className="object-cover"
              alt={campaign.name}
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
          </div>

          <div className="space-y-8 p-6 text-lg leading-relaxed md:p-12">
            <article className="space-y-6">
              <h2 className="text-2xl font-bold leading-tight text-[#053B80] md:text-3xl">
                {campaign.name}
              </h2>
              {hasCampaignArticle ? (
                <div
                  className="space-y-4 text-gray-600 [&_a]:font-semibold [&_a]:text-[#053B80] [&_a]:underline [&_li]:mb-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_strong]:text-gray-800 [&_ul]:list-disc [&_ul]:pl-6"
                  dangerouslySetInnerHTML={{ __html: campaignArticleHtml }}
                />
              ) : (
                <p className="text-gray-600">{content.summary}</p>
              )}
            </article>

            <section className="rounded-2xl border border-[#053B80]/10 bg-[#053B80]/5 p-6 text-sm leading-6 text-[#053B80]">
              <p>
                Antes de participar, confira se voce esta no dominio oficial,
                leia as regras da campanha e utilize apenas seus proprios dados.
                A Chave do Bem nao cobra taxas para liberar cadastro ou
                participacao.
              </p>
            </section>

            {/*
              Blocos repetitivos temporariamente removidos para evitar paginas
              com conteudo muito semelhante entre campanhas durante a revisao do
              Google AdSense:
              - Pontos principais desta campanha
              - Como funciona na pratica?
              - Transparencia e acompanhamento
              - Por que existe uma etapa de leitura antes do cadastro?
              - Aviso final generico de contato
            */}

            <div className="flex flex-col items-center py-4">
              <NextStepButton
                nextStepUrl={nextStep}
                label="CADASTRE-SE AGORA"
                className="w-full rounded-2xl bg-emerald-500 py-5 text-center text-xl font-black text-white shadow-lg transition-all hover:scale-105 hover:bg-emerald-600 active:scale-95 md:w-auto md:px-20"
              />
              <span className="mt-4 text-xs font-medium uppercase tracking-tighter text-gray-400">
                Inscricao gratis • Processo seguro • Chave do Bem
              </span>
            </div>

            {relatedCampaigns.length > 0 && (
              <section className="border-t border-zinc-100 pt-8">
                <h3 className="mb-5 text-2xl font-black text-[#053B80]">
                  Outras campanhas para conhecer
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {relatedCampaigns.map((relatedCampaign) => (
                    <Link
                      key={relatedCampaign.id}
                      href={`/campanha/${relatedCampaign.slug}`}
                      prefetch
                      className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-200">
                        <Image
                          src={relatedCampaign.imageUrl || "/placeholder.png"}
                          alt={relatedCampaign.name}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <h4 className="line-clamp-2 text-xl font-black uppercase leading-tight text-[#053B80] transition group-hover:text-emerald-600">
                          {relatedCampaign.name}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
