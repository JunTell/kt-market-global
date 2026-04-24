'use client';

import { useRef } from 'react';
import Image from 'next/image';

interface Props {
  urls: string[];
  altBase?: string;
  className?: string;
}

/**
 * Single-scroll product gallery: 1 main image + thumbnail strip.
 * Clicking a thumbnail scrolls the main viewport via scroll-snap.
 * Replaces JunCarousel on /phone. JunCarousel is kept elsewhere.
 */
export default function ProductImageCarousel({ urls, altBase = 'Product image', className = '' }: Props) {
  const mainRef = useRef<HTMLDivElement | null>(null);

  if (!urls || urls.length === 0) {
    return (
      <div className={`w-full aspect-[4/3] rounded-[20px] bg-[#F2F4F6] ${className}`} aria-hidden="true" />
    );
  }

  const scrollToIndex = (i: number) => {
    const el = mainRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={mainRef}
        className="scrollbar-hide flex w-full snap-x snap-mandatory overflow-x-auto rounded-[20px] bg-[#F9FAFB]"
        tabIndex={0}
        role="group"
        aria-label={`${altBase} gallery`}
      >
        {urls.map((url, i) => (
          <div key={i} className="relative aspect-[4/3] w-full shrink-0 snap-start">
            <Image
              src={url}
              alt={`${altBase} ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 440px"
              className="object-contain p-6"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {urls.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {urls.map((url, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => scrollToIndex(i)}
                className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-[12px] border border-[#E5E8EB] bg-white"
                aria-label={`${altBase} thumbnail ${i + 1}`}
              >
                <Image src={url} alt="" fill sizes="56px" className="object-contain p-1" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
