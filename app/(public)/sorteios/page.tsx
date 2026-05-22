import { Campaign } from "@/app/generated/prisma/client";
import prisma from "@/src/lib/prisma";
import Image from "next/image";
import Link from "next/link";

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
    <div className="min-h-75 w-full bg-zinc-100 pb-20 font-sans">
      <div className="mx-auto flex h-full w-full flex-col items-center px-5 sm:max-w-6xl">
        <h3 className="mb-8 text-2xl font-bold text-[#053B80]">
          Participe conosco!
        </h3>

        {safeList.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">Nenhuma campanha disponivel no momento.</p>
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {safeList.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/campanha/${campaign.slug}`}
                prefetch
                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-200">
                  <Image
                    src={campaign.imageUrl || "/placeholder.png"}
                    alt={campaign.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h4 className="line-clamp-2 text-xl font-black uppercase leading-tight text-[#053B80] transition group-hover:text-emerald-600">
                    {campaign.name}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
