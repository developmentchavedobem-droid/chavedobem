"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/src/stores/auth.store";
import {
  getFinanceDashboardAction,
  getFinanceUploadUrl,
  markWithdrawalAsPaidAction,
  requestPreviousMonthPaymentAction,
} from "@/src/actions/finance";
import { uploadToSignedS3Url } from "@/src/utils/s3-upload";
import {
  FaArrowRotateRight,
  FaCalendarDays,
  FaCheck,
  FaFileInvoiceDollar,
  FaMoneyBillTransfer,
  FaPaperclip,
} from "react-icons/fa6";

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

type Scope = "month" | "year";

function formatBRL(value: number) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: "Em aberto",
    PAID: "Pago",
    CANCELLED: "Cancelado",
  };

  return labels[status] || status;
}

function statusClass(status: string) {
  if (status === "PAID") return "bg-emerald-100 text-emerald-700";
  if (status === "CANCELLED") return "bg-zinc-200 text-zinc-700";
  return "bg-amber-100 text-amber-700";
}

export default function FaturamentoPage() {
  const user = useAuthStore((state) => state.user);
  const now = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [scope, setScope] = useState<Scope>("month");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [receiptFiles, setReceiptFiles] = useState<Record<number, File | null>>({});
  const [submitting, setSubmitting] = useState(false);

  const years = useMemo(() => {
    const currentYear = now.getFullYear();
    return Array.from({ length: 5 }, (_, index) => currentYear - index);
  }, [now]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setMessage("");

    const response = await getFinanceDashboardAction({ month, year, scope });
    setData(response);
    setLoading(false);

    if (response?.error) {
      setMessage(response.error);
    }
  }, [month, year, scope]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function uploadPdf(file: File, kind: "invoice" | "receipt") {
    const signed = await getFinanceUploadUrl(file.name, file.type, kind);
    if (!signed.success || !signed.uploadUrl || !signed.publicUrl) {
      throw new Error(signed.error || "Erro ao preparar upload.");
    }

    await uploadToSignedS3Url(signed.uploadUrl, file);

    return signed.publicUrl;
  }

  async function handleRequestPayment() {
    if (!invoiceFile) {
      setMessage("Anexe a nota fiscal em PDF.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const invoiceUrl = await uploadPdf(invoiceFile, "invoice");
      const response = await requestPreviousMonthPaymentAction(invoiceUrl);

      if (response?.error) {
        setMessage(response.error);
      } else {
        setInvoiceFile(null);
        setMessage("Solicitacao enviada. Ela ficara em aberto ate o pagamento.");
        await loadData();
      }
    } catch (error: any) {
      setMessage(error.message || "Erro ao solicitar pagamento.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMarkPaid(withdrawalId: number) {
    const receiptFile = receiptFiles[withdrawalId];

    if (!receiptFile) {
      setMessage("Anexe o comprovante em PDF.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const receiptUrl = await uploadPdf(receiptFile, "receipt");
      const response = await markWithdrawalAsPaidAction(withdrawalId, receiptUrl);

      if (response?.error) {
        setMessage(response.error);
      } else {
        setReceiptFiles((current) => ({ ...current, [withdrawalId]: null }));
        setMessage("Pagamento marcado como pago.");
        await loadData();
      }
    } catch (error: any) {
      setMessage(error.message || "Erro ao confirmar pagamento.");
    } finally {
      setSubmitting(false);
    }
  }

  function setReceiptFile(withdrawalId: number, event: ChangeEvent<HTMLInputElement>) {
    setReceiptFiles((current) => ({
      ...current,
      [withdrawalId]: event.target.files?.[0] || null,
    }));
  }

  const previousPeriod = data?.previousPeriod;
  const selectedPeriod = data?.selectedPeriod;
  const isAdmin = user?.role === "ADMIN";
  const isUser = user?.role === "USER";

  return (
    <div className="flex w-full flex-col items-end gap-4 overflow-x-hidden px-3 pb-4 sm:px-4 lg:px-0">
      <div className="flex w-full max-w-full flex-col gap-4 rounded-2xl bg-gray-100 p-4 text-zinc-800 lg:w-[80%]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-[#026D9B]">Faturamento</h1>
            <p className="text-sm text-gray-600">
              {isAdmin
                ? "Resumo geral, periodos e solicitacoes de pagamento dos divulgadores."
                : "Acompanhe seu faturamento e solicite pagamento do mes anterior."}
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            className="btn btn-circle border-none bg-white text-[#026D9B] shadow-sm"
            aria-label="Atualizar faturamento"
          >
            <FaArrowRotateRight />
          </button>
        </div>

        {message && (
          <div className="rounded-xl border border-[#026D9B]/10 bg-white px-4 py-3 text-sm font-semibold text-[#026D9B]">
            {message}
          </div>
        )}

        {isAdmin && (
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row sm:items-end">
            <label className="form-control w-full sm:w-44">
              <span className="label-text mb-1 font-bold text-zinc-600">Visualizar</span>
              <select
                className="select select-bordered bg-white"
                value={scope}
                onChange={(event) => setScope(event.target.value as Scope)}
              >
                <option value="month">Mes</option>
                <option value="year">Ano</option>
              </select>
            </label>

            {scope === "month" && (
              <label className="form-control w-full sm:w-52">
                <span className="label-text mb-1 font-bold text-zinc-600">Mes</span>
                <select
                  className="select select-bordered bg-white"
                  value={month}
                  onChange={(event) => setMonth(Number(event.target.value))}
                >
                  {MONTHS.map((label, index) => (
                    <option key={label} value={index + 1}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="form-control w-full sm:w-40">
              <span className="label-text mb-1 font-bold text-zinc-600">Ano</span>
              <select
                className="select select-bordered bg-white"
                value={year}
                onChange={(event) => setYear(Number(event.target.value))}
              >
                {years.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <div className={`grid grid-cols-1 gap-4 transition-opacity ${loading ? "opacity-50" : "opacity-100"} ${isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          <div className="flex min-h-34 flex-col justify-between rounded-2xl bg-linear-to-br from-[#026D9B] to-[#1F8C6D] p-5 text-white">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                {isAdmin ? "Faturamento do periodo" : "Faturamento selecionado"}
              </span>
              <FaCalendarDays />
            </div>
            <div>
              <p className="text-3xl font-black italic tracking-tighter">
                {formatBRL(isAdmin ? selectedPeriod?.grossRevenue : selectedPeriod?.revenue)}
              </p>
              <p className="text-xs font-bold uppercase opacity-75">
                {selectedPeriod?.scope === "year"
                  ? selectedPeriod?.year
                  : `${MONTHS[(selectedPeriod?.month || 1) - 1]} ${selectedPeriod?.year || ""}`}
              </p>
            </div>
          </div>

          <div className="flex min-h-34 flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Visitas</span>
              <FaArrowRotateRight className="text-[#026D9B]" />
            </div>
            <p className="text-3xl font-black text-[#026D9B]">{(selectedPeriod?.visits || 0).toLocaleString("pt-BR")}</p>
            <p className="text-xs font-semibold text-zinc-500">Acessos rastreados no periodo</p>
          </div>

          {isAdmin && (
            <div className="flex min-h-34 flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Plataforma</span>
                <FaMoneyBillTransfer className="text-[#026D9B]" />
              </div>
              <p className="text-3xl font-black text-[#026D9B]">{formatBRL(selectedPeriod?.platformRevenue || 0)}</p>
              <p className="text-xs font-semibold text-zinc-500">Parcela retida pelo sistema</p>
            </div>
          )}

          <div className="flex min-h-34 flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tickets</span>
              <FaMoneyBillTransfer className="text-[#026D9B]" />
            </div>
            <p className="text-3xl font-black text-[#026D9B]">{(selectedPeriod?.tickets || 0).toLocaleString("pt-BR")}</p>
            <p className="text-xs font-semibold text-zinc-500">Conversoes registradas no periodo</p>
          </div>
        </div>

        {isUser && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <section className="rounded-2xl border border-zinc-200 bg-white p-5 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-zinc-800">Pagamento do mes anterior</h2>
                  <p className="text-sm text-zinc-500">
                    {previousPeriod
                      ? `${MONTHS[previousPeriod.month - 1]} ${previousPeriod.year}`
                      : "Periodo anterior"}
                  </p>
                </div>
                <FaFileInvoiceDollar className="text-2xl text-[#026D9B]" />
              </div>

              <div className="mb-4 rounded-xl bg-zinc-50 p-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Valor disponivel para solicitacao</span>
                <p className="mt-1 text-3xl font-black text-[#026D9B]">{formatBRL(previousPeriod?.revenue || 0)}</p>
                <p className="text-xs font-semibold text-zinc-500">
                  {(previousPeriod?.visits || 0).toLocaleString("pt-BR")} visitas e {(previousPeriod?.tickets || 0).toLocaleString("pt-BR")} tickets
                </p>
              </div>

              {previousPeriod?.request ? (
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm font-semibold text-amber-700">
                  Solicitacao #{previousPeriod.request.id} esta {statusLabel(previousPeriod.request.status).toLowerCase()}.
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="application/pdf"
                    className="file-input file-input-bordered w-full bg-white"
                    onChange={(event) => setInvoiceFile(event.target.files?.[0] || null)}
                    disabled={!previousPeriod?.canRequest || submitting}
                  />
                  <button
                    type="button"
                    onClick={handleRequestPayment}
                    disabled={!previousPeriod?.canRequest || submitting}
                    className="btn btn-theme-primary w-full"
                  >
                    <FaPaperclip />
                    {submitting ? "Enviando..." : "Solicitar pagamento"}
                  </button>
                  {!previousPeriod?.canRequest && (
                    <p className="text-xs font-semibold text-zinc-500">
                      A solicitacao fica disponivel quando houver faturamento registrado no mes anterior.
                    </p>
                  )}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-5 lg:col-span-3">
              <h2 className="mb-4 text-lg font-black text-zinc-800">Historico de solicitacoes</h2>
              <WithdrawalTable withdrawals={data?.withdrawals || []} />
            </section>
          </div>
        )}

        {isAdmin && (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
            <section className="rounded-2xl border border-zinc-200 bg-white p-5 xl:col-span-2">
              <h2 className="mb-4 text-lg font-black text-zinc-800">Divulgadores no periodo</h2>
              <div className="max-h-[520px] space-y-3 overflow-auto pr-1">
                {(data?.users || []).length === 0 && <EmptyState text="Nenhum faturamento de divulgador neste periodo." />}
                {(data?.users || []).map((item: any) => (
                  <div key={item.id} className="rounded-xl bg-zinc-50 p-4">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-zinc-800">{item.name}</p>
                        <p className="text-xs font-semibold text-zinc-500">{item.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-[#026D9B]">{formatBRL(item.revenue)}</p>
                        <p className="text-[10px] font-bold uppercase text-zinc-400">repasse</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold text-zinc-500">
                      <span>{item.visits.toLocaleString("pt-BR")} visitas</span>
                      <span>{item.tickets.toLocaleString("pt-BR")} tickets</span>
                      <span>{formatBRL(item.grossRevenue || 0)} bruto</span>
                      <span>{formatBRL(item.platformRevenue || 0)} plataforma</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-5 xl:col-span-3">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-black text-zinc-800">Solicitacoes de pagamento</h2>
                  <p className="text-sm text-zinc-500">Anexe o comprovante para marcar como pago.</p>
                </div>
                <span className="rounded-xl bg-zinc-100 px-3 py-2 text-xs font-black uppercase text-zinc-500">
                  {formatBRL(selectedPeriod?.promoterRevenue || 0)} estimado para divulgadores
                </span>
              </div>

              <div className="overflow-auto">
                <table className="table w-full min-w-[760px] border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      <th>Divulgador</th>
                      <th>Referencia</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th>Arquivos</th>
                      <th className="text-right">Pagamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.withdrawals || []).map((withdrawal: any) => (
                      <tr key={withdrawal.id} className="bg-zinc-50">
                        <td className="rounded-l-2xl py-4">
                          <p className="font-black text-zinc-800">{withdrawal.userName || "Usuario"}</p>
                          <p className="text-xs font-semibold text-zinc-500">{withdrawal.userEmail}</p>
                        </td>
                        <td className="font-bold text-zinc-600">
                          {withdrawal.referenceMonth && withdrawal.referenceYear
                            ? `${MONTHS[withdrawal.referenceMonth - 1]} ${withdrawal.referenceYear}`
                            : "-"}
                        </td>
                        <td className="font-black text-[#026D9B]">{formatBRL(withdrawal.amount)}</td>
                        <td>
                          <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(withdrawal.status)}`}>
                            {statusLabel(withdrawal.status)}
                          </span>
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-2">
                            {withdrawal.invoiceUrl && (
                              <Link href={withdrawal.invoiceUrl} target="_blank" className="btn btn-xs bg-white text-[#026D9B]">
                                NF
                              </Link>
                            )}
                            {withdrawal.receiptUrl && (
                              <Link href={withdrawal.receiptUrl} target="_blank" className="btn btn-xs bg-white text-emerald-700">
                                Comprovante
                              </Link>
                            )}
                          </div>
                        </td>
                        <td className="rounded-r-2xl text-right">
                          {withdrawal.status === "PAID" ? (
                            <span className="inline-flex items-center gap-2 text-sm font-black text-emerald-700">
                              <FaCheck /> {formatDate(withdrawal.paidAt)}
                            </span>
                          ) : (
                            <div className="flex min-w-64 items-center justify-end gap-2">
                              <input
                                type="file"
                                accept="application/pdf"
                                className="file-input file-input-bordered file-input-sm max-w-40 bg-white"
                                onChange={(event) => setReceiptFile(withdrawal.id, event)}
                                disabled={submitting}
                              />
                              <button
                                type="button"
                                onClick={() => handleMarkPaid(withdrawal.id)}
                                disabled={submitting}
                                className="btn btn-sm btn-theme-primary"
                              >
                                Pagar
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(data?.withdrawals || []).length === 0 && <EmptyState text="Nenhuma solicitacao de pagamento registrada." />}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function WithdrawalTable({ withdrawals }: { withdrawals: any[] }) {
  if (withdrawals.length === 0) {
    return <EmptyState text="Nenhuma solicitacao enviada ate agora." />;
  }

  return (
    <div className="overflow-auto">
      <table className="table w-full min-w-[620px] border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <th>Referencia</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Solicitado em</th>
            <th>Arquivos</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((withdrawal) => (
            <tr key={withdrawal.id} className="bg-zinc-50">
              <td className="rounded-l-2xl py-4 font-bold text-zinc-600">
                {withdrawal.referenceMonth && withdrawal.referenceYear
                  ? `${MONTHS[withdrawal.referenceMonth - 1]} ${withdrawal.referenceYear}`
                  : "-"}
              </td>
              <td className="font-black text-[#026D9B]">{formatBRL(withdrawal.amount)}</td>
              <td>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(withdrawal.status)}`}>
                  {statusLabel(withdrawal.status)}
                </span>
              </td>
              <td className="font-semibold text-zinc-500">{formatDate(withdrawal.createdAt)}</td>
              <td className="rounded-r-2xl">
                <div className="flex flex-wrap gap-2">
                  {withdrawal.invoiceUrl && (
                    <Link href={withdrawal.invoiceUrl} target="_blank" className="btn btn-xs bg-white text-[#026D9B]">
                      NF
                    </Link>
                  )}
                  {withdrawal.receiptUrl && (
                    <Link href={withdrawal.receiptUrl} target="_blank" className="btn btn-xs bg-white text-emerald-700">
                      Comprovante
                    </Link>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-sm font-semibold text-zinc-500">
      {text}
    </div>
  );
}
