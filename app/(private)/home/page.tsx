"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useAuthStore } from "@/src/stores/auth.store";
import { FaArrowRotateRight, FaCopy, FaCheck, FaChartLine } from "react-icons/fa6";
import { monthPipe } from "@/src/utils/datepipe";
import { getDashboardStatsAction } from "@/src/actions/stats";
import dynamic from "next/dynamic";

const AppDatePicker = dynamic(() => import("@/src/components/AppDatePicker"), {
  ssr: false,
  loading: () => <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />,
});

export default function PrivateHome() {
  const user = useAuthStore((state) => state.user);
  const [dateSelected, setDateSelected] = useState<Date>(new Date());
  const [monthSelected, setMonthSelected] = useState<Date>(new Date());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const formattedMonth = useMemo(() => monthPipe(monthSelected.getMonth()), [monthSelected]);

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatBRL = (val: number) => val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const formatUSD = (val: number) => val.toLocaleString("pt-BR", { style: "currency", currency: "USD" });

  return (
    <div className="flex flex-col items-end gap-2 overflow-x-hidden px-3 pb-4 sm:px-4 lg:w-full lg:px-0">
      <div className="flex w-full max-w-full flex-col gap-2 lg:w-[80%] lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-col gap-1 rounded-2xl bg-gray-100 p-4 font-semibold text-[#026D9B]">
          <span className="text-lg">Ola, {user?.profile?.name || "Usuario"}</span>
          <span className="text-xs font-normal text-zinc-400">
            {user?.email} - {user?.role}
          </span>
        </div>
        <div className="flex h-20 w-full items-center justify-between rounded-2xl bg-gray-100 p-4 lg:w-[30%]">
          <div className="flex flex-col">
            <span className="text-nowrap text-[10px] font-black uppercase tracking-widest text-gray-400">Atualizado em</span>
            <span className="text-sm font-bold text-zinc-600">{new Date().toLocaleTimeString()}</span>
          </div>
          <button onClick={fetchData} className="btn btn-circle border-none bg-white text-[#026D9B] shadow-sm transition-all duration-500 hover:rotate-180">
            <FaArrowRotateRight />
          </button>
        </div>
      </div>

      <div className="w-full max-w-full rounded-2xl bg-gray-100 p-4 lg:h-[78vh] lg:w-[80%]">
        <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black uppercase italic tracking-tighter text-[#026D9B]">Dashboard</span>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-1 text-white shadow-lg shadow-emerald-500/20">
              <FaChartLine size={12} />
              <span className="text-xs font-black uppercase">AdSense estimado</span>
            </div>
          </div>
        </div>

        <div className={`flex flex-col gap-4 transition-opacity duration-300 ${loading ? "pointer-events-none opacity-50" : "opacity-100"}`}>
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex h-35 w-full flex-col justify-between rounded-2xl bg-linear-to-br from-[#026D9B] to-[#1F8C6D] p-5 text-white lg:w-[35%]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Receita do dia</span>
                <AppDatePicker id="day" mode="day" value={dateSelected} onChange={setDateSelected} />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black italic tracking-tighter">{formatBRL(stats?.dailyRevenueBRL || 0)}</span>
                <span className="text-sm font-bold italic opacity-70">
                  {formatUSD(stats?.dailyReport?.estimatedEarningsUsd || 0)} x dolar {Number(stats?.dailyReport?.exchangeRate || 0).toLocaleString("pt-BR", {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4,
                  })}
                </span>
              </div>
            </div>

            <div className="flex h-auto w-full flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 lg:h-35 lg:w-[65%]">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Receita de {formattedMonth}</span>
                <AppDatePicker id="month" mode="month" value={monthSelected} onChange={setMonthSelected} />
              </div>
              <div className="flex gap-10">
                <div className="flex flex-col">
                  <span className="text-3xl font-black italic tracking-tighter text-[#026D9B]">{formatBRL(stats?.monthlyTotalBRL || 0)}</span>
                  <span className="text-sm font-bold italic text-zinc-400">
                    Calculada por visitas validas e cotacao diaria do dolar
                  </span>
                </div>
                <div className="hidden flex-col border-l border-zinc-100 pl-8 md:flex">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">AdSense do dia</span>
                  <span className="text-lg font-black text-zinc-700">{formatBRL(stats?.dailyReport?.estimatedEarnings || 0)}</span>
                  <span className="text-xs font-bold text-zinc-400">
                    {(stats?.dailyReport?.pageViews || 0).toLocaleString("pt-BR")} page views
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 lg:h-[48vh]">
            <span className="text-lg font-black uppercase italic tracking-tighter text-zinc-700">Performance por Rede</span>
            <div className="custom-scrollbar overflow-auto">
              <table className="table w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <th className="pb-2 pl-4">Rede</th>
                    <th className="pb-2">Visitas</th>
                    <th className="pb-2">Tickets</th>
                    <th className="pb-2">Faturamento</th>
                    <th className="pb-2 pr-4 text-right">Copiar</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.platforms?.map((p: any, index: number) => (
                    <tr key={index} className="group bg-zinc-50 transition-all hover:bg-zinc-100">
                      <td className="rounded-l-2xl py-4 pl-4 font-black text-[#026D9B]">{p.name}</td>
                      <td className="font-bold text-zinc-500">{p.visits}</td>
                      <td className="font-bold text-zinc-500">{p.tickets}</td>
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="font-black text-zinc-800">{formatBRL(p.revenueBRL)}</span>
                          <span className="text-[10px] font-bold uppercase italic text-zinc-400">Estimado pelo AdSense</span>
                        </div>
                      </td>
                      <td className="rounded-r-2xl py-4 pr-4 text-right">
                        <button
                          onClick={() => {
                            const fullLink = `https://chavedobem.com/participe?ref=${p.code}`;
                            navigator.clipboard.writeText(fullLink);
                            setCopiedIndex(index);
                            setTimeout(() => setCopiedIndex(null), 2000);
                          }}
                          className={`btn btn-circle btn-sm border-none shadow-sm transition-all ${
                            copiedIndex === index ? "bg-emerald-500 text-white" : "bg-white text-[#026D9B] hover:bg-zinc-200"
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
