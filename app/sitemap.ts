import type { MetadataRoute } from "next";
import prisma from "@/src/lib/prisma";

const SITE_URL = "https://chavedobem.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || SITE_URL).replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = [
    "",
    "/cadastre-se",
    "/participe",
    "/quem-somos",
    "/fale-conosco",
    "/politica-privacidade",
    "/termos-uso",
    "/sorteios",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
  }));

  let campaigns: Array<{ slug: string; updatedAt: Date }> = [];

  try {
    campaigns = await prisma.campaign.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
  } catch (error) {
    console.error("Erro ao gerar rotas dinamicas do sitemap:", error);
  }

  const campaignRoutes = campaigns.flatMap((campaign) => [
    {
      url: `${baseUrl}/campanha/${campaign.slug}`,
      lastModified: campaign.updatedAt,
    },
    {
      url: `${baseUrl}/campanha/${campaign.slug}/descricao`,
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
