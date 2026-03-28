'use client'

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaUserShield, FaUsers, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import UserDetailsModal from "../../UserDetailModal";

// Definindo a interface para o TypeScript não reclamar na Page
interface UserTabsProps {
  systemUsers: any[];
  customers: any[];
  totalCustomers: number;
  currentPage: number;
  pageSize: number;
  activeTab: string;
}

export default function UserTabs({ 
  systemUsers, 
  customers, 
  totalCustomers, 
  currentPage, 
  pageSize,
  activeTab 
}: UserTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const totalPages = Math.ceil(totalCustomers / pageSize);

  // Estado para controlar qual usuário está sendo visualizado no modal
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const setTab = (tab: string) => {
    const params = new URLSearchParams();
    params.set("tab", tab);
    params.set("page", "1"); // Resetar para página 1 ao trocar de aba
    router.push(`${pathname}?${params.toString()}`);
  };

  const setPage = (page: number) => {
    const params = new URLSearchParams();
    params.set("tab", "customers");
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentList = activeTab === 'system' ? systemUsers : customers;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
      
      {/* NAVEGAÇÃO DE ABAS */}
      <div className="flex border-b border-zinc-100 bg-zinc-50/50">
        <button 
          onClick={() => setTab('system')}
          className={`flex-1 py-5 flex items-center justify-center gap-2 font-bold text-sm transition-all ${
            activeTab === 'system' 
            ? 'text-[#053B80] bg-white border-b-2 border-[#053B80]' 
            : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <FaUserShield /> Equipe do Sistema
        </button>
        <button 
          onClick={() => setTab('customers')}
          className={`flex-1 py-5 flex items-center justify-center gap-2 font-bold text-sm transition-all ${
            activeTab === 'customers' 
            ? 'text-[#053B80] bg-white border-b-2 border-[#053B80]' 
            : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <FaUsers /> Base de Clientes ({totalCustomers})
        </button>
      </div>

      {/* TABELA */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-50 text-zinc-400 text-[10px] font-black uppercase tracking-widest border-b border-zinc-100">
            <tr>
              <th className="px-6 py-4">Usuário</th>
              <th className="px-6 py-4">Papel (Role)</th>
              <th className="px-6 py-4">Cadastro</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {currentList.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-zinc-400 text-sm italic">
                  Nenhum usuário encontrado nesta lista.
                </td>
              </tr>
            ) : (
              currentList.map((u: any) => (
                <tr key={u.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#053B80] group-hover:text-[#026D9B] transition-colors">
                        {u.profile?.name || 'Sem nome'}
                      </span>
                      <span className="text-xs text-zinc-400">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      u.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 
                      u.role === 'USER' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-zinc-500">
                    {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedUser(u)}
                      className="text-[#026D9B] hover:text-[#053B80] font-black text-xs uppercase tracking-widest border border-[#026D9B]/20 px-4 py-2 rounded-xl hover:bg-[#026D9B]/5 transition-all"
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINAÇÃO */}
      {activeTab === 'customers' && totalPages > 1 && (
        <div className="p-6 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/30">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
              className="p-2 bg-white border border-zinc-200 text-zinc-500 rounded-xl disabled:opacity-30 hover:bg-zinc-50 transition-all shadow-sm"
            >
              <FaChevronLeft size={14} />
            </button>
            <button 
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
              className="p-2 bg-white border border-zinc-200 text-zinc-500 rounded-xl disabled:opacity-30 hover:bg-zinc-50 transition-all shadow-sm"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE DETALHES */}
      {selectedUser && (
        <UserDetailsModal 
          key={selectedUser.id} // Fundamental para resetar o estado interno do modal ao trocar de user
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
}