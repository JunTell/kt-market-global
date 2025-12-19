'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';

export default function TargetAudience() {
  const t = useTranslations('Target');
  const checks = ['check1', 'check2', 'check3', 'check4'];

  return (
    <section className="py-12 px-5 bg-label-900 text-label-100">
      <h2 className="text-xl font-bold mb-6 whitespace-pre-line leading-tight">
        {t.raw('title')}
      </h2>

      <div className="space-y-3 mb-8">
        {checks.map((key) => (
          <div key={key} className="flex items-center gap-3 bg-white/10 p-3.5 rounded-xl border border-white/5">
            <CheckCircle2 className="text-secondary shrink-0" size={20} />
            <span className="text-sm font-medium leading-snug">{t(key)}</span>
          </div>
        ))}
      </div>

      <div className="bg-primary rounded-xl p-4 text-center shadow-lg shadow-primary/30">
        <p className="text-sm font-bold leading-relaxed">
          {t('footer')}
        </p>
      </div>
    </section>
  );
}