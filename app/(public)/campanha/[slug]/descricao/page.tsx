import AdPageVisitTracker from "@/src/components/campaign/AdPageVisitTracker";
import NextStepButton from "@/src/components/campaign/NextStepButton";
import prisma from "@/src/lib/prisma";
import { hasHtmlContent, sanitizeCampaignHtml } from "@/src/utils/html-content";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";

export default async function CampaignSecondDescriptionPage({
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

  if (!campaign || campaign.status !== "ACTIVE") notFound();

  const secondDescriptionHtml = sanitizeCampaignHtml(campaign.secondDescription);

  if (!hasHtmlContent(secondDescriptionHtml)) {
    redirect(`/campanha/${slug}/instrucoes${ref ? `?ref=${ref}` : ""}`);
  }

  const nextStepUrl = `/campanha/${slug}/instrucoes${ref ? `?ref=${ref}` : ""}`;

  return (
    <div className="min-h-screen bg-zinc-100 py-20 font-sans text-gray-800">
      <AdPageVisitTracker slug={slug} page="description" refCode={ref} />

      <div className="w-full bg-[#053B80] px-4 pb-24 pt-16 text-white">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur-sm">
            <FaCheckCircle className="text-emerald-400" />
            Campanha Oficial Chave do Bem
          </div>
          <h1 className="text-3xl font-black uppercase leading-tight md:text-5xl">
            {campaign.name}
          </h1>
        </div>
      </div>

      <main className="-mt-12 mx-auto max-w-4xl px-4">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
          <div className="relative h-56 w-full bg-zinc-200 md:h-96">
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
            <article
              className="space-y-4 text-gray-600 [&_a]:font-semibold [&_a]:text-[#053B80] [&_a]:underline [&_img]:my-6 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-2xl [&_li]:mb-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_strong]:text-gray-800 [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: secondDescriptionHtml }}
            />

            <div className="flex flex-col items-center border-t border-zinc-100 pt-8">
              <NextStepButton
                nextStepUrl={nextStepUrl}
                label="CONTINUAR"
                className="w-full rounded-2xl bg-emerald-500 py-5 text-center text-xl font-black text-white shadow-lg transition-all hover:scale-105 hover:bg-emerald-600 active:scale-95 md:w-auto md:px-20"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
