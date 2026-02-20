"use client";

import Image from "next/image";
import Link from "next/link";

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
          <Link href="/participe" key={index} className="cursor-pointer">
            <Image
              priority
              src={src}
              alt={`carousel-${index}`}
              width={200}
              height={120}
              className="mx-4"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
