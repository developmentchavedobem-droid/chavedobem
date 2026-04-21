import InfiniteCarousel from "@/src/components/InfiniteCarousel";
import Image from "next/image";
import Campaigns from "./sorteios/page";
import prisma from "@/src/lib/prisma";
import Link from "next/link";

export default async function Home() {
  // Buscamos apenas campanhas ativas
  const campaigns = await prisma.campaign.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  // Preparamos os itens para o carrossel (filtramos apenas as que tem imagem)
  const carouselItems = campaigns
    .filter(c => c.imageUrl)
    .map(c => ({
      imageUrl: c.imageUrl!,
      slug: c.slug
    }));

  return (
    <div className="flex flex-col min-h-screen pt-10 bg-zinc-100 font-sans">
      {/* HERO SECTION */}
      <section className="w-full h-[70vh] flex flex-col-reverse sm:flex-row gap-5 sm:items-center bg-[url(/person.jpg)] bg-no-repeat bg-cover bg-center sm:bg-top">
        <article className="flex flex-col justify-center gap-3 px-5 sm:px-20 w-full sm:w-fit h-4/6 sm:h-full bg-linear-to-t sm:bg-linear-to-r from-sky-700 text-white">
          <h3 className="font-bold text-4xl">
            Sua ponte direta para <br className="hidden sm:flex"/>transformar vidas.
          </h3>
          <p className="font-semibold">O Chave do Bem é a maior central de doações do Brasil.<br className="hidden sm:flex"/>Simples, transparente e totalmente gratuito.</p>
          <div className="w-full flex items-center gap-2">
            <Link href="/cadastre-se" >
              <button className="btn btn-outline btn-theme">
                Quero participar
              </button>
            </Link>
            <Link href="/cadastre-se">
              <button className="btn btn-outline btn-theme bg-transparent">
                Campanhas disponíveis
              </button>
            </Link>
          </div>
        </article>

        <Image
          className="w-40 sm:w-72 md:w-80 h-auto"
          src="/logo.png"
          alt="ChaveDoBem logo"
          width={300}
          height={300}
          priority
        />

      </section>
      
      {/* CAROUSEL SECTION */}
      {carouselItems.length > 0 && (
        <div className="w-full py-16 flex flex-col items-center justify-center gap-10 bg-white shadow-xs">
          <h3 className="font-bold text-[#053B80] text-2xl uppercase tracking-widest">
            Doações em destaque
          </h3>
          <InfiniteCarousel items={carouselItems} speed={30} />
        </div>
      )}

      {/* CAMPAIGNS LIST */}
      <div id="campanhas" className="pt-10">
        <Campaigns campaigns={campaigns} />
      </div>
    </div>
  );
}


