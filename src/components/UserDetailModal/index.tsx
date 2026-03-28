'use client'

import { useState } from "react";
import { IoClose, IoPencil, IoTrash, IoSave } from "react-icons/io5";
import { updateUserAction, deleteUserAction } from "@/src/actions/user";

interface UserDetailsModalProps {
  user: any;
  onClose: () => void;
}

export default function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Inicializamos o estado diretamente das props. 
  // Dica: Use 'key={user.id}' ao chamar este componente no pai para resetar este estado automaticamente.
  const [formData, setFormData] = useState({
    name: user.profile?.name || "",
    email: user.email || "",
    register_number: user.profile?.register_number || "",
    phone_number: user.profile?.phone_number || ""
  });

  // Função para salvar as alterações
  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData(e.currentTarget);
    const result = await updateUserAction(user.id, data);

    if (result.success) {
      setIsEditing(false);
      // O revalidatePath no servidor atualizará os dados reais na tabela ao fundo.
    } else {
      alert(result.error || "Erro ao atualizar.");
    }
    setIsLoading(false);
  }

  // Função para excluir o usuário
  async function handleDelete() {
    const confirmDelete = confirm(
      "ATENÇÃO: Esta ação é irreversível.\n\nTodos os dados vinculados (Perfil, Carteira, Links e Tickets) serão apagados permanentemente.\n\nDeseja continuar?"
    );

    if (confirmDelete) {
      setIsLoading(true);
      const result = await deleteUserAction(user.id);
      if (result.success) {
        onClose();
      } else {
        alert(result.error || "Erro ao excluir.");
        setIsLoading(false);
      }
    }
  }

  // Função para cancelar e resetar campos
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.profile?.name || "",
      email: user.email || "",
      register_number: user.profile?.register_number || "",
      phone_number: user.profile?.phone_number || ""
    });
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-[#053B80] uppercase italic tracking-tighter">
              {isEditing ? "Editando Usuário" : "Detalhes do Usuário"}
            </h3>
            <span className="bg-zinc-100 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded">ID: {user.id}</span>
          </div>
          <button 
            onClick={onClose} 
            className="text-zinc-300 hover:text-red-500 transition-colors"
          >
            <IoClose size={32} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleUpdate} className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field 
              label="Nome Completo" 
              name="name" 
              value={formData.name} 
              onChange={(e: any) => setFormData({...formData, name: e.target.value})}
              disabled={!isEditing} 
              required
            />
            <Field 
              label="E-mail" 
              name="email" 
              type="email"
              value={formData.email} 
              onChange={(e: any) => setFormData({...formData, email: e.target.value})}
              disabled={!isEditing} 
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field 
              label="CPF / CNPJ" 
              name="register_number" 
              value={formData.register_number} 
              onChange={(e: any) => setFormData({...formData, register_number: e.target.value})}
              disabled={!isEditing} 
            />
            <Field 
              label="WhatsApp" 
              name="phone_number" 
              value={formData.phone_number} 
              onChange={(e: any) => setFormData({...formData, phone_number: e.target.value})}
              disabled={!isEditing} 
            />
          </div>

          {/* Info Cards */}
          <div className="bg-zinc-50 p-4 rounded-2xl space-y-2 border border-zinc-100">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Informações de Sistema</p>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500 font-medium">Tipo de Conta:</span>
              <span className="font-bold text-[#053B80] uppercase tracking-tighter">{user.role}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500 font-medium">Membro desde:</span>
              <span className="font-bold text-[#053B80]">
                {new Date(user.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-3 pt-4">
            {!isEditing ? (
              <>
                <button 
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex-[3] bg-zinc-100 text-[#053B80] font-black py-5 rounded-2xl uppercase text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95"
                >
                  <IoPencil size={16} /> Editar Dados
                </button>
                
                <button 
                  type="button"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 bg-red-50 text-red-500 font-black py-5 rounded-2xl uppercase text-xs flex items-center justify-center hover:bg-red-100 transition-all disabled:opacity-50"
                >
                  <IoTrash size={22} />
                </button>
              </>
            ) : (
              <>
                <button 
                  type="button" 
                  onClick={handleCancel} 
                  className="flex-1 bg-zinc-100 text-zinc-500 font-black py-5 rounded-2xl uppercase text-xs hover:bg-zinc-200 transition-all"
                >
                  Cancelar
                </button>
                
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="flex-[2] bg-[#1F8C6D] text-white font-black py-5 rounded-2xl uppercase text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  <IoSave size={16} /> {isLoading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black text-gray-400 uppercase ml-3 tracking-widest">
        {label}
      </label>
      <input 
        {...props} 
        className="w-full bg-zinc-100 disabled:bg-zinc-50 disabled:text-zinc-400 rounded-2xl px-6 py-4 text-sm outline-none font-bold border-2 text-[#053B80] border-transparent focus:border-[#053B80]/10 transition-all placeholder:text-zinc-300"
      />
    </div>
  );
}