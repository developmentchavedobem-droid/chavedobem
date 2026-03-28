// app/participe/layout.tsx
import Script from "next/script";

export default function ParticipeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Mantemos o Script do AdSense aqui se for necessário nesta página */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2617789128311033"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      
      {/* Sem Header, Sem Footer, Apenas o conteúdo */}
      <main className="min-h-screen bg-white">
        {children}
      </main>
    </>
  );
}