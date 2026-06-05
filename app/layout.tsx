import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AuthBootstrap from "@/src/components/AuthBootstrap";

const GA_MEASUREMENT_ID = "G-N4CX0EQM20";

export const metadata: Metadata = {
  metadataBase: new URL("https://chavedobem.com"),
  title: "Chave do Bem",
  description: "Campanhas gratuitas com informacao clara e participacao segura.",
  openGraph: {
    title: "Chave do Bem",
    description: "Campanhas gratuitas com informacao clara e participacao segura.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Chave do Bem",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  other: {
    "google-adsense-account": "ca-pub-2617789128311033",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <AuthBootstrap />
        <main>{children}</main>
      </body>
    </html>
  );
}
