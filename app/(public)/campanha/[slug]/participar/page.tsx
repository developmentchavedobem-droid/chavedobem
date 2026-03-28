'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaCalendarAlt, FaUsers, FaTicketAlt, FaCheckCircle, FaClock } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import AuthModal from "@/src/components/campaign/AuthModal";
import { useAuthStore } from "@/src/stores/auth.store";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ParticiparPage({ params }: PageProps) {
  const { slug } = React.use(params);
  const router = useRouter();
  
  // Zustand Auth
  const { user, isAuthenticated, refreshUser, loading: authLoading } = useAuthStore();
  
  // Estados Locais
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Lógica de Trava/Contador
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  // 1. Carregar Campanha e Sessão
  useEffect(() => {
    refreshUser();
    async function fetchCampaign() {
      try {
        const res = await fetch(`/api/campaigns/slug/${slug}`);
        if (!res.ok) return;
        const data = await res.json();
        setCampaign(data);
        
        // Se o usuário já tiver um ticket recente para esta campanha, calcula o tempo
        if (data.userLastTicketDate) {
          calculateTimeRemaining(data.userLastTicketDate);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaign();
  }, [slug]);

  // 2. Lógica do Contador (Trava de 3h)
  function calculateTimeRemaining(lastDate: string) {
    const lastClaim = new Date(lastDate).getTime();
    const interval = 3 * 60 * 60 * 1000; // 3 Horas
    
    const update = () => {
      const now = new Date().getTime();
      const diff = (lastClaim + interval) - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }

  // 3. Ação Principal
  const handleAction = async () => {
    if (!isAuthenticated) {
      setIsModalOpen(true);
      return;
    }

    if (timeLeft) return; // Botão desativado se houver trava

    setIsClaiming(true);
    try {
      const res = await fetch('/api/campaigns/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: campaign.id })
      });

      if (res.ok) {
        setShowSuccessModal(true);
        calculateTimeRemaining(new Date().toISOString()); // Inicia trava de 3h
      } else {
        const err = await res.json();
        alert(err.error || "Erro ao resgatar");
      }
    } catch (e) {
      alert("Falha na conexão");
    } finally {
      setIsClaiming(false);
    }
  };

  if (loading || authLoading) return <div className="min-h-screen bg-zinc-100 animate-pulse" />;
  if (!campaign) return notFound();

  return (
    <div className="min-h-screen bg-zinc-100 font-sans pb-10">
      
      {/* MODAL DE LOGIN/CADASTRO */}
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} campaignSlug={slug} />

      {/* MODAL DE SUCESSO (ESTILO LINKDOBEM) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 text-center animate-in zoom-in-95 relative shadow-2xl">
            <button onClick={() => setShowSuccessModal(false)} className="absolute top-6 right-6 text-zinc-300">
              <IoClose size={28} />
            </button>
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
               <FaCheckCircle size={45} />
            </div>
            <h4 className="text-2xl font-black text-gray-800 leading-tight">
              Ingresso resgatado<br/>com sucesso!
            </h4>
            <Link href="/cadastre-se" className="mt-8 block w-full bg-[#1D8347] text-white py-5 rounded-2xl font-black uppercase text-sm shadow-lg active:scale-95 transition-all">
              Participar de mais Doações
            </Link>
          </div>
        </div>
      )}

      <main className="max-w-125 mx-auto bg-white min-h-screen shadow-2xl flex flex-col border-x border-zinc-200">
        
        {/* IMAGEM DA CAMPANHA */}
        <div className="relative w-full aspect-16/10 bg-zinc-200">
          <Image src={campaign.imageUrl} alt={campaign.name} fill className="object-cover" priority unoptimized />
        </div>

        <div className="p-8 text-center space-y-6">
          <h2 className="text-2xl font-black text-[#053B80] uppercase tracking-tighter leading-tight">
            {campaign.name}
          </h2>

          <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 px-8 py-4 rounded-2xl text-[#053B80] mx-auto w-fit font-black text-xl shadow-inner">
            <FaUsers className="opacity-40" />
            {(campaign._count?.tickets || 0).toLocaleString('pt-BR')} pessoas
          </div>

          {/* ALERTA DE TRAVA (CASO EXISTA) */}
          {isAuthenticated && timeLeft && (
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl animate-in fade-in zoom-in">
              <p className="text-amber-800 font-black text-sm uppercase tracking-tighter">Ingresso resgatado com sucesso!</p>
              <p className="text-zinc-500 text-xs font-bold mt-1">
                Você já resgatou este ingresso recentemente. <br/>
                <span className="text-red-500 flex items-center justify-center gap-1 mt-1">
                  <FaClock /> Volte em {timeLeft}
                </span>
              </p>
            </div>
          )}

          {/* BOTÃO DE AÇÃO */}
          <button 
            onClick={handleAction}
            disabled={isClaiming || (!!timeLeft && isAuthenticated)}
            className={`w-full py-6 rounded-2xl text-xl font-black shadow-xl uppercase transition-all active:scale-95
              ${timeLeft && isAuthenticated 
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' 
                : 'bg-emerald-500 hover:bg-emerald-600 text-white animate-pulse'}`}
          >
            {isClaiming ? "PROCESSANDO..." : (isAuthenticated ? "PEGAR MEU INGRESSO GRÁTIS!" : "PARTICIPAR")}
          </button>
        </div>

        {/* FOOTER */}
        <footer className="mt-auto p-10 text-center border-t border-zinc-50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            © Chave do Bem 2024 - 2026 | Todos os direitos reservados
          </p>
        </footer>
      </main>
    </div>
  );
}