import Image from "next/image";
import Link from "next/link";

export default function Card({ campaign }: { campaign: any }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md">
      <Link
        href={`/campanha/${campaign.slug}`}
        prefetch
        className="flex flex-row items-center gap-4 p-3"
      >
        <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-xl md:w-48">
          <Image
            src={campaign.imageUrl || "https://i.imgur.com/HG2CkcH.jpeg"}
            alt={campaign.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/5 transition-colors group-hover:bg-transparent" />
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <h3 className="text-base font-black uppercase leading-tight tracking-tighter text-[#053B80] transition-colors group-hover:text-emerald-600 md:text-lg">
            {campaign.name}
          </h3>
        </div>
      </Link>
    </div>
  );
}
