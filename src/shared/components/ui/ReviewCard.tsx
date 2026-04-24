'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { Review } from '@/features/home/types';

const AVATAR_BG = [
  '#0A2850', '#0055D4', '#2B96ED', '#FF5A3C', '#34C759',
] as const;

function pickBg(name: string) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum = (sum + name.charCodeAt(i)) | 0;
  return AVATAR_BG[Math.abs(sum) % AVATAR_BG.length];
}

function flagEmoji(countryCode: string) {
  const cc = countryCode.trim().toUpperCase();
  if (cc.length !== 2) return '';
  const A = 0x1f1e6;
  return String.fromCodePoint(A + cc.charCodeAt(0) - 65, A + cc.charCodeAt(1) - 65);
}

export default function ReviewCard({ review }: { review: Review }) {
  const [imgFailed, setImgFailed] = useState(false);
  const imgSrc = `/images/reviews/${review.id}.webp`;
  const initial = review.name.trim().charAt(0).toUpperCase();
  const bg = pickBg(review.name);
  const t = useTranslations('Home.Reviews');

  return (
    <article
      className="snap-start shrink-0 w-[280px] rounded-[20px] border border-[#E5E8EB] bg-white p-4"
      aria-label={t.has('card_aria') ? t('card_aria', { name: review.name }) : `Review by ${review.name}`}
    >
      <header className="flex items-center gap-3">
        <div
          className="relative h-10 w-10 overflow-hidden rounded-full"
          style={{ backgroundColor: imgFailed ? bg : '#F2F4F6' }}
        >
          {!imgFailed ? (
            <Image
              src={imgSrc}
              alt={review.name}
              fill
              sizes="40px"
              className="object-cover"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
              {initial}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#111827] truncate">{review.name}</p>
          <p className="text-[11px] text-[#6B7280] truncate">
            {flagEmoji(review.country_code)} {review.country_label} · {review.date}
          </p>
        </div>
      </header>

      <div className="mt-3 flex items-center gap-1 text-[#FFB020]" aria-label={t.has('rating_aria') ? t('rating_aria', { rating: review.rating }) : `Rating ${review.rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} aria-hidden="true" className={i < review.rating ? '' : 'opacity-30'}>★</span>
        ))}
      </div>

      <p className="mt-2 text-sm leading-6 text-[#4B5563] line-clamp-3 break-keep">
        {review.body}
      </p>

      <span className="mt-3 inline-block rounded-full bg-[#F4F8FC] px-2.5 py-1 text-[10px] font-semibold text-[#0055D4]">
        {review.model}
      </span>
    </article>
  );
}
