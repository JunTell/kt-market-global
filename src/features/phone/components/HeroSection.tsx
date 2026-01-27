import { useTranslations } from 'next-intl';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

/**
 * HeroSection Component
 * 
 * Purpose: Trust-First landing page hero that immediately addresses customer anxieties:
 * - Official KT Dealer status
 * - Foreigners explicitly allowed
 * - Postpaid (not prepaid) emphasis
 * - No hidden conditions transparency
 * 
 * Design: Uses Trust Theme (Dark Navy background, Official Blue accents)
 * Architecture: Server Component (static content, no client-side state)
 */
export default function HeroSection() {
    const t = useTranslations('Home.Hero');

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
                            className="text-2xl md:text-3xl font-bold leading-tight mb-4"
                            style={{ color: 'var(--trust-text-white)' }}
                        >
                            {t('title_1')}
                            <br />
                            <span style={{ color: 'var(--trust-primary)' }}>
                                {t('title_highlight')}
                            </span>
                        </h1>

                        <div className="mb-6 pl-1 border-l-4 border-trust-primary/30">
                            <p
                                className="text-xs md:text-sm font-bold mb-1"
                                style={{ color: 'var(--trust-text-gray)' }}
                            >
                                KT Official Dealer <span style={{ color: 'var(--trust-primary)' }}>KT</span>
                            </p>
                            <p
                                className="text-[10px] md:text-xs font-medium opacity-80"
                                style={{ color: 'var(--trust-text-gray)' }}
                            >
                                {t('desc')}
                            </p>
                        </div>

                        {/* CTA Button */}
                        <div className="flex justify-center md:justify-start mb-6 md:mb-0">
                            <a
                                href="#eligibility-section"
                                className="inline-flex items-center justify-center h-10 md:h-12 px-6 md:px-8 text-sm md:text-base font-bold rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                                style={{
                                    backgroundColor: 'var(--trust-accent)',
                                    color: 'var(--trust-text-white)',
                                    boxShadow: '0 4px 20px rgba(255, 59, 48, 0.4)'
                                }}
                            >
                                {t('cta_check')}
                            </a>
                        </div>
                    </div>

                    {/* Right Column: ARC Illustration */}
                    <div className="relative flex justify-center md:justify-end">
                        <div className="relative w-full max-w-[320px] md:max-w-[440px]">
                            {/* Main ARC Image */}
                            <Image
                                src="/images/신분증이미지1.png"
                                alt="Foreigner Registration Card"
                                width={500}
                                height={320}
                                className="w-full h-auto drop-shadow-2xl"
                                priority
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
