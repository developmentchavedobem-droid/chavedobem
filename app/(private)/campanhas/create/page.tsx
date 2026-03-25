import CampaignForm from "@/src/components/campaign/CampaignForm";

export default function CreateCampaignPage() {
  return (
    <div className="flex w-full items-end max-w-full flex-col gap-4 px-3 pb-4 sm:px-4 lg:px-0">
      <div className="w-full max-w-full rounded-2xl bg-gray-100 p-6 lg:w-[80%]">
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-[#026D9B]">Nova Campanha</h1>
          <p className="text-sm text-gray-500">Preencha os dados abaixo para lançar uma nova meta de tickets.</p>
        </div>

        {/* Chamada do componente sem initialData indica que é uma criação */}
        <CampaignForm />
      </div>
    </div>
  );
}