// src/components/Card.tsx
import Image from "next/image";
import Link from "next/link";
import { FaClock } from "react-icons/fa";

export default function Card({ campaign }: { campaign: any }) {
  // Formatação da data similar ao exemplo enviado
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(campaign.createdAt));

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-zinc-200 overflow-hidden transition-all">
      <Link href={`/campanha/${campaign.slug}`} className="flex flex-row items-center p-3 gap-4">
        
        {/* Thumbnail Quadrada (Estilo Link do Bem) */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-xl overflow-hidden">
          <Image 
            src={campaign.imageUrl || "https://i.imgur.com/HG2CkcH.jpeg"} 
            alt={campaign.name}
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
        </div>

        {/* Detalhes do Item */}
        <div className="flex flex-col flex-1 gap-1">
          <h3 className="text-[#053B80] font-black text-base md:text-lg leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2 uppercase tracking-tighter">
            {campaign.name}
          </h3>
          
          <div className="flex items-center gap-2 text-zinc-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mt-1">
            <FaClock size={12} className="text-zinc-300" />
            <span>{formattedDate}</span>
          </div>

          <div className="mt-2 hidden md:block">
            <span className="bg-zinc-100 text-zinc-500 text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest border border-zinc-200">
               Inscrição Gratuita
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}