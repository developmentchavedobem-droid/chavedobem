import prisma from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import CampaignForm from "@/src/components/campaign/CampaignForm";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";


export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = token ? (jwt.decode(token) as any) : null;

  if (!decoded || decoded.role !== "ADMIN") {
    redirect("/dashboard");
  }
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({ where: { id: Number(id) } });

  if (!campaign) notFound();

  return (
    <div className="flex w-full items-end max-w-full flex-col gap-4 px-3 pb-4 sm:px-4 lg:px-0">
      <div className="w-full max-w-full rounded-2xl bg-gray-100 p-6 lg:w-[80%]">
        <h1 className="text-2xl font-bold text-[#026D9B]">Editar Campanha</h1>
        <CampaignForm initialData={campaign} isEditing />
      </div>
    </div>
  );
}