import { getTranslations } from 'next-intl/server';
import type { TrustStat } from '@/features/home/types';

export default async function TrustStatsStrip() {
  const t = await getTranslations('Home.Trust');

  const items = (t.raw('stats.items') as unknown as TrustStat[]) || [];
  if (items.length === 0) return null;

  return (
    <section
      className="px-5 py-6 md:py-8"
      style={{ backgroundColor: 'var(--paper-blue)' }}
      aria-label="Trust statistics"
    >
      <div className="mx-auto grid max-w-layout-max grid-cols-3 gap-3 text-center">
        {items.map(({ id, label, value }) => (
          <div key={id} className="flex flex-col items-center">
            <span className="text-lg md:text-2xl font-bold tabular-nums text-[#111827]">
              {value}
            </span>
            <span className="mt-1 text-[10px] md:text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
