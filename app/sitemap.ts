import type { MetadataRoute } from "next";
import prisma from "@/src/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://chavedobem.com.br";

  const staticRoutes = [
    "",
    "/cadastre-se",
    "/quem-somos",
    "/fale-conosco",
    "/politica-privacidade",
    "/termos-uso",
    "/sorteios",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  const campaigns = await prisma.campaign.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const campaignRoutes = campaigns.flatMap((campaign) => [
    {
      url: `${baseUrl}/campanha/${campaign.slug}`,
      lastModified: campaign.updatedAt,
    },
    {
      url: `${baseUrl}/campanha/${campaign.slug}/instrucoes`,
      lastModified: campaign.updatedAt,
    },
    {
      url: `${baseUrl}/campanha/${campaign.slug}/tutorial`,
      lastModified: campaign.updatedAt,
    },
  ]);

  return [...staticRoutes, ...campaignRoutes];
}
