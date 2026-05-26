"use client";

import { FormEvent, useState } from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa6";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setStatus("error");
      setFeedback(data?.error || "Nao foi possivel enviar sua mensagem agora.");
      return;
    }

    event.currentTarget.reset();
    setStatus("success");
    setFeedback("Mensagem enviada com sucesso. Nossa equipe retornara pelo e-mail informado.");
  }

  return (
    <section className="flex flex-col bg-zinc-100 px-6 pb-24 pt-30">
      <header className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-[#053B80] md:text-5xl">
          Fale Conosco
        </h1>
        <div className="mx-auto h-1 w-24 rounded-full bg-cyan-900/70" />
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-zinc-600">
          Use este canal para tirar duvidas sobre cadastro, campanhas, privacidade
          ou suporte relacionado a sua participacao.
        </p>
      </header>

      <div className="mx-auto w-full sm:max-w-3xl">
        {/* <aside className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm">
          <h2 className="text-xl font-bold text-[#053B80]">Canais oficiais</h2>
          <div className="mt-6 space-y-5 text-sm text-zinc-700">
            <p className="flex items-center gap-3">
              <FaEnvelope className="text-[#053B80]" />
              <a href="mailto:contato@chavedobem.com.br" className="font-semibold underline">
                contato@chavedobem.com.br
              </a>
            </p>
            <p className="flex items-center gap-3">
              <FaPhone className="text-[#053B80]" />
              <span>Atendimento pelos canais oficiais informados nas campanhas.</span>
            </p>
          </div>
          <p className="mt-6 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-[#053B80]">
            A Chave do Bem nao solicita pagamentos, senhas ou codigos de
            verificacao por conversas externas para liberar participacao.
          </p>
        </aside> */}

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-md w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <label className="form-control">
              <span className="label-text mb-2 font-semibold text-[#053B80]">Nome</span>
              <input
                name="name"
                type="text"
                placeholder="Digite seu nome"
                className="input input-bordered w-full bg-white text-black placeholder:text-gray-500"
                required
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-2 font-semibold text-[#053B80]">E-mail</span>
              <input
                name="email"
                type="email"
                placeholder="Digite seu e-mail"
                className="input input-bordered w-full bg-white text-black placeholder:text-gray-500"
                required
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-2 font-semibold text-[#053B80]">Assunto</span>
              <input
                name="subject"
                type="text"
                placeholder="Assunto da mensagem"
                className="input input-bordered w-full bg-white text-black placeholder:text-gray-500"
                required
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-2 font-semibold text-[#053B80]">Mensagem</span>
              <textarea
                name="message"
                placeholder="Escreva sua mensagem"
                className="textarea textarea-bordered h-32 w-full bg-white text-black placeholder:text-gray-500"
                required
              />
            </label>

            {feedback && (
              <p className={status === "success" ? "text-sm font-semibold text-emerald-600" : "text-sm font-semibold text-red-600"}>
                {feedback}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="btn border-none bg-[#053B80] text-white hover:bg-[#042e63]"
            >
              {status === "sending" ? "Enviando..." : "Enviar mensagem"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
