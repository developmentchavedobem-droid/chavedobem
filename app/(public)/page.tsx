import InfiniteCarousel from "@/src/components/InfiniteCarousel";
import Image from "next/image";
import Campaigns from "./sorteios/page";

export default function Home() {

  const images = [
      "/camp-1.png",
      "/camp-2.png",
      "/camp-3.png",
      "/camp-4.png",
      "/camp-5.png",
  ];

  return (
    <div className="flex flex-col min-h-screen pt-10 bg-zinc-100 font-sans">
      <section className="w-full h-screen sm:h-[70vh] flex flex-col-reverse sm:flex-row gap-5 sm:items-center bg-[url(/person.jpg)] bg-no-repeat bg-cover bg-center sm:bg-top">
        <article className="flex flex-col justify-center gap-3 px-20 w-full sm:w-fit h-full bg-linear-to-t sm:bg-linear-to-r from-sky-700">
          <h3 className="font-bold text-4xl">
            Sua ponte direta para <br className="hidden sm:flex"/>transformar vidas.
          </h3>
          <p className="font-semibold">O link do bem conecta quem quer ajudar com quem mais <br className="hidden sm:flex"/>precisa. Simples, transparente e totalmente gratuito.</p>
          <div className="w-full flex items-center gap-2">
            <button className="btn btn-outline btn-theme">
              Quero participar
            </button>
            <button className="btn btn-outline btn-theme bg-transparent">
              Sorteios disponíveis
            </button>
          </div>
        </article>

        <Image
          className="w-40 sm:w-72 md:w-80 h-auto"
          src="/logo.svg"
          alt="ChaveDoBem logo"
          width={300}
          height={300}
          priority
        />

      </section>
      
      <div className="w-full h-[50vh] flex flex-col items-center justify-center gap-10">
        <h3 className="font-semibold text-[#053B80] text-2xl">Doações disponíveis</h3>
        <InfiniteCarousel images={images} speed={25} />
      </div>

      <Campaigns />
    </div>
  );
}
