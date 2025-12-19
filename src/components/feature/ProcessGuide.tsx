'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export default function ProcessGuide() {
  const t = useTranslations('Process');

  const steps = [
    { id: 1, title: t('step1_title'), desc: t('step1_desc') },
    { id: 2, title: t('step2_title'), desc: t('step2_desc') },
    { id: 3, title: t('step3_title'), desc: t('step3_desc') },
  ];

  const badges = ['badge1', 'badge2', 'badge3'];

  return (
    <section className="py-10 px-5 bg-background-alt">
      <h2 
        className="text-xl font-bold text-label-900 mb-8 whitespace-pre-line leading-tight text-center"
        dangerouslySetInnerHTML={{ __html: t.raw('title') }}
      />

      {/* Steps */}
      <div className="space-y-3 mb-12">
        {steps.map((step) => (
          <div 
            key={step.id} 
            // 원이 60px이므로 전체 카드 높이는 자연스럽게 늘어납니다 (padding 포함 약 76~80px)
            className="bg-background rounded-[32px] py-2 px-3 flex items-center gap-4 shadow-sm border border-line-200/50"
          >
            {/* ✅ STEP Circle: 60px로 수정 */}
            <div className="shrink-0 w-[60px] h-[60px] rounded-full bg-[#5681E8] text-white flex flex-col items-center justify-center shadow-sm leading-none">
              <span className="text-[11px] font-medium opacity-90 mb-0.5">STEP</span>
              <span className="text-xl font-bold">{step.id}</span>
            </div>
            
            {/* Text Content */}
            <div className="flex-1 py-1">
              <h3 className="font-bold text-sm text-label-900 mb-1 leading-none">
                {step.title}
              </h3>
              <p className="text-[11px] text-label-500 whitespace-pre-line leading-tight">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Badges: 100px 유지 */}
      <div className="flex justify-center gap-3">
        {badges.map((badge, idx) => {
          let badgeStyle = "";
          if (idx === 0) badgeStyle = "bg-background border-[2.5px] border-[#5681E8] text-label-900"; 
          else if (idx === 1) badgeStyle = "bg-[#A9AFB9] text-white border-none"; 
          else if (idx === 2) badgeStyle = "bg-[#4A7AFF] text-white border-none"; 

          return (
            <div 
              key={badge} 
              className={cn(
                "flex flex-col items-center justify-center rounded-full shadow-md text-center p-2 shrink-0",
                badgeStyle
              )}
              style={{ width: '100px', height: '100px' }} 
            >
              <span className={cn(
                "text-[13px] font-bold leading-snug break-keep whitespace-pre-line",
                idx === 0 ? "text-label-900" : "text-white"
              )}>
                {t(`${badge}`)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}