import { getTranslations } from 'next-intl/server';
import { CheckCircle2, ShieldCheck, Users } from 'lucide-react';
import Image from 'next/image';

export default async function HeroSection() {
  const t = await getTranslations('Home.Hero');

  return (
    <section
      className="relative flex min-h-[300px] w-full flex-col items-center justify-center overflow-hidden px-6 py-10 md:min-h-[340px] md:px-12 md:py-14"
      style={{ background: 'linear-gradient(90deg, #111C2E 0%, #0A2850 100%)' }}
    >
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at top center, rgba(0,85,212,.2) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,85,212,.6) 50%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <div className="w-full max-w-layout-max mx-auto relative z-10">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
          {/* Left: copy */}
          <div className="text-center md:text-left">
            <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
              <Badge kind="safe"><ShieldCheck className="w-3 h-3" />{t('badge_official')}</Badge>
              <Badge kind="primary"><CheckCircle2 className="w-3 h-3" />{t('badge_postpaid')}</Badge>
              <Badge kind="ghost"><Users className="w-3 h-3" />{t('badge_specialist')}</Badge>
            </div>

            <h1 className="mb-3 break-keep text-3xl font-bold leading-tight md:text-5xl text-white">
              {t('title_1')}
              <br />
              <span className="text-[#7DD3FC]">{t('title_highlight')}</span>
            </h1>
            <p className="mb-6 max-w-xl text-sm opacity-90 md:text-lg text-white">
              {t('subtitle')}
            </p>

            <div className="flex flex-col items-center md:items-start gap-3 mb-6 md:mb-0 w-full md:w-auto animate-fadeInUp">
              <a
                href="#faq-is-kt-official"
                className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 text-base md:text-lg font-bold rounded-2xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-xl w-full md:w-[280px] hover:brightness-105 hover:-translate-y-[1px] text-white"
                style={{
                  background: 'linear-gradient(135deg, #FF4D4D 0%, #FF6A3D 45%, #FFB020 100%)',
                  boxShadow: '0 10px 28px rgba(255,77,77,.35)',
                  textShadow: '0 1px 2px rgba(0,0,0,.25)',
                }}
              >
                {t('cta_check')}
              </a>
              <a
                href="#products-section"
                className="inline-flex items-center justify-center h-11 md:h-12 px-6 md:px-8 text-sm md:text-base font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer w-full md:w-[280px] border border-white/30 hover:border-white/60 hover:bg-white/10 text-white/90"
              >
                {t('cta_subscription')}
              </a>
            </div>
          </div>

          {/* Right: image */}
          <div className="relative flex justify-center md:justify-end">
            <div className="relative w-full max-w-[360px] md:max-w-[440px]">
              <div className="relative rounded-[36px] border border-white/10 bg-[rgba(255,255,255,0.06)] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur">
                <Image
                  src="/images/신분증이미지1.webp"
                  alt=""
                  width={500}
                  height={320}
                  className="w-full h-auto drop-shadow-2xl"
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 768px) 320px, 440px"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-16 flex items-center justify-center gap-2 text-sm md:text-base text-white">
          <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#34C759]" />
          <span className="font-medium">{t('no_hidden')}</span>
        </div>
      </div>
    </section>
  );
}

function Badge({ kind, children }: { kind: 'safe' | 'primary' | 'ghost'; children: React.ReactNode }) {
  const style =
    kind === 'safe'
      ? { backgroundColor: 'var(--trust-safe)', color: '#fff' }
      : kind === 'primary'
      ? { backgroundColor: 'var(--trust-primary)', color: '#fff' }
      : { backgroundColor: 'rgba(255,255,255,.1)', color: '#fff' };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold" style={style}>
      {children}
    </span>
  );
}
