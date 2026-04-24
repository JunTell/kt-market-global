'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, Info } from 'lucide-react';
import type { WhyCheapItem } from '@/features/home/types';

export default function WhyCheapCard() {
  const t = useTranslations('Phone.WhyCheap');
  const [open, setOpen] = useState(false);

  const items = (t.raw('items') as unknown as WhyCheapItem[]) || [];
  if (items.length === 0) return null;

  return (
    <section className="rounded-[20px] border border-[#FFCC80] bg-[#FFF7ED] p-4">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 min-h-[44px]"
      >
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-[#B45309]" aria-hidden="true" />
          <span className="text-sm font-bold text-[#111827]">{t('title')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B45309]">
            {open ? t('toggle_hide') : t('toggle_show')}
          </span>
          <ChevronDown
            className={`h-5 w-5 text-[#B45309] transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </div>
      </button>

      {open && (
        <>
          {t.has('subtitle') && (
            <p className="mt-2 text-xs text-[#6B7280]">{t('subtitle')}</p>
          )}
          <ul className="mt-3 space-y-3">
            {items.map((it, i) => (
              <li key={i} className="rounded-[14px] bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#4B5563]">{it.label}</span>
                  <span className="text-sm font-bold tabular-nums text-[#FF5A3C]">{it.value}</span>
                </div>
                <p className="mt-1 text-[11px] leading-5 text-[#6B7280]">{it.note}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
