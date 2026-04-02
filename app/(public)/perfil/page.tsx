'use client'

import React, { useEffect, useState, useMemo } from "react";
import {
  FaTicketAlt, FaEdit, FaSignOutAlt, FaUserCircle,
  FaSave, FaTimes, FaIdCard, FaPhone, FaPlus, FaChevronRight
} from "react-icons/fa";
import { useAuthStore } from "@/src/stores/auth.store";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PerfilPage() {
  const { user, refreshUser, logout, loading: authLoading } = useAuthStore();
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const loadFullData = async () => {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (!data.error) setUserData(data);
    };
    loadFullData();
  }, [refreshUser]);

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

  if (authLoading || !userData) {
    return (
      <div className="min-h-screen bg-[#f0f4fa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#053B80]/20 border-t-[#053B80] animate-spin" />
          <span className="text-xs font-bold text-[#053B80]/40 uppercase tracking-widest">Carregando...</span>
        </div>
      </div>
    );
  }

  const initials = userData.profile?.name?.substring(0, 2)?.toUpperCase() || "U";
  const totalTickets = userData.profile?.tickets?.length || 0;

  return (
    <main className="min-h-screen bg-[#f0f4fa] font-sans">
      {/* Faixa de fundo azul no topo */}
      <div className="absolute top-0 left-0 right-0 h-52 bg-gradient-to-br from-[#053B80] via-[#064499] to-[#0a56c4] z-0 overflow-hidden">
        {/* Detalhes decorativos */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute top-14 -left-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#f0f4fa] to-transparent" />
      </div>

      <div className="relative z-10 max-w-[430px] mx-auto px-4 pt-12 pb-28">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-0.5">Bem-vindo de volta</p>
            <h1 className="text-white text-2xl font-black tracking-tight leading-none">
              {userData.profile?.name?.split(' ')[0] || "Usuário"}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all active:scale-90 border border-white/10"
          >
            <FaSignOutAlt size={14} />
          </button>
        </div>

        {/* CARD PERFIL */}
        <div className="bg-white rounded-3xl shadow-xl shadow-[#053B80]/10 p-5 mb-4 border border-white">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#053B80] to-[#0a56c4] flex items-center justify-center text-white text-xl font-black shadow-lg shadow-[#053B80]/30">
                {initials}
              </div>
              {/* Badge de tickets */}
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-md border-2 border-white">
                <span className="text-[9px] font-black text-white">{totalTickets}</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-[#053B80] font-black text-base leading-tight truncate">
                {userData.profile?.name || "Usuário"}
              </h2>
              <p className="text-zinc-400 text-xs font-medium truncate mt-0.5">{userData.email}</p>
              {userData.profile?.phone_number && (
                <p className="text-zinc-400 text-xs mt-0.5">{userData.profile.phone_number}</p>
              )}
            </div>

            {/* Botão editar */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex-shrink-0 w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-[#053B80] hover:bg-zinc-100 transition-all active:scale-90 border border-zinc-100"
            >
              <FaEdit size={14} />
            </button>
          </div>
        </div>

        {/* STATS RÁPIDAS */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-4 border border-white shadow-md shadow-[#053B80]/5">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Ingressos</p>
            <p className="text-3xl font-black text-[#053B80]">{totalTickets}</p>
            <p className="text-[10px] text-zinc-400 font-medium mt-0.5">no total</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-white shadow-md shadow-[#053B80]/5">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Campanhas</p>
            <p className="text-3xl font-black text-[#053B80]">{groupedTickets.length}</p>
            <p className="text-[10px] text-zinc-400 font-medium mt-0.5">participando</p>
          </div>
        </div>

        {/* CTA - RETIRAR INGRESSOS */}
        <Link href="/cadastre-se">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all cursor-pointer border border-emerald-400">
            <div>
              <p className="text-white/80 text-[10px] font-black uppercase tracking-widest">Quer mais chances?</p>
              <p className="text-white text-base font-black mt-0.5">Retirar Mais Ingressos</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <FaPlus className="text-white" size={16} />
            </div>
          </div>
        </Link>

        {/* MEUS INGRESSOS */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="flex items-center gap-2 text-sm font-black text-[#053B80] uppercase tracking-widest">
              <FaTicketAlt className="text-emerald-500" size={13} />
              Meus Ingressos
            </h3>
            {totalTickets > 0 && (
              <span className="text-[10px] font-black text-zinc-400 bg-zinc-100 px-2.5 py-1 rounded-full uppercase">
                {totalTickets} total
              </span>
            )}
          </div>

          <div className="space-y-3">
            {groupedTickets.length > 0 ? (
              groupedTickets.map((ticket: any, i: number) => (
                <TicketItem key={i} title={ticket.title} count={ticket.count} status={ticket.status} />
              ))
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-zinc-200 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-3 border border-zinc-100">
                  <FaTicketAlt className="text-zinc-300" size={22} />
                </div>
                <p className="text-zinc-500 text-sm font-bold">Nenhum ingresso ainda</p>
                <p className="text-zinc-400 text-xs mt-1">Retire seus ingressos e participe dos sorteios!</p>
              </div>
            )}
          </div>
        </div>
      </div>

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

// --- TICKET ITEM ---
function TicketItem({ title, count, status }: { title: string; count: number; status?: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-zinc-100 shadow-sm flex items-center gap-3 hover:border-emerald-200 hover:shadow-md transition-all active:scale-[0.99]">
      {/* Ícone / badge de quantidade */}
      <div className="w-12 h-12 rounded-xl bg-[#053B80] flex flex-col items-center justify-center flex-shrink-0 shadow-md shadow-[#053B80]/20">
        <span className="text-[8px] font-black text-white/50 leading-none uppercase">qtd</span>
        <span className="text-lg font-black text-white leading-none">{count}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {status && (
          <span className="inline-block text-[8px] font-black uppercase tracking-widest bg-zinc-800 text-white px-2 py-0.5 rounded-full mb-1">
            {status}
          </span>
        )}
        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-0.5">Campanha</p>
        <p className="text-sm font-black text-[#053B80] leading-tight truncate uppercase">{title}</p>
      </div>

      <FaChevronRight className="text-zinc-300 flex-shrink-0" size={12} />
    </div>
  );
}

// --- MODAL DE EDIÇÃO ---
function EditProfileModal({ user, onClose, onSuccess }: { user: any; onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.profile?.name || "",
    phone_number: user.profile?.phone_number || "",
    register_number: user.profile?.register_number || "",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
    <div
      className="fixed inset-0 z-[500] flex items-end justify-center bg-[#053B80]/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-[430px] rounded-t-[2rem] p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Handle */}
        <div className="w-10 h-1 bg-zinc-200 rounded-full mx-auto mb-6" />

        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Conta</p>
            <h4 className="text-xl font-black text-[#053B80]">Editar Perfil</h4>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90">
            <FaTimes size={14} />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <InputField
            label="Nome Completo"
            icon={<FaUserCircle />}
            value={formData.name}
            onChange={(v) => setFormData({ ...formData, name: v })}
            placeholder="Seu nome completo"
          />
          <InputField
            label="CPF"
            icon={<FaIdCard />}
            value={formData.register_number}
            onChange={(v) => setFormData({ ...formData, register_number: v })}
            placeholder="Apenas números"
          />
          <InputField
            label="Celular / WhatsApp"
            icon={<FaPhone />}
            value={formData.phone_number}
            onChange={(v) => setFormData({ ...formData, phone_number: v })}
            placeholder="(00) 00000-0000"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#053B80] text-white py-4 rounded-2xl font-black uppercase text-sm shadow-xl shadow-[#053B80]/20 mt-2 flex items-center justify-center gap-2 hover:bg-[#032856] transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Salvando...
              </span>
            ) : (
              <><FaSave size={14} /> Salvar Alterações</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({
  label, icon, value, onChange, placeholder
}: {
  label: string; icon: React.ReactNode; value: string;
  onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">{label}</label>
      <div className="relative flex items-center">
        <span className="absolute left-4 text-zinc-300 text-sm pointer-events-none">{icon}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3.5 pl-11 pr-4 font-semibold text-sm text-zinc-700 placeholder:text-zinc-300 focus:ring-2 focus:ring-[#053B80]/20 focus:border-[#053B80]/30 outline-none transition-all"
        />
      </div>
    </div>
  );
}