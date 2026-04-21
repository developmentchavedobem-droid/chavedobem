import CampaignForm from "@/src/components/campaign/CampaignForm";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export default async function CreateCampaignPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = token ? (jwt.decode(token) as any) : null;

  if (!decoded || decoded.role !== "ADMIN") {
    redirect("/home");
  }

  return (
    <div className="flex w-full max-w-full flex-col items-end gap-4 px-3 pb-4 sm:px-4 lg:px-0">
      <div className="w-full max-w-full rounded-2xl bg-gray-100 p-6 lg:w-[80%]">
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-[#026D9B]">Nova Campanha</h1>
          <p className="text-sm text-gray-500">
            Preencha a meta de renda, a meta de tickets e as informacoes publicas da campanha.
          </p>
        </div>

        <CampaignForm />
      </div>
    </div>
  );
}
