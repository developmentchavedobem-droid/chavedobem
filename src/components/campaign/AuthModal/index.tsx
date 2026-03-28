'use client'

import { IoClose } from "react-icons/io5";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: 'login' | 'register' | 'forgot') => void;
  campaignSlug: string; // Adicionado para resolver o erro TS2322
}

export default function AuthModal({ isOpen, onClose, onSelectAction }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#053B80]/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 pt-12 flex flex-col items-center">
          <p className="text-2xl font-black text-[#053B80] mb-8 uppercase italic tracking-tighter">
            Eu quero...
          </p>
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-8 text-3xl text-zinc-300 hover:text-zinc-500 font-light"
          >
            <IoClose />
          </button>

          <div className="w-full space-y-4">
            <button 
              onClick={() => onSelectAction('login')}
              className="w-full bg-[#1F8C6D] hover:bg-[#16664f] text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-95 uppercase text-lg tracking-tight"
            >
              ACESSAR CONTA
            </button>

            <button 
              onClick={() => onSelectAction('register')}
              className="w-full bg-[#053B80] hover:bg-sky-900 text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-95 uppercase text-lg tracking-tight"
            >
              CRIAR CONTA
            </button>

            <button 
              onClick={() => onSelectAction('forgot')}
              className="w-full bg-transparent border-2 border-zinc-100 hover:border-zinc-200 text-zinc-400 font-black py-4 rounded-2xl transition-all uppercase text-xs tracking-widest"
            >
              ESQUECI MINHA SENHA
            </button>
          </div>
          
          <div className="mt-8 h-1 w-12 bg-zinc-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}