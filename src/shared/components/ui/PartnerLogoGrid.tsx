import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

const LOGOS = [
  { slug: 'kt',        altKey: 'partners_alt.kt' },
  { slug: 'samsung',   altKey: 'partners_alt.samsung' },
  { slug: 'apple',     altKey: 'partners_alt.apple' },
  { slug: 'kakaopay',  altKey: 'partners_alt.kakaopay' },
  { slug: 'tta',       altKey: 'partners_alt.tta' },
] as const;

export default async function PartnerLogoGrid() {
  const t = await getTranslations('Home.Trust');
  const title = t.has('partners_title') ? t('partners_title') : 'Trusted partners';

  return (
    <section
      className="px-5 py-10 md:py-14"
      style={{ backgroundColor: 'var(--paper-blue)' }}
      aria-label={t.has('partners_aria') ? t('partners_aria') : 'Partner logos'}
    >
      <div className="mx-auto max-w-layout-max">
        <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
          {title}
        </p>
        <ul className="grid grid-cols-3 items-center gap-4 md:grid-cols-5 md:gap-8">
          {LOGOS.map(({ slug, altKey }) => {
            const alt = t.has(altKey) ? t(altKey) : slug;
            return (
              <li key={slug} className="flex items-center justify-center">
                {/* fallback for missing SVG files handled in Phase 4 */}
                <Image
                  src={`/images/partners/${slug}.svg`}
                  alt={alt}
                  width={96}
                  height={28}
                  className="h-7 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
