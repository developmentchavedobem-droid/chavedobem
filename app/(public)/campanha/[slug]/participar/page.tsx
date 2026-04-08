'use client'

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { FaUsers, FaCheckCircle, FaClock } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import AuthModal from "@/src/components/campaign/AuthModal";
import { useAuthStore } from "@/src/stores/auth.store";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ParticiparPage({ params }: PageProps) {
  const { slug } = React.use(params);
  const { isAuthenticated, refreshUser, loading: authLoading } = useAuthStore();
  
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  // Usamos useRef para guardar o ID do intervalo e conseguir limpá-lo globalmente na página
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback((lastDate: string) => {
    stopTimer(); // Garante que não existam dois timers rodando

    const lastClaim = new Date(lastDate).getTime();
    const interval = 3 * 60 * 60 * 1000;
    
    const update = () => {
      const now = new Date().getTime();
      const diff = (lastClaim + interval) - now;

      if (diff <= 0) {
        setTimeLeft(null);
        stopTimer();
        return true;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
      return false;
    };

    if (update()) return; 

    timerRef.current = setInterval(update, 1000);
  }, [stopTimer]);

  const fetchCampaignData = useCallback(async () => {
    try {
      const res = await fetch(`/api/campaigns/slug/${slug}`);
      if (!res.ok) return;
      const data = await res.json();
      setCampaign(data);
      
      // A API agora retorna o último ticket GLOBAL do usuário
      if (data.userLastTicketDate) {
        startTimer(data.userLastTicketDate);
      } else {
        setTimeLeft(null); // Garante que o botão limpe caso não haja ticket
      }
    } catch (e) {
      console.error("Erro ao buscar campanha:", e);
    } finally {
      setLoading(false);
    }
  }, [slug, startTimer]);

  useEffect(() => {
    const initializePage = async () => {
      // 1. Primeiro valida se o usuário está logado (atualiza o estado do Zustand)
      await refreshUser();
      
      // 2. Agora busca os dados da campanha. 
      // Como o usuário já está validado, a API /api/campaigns/slug/[slug] 
      // conseguirá identificar o ID dele e retornar o 'userLastTicketDate' global.
      fetchCampaignData();
    };

    initializePage();

    return () => stopTimer();
  }, [fetchCampaignData, refreshUser, stopTimer]);

  const handleAction = async () => {
    if (!isAuthenticated) {
      await refreshUser();
      if (!useAuthStore.getState().isAuthenticated) {
        setIsModalOpen(true);
        return;
      }
    }

    if (timeLeft) return;

    setIsClaiming(true);
    try {
      const res = await fetch('/api/campaigns/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: campaign.id })
      });

      const data = await res.json();

      if (res.ok) {
        setShowSuccessModal(true);
        // Recarregar dados para atualizar contador de pessoas e pegar a nova trava GLOBAL
        fetchCampaignData(); 
      } else {
        alert(data.error || "Erro ao resgatar ingresso.");
        // Se a API retornar a data do ticket que causou o erro, iniciamos o timer com ela
        if (data.userLastTicketDate) startTimer(data.userLastTicketDate);
      }
    } catch (e) {
      alert("Falha na conexão com o servidor.");
    } finally {
      setIsClaiming(false);
    }
  };

  if (loading || authLoading) return <div className="min-h-screen bg-zinc-100 animate-pulse" />;
  if (!campaign) return notFound();

  return (
    <div className="min-h-screen bg-zinc-100 font-sans pb-10">
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} campaignSlug={slug} />

      {/* MODAL DE SUCESSO */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 text-center animate-in zoom-in-95 relative shadow-2xl">
            <button onClick={() => setShowSuccessModal(false)} className="absolute top-6 right-6 text-zinc-300">
              <IoClose size={28} />
            </button>
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
               <FaCheckCircle size={45} />
            </div>
            <h4 className="text-2xl font-black text-gray-800 leading-tight">Ingresso resgatado!</h4>
            <p className="text-zinc-500 text-sm mt-2 font-medium">Sua participação foi confirmada.</p>
            <button 
              onClick={() => setShowSuccessModal(false)} 
              className="mt-8 block w-full bg-[#1D8347] text-white py-5 rounded-2xl font-black uppercase text-sm shadow-lg hover:bg-[#166638] transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <main className="max-w-125 mx-auto bg-white min-h-screen shadow-2xl flex flex-col border-x border-zinc-200">
        <div className="relative w-full aspect-16/10 bg-zinc-200">
          <Image src={campaign.imageUrl || "/placeholder.png"} alt={campaign.name} fill className="object-cover" priority unoptimized />
        </div>

        <div className="p-8 text-center space-y-6">
          <h2 className="text-2xl font-black text-[#053B80] uppercase italic tracking-tighter leading-tight">
            {campaign.name}
          </h2>

          <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 px-8 py-4 rounded-2xl text-[#053B80] mx-auto w-fit font-black text-xl shadow-inner">
            <FaUsers className="opacity-40" />
            {(campaign._count?.tickets || 0).toLocaleString('pt-BR')} participantes
          </div>

          {/* TRAVA VISÍVEL */}
          {isAuthenticated && timeLeft ? (
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl animate-in fade-in slide-in-from-top-2">
              <p className="text-amber-800 font-black text-xs uppercase tracking-widest">Aguarde para o próximo resgate</p>
              <span className="text-red-500 flex items-center justify-center gap-2 mt-2 text-xl font-black bg-white py-2 rounded-xl border border-red-100 shadow-sm">
                <FaClock className="animate-pulse" /> {timeLeft}
              </span>
            </div>
          ) : (
            <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
              Resgate seu ingresso gratuito a cada 3 horas
            </div>
          )}

          <button 
            onClick={handleAction}
            disabled={isClaiming || (!!timeLeft && isAuthenticated)}
            className={`w-full py-6 rounded-2xl text-xl font-black shadow-xl uppercase transition-all active:scale-95
              ${(timeLeft && isAuthenticated) || isClaiming
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200 shadow-none' 
                : 'bg-emerald-500 hover:bg-emerald-600 text-white animate-pulse'}`}
          >
            {isClaiming ? "PROCESSANDO..." : (timeLeft && isAuthenticated ? "AGUARDE O CONTADOR" : "RESGATAR MEU INGRESSO")}
          </button>
        </div>

        <footer className="mt-auto p-10 text-center border-t border-zinc-50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            © Chave do Bem 2026 | Todos os direitos reservados
          </p>
        </footer>
      </main>
    </div>
  );
}