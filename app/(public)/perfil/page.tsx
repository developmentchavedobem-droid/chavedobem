'use client'

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaTicketAlt, FaEdit, FaTrash, FaExternalLinkAlt, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setUser(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="min-h-screen bg-zinc-50 animate-pulse" />;
  if (!user) return <div className="p-10 text-center">Acesso negado. Faça login.</div>;

  return (
    <main className="max-w-[500px] mx-auto bg-white min-h-screen shadow-2xl flex flex-col font-sans">
      {/* HEADER PERFIL */}
      <div className="p-8 bg-zinc-50 border-b border-zinc-100">
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image src="/donzinho.png" fill alt="Avatar" className="object-cover" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-[#053B80]">Olá, {user.name?.split(' ')[0]}!</h2>
            <p className="text-sm text-gray-500 font-medium">{user.email}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-zinc-200 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-zinc-100 transition-all">
            <FaEdit /> Meus dados
          </button>
          <button className="flex items-center justify-center gap-2 px-4 border border-red-100 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-all">
            <FaTrash />
          </button>
        </div>
      </div>

      {/* AÇÕES RÁPIDAS */}
      <div className="p-6 space-y-3">
        <Link href="/cadastre-se" className="w-full flex items-center justify-center bg-[#1D8347] text-white py-4 rounded-2xl font-black uppercase text-sm shadow-lg shadow-emerald-100 active:scale-95 transition-all">
          Participar de mais Doações
        </Link>
      </div>

      {/* MEUS INGRESSOS */}
      <div className="px-6 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="flex items-center gap-2 text-lg font-black text-[#053B80] uppercase tracking-tighter">
            <FaTicketAlt size={24} /> Meus Ingressos
          </h3>
          <FaInfoCircle className="text-zinc-300" />
        </div>

        <div className="space-y-4">
          {/* MOCK DE INGRESSOS - Depois mapear de user.tickets */}
          <TicketItem title="SALÁRIO DE 3MIL POR MÊS DURANTE 1 ANO" count={3} />
          <TicketItem title="ACHADINHOS DA SHOPEE 2MIL EM DINHEIRO" count={1} />
          <TicketItem title="10 MIL NO QUIZ DO IT 4 BRAZIL" count={1} status="Encerrada" />
        </div>
      </div>

      <div className="h-20" />
    </main>
  );
}

function TicketItem({ title, count, status }: { title: string, count: number, status?: string }) {
  return (
    <div className="relative p-5 bg-white border border-zinc-100 rounded-2xl shadow-sm flex items-center justify-between group hover:border-[#053B80]/20 transition-all">
      {status && (
        <span className="absolute -top-2 left-4 bg-zinc-500 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
          {status}
        </span>
      )}
      <div className="flex items-center gap-3">
        <FaExternalLinkAlt className="text-zinc-300 group-hover:text-[#053B80]" size={14} />
        <span className="text-[13px] font-black text-gray-700 leading-tight uppercase max-w-[200px]">{title}</span>
      </div>
      <div className="w-10 h-10 bg-[#333] text-white flex items-center justify-center rounded-full font-black text-lg shadow-md">
        {count}
      </div>
    </div>
  );
}