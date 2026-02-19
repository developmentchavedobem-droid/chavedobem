import InfiniteCarousel from "@/src/components/InfiniteCarousel";
import Image from "next/image"
import Link from "next/link";

export default function Donations() {

    const images = [
    "/camp-1.png",
    "/camp-2.png",
    "/camp-3.png",
    "/camp-4.png",
    "/camp-5.png",
  ];

    return (
        <div className="flex flex-col gap-5 w-full h-[96vh] sm:h-[94vh] items-center justify-center bg-linear-to-b from-[#036E9B] to-[#1D8C6D]">
            <Image
                className=""
                src="/logo.svg"
                alt="ChaveDoBem logo"
                width={300}
                height={100}
                priority
            />
            <p className="font-bold text-center">Bem-vindos a maior<br/>Central de doações do Brasil</p>

            <InfiniteCarousel images={images} speed={25} />
            
            <button className="btn btn-theme px-10">
                <Link href="/sorteios">Participe Agora!</Link>
            </button>
        </div>
    )
}