import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import prisma from "@/src/lib/prisma";
import { FaCircleCheck, FaCircleExclamation, FaClockRotateLeft } from "react-icons/fa6";

export const dynamic = "force-dynamic";

function formatDate(value: Date | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(value);
}

function statusClass(status: string) {
  if (status === "SUCCESS") return "bg-emerald-100 text-emerald-700";
  if (status === "FAILED") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

export default async function CronLogsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = token ? (jwt.decode(token) as any) : null;

  if (!decoded || decoded.role !== "ADMIN") {
    redirect("/home");
  }

  const logs = await prisma.cronSyncLog.findMany({
    orderBy: { startedAt: "desc" },
    take: 50,
  });

  const latestSuccess = logs.find((log) => log.status === "SUCCESS");
  const latestFailure = logs.find((log) => log.status === "FAILED");
  const totalSyncedDays = logs.reduce((total, log) => total + log.syncedDays, 0);

  return (
    <div className="flex w-full flex-col items-end gap-4 overflow-x-hidden px-3 pb-4 sm:px-4 lg:px-0">
      <div className="flex w-full max-w-full flex-col gap-4 rounded-2xl bg-gray-100 p-4 text-zinc-800 lg:w-[80%]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#026D9B]">Logs do Cron</h1>
            <p className="text-sm text-zinc-600">
              Acompanhe as sincronizacoes automaticas do Google AdSense e os recalculos de monetizacao.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#026D9B]">
            {logs.length} execucoes recentes
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Ultimo sucesso</span>
              <FaCircleCheck className="text-emerald-500" />
            </div>
            <p className="text-lg font-black text-zinc-800">{formatDate(latestSuccess?.finishedAt || null)}</p>
            <p className="text-xs font-semibold text-zinc-500">{latestSuccess?.message || "Nenhum sucesso registrado."}</p>
          </div>

          <div className="rounded-2xl bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Ultima falha</span>
              <FaCircleExclamation className="text-red-500" />
            </div>
            <p className="text-lg font-black text-zinc-800">{formatDate(latestFailure?.finishedAt || null)}</p>
            <p className="line-clamp-2 text-xs font-semibold text-zinc-500">{latestFailure?.error || "Nenhuma falha recente."}</p>
          </div>

          <div className="rounded-2xl bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Dias processados</span>
              <FaClockRotateLeft className="text-[#026D9B]" />
            </div>
            <p className="text-3xl font-black text-[#026D9B]">{totalSyncedDays.toLocaleString("pt-BR")}</p>
            <p className="text-xs font-semibold text-zinc-500">Soma das execucoes listadas</p>
          </div>
        </div>

        <div className="overflow-auto rounded-2xl bg-white p-4">
          <table className="table w-full min-w-[920px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <th>Status</th>
                <th>Inicio</th>
                <th>Fim</th>
                <th>Origem</th>
                <th>Dias</th>
                <th>Mensagem</th>
                <th>Erro</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="bg-zinc-50">
                  <td className="rounded-l-2xl py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="font-semibold text-zinc-600">{formatDate(log.startedAt)}</td>
                  <td className="font-semibold text-zinc-600">{formatDate(log.finishedAt)}</td>
                  <td className="font-bold text-zinc-500">{log.trigger}</td>
                  <td className="font-bold text-zinc-500">
                    {log.syncedDays}/{log.daysRequested}
                  </td>
                  <td className="max-w-72 text-sm font-semibold text-zinc-600">{log.message || "-"}</td>
                  <td className="rounded-r-2xl max-w-96 text-xs font-semibold text-red-600">{log.error || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && (
            <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-sm font-semibold text-zinc-500">
              Nenhuma execucao de cron registrada ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
