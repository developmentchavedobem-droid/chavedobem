'use client'

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUploadUrl } from "@/src/actions/campanhas";
import Image from "next/image";
import Link from "next/link";

export default function CreateCampaignPage() {
  const router = useRouter();
  
  // 1. Estado inicial com os novos campos
  const [form, setForm] = useState({ 
    name: "", 
    goal: "", 
    description: "",
    ticketValue: "0.05", // Padrão solicitado: 0,05
    ticketGoal: 0
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 2. Lógica de Sincronização Automática
  // Sempre que 'goal' ou 'ticketValue' mudarem, recalculamos o 'ticketGoal'
  useEffect(() => {
    const goalNum = Number(form.goal) || 0;
    const valNum = Number(form.ticketValue) || 0;

    if (valNum > 0) {
      const calculatedGoal = Math.ceil(goalNum / valNum);
      setForm(prev => ({ ...prev, ticketGoal: calculatedGoal }));
    } else {
      setForm(prev => ({ ...prev, ticketGoal: 0 }));
    }
  }, [form.goal, form.ticketValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      let finalImageUrl = "";

      if (imageFile) {
        const res = await getUploadUrl(imageFile.name, imageFile.type);
        
        if (!res.success || !res.uploadUrl) throw new Error("Erro na URL");

        const uploadResponse = await fetch(res.uploadUrl, {
          method: "PUT",
          body: imageFile,
          headers: {
            // O navegador precisa enviar isso, mas como não está "assinado" na URL,
            // o S3 não será tão rigoroso no Preflight.
            "Content-Type": imageFile.type, 
          },
          // Garante que não enviamos cookies de sessão do Next.js para a Amazon
          credentials: "omit", 
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error("S3 Error Body:", errorText);
          throw new Error("Falha no upload para o S3");
        }
        
        finalImageUrl = res.publicUrl;
      }

      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          goal: Number(form.goal),
          ticketValue: Number(form.ticketValue),
          ticketGoal: form.ticketGoal,
          imageUrl: finalImageUrl
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao salvar no banco");
      }

      router.push("/campanhas");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Erro ao criar campanha.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full items-end max-w-full flex-col gap-4 px-3 pb-4 sm:px-4 lg:px-0">
      <div className="w-full max-w-full rounded-2xl bg-gray-100 p-6 lg:w-[80%]">
        <h1 className="text-2xl font-bold text-[#026D9B]">Nova Campanha</h1>
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          <div className="lg:col-span-2 space-y-4">
            <label className="form-control w-full">
              <span className="label-text font-semibold mb-2 text-gray-700">Nome da Campanha</span>
              <input 
                className="input input-bordered w-full bg-white text-gray-600" 
                placeholder="Ex.: iPhone 16 Pro Max" 
                required
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text font-semibold mb-2 text-gray-700">Descrição</span>
              <textarea 
                className="textarea textarea-bordered w-full bg-white h-70 text-gray-600" 
                placeholder="Descreva o objetivo da campanha"
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
              />
            </label>
          </div>

          <div className="bg-white p-4 rounded-2xl space-y-4">
            <label className="form-control w-full">
              <span className="label-text font-semibold mb-2 text-gray-700">Meta Financeira (R$)</span>
              <input 
                type="number" 
                className="input input-bordered w-full bg-white text-gray-600" 
                placeholder="10000" 
                required
                value={form.goal}
                onChange={e => setForm({...form, goal: e.target.value})}
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text font-semibold mb-2 text-gray-700">Valor Estimado p/ Ticket (R$)</span>
              <input 
                type="number" 
                step="0.01"
                className="input input-bordered w-full bg-white text-gray-600" 
                value={form.ticketValue}
                onChange={e => setForm({...form, ticketValue: e.target.value})}
              />
            </label>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-800 font-semibold uppercase tracking-wider">Meta de Audiência</p>
              <p className="text-2xl font-bold text-[#026D9B]">{form.ticketGoal.toLocaleString('pt-BR')} <span className="text-sm font-normal">Tickets</span></p>
              <p className="text-[10px] text-blue-600 mt-1">* Cálculo baseado no lucro médio por anúncio.</p>
            </div>
            
            <div className="form-control">
              <span className="label-text font-semibold mb-2 text-gray-700">Imagem de Capa</span>
              <input 
                type="file" 
                accept="image/*"
                className="file-input file-input-bordered w-full bg-white text-gray-600" 
                onChange={handleFileChange}
              />
            </div>

            {/* Preview do Card */}
            <div className="relative h-40 rounded-xl overflow-hidden bg-slate-200">
              {previewUrl ? (
                <Image src={previewUrl} alt="Preview" fill className="object-cover opacity-60" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">Sem imagem</div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent p-4 flex flex-col justify-end text-white">
                <p className="font-bold truncate">{form.name || "Título"}</p>
                <p className="text-xs">Meta: R$ {Number(form.goal).toLocaleString('pt-BR')}</p>
                <p className="text-[10px] opacity-80">{form.ticketGoal.toLocaleString('pt-BR')} tickets necessários</p>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            <div className="flex flex-col gap-2">
              <button type="submit" disabled={submitting} className="btn btn-theme-primary w-full">
                {submitting ? "Processando..." : "Criar Campanha"}
              </button>
              <Link href="/campanhas" className="btn rounded-3xl w-full">Cancelar</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}