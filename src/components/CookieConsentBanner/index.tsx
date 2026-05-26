"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "chavedobem_cookie_consent";

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsVisible(localStorage.getItem(STORAGE_KEY) !== "accepted");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function acceptCookies() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setIsVisible(false);
  }

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[120] border-t border-zinc-200 bg-white px-5 py-4 shadow-2xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-6 text-zinc-700">
          Usamos cookies essenciais e tecnologias semelhantes para manter o site
          funcionando, melhorar a navegacao, medir audiencia e exibir
          publicidade. Ao continuar, voce concorda com nossa{" "}
          <Link href="/politica-privacidade" className="font-bold text-[#053B80] underline">
            Politica de Privacidade
          </Link>{" "}
          e com os{" "}
          <Link href="/termos-uso" className="font-bold text-[#053B80] underline">
            Termos de Uso
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={acceptCookies}
          className="btn btn-theme-primary shrink-0 rounded-xl px-6"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
