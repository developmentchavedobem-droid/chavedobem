import type { MetadataRoute } from "next";

const SITE_URL = "https://chavedobem.com";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || SITE_URL).replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/home", "/campanhas", "/usuarios", "/faturamento", "/cron-logs"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
