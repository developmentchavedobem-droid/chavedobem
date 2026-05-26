import Campaigns from "./sorteios/page";
import prisma from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const campaigns = await prisma.campaign.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 font-sans pt-20">
      <div id="campanhas">
        <Campaigns campaigns={campaigns} />
      </div>
    </div>
  );
}
