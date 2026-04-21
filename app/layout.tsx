import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthBootstrap from "@/src/components/AuthBootstrap";

export const metadata: Metadata = {
  metadataBase: new URL("https://chavedobem.com"),
  title: "Chave do Bem",
  description: "Participe e ganhe prêmios!",
  openGraph: {
    title: "Chave do Bem",
    description: "Participe e ganhe prêmios!",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Chave do Bem"
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true
    }
  }
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
        <AuthBootstrap />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
