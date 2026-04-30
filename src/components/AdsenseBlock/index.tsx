"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

type AdSenseBlockProps = {
  slot?: string;
  format?: "auto" | "fluid" | "rectangle";
  responsive?: "true" | "false";
  className?: string;
  onStatusChange?: (status: "filled" | "unfilled") => void;
};

export default function AdSenseBlock({
  slot = "4045778130",
  format = "auto",
  responsive = "true",
  className = "my-6 min-h-25",
  onStatusChange,
}: AdSenseBlockProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);
  const onStatusChangeRef = useRef(onStatusChange);

  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    const adElement = adRef.current;
    if (!adElement) return;

    const observer = new MutationObserver(() => {
      const status = adElement.getAttribute("data-ad-status");
      if (status === "filled" || status === "unfilled") {
        onStatusChangeRef.current?.(status);
      }
    });

    observer.observe(adElement, {
      attributes: true,
      attributeFilter: ["data-ad-status"],
    });

    if (!pushedRef.current) {
      pushedRef.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("AdSense error:", err);
        }
      }
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <ins
        ref={adRef}
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
