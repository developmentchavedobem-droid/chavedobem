"use client";

import PublicHeader from "@/src/components/PublicHeader";
import Footer from "@/src/components/Footer";
import PublicContentBoost from "@/src/components/PublicContentBoost";
import Script from "next/script";
import { usePathname } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Normalização: Remove barras no final e garante que pegamos apenas o início da rota
  // Isso ignora ?ref=... e garante que /participe ou /participe/ funcionem
  const isParticipePage = pathname?.split('?')[0].replace(/\/$/, "") === "/participe";

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2617789128311033"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* Condicional Estrita */}
      {!isParticipePage ? (
        <>
          <PublicHeader />
          <main className="pt-10 min-h-screen">
            {children}
          </main>
          <PublicContentBoost pathname={pathname || "/"} />
          <Footer />
        </>
      ) : (
        /* Na página participe, renderiza APENAS o conteúdo puro */
        <main className="min-h-screen">
          {children}
        </main>
      )}
    </>
  );
}
