import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://chavedobem.com.br";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/home", "/campanhas", "/usuarios", "/faturamento", "/cron-logs"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
