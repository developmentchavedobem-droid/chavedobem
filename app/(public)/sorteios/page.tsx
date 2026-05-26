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
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-7">
            {safeList.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/campanha/${campaign.slug}`}
                prefetch
                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-200 sm:aspect-[16/11]">
                  <Image
                    src={campaign.imageUrl || "/placeholder.png"}
                    alt={campaign.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/55 to-transparent opacity-90" />
                </div>
                <div className="p-4 sm:p-5">
                  <h4 className="line-clamp-2 min-h-14 text-lg font-black uppercase leading-tight text-[#053B80] transition group-hover:text-emerald-600 sm:text-xl">
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
