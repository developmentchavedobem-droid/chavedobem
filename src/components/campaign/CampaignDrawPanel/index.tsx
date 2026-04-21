"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaDice, FaTrophy } from "react-icons/fa6";

type Winner = {
  id: number;
  position: number;
  profile: {
    name: string;
    phone_number: string | null;
    user: { email: string };
  };
  ticket: {
    id: number;
    createdAt: Date | string;
  };
};

type Draw = {
  id: number;
  requestedWinners: number;
  totalParticipants: number;
  seed: string;
  createdAt: Date | string;
  winners: Winner[];
};

type Props = {
  campaignId: number;
  isReadyToDraw: boolean;
  uniqueParticipants: number;
  draws: Draw[];
};

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function CampaignDrawPanel({ campaignId, isReadyToDraw, uniqueParticipants, draws }: Props) {
  const router = useRouter();
  const [winners, setWinners] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const latestDraw = draws[0];

  async function handleDraw() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/campaigns/${campaignId}/draw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winners }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Nao foi possivel realizar o sorteio.");
      }

      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Erro ao realizar sorteio.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FaTrophy className="text-amber-500" />
            <h2 className="text-lg font-black text-zinc-800">Sorteio de ganhadores</h2>
          </div>
          <p className="mt-1 text-sm font-semibold text-zinc-500">
            {isReadyToDraw
              ? `${uniqueParticipants.toLocaleString("pt-BR")} participante(s) unico(s) disponiveis para sorteio.`
              : "O sorteio sera liberado quando a campanha atingir a meta de renda ou de tickets."}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="number"
            min={1}
            max={Math.max(uniqueParticipants, 1)}
            value={winners}
            onChange={(event) => setWinners(Math.max(1, Number(event.target.value || 1)))}
            className="input input-bordered input-sm w-full bg-zinc-50 text-zinc-800 sm:w-28"
            disabled={!isReadyToDraw || loading}
          />
          <button
            onClick={handleDraw}
            disabled={!isReadyToDraw || loading || uniqueParticipants === 0}
            className="btn btn-sm btn-theme-primary gap-2"
          >
            <FaDice />
            {loading ? "Sorteando..." : "Sortear"}
          </button>
        </div>
      </div>

      {error && <div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</div>}

      {latestDraw && (
        <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-amber-700">Ultimo sorteio</p>
              <p className="text-sm font-bold text-zinc-600">
                {formatDate(latestDraw.createdAt)} - {latestDraw.requestedWinners} ganhador(es)
              </p>
            </div>
            <p className="text-xs font-semibold text-zinc-500">Seed: {latestDraw.seed}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {latestDraw.winners.map((winner) => (
              <div key={winner.id} className="rounded-xl bg-white p-4">
                <p className="text-xs font-black uppercase text-amber-600">#{winner.position} ganhador</p>
                <p className="mt-1 text-lg font-black text-zinc-800">{winner.profile.name}</p>
                <p className="text-sm font-semibold text-zinc-500">{winner.profile.user.email}</p>
                {winner.profile.phone_number && (
                  <p className="text-sm font-semibold text-zinc-500">{winner.profile.phone_number}</p>
                )}
                <p className="mt-2 text-xs font-bold text-zinc-400">Ticket #{winner.ticket.id}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {draws.length > 1 && (
        <div className="mt-4 overflow-auto">
          <table className="table w-full min-w-[680px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <th>Data</th>
                <th>Ganhadores</th>
                <th>Participantes</th>
                <th>Seed</th>
              </tr>
            </thead>
            <tbody>
              {draws.slice(1).map((draw) => (
                <tr key={draw.id} className="bg-zinc-50 text-sm font-semibold text-zinc-600">
                  <td className="rounded-l-xl p-3">{formatDate(draw.createdAt)}</td>
                  <td>{draw.requestedWinners}</td>
                  <td>{draw.totalParticipants}</td>
                  <td className="rounded-r-xl text-xs">{draw.seed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
