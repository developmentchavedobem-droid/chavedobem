import InfiniteCarousel from "@/src/components/InfiniteCarousel";
import Image from "next/image";
import Campaigns from "./sorteios/page";
import prisma from "@/src/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const campaigns = await prisma.campaign.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  const carouselItems = campaigns
    .filter((campaign) => campaign.imageUrl)
    .map((campaign) => ({
      imageUrl: campaign.imageUrl!,
      slug: campaign.slug,
    }));

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 pt-10 font-sans">
      <section className="flex h-[70vh] w-full flex-col-reverse gap-5 bg-[url(/person.jpg)] bg-cover bg-center bg-no-repeat sm:flex-row sm:items-center sm:justify-between sm:bg-top">
        <article className="flex h-4/6 w-full flex-col justify-center gap-3 bg-linear-to-t from-sky-700 px-5 text-white sm:h-full sm:w-fit sm:bg-linear-to-r sm:px-20">
          <h1 className="text-4xl font-bold">
            Sua ponte direta para <br className="hidden sm:flex" />
            transformar vidas.
          </h1>
          <p className="max-w-2xl font-semibold leading-7">
            O Chave do Bem conecta pessoas a campanhas gratuitas, com
            informacao clara, regras acessiveis e participacao segura.
          </p>
          <div className="flex w-full flex-wrap items-center gap-2">
            <Link href="/cadastre-se">
              <button className="btn btn-outline btn-theme">
                Quero participar
              </button>
            </Link>
            <Link href="#campanhas">
              <button className="btn btn-outline btn-theme bg-transparent">
                Campanhas disponiveis
              </button>
            </Link>
          </div>
        </article>

        <Image
          className="h-auto w-40 sm:mr-10 sm:w-72 md:w-60"
          src="/logo.png"
          alt="Chave do Bem"
          width={300}
          height={300}
          priority
        />
      </section>

      {carouselItems.length > 0 && (
        <div className="flex w-full flex-col items-center justify-center gap-10 bg-white py-16 shadow-xs">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-[#053B80]">
            Destaques
          </h2>
          <InfiniteCarousel items={carouselItems} speed={30} />
        </div>
      )}

      <div id="campanhas" className="pt-10">
        <Campaigns campaigns={campaigns} />
      </div>
    </div>
  );
}
