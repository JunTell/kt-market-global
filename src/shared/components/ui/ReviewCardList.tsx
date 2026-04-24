'use client';

import { useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { Review } from '@/features/home/types';
import ReviewCard from './ReviewCard';

interface Props {
  items?: Review[];
  filterModel?: string;
  /** If true, render as a grid fallback when items.length < 3 */
  autoGrid?: boolean;
}

export default function ReviewCardList({ items, filterModel, autoGrid = true }: Props) {
  const t = useTranslations('Home.Reviews');
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const raw = (items ?? (t.raw('items') as unknown as Review[])) || [];
  const filtered = filterModel
    ? raw.filter((r) => r.model.toLowerCase() === filterModel.toLowerCase())
    : raw;

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!scrollerRef.current) return;
    if (e.key === 'ArrowRight') scrollerRef.current.scrollBy({ left: 292, behavior: 'smooth' });
    if (e.key === 'ArrowLeft')  scrollerRef.current.scrollBy({ left: -292, behavior: 'smooth' });
  }, []);

  if (filtered.length === 0) return null;

  const shouldGrid = autoGrid && filtered.length < 3;

  return (
    <section
      className="bg-white px-5 py-14 md:py-20"
      aria-label={t.has('section_aria') ? t('section_aria') : 'Customer reviews'}
    >
      <div className="mx-auto max-w-layout-max">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFB020]">
          {t.has('summary') ? t('summary') : '★★★★★'}
        </p>
        <h2 className="text-[22px] md:text-[28px] font-bold text-[#111827]">{t('title')}</h2>
        {t.has('subtitle') && (
          <p className="mt-2 text-sm md:text-base text-[#4B5563]">{t('subtitle')}</p>
        )}

        {shouldGrid ? (
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {filtered.map((r) => <ReviewCard key={r.id} review={r} />)}
          </div>
        ) : (
          <div
            ref={scrollerRef}
            tabIndex={0}
            role="group"
            aria-label={t.has('scroller_aria') ? t('scroller_aria') : 'Review list — use left/right arrow keys to scroll'}
            onKeyDown={onKeyDown}
            className="scrollbar-hide mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto outline-none focus:ring-2 focus:ring-[#0055D4]/40 rounded-[20px]"
          >
            {filtered.map((r) => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}
      </div>
    </section>
  );
}
