'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';

export default function WhyChooseUs() {
  const t = useTranslations('WhyUs');
  const checks = ['check1', 'check2', 'check3', 'check4', 'check5'];

  return (
    <section className="py-10 px-5 bg-background-alt">
      <h2 className="text-xl font-bold text-label-900 mb-6 whitespace-pre-line leading-tight text-center">
        {t.raw('title')}
      </h2>

      <div className="space-y-2.5 mb-8">
        {checks.map((key) => (
          <div key={key} className="flex items-center gap-3 bg-background p-3.5 rounded-xl shadow-sm border border-line-200">
            <CheckCircle2 className="text-label-100 shrink-0" size={18} fill="currentColor" /> 
            {/* Lucide 아이콘 색상 조정: fill은 내부, text는 테두리 */}
            <div className="relative">
                <CheckCircle2 className="text-primary" size={20} />
            </div>
            <span className="text-sm font-medium text-label-800">{t(key)}</span>
          </div>
        ))}
      </div>

      <div className="bg-secondary rounded-xl p-4 text-center text-label-100 shadow-md">
        <p className="text-sm font-bold whitespace-pre-line leading-relaxed">
          {t('footer')}
        </p>
      </div>
    </section>
  );
}