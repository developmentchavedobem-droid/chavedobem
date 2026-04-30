"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import AdSenseBlock from "@/src/components/AdsenseBlock";

interface AdOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdOverlay({ isOpen, onClose }: AdOverlayProps) {
  const [status, setStatus] = useState<"loading" | "filled">("loading");

  useEffect(() => {
    if (!isOpen || status !== "loading") return;

    const fallbackTimer = window.setTimeout(onClose, 3500);

    return () => window.clearTimeout(fallbackTimer);
  }, [isOpen, onClose, status]);

  useEffect(() => {
    if (isOpen) setStatus("loading");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex h-screen w-screen items-center justify-center animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {status === "filled" && (
        <button
          onClick={onClose}
          aria-label="Fechar anuncio"
          className="absolute left-6 top-6 z-[110] rounded-full border border-white/20 bg-white/10 p-3 text-white transition-all hover:bg-white/20"
        >
          <IoClose size={32} />
        </button>
      )}

      <div className="relative z-[110] flex aspect-[3/4] w-[90%] max-w-[400px] items-center justify-center overflow-hidden rounded-3xl bg-white p-4 shadow-2xl sm:aspect-square">
        {status === "loading" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white text-center">
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-[#053B80]" />
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
              Carregando
            </p>
          </div>
        )}

        <AdSenseBlock
          className={`h-full min-h-64 transition-opacity ${
            status === "filled" ? "opacity-100" : "opacity-0"
          }`}
          onStatusChange={(adStatus) => {
            if (adStatus === "filled") {
              setStatus("filled");
              return;
            }

            onClose();
          }}
        />
      </div>
    </div>
  );
}
