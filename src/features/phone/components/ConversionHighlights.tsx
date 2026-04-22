'use client';

import { useTranslations } from 'next-intl';
import { BadgeCheck, CreditCard, Globe2, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react';

const ICONS = [ShieldCheck, CreditCard, Globe2, PackageCheck];

export default function ConversionHighlights() {
  const t = useTranslations('Home.Conversion');

  const highlightKeys = ['item1', 'item2', 'item3', 'item4'] as const;
  const stepKeys = ['step1', 'step2', 'step3'] as const;

  return (
    <section className="relative overflow-hidden bg-[#f4f8fc] px-5 py-14 md:px-12 md:py-20">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at top left, rgba(0, 85, 212, 0.08), transparent 32%), radial-gradient(circle at bottom right, rgba(255, 176, 32, 0.12), transparent 28%)',
        }}
      />

      <div className="relative mx-auto grid w-full max-w-layout-max gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(17,28,46,0.08)] backdrop-blur md:p-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#eaf2ff] px-3 py-1.5 text-xs font-bold text-[#0055d4]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('eyebrow')}</span>
          </div>

          <h2 className="mb-3 text-2xl font-bold text-[#111827] md:text-[32px] md:leading-tight">
            {t('title')}
          </h2>
          <p className="mb-8 max-w-2xl text-sm leading-6 text-[#4b5563] md:text-base">
            {t('description')}
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {highlightKeys.map((key, index) => {
              const Icon = ICONS[index];

              return (
                <div
                  key={key}
                  className="rounded-[24px] border border-[#e5edf8] bg-[#fbfdff] p-4 shadow-sm"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#0055d4]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-1 text-sm font-bold text-[#111827] md:text-base">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="text-xs leading-5 text-[#6b7280] md:text-sm">
                    {t(`${key}.desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[32px] bg-[#0f172a] p-6 text-white shadow-[0_20px_70px_rgba(15,23,42,0.28)] md:p-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90">
            <BadgeCheck className="h-3.5 w-3.5 text-[#7dd3fc]" />
            <span>{t('journey_eyebrow')}</span>
          </div>

          <h3 className="mb-2 text-xl font-bold md:text-2xl">{t('journey_title')}</h3>
          <p className="mb-8 text-sm leading-6 text-white/70 md:text-base">
            {t('journey_description')}
          </p>

          <div className="space-y-4">
            {stepKeys.map((key, index) => (
              <div key={key} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-[#111827]">
                  {index + 1}
                </div>
                <h4 className="mb-1 text-sm font-bold md:text-base">{t(`${key}.title`)}</h4>
                <p className="text-xs leading-5 text-white/70 md:text-sm">{t(`${key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
