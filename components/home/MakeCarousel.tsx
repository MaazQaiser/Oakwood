"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { getMakeUrl } from "@/config/routes";

const MAKE_IMAGES: Record<string, string> = {
  audi: "/images/makes/audi.png",
  bmw: "/images/makes/bmw.png",
  ford: "/images/makes/ford.png",
  "mercedes-benz": "/images/makes/mercedes.png",
  volkswagen: "/images/makes/volkswagen.png",
  toyota: "/images/makes/toyota.png",
  hyundai: "/images/makes/hyundai.png",
  vauxhall: "/images/makes/vauxhall.png",
  nissan: "/images/makes/nissan.png",
  kia: "/images/makes/kia.png",
};

const MAKE_LOGOS: Record<string, string> = {
  audi: "/images/brand-logos/audi.png",
  bmw: "/images/brand-logos/bmw.png",
  ford: "/images/brand-logos/ford.png",
  "mercedes-benz": "/images/brand-logos/mercedes.png",
  volkswagen: "/images/brand-logos/volkswagen.png",
  toyota: "/images/brand-logos/toyota.png",
  hyundai: "/images/brand-logos/hyundai.png",
  vauxhall: "/images/brand-logos/vauxhall.png",
  nissan: "/images/brand-logos/nissan.png",
  kia: "/images/brand-logos/kia.png",
};

function MakeLogo({ slug }: { slug: string }) {
  const src = MAKE_LOGOS[slug];
  if (!src) return null;

  return (
    <span className="relative mx-auto block h-7 w-14">
      <Image src={src} alt="" fill sizes="56px" className="object-contain" />
    </span>
  );
}

export function MakeCarousel({
  makes,
}: {
  makes: { slug: string; name: string }[];
}) {
  const scroller = useRef<HTMLUListElement>(null);

  function scrollByPage(direction: -1 | 1) {
    const node = scroller.current;
    if (!node) return;
    const distance = Math.round(node.clientWidth * 0.6) * direction;
    node.scrollTo({ left: node.scrollLeft + distance, behavior: "smooth" });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-h3 text-ink">Browse by make</h2>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Show previous makes"
            onClick={() => scrollByPage(-1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-ink hover:bg-page-tint"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <path d="M14.5 6 8.5 12l6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Show next makes"
            onClick={() => scrollByPage(1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-ink hover:bg-page-tint"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <path d="m9.5 6 6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <ul
        ref={scroller}
        className="mt-8 flex gap-2 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {makes.map((make) => (
            <li key={make.slug} className="w-[9.5rem] shrink-0 sm:w-[10.5rem] lg:w-auto lg:min-w-0 lg:flex-1">
            <Link
              href={getMakeUrl(make.name)}
              className="flex flex-col items-center px-2 py-3 text-center no-underline"
            >
              <MakeLogo slug={make.slug} />
              <span className="mt-2 text-[0.95rem] font-medium text-ink">{make.name}</span>
              <span className="relative mt-3 block h-16 w-full">
                <Image
                  src={MAKE_IMAGES[make.slug] ?? "/images/vehicle-side.svg"}
                  alt=""
                  fill
                  sizes="168px"
                  className="object-contain object-bottom"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
