import { Campaign } from "@/app/generated/prisma/client";
import prisma from "@/src/lib/prisma";
import Card from "@/src/components/Card";

export const dynamic = "force-dynamic";

interface CampaignsProps {
  campaigns?: Campaign[];
}

export default async function CampaignsPage({ campaigns }: CampaignsProps) {
  const list =
    campaigns ??
    (await prisma.campaign.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    }));

  const safeList = list || [];

  return (
    <div className="min-h-screen w-full bg-zinc-100 px-4 py-10 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center">
        <h3 className="mb-8 text-center text-2xl font-black uppercase tracking-wide text-[#053B80] sm:text-3xl">
          Participe conosco!
        </h3>

        {safeList.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">Nenhuma campanha disponivel no momento.</p>
          </div>
        ) : (
          <div className="flex w-full max-w-3xl flex-col gap-4">
            {safeList.map((campaign) => (
              <Card key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
