import type { MetadataRoute } from "next";

const SITE_URL = "https://www.chavedobem.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/home", "/campanhas", "/usuarios", "/faturamento", "/cron-logs"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
