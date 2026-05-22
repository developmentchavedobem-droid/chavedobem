'use client'

import type React from "react";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";
// import AdOverlay from "@/src/components/AdOverlay";

interface Props {
  nextStepUrl: string;
  label: string;
  className?: string;
  showIcon?: boolean;
}

export default function NextStepButton({ nextStepUrl, label, className, showIcon }: Props) {
  // const [showAd, setShowAd] = useState(false);
  const router = useRouter();

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(nextStepUrl);
  };

  // const onAdClose = () => {
  //   setShowAd(false);
  //   router.push(nextStepUrl);
  // };

  return (
    <>
      {/* <AdOverlay isOpen={showAd} onClose={onAdClose} /> */}
      <button onClick={handleAction} className={className}>
        {label} {showIcon && <FaArrowRight />}
      </button>
    </>
  );
}
