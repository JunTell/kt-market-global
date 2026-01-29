import { getTranslations } from 'next-intl/server';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default async function HeroSection() {
    const t = await getTranslations('Home.Hero');

    return (
        <section
            className="relative w-full min-h-[300px] md:min-h-[340px] flex flex-col items-center justify-center px-6 md:px-12 py-8 md:py-10 overflow-hidden"
            style={{
                background: 'linear-gradient(90deg, #111C2E 0%, #0A2850 100%)'
            }}
        >
            {/* Premium Grid Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                    pointerEvents: 'none'
                }}
            />

            {/* Radial Gradient Accent - KT Blue */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    background: 'radial-gradient(ellipse at top center, rgba(0, 85, 212, 0.2) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }}
            />

            {/* Subtle Top Border Glow */}
            <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(0, 85, 212, 0.6) 50%, transparent 100%)',
                    pointerEvents: 'none'
                }}
            />

            {/* Responsive Container */}
            <div className="w-full max-w-layout-max mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center md:text-left">
                        {/* Trust Badges */}
                        <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                            <div
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold"
                                style={{
                                    backgroundColor: 'var(--trust-safe)',
                                    color: 'var(--trust-text-white)'
                                }}
                            >
                                <ShieldCheck className="w-3 h-3" />
                                <span>{t('badge_official')}</span>
                            </div>

                            <div
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold"
                                style={{
                                    backgroundColor: 'var(--trust-primary)',
                                    color: 'var(--trust-text-white)'
                                }}
                            >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{t('badge_postpaid')}</span>
                            </div>
                        </div>

                        <h1
                            className="text-2xl md:text-3xl font-bold leading-tight mb-2"
                            style={{ color: 'var(--trust-text-white)' }}
                        >
                            {t('title_1')}
                            <br />
                            <span style={{ color: 'var(--trust-primary)' }}>
                                {t('title_highlight')}
                            </span>
                        </h1>
                        <p className="text-sm md:text-lg mb-6 opacity-90" style={{ color: 'var(--trust-text-white)' }}>
                            {t('subtitle')}
                        </p>

                        <div className="mb-6 pl-1 border-l-4 border-trust-primary/30">
                            <p
                                className="text-xs md:text-sm font-bold mb-1"
                                style={{ color: 'var(--trust-text-gray)' }}
                            >
                                {t('trust_line')}
                            </p>
                            <p
                                className="text-[10px] md:text-xs font-medium opacity-80"
                                style={{ color: 'var(--trust-text-gray)' }}
                            >
                                {t('desc')}
                            </p>
                        </div>

                        <div className="flex flex-col items-center md:items-start gap-4 mb-6 md:mb-0 w-full md:w-auto animate-fadeInUp">
                            <a
                                href="#eligibility-section"
                                className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 text-base md:text-lg font-bold rounded-2xl
                                           transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-xl w-full md:w-[280px]
                                           hover:brightness-105 hover:shadow-[0_14px_36px_rgba(255,77,77,0.45)] hover:-translate-y-[1px]"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #FF4D4D 0%, #FF6A3D 45%, #FFB020 100%)",
                                    color: "var(--trust-text-white)",
                                    boxShadow: "0 10px 28px rgba(255, 77, 77, 0.35)",
                                    textShadow: "0 1px 2px rgba(0,0,0,0.25)",
                                }}
                            >
                                {t("cta_check")}
                            </a>

                            <a
                                href="#products-section"
                                className="inline-flex items-center justify-center h-10 md:h-12 px-6 md:px-8 text-sm md:text-base font-medium rounded-xl
                                           transition-all duration-200 hover:bg-white/10 active:scale-[0.98] cursor-pointer w-full md:w-[280px]"
                                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                            >
                                <span className="border-b border-current pb-0.5">{t("cta_subscription")}</span>
                            </a>
                        </div>
                    </div>

                    {/* Right Column: ARC Illustration */}
                    <div className="relative flex justify-center md:justify-end">
                        <div className="relative w-full max-w-[320px] md:max-w-[440px]">
                            {/* Main ARC Image */}
                            <Image
                                src="/images/신분증이미지1.webp"
                                alt="Foreigner Registration Card"
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

                {/* No Hidden Conditions Badge - Bottom */}
                <div className="mt-10 md:mt-16 flex items-center justify-center gap-2 text-sm md:text-base" style={{ color: 'var(--trust-text-gray)' }}>
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--trust-safe)' }} />
                    <span className="font-medium">{t('no_hidden')}</span>
                </div>
            </div>
        </section>
    );
}
