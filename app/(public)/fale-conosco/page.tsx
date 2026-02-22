"use client"

import Image from "next/image"

import { FaPhone, FaEnvelope, FaLocationDot } from "react-icons/fa6"

export default function Contact() {
  return (
    <section className="bg-zinc-100 pt-30 pb-20 flex flex-col px-6">
      
      {/* Header */}
      <header className="text-center mb-16">
        <h3 className="text-[#053B80] text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Fale Conosco
        </h3>
        <div className="w-24 h-1 bg-cyan-900/70 mx-auto rounded-full"></div>
      </header>

      {/* Conteúdo */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Informações de Contato */}
        <div className="flex flex-col gap-6 text-zinc-700">
          <div className="flex flex-col gap-4 text-base">
            <Image
              className="mx-auto sm:mx-0"
              src="/logo.svg"
              alt="ChaveDoBem logo"
              width={200}
              height={200}
              priority
            />
            <span className="font-bold text-lg text-[#053B80]">
              Informações de Contato
            </span>

            <div className="flex items-center gap-4">
              <FaPhone size={20} className="text-cyan-900" />
              <span>(11) 99559-2200</span>
            </div>

            <div className="flex items-center gap-4">
              <FaEnvelope size={20} className="text-cyan-900" />
              <span>contato@chavedobem.com.br</span>
            </div>

            <div className="flex items-center gap-4">
              <FaLocationDot size={20} className="text-cyan-900" />
              <span>Av. Itajaúna, Centro, SP.</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
            <p className="text-sm text-zinc-600 leading-relaxed">
              Estamos prontos para atender você. Envie sua mensagem pelo formulário
              ou entre em contato diretamente pelos nossos canais.
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white p-8 rounded-2xl shadow-md border border-zinc-200">
          <form className="flex flex-col gap-5">

            <div className="form-control ">
              <label className="label text-[#053B80]">
                <span className="label-text font-semibold">Nome</span>
              </label>
              <input
                type="text"
                placeholder="Digite seu nome"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label text-[#053B80]">
                <span className="label-text font-semibold">E-mail</span>
              </label>
              <input
                type="email"
                placeholder="Digite seu e-mail"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label text-[#053B80]">
                <span className="label-text font-semibold">Assunto</span>
              </label>
              <input
                type="text"
                placeholder="Assunto da mensagem"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label text-[#053B80]">
                <span className="label-text font-semibold">Mensagem</span>
              </label>
              <textarea
                placeholder="Escreva sua mensagem"
                className="textarea textarea-bordered w-full h-32"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn bg-[#053B80] hover:bg-[#042e63] text-white border-none mt-2"
            >
              Enviar Mensagem
            </button>

          </form>
        </div>
      </div>
    </section>
  )
}