'use client'

import { IoClose } from "react-icons/io5";

interface AdOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdOverlay({ isOpen, onClose }: AdOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-300">
      {/* Fundo Desfocado */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Botão Fechar no Canto Superior Esquerdo */}
      <button 
        onClick={onClose}
        className="absolute top-6 left-6 z-[110] bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all border border-white/20"
      >
        <IoClose size={32} />
      </button>

      {/* Container do Anúncio */}
      <div className="relative z-[110] w-[90%] max-w-[400px] aspect-[3/4] sm:aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center justify-center p-4">
        <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-4 font-bold">Publicidade</span>
        
        {/* Slot do AdSense */}
        <div className="w-full h-full bg-zinc-100 border border-dashed border-zinc-300 flex items-center justify-center text-gray-400 text-center px-6">
          <p className="text-sm italic">
            [ Slot AdSense Intersticial ]<br/>
            Bloco de Anúncio Responsivo
          </p>
        </div>
      </div>
    </div>
  );
}