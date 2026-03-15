'use client'

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type FormState = {
  name: string;
  goal: string;
  description: string;
  imageUrl: string;
};

const initialState: FormState = {
  name: "",
  goal: "",
  description: "",
  imageUrl: "",
};

export default function CreateCampaignPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          goal: Number(form.goal),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Não foi possível criar a campanha");
        return;
      }

      router.push("/campanhas");
      router.refresh();
    } catch {
      setError("Não foi possível criar a campanha");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full items-end max-w-full flex-col gap-4 overflow-x-hidden px-3 pb-4 sm:px-4 lg:px-0">
      <div className="w-full max-w-full rounded-2xl bg-gray-100 p-4 lg:w-[80%]">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-bold text-[#026D9B]">Criar campanha</h1>
          <p className="text-sm text-gray-600">
            Cadastre uma nova campanha com a identidade visual e a meta de arrecadação.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-semibold text-gray-700">Nome da campanha</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full bg-white"
                placeholder="Ex.: Casa nova solidária"
                value={form.name}
                onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))}
                required
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-semibold text-gray-700">Descrição</span>
              </div>
              <textarea
                className="textarea textarea-bordered min-h-32 w-full bg-white"
                placeholder="Descreva o objetivo da campanha"
                value={form.description}
                onChange={(event) => setForm((state) => ({ ...state, description: event.target.value }))}
              />
            </label>
          </div>

          <div className="space-y-4 rounded-2xl bg-white p-4">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-semibold text-gray-700">Meta da campanha</span>
              </div>
              <input
                type="number"
                min="1"
                step="1"
                className="input input-bordered w-full bg-white"
                placeholder="50000"
                value={form.goal}
                onChange={(event) => setForm((state) => ({ ...state, goal: event.target.value }))}
                required
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-semibold text-gray-700">URL da imagem</span>
              </div>
              <input
                type="url"
                className="input input-bordered w-full bg-white"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(event) => setForm((state) => ({ ...state, imageUrl: event.target.value }))}
              />
            </label>

            <div className="rounded-2xl bg-gray-100 p-4">
              <p className="text-sm font-semibold text-[#026D9B]">Prévia do card</p>
              <div
                className="mt-3 flex min-h-48 flex-col justify-end rounded-2xl p-4 text-white"
                style={{
                  backgroundImage: form.imageUrl
                    ? `linear-gradient(180deg, rgba(2,109,155,0.12) 0%, rgba(2,109,155,0.88) 100%), url(${form.imageUrl})`
                    : "linear-gradient(180deg, #026D9B 0%, #237C7B 100%)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <span className="text-lg font-bold">
                  {form.name || "Nome da campanha"}
                </span>
                <span className="mt-1 text-sm text-white/85">
                  Meta: {form.goal ? Number(form.goal).toLocaleString("pt-BR") : "0"}
                </span>
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                className="btn w-full sm:w-auto"
                onClick={() => router.push("/campanhas")}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-theme-primary w-full sm:flex-1"
                disabled={submitting}
              >
                {submitting ? "Criando..." : "Criar campanha"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
