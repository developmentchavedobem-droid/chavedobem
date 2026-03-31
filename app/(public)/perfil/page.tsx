'use client'

import React, { useEffect, useState, useMemo } from "react";
import { FaTicketAlt, FaEdit, FaSignOutAlt, FaUserCircle, FaSave, FaTimes, FaIdCard, FaPhone, FaBirthdayCake } from "react-icons/fa";
import { useAuthStore } from "@/src/stores/auth.store";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PerfilPage() {
  const { user, refreshUser, logout, loading: authLoading } = useAuthStore();
  const router = useRouter();
  
  const [userData, setUserData] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Carregar dados estendidos (com tickets)
  useEffect(() => {
    const loadFullData = async () => {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (!data.error) setUserData(data);
    };
    loadFullData();
  }, [refreshUser]);

  // Agrupar tickets por campanha para mostrar o contador correto
  const groupedTickets = useMemo(() => {
    if (!userData?.profile?.tickets) return [];
    const groups: any = {};
    userData.profile.tickets.forEach((t: any) => {
      const cId = t.campaignId;
      if (!groups[cId]) {
        groups[cId] = { 
          title: t.campaign.name, 
          count: 0, 
          status: t.campaign.status === 'FINISHED' ? 'Encerrada' : null 
        };
      }
      groups[cId].count++;
    });
    return Object.values(groups);
  }, [userData]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (authLoading || !userData) return <div className="min-h-screen bg-zinc-50 animate-pulse" />;

  return (
    <main className="max-w-[600px] mx-auto bg-white min-h-screen shadow-2xl flex flex-col font-sans border-x border-zinc-100 py-15">
      
      {/* HEADER PERFIL */}
      <div className="p-8 bg-linear-to-b from-zinc-50 to-white border-b border-zinc-100">
        <div className="flex items-center gap-5">
          {/* Avatar com Ícone */}
          <div className="w-20 h-20 rounded-3xl bg-[#053B80] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-100 uppercase">
            {userData.profile?.name?.substring(0, 2) || "U"}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-[#053B80] tracking-tighter leading-tight">
              {userData.profile?.name || "Usuário"}
            </h2>
            <p className="text-sm text-zinc-400 font-bold">{userData.email}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-8">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-zinc-100 py-3 rounded-2xl text-xs font-black text-[#053B80] uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95"
          >
            <FaEdit /> Editar Perfil
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-6 bg-red-50 py-3 rounded-2xl text-xs font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>

      {/* AÇÕES RÁPIDAS */}
      <div className="p-6">
        <Link href="/cadastre-se">
          <button className="w-full flex items-center justify-center bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase text-sm shadow-xl shadow-emerald-100 active:scale-95 transition-all hover:bg-emerald-600">
            Retirar mais ingressos
          </button>
        </Link>
      </div>

      {/* MEUS INGRESSOS */}
      <div className="px-6 flex-1">
        <div className="flex items-center justify-between mb-6 border-b border-zinc-50 pb-4">
          <h3 className="flex items-center gap-3 text-lg font-black text-[#053B80] uppercase italic tracking-tighter">
            <FaTicketAlt className="text-emerald-500" /> Meus Ingressos
          </h3>
          <span className="bg-zinc-100 text-zinc-500 text-[10px] font-black px-3 py-1 rounded-full uppercase">
            Total: {userData.profile?.tickets?.length || 0}
          </span>
        </div>

        <div className="space-y-4">
          {groupedTickets.length > 0 ? (
            groupedTickets.map((ticket: any, i: number) => (
              <TicketItem key={i} title={ticket.title} count={ticket.count} status={ticket.status} />
            ))
          ) : (
            <div className="text-center py-10 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
              <p className="text-zinc-400 text-sm font-bold italic">Você ainda não possui ingressos.</p>
            </div>
          )}
        </div>
      </div>

      <div className="h-20" />

      {/* MODAL DE EDIÇÃO */}
      {isEditModalOpen && (
        <EditProfileModal 
          user={userData} 
          onClose={() => setIsEditModalOpen(false)} 
          onSuccess={() => {
            setIsEditModalOpen(false);
            refreshUser();
          }}
        />
      )}
    </main>
  );
}

// --- SUB-COMPONENTE: ITEM DE INGRESSO ---
function TicketItem({ title, count, status }: { title: string, count: number, status?: string }) {
  return (
    <div className="relative p-5 bg-white border border-zinc-100 rounded-3xl shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
      {status && (
        <span className="absolute -top-2 left-6 bg-zinc-800 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
          {status}
        </span>
      )}
      <div className="flex flex-col gap-1 pr-4">
        <span className="text-xs font-black text-emerald-500 uppercase tracking-widest italic">Campanha</span>
        <span className="text-[14px] font-black text-[#053B80] leading-tight uppercase tracking-tighter">{title}</span>
      </div>
      <div className="min-w-12 h-12 bg-zinc-900 text-white flex flex-col items-center justify-center rounded-2xl shadow-lg border-b-4 border-black">
        <span className="text-[8px] font-black opacity-50 leading-none">QTD</span>
        <span className="font-black text-xl leading-none">{count}</span>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTE: MODAL DE EDIÇÃO ---
function EditProfileModal({ user, onClose, onSuccess }: { user: any, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.profile?.name || "",
    phone_number: user.profile?.phone_number || "",
    register_number: user.profile?.register_number || "",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Aqui você deve criar uma API /api/auth/update-profile
    const res = await fetch('/api/auth/update-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      onSuccess();
    } else {
      alert("Erro ao atualizar dados.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-[#053B80]/40 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-8">
          <h4 className="text-xl font-black text-[#053B80] uppercase italic">Meus Dados</h4>
          <button onClick={onClose} className="text-zinc-300 hover:text-red-500"><FaTimes size={24} /></button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Nome Completo</label>
            <div className="relative">
              <FaUserCircle className="absolute left-4 top-4 text-zinc-300" />
              <input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 font-bold text-zinc-700 focus:ring-2 ring-blue-500 outline-hidden" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">CPF (Apenas números)</label>
            <div className="relative">
              <FaIdCard className="absolute left-4 top-4 text-zinc-300" />
              <input 
                value={formData.register_number}
                onChange={e => setFormData({...formData, register_number: e.target.value})}
                className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 font-bold text-zinc-700 focus:ring-2 ring-blue-500 outline-hidden" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Celular / WhatsApp</label>
            <div className="relative">
              <FaPhone className="absolute left-4 top-4 text-zinc-300" />
              <input 
                value={formData.phone_number}
                onChange={e => setFormData({...formData, phone_number: e.target.value})}
                className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 font-bold text-zinc-700 focus:ring-2 ring-blue-500 outline-hidden" 
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#053B80] text-white py-5 rounded-2xl font-black uppercase text-sm shadow-xl mt-6 flex items-center justify-center gap-2 hover:bg-[#032856] transition-all"
          >
            {loading ? "Salvando..." : <><FaSave /> Salvar Alterações</>}
          </button>
        </form>
      </div>
    </div>
  );
}