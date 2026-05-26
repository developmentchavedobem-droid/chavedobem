"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getUploadUrl } from "@/src/actions/campanhas";
import { uploadToSignedS3Url } from "@/src/utils/s3-upload";
import Link from "next/link";
import RichTextEditor from "@/src/components/campaign/RichTextEditor";

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
    secondDescription: initialData?.secondDescription || "",
    ticketGoal: initialData?.ticketGoal?.toString() || "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.imageUrl || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const finalGoal = Number(form.goal);
      const finalTicketGoal = Number(form.ticketGoal);
      let finalImageUrl = previewUrl;

      if (imageFile) {
        const res = await getUploadUrl(imageFile.name, imageFile.type);
        if (!res.success || !res.uploadUrl) throw new Error("Erro no upload");
        await uploadToSignedS3Url(res.uploadUrl, imageFile);
        finalImageUrl = res.publicUrl || "";
      }

      const url = isEditing ? `/api/campaigns/${initialData.id}` : "/api/campaigns";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          goal: finalGoal,
          ticketGoal: finalTicketGoal,
          ticketValue: 0,
          imageUrl: finalImageUrl,
        }),
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
    <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-6 text-gray-800 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <label className="form-control w-full">
          <span className="label-text mb-2 font-semibold">Nome da Campanha</span>
          <input
            className="input input-bordered w-full bg-white"
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>

        <div className="form-control w-full">
          <span className="label-text mb-2 font-semibold">Conteudo da Campanha</span>
          <RichTextEditor
            value={form.description}
            onChange={(description) => setForm((current) => ({ ...current, description }))}
          />
          <p className="mt-2 text-xs text-gray-500">
            Use este campo como um artigo: explique a proposta, os detalhes, as regras e o contexto da campanha.
          </p>
        </div>

        <div className="form-control w-full">
          <span className="label-text mb-2 font-semibold">Segunda Descricao</span>
          <RichTextEditor
            value={form.secondDescription}
            onChange={(secondDescription) => setForm((current) => ({ ...current, secondDescription }))}
          />
          <p className="mt-2 text-xs text-gray-500">
            Este conteudo aparece como a segunda etapa da campanha, antes das instrucoes.
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <label className="form-control w-full">
          <span className="label-text mb-2 font-semibold">Meta de Renda (R$)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            className="input input-bordered w-full bg-white"
            required
            value={form.goal}
            onChange={(event) => setForm({ ...form, goal: event.target.value })}
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text mb-2 font-semibold">Meta de Tickets</span>
          <input
            type="number"
            min="0"
            className="input input-bordered w-full bg-white"
            required
            value={form.ticketGoal}
            onChange={(event) => setForm({ ...form, ticketGoal: event.target.value })}
          />
        </label>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
          <p className="text-xs font-semibold uppercase text-blue-800">Monetizacao</p>
          <p className="text-sm font-semibold text-[#026D9B]">
            A receita vem dos relatorios do AdSense e e distribuida pelas visitas validas da campanha.
          </p>
        </div>

        <div className="form-control">
          <span className="label-text mb-2 font-semibold">Imagem de Capa</span>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full bg-white"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                setImageFile(file);
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
          />
        </div>

        {error && <p className="text-center text-xs text-red-500">{error}</p>}

        <button type="submit" disabled={submitting} className="btn btn-theme-primary w-full">
          {submitting ? "Salvando..." : isEditing ? "Salvar Alteracoes" : "Criar Campanha"}
        </button>
        <Link href="/campanhas" className="btn w-full rounded-3xl">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
