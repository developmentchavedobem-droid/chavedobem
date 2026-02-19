"use client";

import Image from "next/image";

interface Props {
  images: string[];
  speed?: number; // duração da animação
}

export default function InfiniteCarousel({ images, speed = 20 }: Props) {
  const duplicated = [...images, ...images];

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex w-max animate-scroll"
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {duplicated.map((src, index) => (
          <Image
            key={index}
            priority
            src={src}
            alt={`carousel-${index}`}
            width={200}
            height={120}
            className="mx-4"
          />
        ))}
      </div>
    </div>
  );
}
