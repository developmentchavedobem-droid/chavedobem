'use client'
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function TrackingManager() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  useEffect(() => {
    if (ref) {
      // Salva o ID do divulgador na sessão para resgate final
      sessionStorage.setItem("campaign_ref", ref);
      console.log("Rastreio ativado para o link:", ref);
    }
  }, [ref]);

  return null;
}