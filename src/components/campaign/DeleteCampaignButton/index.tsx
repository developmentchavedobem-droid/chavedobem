'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";

export default function DeleteCampaignButton({ id }: { id: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/campanhas");
        router.refresh();
      }
    } catch (error) {
      alert("Erro ao excluir");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="btn btn-sm btn-error btn-outline gap-2" onClick={() => (window as any).delete_modal.showModal()}>
        <FaTrash /> Excluir
      </button>

      <dialog id="delete_modal" className="modal">
        <div className="modal-box text-gray-800">
          <h3 className="font-bold text-lg">Confirmar exclusão</h3>
          <p className="py-4">Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Cancelar</button>
            </form>
            <button className="btn btn-error text-white" onClick={handleDelete} disabled={loading}>
              {loading ? "Excluindo..." : "Sim, Excluir"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}