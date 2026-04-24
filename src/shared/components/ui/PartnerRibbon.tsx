import { getTranslations } from 'next-intl/server';

export default async function PartnerRibbon() {
  const t = await getTranslations('Home.Trust');

  if (!t.has('ribbon')) return null;

  const full = t('ribbon');
  const short = t.has('ribbon_short') ? t('ribbon_short') : full;

  return (
    <div
      className="flex h-6 items-center justify-center text-[11px] font-semibold leading-none text-[#7DD3FC]"
      style={{ backgroundColor: 'var(--trust-bg-900)' }}
      role="note"
    >
      <span className="sm:hidden px-3 truncate">{short}</span>
      <span className="hidden sm:inline px-4 truncate">{full}</span>
    </div>
  );
}
