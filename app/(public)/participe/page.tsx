import InfiniteCarousel from "@/src/components/InfiniteCarousel";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/src/lib/prisma";
import RefTracker from "@/src/components/campaign/RefTracker";
import { Suspense } from "react";

export default async function ParticipePage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const campaigns = await prisma.campaign.findMany({
    where: { status: "ACTIVE" },
    take: 10,
    select: { imageUrl: true, slug: true },
  });

  const carouselItems = campaigns.length > 0 
    ? campaigns.map((c) => ({ imageUrl: c.imageUrl || "/camp-1.png", slug: c.slug }))
    : [{ imageUrl: "/camp-1.png", slug: "geral" }];

  return (
    // h-screen força ocupar tudo, ignorando o layout padrão se necessário
    <div className="fixed inset-0 z-999 flex flex-col gap-6 w-full h-screen items-center justify-center bg-linear-to-b from-[#036E9B] to-[#1D8C6D] text-white overflow-hidden">
      
      {/* Captura o ref da URL: ?ref=USUARIO_ID&src=instagram */}
      <Suspense fallback={null}>
        <RefTracker />
      </Suspense>

      <Image
        className="animate-fade-in"
        src="/logo.png"
        alt="ChaveDoBem logo"
        width={200}
        height={100}
        priority
      />

      <div className="space-y-2 text-center">
        <p className="font-bold text-2xl sm:text-3xl leading-tight">
          Bem-vindos à maior<br />
          <span className="text-emerald-400">Central de Doações</span> do Brasil
        </p>
        <p className="text-sm opacity-80">Transforme vidas com apenas alguns cliques.</p>
        <p className="mx-auto max-w-xl px-6 text-xs leading-5 text-white/75 sm:text-sm">
          A Chave do Bem reune campanhas gratuitas, informacoes de participacao e orientacoes de seguranca em um unico ambiente. Antes de se cadastrar, leia as regras da campanha escolhida, mantenha seus dados atualizados e acompanhe apenas os canais oficiais da plataforma.
        </p>
      </div>

      <div className="w-full py-4">
        <InfiniteCarousel items={carouselItems} speed={30} refCode={ref} />
      </div>

      <div className="flex flex-col items-center gap-4">
        <Link href="/cadastre-se" className="btn btn-theme px-12 py-4 h-auto text-lg shadow-xl hover:scale-105 transition-transform">
          Participe Agora!
        </Link>
        <p className="max-w-lg px-6 text-center text-[11px] leading-5 text-white/70">
          A participacao nao exige pagamento, compra de produtos ou transferencia de valores. O cadastro ajuda a identificar participantes reais e permite que os ingressos gratuitos sejam vinculados ao perfil correto.
        </p>
      </div>
    </div>
  );
}
