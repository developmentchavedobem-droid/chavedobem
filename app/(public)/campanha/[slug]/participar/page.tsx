'use client'

import React, { useState } from "react";
import Image from "next/image";
import { FaCalendarAlt, FaUsers } from "react-icons/fa";
import AuthModal from "@/src/components/campaign/AuthModal";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ParticiparPage({ params }: PageProps) {
  const { slug } = React.use(params);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Nome da campanha baseado no slug para renderização imediata
  const campaignName = slug.replace(/-/g, ' ').toUpperCase();

  return (
    <div className="min-h-screen bg-zinc-100 font-sans pb-10">
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSelectAction={(action) => console.log("Ação selecionada:", action)}
        campaignSlug={slug}
      />

      {/* Container Principal Estilo App - max-w-125 é aprox 500px */}
      <main className="max-w-125 mx-auto bg-white min-h-screen shadow-2xl flex flex-col border-x border-zinc-200">
        
        {/* Wrapper Campaign */}
        <div className="flex flex-col">
          <div className="relative w-full aspect-16/10 bg-zinc-200">
            <Image 
              src="https://i.imgur.com/HG2CkcH.jpeg" 
              alt="img-capa" 
              fill 
              className="object-cover"
              priority
              unoptimized
            />
          </div>

          <div className="p-8 text-center space-y-6">
            <h2 className="text-2xl font-black text-[#053B80] uppercase tracking-tighter leading-tight">
              {campaignName}
            </h2>

            <p className="flex items-center justify-center gap-2 text-gray-500 font-bold text-sm">
              <FaCalendarAlt className="text-zinc-300" />
              30/04/2026 - Ao Vivo no YouTube
            </p>

            {/* Box de Registros */}
            <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 px-8 py-4 rounded-2xl text-[#053B80] mx-auto w-fit font-black text-xl">
              <FaUsers size={22} className="opacity-50" />
              103.926 pessoas
            </div>

            {/* Botão de Ação com Efeito Pulse */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-6 rounded-2xl text-xl shadow-xl transition-all animate-pulse active:scale-95 uppercase tracking-tight"
            >
              ACESSAR / PARTICIPAR
            </button>
          </div>
        </div>

        {/* Copyright Footer */}
        <footer className="mt-auto p-10 text-center border-t border-zinc-50 bg-zinc-50/50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
            © Chave do Bem 2024 - 2026 | Todos os direitos reservados
          </p>
        </footer>
      </main>
    </div>
  );
}