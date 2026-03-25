'use client'

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUploadUrl } from "@/src/actions/campanhas";
import Image from "next/image";
import Link from "next/link";

interface CampaignFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function CampaignForm({ initialData, isEditing }: CampaignFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initialData?.name || "",
    goal: initialData?.goal?.toString() || "",
    description: initialData?.description || "",
    ticketValue: initialData?.ticketValue?.toString() || "0.05",
    ticketGoal: initialData?.ticketGoal || 0
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.imageUrl || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const goalNum = Number(form.goal) || 0;
    const valNum = Number(form.ticketValue) || 0;
    const calculatedGoal = valNum > 0 ? Math.ceil(goalNum / valNum) : 0;
    setForm(prev => ({ ...prev, ticketGoal: calculatedGoal }));
  }, [form.goal, form.ticketValue]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const finalGoal = Number(form.goal);
      const finalTicketValue = Number(form.ticketValue);
      const finalTicketGoal = finalTicketValue > 0 ? Math.ceil(finalGoal / finalTicketValue) : 0;
      let finalImageUrl = previewUrl;

      if (imageFile) {
        const res = await getUploadUrl(imageFile.name, imageFile.type);
        if (!res.success || !res.uploadUrl) throw new Error("Erro no upload");
        await fetch(res.uploadUrl, { method: "PUT", body: imageFile, headers: { "Content-Type": imageFile.type }, credentials: "omit" });
        finalImageUrl = res.publicUrl || "";
      }

      const url = isEditing ? `/api/campaigns/${initialData.id}` : "/api/campaigns";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, goal: finalGoal, ticketValue: finalTicketValue, ticketGoal: finalTicketGoal, imageUrl: finalImageUrl }),
      });

      if (!response.ok) throw new Error("Erro ao salvar");
      router.push("/campanhas");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 text-gray-800">
      <div className="lg:col-span-2 space-y-4">
        <label className="form-control w-full">
          <span className="label-text font-semibold mb-2">Nome da Campanha</span>
          <input className="input input-bordered w-full bg-white" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className="form-control w-full">
          <span className="label-text font-semibold mb-2">Descrição</span>
          <textarea className="textarea textarea-bordered w-full bg-white h-70" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </label>
      </div>

      <div className="bg-white p-4 rounded-2xl space-y-4 shadow-sm border border-gray-100">
        <label className="form-control w-full">
          <span className="label-text font-semibold mb-2">Meta Financeira (R$)</span>
          <input type="number" className="input input-bordered w-full bg-white" required value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} />
        </label>
        <label className="form-control w-full">
          <span className="label-text font-semibold mb-2">Valor p/ Ticket (R$)</span>
          <input type="number" step="0.0001" className="input input-bordered w-full bg-white" value={form.ticketValue} onChange={e => setForm({ ...form, ticketValue: e.target.value })} />
        </label>
        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-800 font-semibold uppercase">Meta de Audiência</p>
          <p className="text-2xl font-bold text-[#026D9B]">{form.ticketGoal.toLocaleString('pt-BR')} <span className="text-sm font-normal">Tickets</span></p>
        </div>
        <div className="form-control">
          <span className="label-text font-semibold mb-2">Imagem de Capa</span>
          <input type="file" accept="image/*" className="file-input file-input-bordered w-full bg-white" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) { setImageFile(file); setPreviewUrl(URL.createObjectURL(file)); }
          }} />
        </div>
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
        <button type="submit" disabled={submitting} className="btn btn-theme-primary w-full">
          {submitting ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Campanha"}
        </button>
        <Link href="/campanhas" className="btn rounded-3xl w-full">Cancelar</Link>
      </div>
    </form>
  );
}