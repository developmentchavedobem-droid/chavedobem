"use client";

import { useEffect, useRef } from "react";

type AdPageVisitTrackerProps = {
  slug: string;
  page: "campaign" | "description" | "instructions" | "tutorial";
  refCode?: string;
};

export default function AdPageVisitTracker({ slug, page, refCode }: AdPageVisitTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current || !slug) return;

    trackedRef.current = true;
    const cookieRef = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("chave_ref="))
      ?.split("=")[1];
    const urlRef = new URLSearchParams(window.location.search).get("ref");
    const resolvedRef = refCode || urlRef || cookieRef;

    fetch("/api/campaigns/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ slug, page, ref: resolvedRef }),
    }).then(async (response) => {
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        console.warn("Visita monetizavel nao registrada:", data || response.status);
      }
    }).catch((error) => {
      console.error("Erro ao registrar visita monetizavel:", error);
    });
  }, [slug, page, refCode]);

  return null;
}
