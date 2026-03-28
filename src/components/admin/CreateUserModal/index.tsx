'use client'

import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { createStaffUserAction } from "@/src/actions/user";

export default function CreateUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError("");

    const result = await createStaffUserAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      // Sucesso
      setIsOpen(false);
      setIsLoading(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[#053B80] text-white px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all"
      >
        <FaUserPlus size={16} /> Novo Divulgador
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-[#053B80] uppercase italic tracking-tighter">Criar Usuário</h3>
              <button onClick={() => setIsOpen(false)} className="text-zinc-300 hover:text-red-500 transition-colors">
                <IoClose size={32} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-500 text-xs font-bold rounded-xl uppercase">
                {error}
              </div>
            )}

            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-3 tracking-widest">Nome Completo</label>
                <input name="name" type="text" required className="w-full bg-zinc-100 rounded-2xl px-6 py-4 text-sm outline-none font-bold text-[#053B80]" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-3 tracking-widest">E-mail</label>
                <input name="email" type="email" required className="w-full bg-zinc-100 rounded-2xl px-6 py-4 text-sm outline-none font-bold text-[#053B80]" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-3 tracking-widest">Senha</label>
                <input name="password" type="password" required className="w-full bg-zinc-100 rounded-2xl px-6 py-4 text-sm outline-none font-bold text-[#053B80]" />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#053B80] text-white font-black py-5 rounded-2xl shadow-xl uppercase mt-4 disabled:opacity-50"
              >
                {isLoading ? "Criando..." : "Criar Divulgador"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}