"use client";

import { useEffect } from "react";

// 1. Definição global para o TypeScript reconhecer o objeto do Google
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

type AdSenseBlockProps = {
  slot: string;
  format?: "auto" | "fluid" | "rectangle";
  responsive?: "true" | "false";
};

export default function AdSenseBlock({ 
  slot, 
  format = "auto", 
  responsive = "true" 
}: AdSenseBlockProps) {
  
  useEffect(() => {
    try {
      // Agora o TS reconhece window.adsbygoogle
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className="my-6 flex justify-center w-full overflow-hidden min-h-25 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-2617789128311033"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}