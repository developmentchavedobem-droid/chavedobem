'use client'

import { useState, useMemo, useEffect, useCallback } from "react";
import { useAuthStore } from "@/src/stores/auth.store";
import { FaArrowRotateRight, FaCopy, FaCheck, FaDollarSign } from "react-icons/fa6";
import { monthPipe } from "@/src/utils/datepipe";
import { getDashboardStatsAction } from "@/src/actions/stats";
import dynamic from "next/dynamic";

const AppDatePicker = dynamic(() => import("@/src/components/AppDatePicker"), {
  ssr: false,
  loading: () => <div className="h-10 w-24 animate-pulse bg-gray-200 rounded-lg" />
});

export default function PrivateHome() {
  const user = useAuthStore((state) => state.user);
  const [dateSelected, setDateSelected] = useState<Date>(new Date());
  const [monthSelected, setMonthSelected] = useState<Date>(new Date());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const formattedMonth = useMemo(() => monthPipe(monthSelected.getMonth()), [monthSelected]);

  // CORREÇÃO: Memoizamos a função para não recriar o efeito desnecessariamente
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDashboardStatsAction(dateSelected, monthSelected);
      if (data && !data.error) {
        setStats(data);
      }
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, [dateSelected, monthSelected]);

  // Chamada do efeito limpa
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatBRL = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatUSD = (val: number) => {
    const rate = stats?.dollarRate;
    return (val / rate).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  return (
    <div className="flex lg:w-full flex-col items-end gap-2 overflow-x-hidden px-3 pb-4 sm:px-4 lg:px-0">
      {/* Header Profile */}
      <div className="flex w-full max-w-full flex-col gap-2 lg:w-[80%] lg:flex-row lg:items-center">
        <div className="flex-1 flex flex-col gap-1 rounded-2xl bg-gray-100 p-4 text-[#026D9B] font-semibold">
          <span className="text-lg">Olá, {user?.profile?.name || "Usuário"}</span>
          <span className="text-xs font-normal text-zinc-400">{user?.email} • {user?.role}</span>
        </div>
        <div className="flex w-full items-center justify-between rounded-2xl bg-gray-100 p-4 lg:w-[30%] h-20">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-nowrap">Atualizado em</span>
            <span className="text-sm font-bold text-zinc-600">{new Date().toLocaleTimeString()}</span>
          </div>
          <button onClick={fetchData} className="btn btn-circle bg-white border-none shadow-sm text-[#026D9B] hover:rotate-180 transition-all duration-500">
            <FaArrowRotateRight />
          </button>
        </div>
      </div>

      <div className="w-full max-w-full rounded-2xl bg-gray-100 p-4 lg:h-[78vh] lg:w-[80%]">
        <div className="mb-4 flex flex-col lg:flex-row justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* CORREÇÃO TAILWIND: Removido 'italic' duplicado */}
            <span className="text-2xl font-black text-[#026D9B] uppercase italic tracking-tighter">
              Dashboard
            </span>
            <div className="flex items-center gap-2 bg-emerald-500 text-white px-3 py-1 rounded-lg shadow-lg shadow-emerald-500/20">
              <FaDollarSign size={12} />
              <span className="text-xs font-black uppercase">Câmbio: R$ {stats?.dollarRate?.toFixed(2) || "5.17"}</span>
            </div>
          </div>
        </div>

        <div className={`flex flex-col gap-4 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Receita Diária */}
            <div className="flex h-35 w-full flex-col justify-between rounded-2xl bg-linear-to-br from-[#026D9B] to-[#1F8C6D] p-5 text-white lg:w-[35%]">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Receita Diária</span>
                <AppDatePicker id="day" mode="day" value={dateSelected} onChange={setDateSelected} />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black italic tracking-tighter">
                  {formatBRL(stats?.dailyRevenueBRL || 0)}
                </span>
                <span className="text-sm font-bold opacity-70 italic">
                  {formatUSD(stats?.dailyRevenueBRL || 0)}
                </span>
              </div>
            </div>

            {/* Receita Mensal */}
            <div className="flex h-auto w-full flex-col justify-between rounded-2xl bg-white p-5 border border-zinc-200 lg:h-35 lg:w-[65%]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Receita de {formattedMonth}</span>
                <AppDatePicker id="month" mode="month" value={monthSelected} onChange={setMonthSelected} />
              </div>
              <div className="flex gap-10">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-[#026D9B] italic tracking-tighter">
                    {formatBRL(stats?.monthlyTotalBRL || 0)}
                  </span>
                  <span className="text-sm font-bold text-zinc-400 italic">
                    {formatUSD(stats?.monthlyTotalBRL || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabela de Links */}
          <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 border border-zinc-200 lg:h-[48vh]">
            <span className="text-lg font-black text-zinc-700 uppercase italic tracking-tighter">Performance por Rede</span>
            <div className="overflow-auto custom-scrollbar">
              <table className="table w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-left">
                    <th className="pb-2 pl-4">Rede</th>
                    <th className="pb-2">Visitas</th>
                    <th className="pb-2">Tickets</th>
                    <th className="pb-2">Faturamento (BRL / USD)</th>
                    <th className="pb-2 text-right pr-4">Copiar</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.platforms?.map((p: any, index: number) => (
                    <tr key={index} className="bg-zinc-50 hover:bg-zinc-100 transition-all group">
                      <td className="py-4 pl-4 rounded-l-2xl font-black text-[#026D9B]">{p.name}</td>
                      <td className="font-bold text-zinc-500">{p.visits}</td>
                      <td className="font-bold text-zinc-500">{p.tickets}</td>
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="font-black text-zinc-800">{formatBRL(p.revenueBRL)}</span>
                          <span className="text-[10px] font-bold text-zinc-400 uppercase italic">
                            {formatUSD(p.revenueBRL)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 pr-4 rounded-r-2xl text-right">
                        <button 
                          onClick={() => {
                             const fullLink = `https://chavedobem.com/participe?ref=${p.code}`;
                             navigator.clipboard.writeText(fullLink);
                             setCopiedIndex(index);
                             setTimeout(() => setCopiedIndex(null), 2000);
                          }}
                          className={`btn btn-sm btn-circle border-none shadow-sm transition-all ${
                            copiedIndex === index ? 'bg-emerald-500 text-white' : 'bg-white text-[#026D9B] hover:bg-zinc-200'
                          }`}
                        >
                          {copiedIndex === index ? <FaCheck size={12} /> : <FaCopy size={12} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}