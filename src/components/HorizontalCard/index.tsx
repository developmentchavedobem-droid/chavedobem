import Image from "next/image";
import Link from "next/link";
import { Campaign } from "@/app/generated/prisma/client";
import { getTextPreview } from "@/src/utils/html-content";

interface HorizontalCardProps {
  campaign: Campaign;
}

export default function HorizontalCard({ campaign }: HorizontalCardProps) {
  return (
    <div className="w-full rounded-xl border overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer bg-white">
      <Link href={`/campanha/${campaign.slug}`} prefetch className="flex h-full">
        {/* Lado da Imagem */}
        <div className="relative w-1/3 min-w-[120px] h-32">
          <Image
            fill
            priority
            src={campaign.imageUrl || "/placeholder.png"}
            alt={campaign.name}
            className="object-cover"
          />
        </div>

        {/* Lado do Conteúdo */}
        <div className="w-2/3 flex flex-col justify-center px-6 py-4 bg-white">
          <h4 className="font-bold text-lg text-[#053B80]">
            {campaign.name}
          </h4>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {getTextPreview(campaign.description, "Clique para saber mais sobre esta doação e como participar.")}
          </p>
          
          <div className="mt-3 flex items-center gap-2">
             <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
               Ativa
             </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
