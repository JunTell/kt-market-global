'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import type { FAQItem } from '@/features/home/types';

interface Props {
  /** i18n namespace holding title/items. Defaults to 'Home.FAQ'. */
  namespace?: 'Home.FAQ' | 'Phone.FAQ';
}

export default function FAQAccordion({ namespace = 'Home.FAQ' }: Props) {
  const t = useTranslations(namespace);
  const [openId, setOpenId] = useState<string | null>(null);

  const items = (t.raw('items') as unknown as FAQItem[]) || [];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace(/^#faq-/, '');
    if (hash && items.some((it) => it.id === hash)) {
      setOpenId(hash);
      const el = document.getElementById(`faq-${hash}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) return null;

  return (
    <section
      className="bg-white px-5 py-14 md:py-20"
      aria-label={t.has('aria_region') ? t('aria_region') : 'FAQ'}
    >
      <div className="mx-auto max-w-[720px]">
        <h2 className="mb-2 text-[22px] md:text-[28px] font-bold text-[#111827]">{t('title')}</h2>
        {t.has('subtitle') && (
          <p className="mb-8 text-sm md:text-base text-[#4B5563]">{t('subtitle')}</p>
        )}
        <ul className="divide-y divide-[#E5E8EB]">
          {items.map((it) => {
            const isOpen = openId === it.id;
            return (
              <li key={it.id} id={`faq-${it.id}`}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : it.id)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left min-h-[48px]"
                >
                  <span className="text-sm md:text-base font-semibold text-[#111827] break-keep">
                    {it.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#6B7280] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="pb-4 pr-8 text-sm leading-6 text-[#4B5563] break-keep">
                    {it.a}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
