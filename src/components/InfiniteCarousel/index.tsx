"use client";

import Image from "next/image";
import Link from "next/link";

interface CarouselItem {
  imageUrl: string;
  slug: string;
}

interface Props {
  items: CarouselItem[];
  speed?: number;
}

export default function InfiniteCarousel({ items, speed = 25 }: Props) {
  if (!items || items.length === 0) return null;
  
  const carouselItems = items.length < 5 ? [...items, ...items, ...items] : [...items, ...items];

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex w-max animate-scroll"
        style={{ animationDuration: `${speed}s` }}
      >
        {carouselItems.map((item, index) => (
          <Link 
            href={`/campanha/${item.slug}`} 
            key={`${item.slug}-${index}`} 
            className="mx-4 block transition-transform hover:scale-105 shrink-0"
          >
            <Image
              src={item.imageUrl || "/placeholder.png"}
              alt="Campanha"
              width={220}
              height={130}
              className="rounded-xl shadow-md object-cover h-[120px] w-[220px]"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}