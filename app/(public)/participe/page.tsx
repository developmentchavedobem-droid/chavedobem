import InfiniteCarousel from "@/src/components/InfiniteCarousel";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/src/lib/prisma";

export default async function Donations() {
  // 1. Buscamos as campanhas reais do banco de dados
  const campaigns = await prisma.campaign.findMany({
    where: {
      status: "ACTIVE", // Apenas campanhas ativas
    },
    take: 10, // Limitamos para não sobrecarregar o carrossel
    select: {
      imageUrl: true,
      slug: true,
    },
  });

  // 2. Mapeamos os dados para o formato que o InfiniteCarousel espera
  // Caso não haja campanhas no banco, definimos um fallback para não quebrar o layout
  const carouselItems = campaigns.length > 0 
    ? campaigns.map((c) => ({
        imageUrl: c.imageUrl || "/camp-1.png",
        slug: c.slug,
      }))
    : [
        { imageUrl: "/camp-1.png", slug: "geral" },
        { imageUrl: "/camp-2.png", slug: "geral" },
      ];

  return (
    <div className="flex flex-col gap-8 w-full h-[96vh] sm:h-[94vh] items-center justify-center bg-linear-to-b from-[#036E9B] to-[#1D8C6D] text-white overflow-hidden">
      {/* Logo */}
      <Image
        className="animate-fade-in"
        src="/logo.svg"
        alt="ChaveDoBem logo"
        width={300}
        height={100}
        priority
      />

      {/* Texto de Boas-vindas */}
      <div className="space-y-2">
        <p className="font-bold text-2xl sm:text-3xl text-center leading-tight">
          Bem-vindos à maior<br />
          <span className="text-emerald-400">Central de Doações</span> do Brasil
        </p>
        <p className="text-center text-sm opacity-80">
          Transforme vidas com apenas alguns cliques.
        </p>
      </div>

      {/* Carrossel com dados REAIS do Backend */}
      <div className="w-full py-4">
        <InfiniteCarousel items={carouselItems} speed={30} />
      </div>

      {/* Botão de Ação */}
      <div className="flex flex-col items-center gap-4">
        <Link href="/sorteios" className="btn btn-theme px-12 py-4 h-auto text-lg shadow-xl hover:scale-105 transition-transform">
          Participe Agora!
        </Link>
        <Link href="/" className="text-xs underline opacity-70 hover:opacity-100">
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}