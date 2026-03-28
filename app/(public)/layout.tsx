import PublicHeader from "@/src/components/PublicHeader";
import Footer from "@/src/components/Footer";
import Script from "next/script";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />

      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2617789128311033"
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onLoad={() => {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }}
      />

      <main className="pt-10">
        {children}
      </main>

      <Footer />
    </>
  );
}