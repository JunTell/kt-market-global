import { useTranslations } from 'next-intl';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

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
            className="relative w-full min-h-[600px] flex flex-col items-center justify-center px-6 md:px-12 py-16 md:py-20 overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #1a2d4a 0%, #0f1b2e 50%, #0a1628 100%)'
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

            {/* Diagonal Accent Overlay */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    background: 'linear-gradient(135deg, rgba(0, 85, 212, 0.1) 0%, transparent 50%)',
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
            <div className="w-full max-w-7xl mx-auto relative z-10">
                {/* Trust Badges - Top */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {/* KT Official Partner Badge */}
                    <div
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                        style={{
                            backgroundColor: 'var(--trust-safe)',
                            color: 'var(--trust-text-white)'
                        }}
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{t('badge_official')}</span>
                    </div>

                    {/* Postpaid Only Badge */}
                    <div
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                        style={{
                            backgroundColor: 'var(--trust-primary)',
                            color: 'var(--trust-text-white)'
                        }}
                    >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('badge_postpaid')}</span>
                    </div>
                </div>

                {/* Main Headline */}
                <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12">
                    <h1
                        className="text-3xl font-bold leading-tight mb-4"
                        style={{ color: 'var(--trust-text-white)' }}
                    >
                        {t('title_1')}
                        <br />
                        <span style={{ color: 'var(--trust-primary)' }}>
                            {t('title_highlight')}
                        </span>
                    </h1>

                    <p
                        className="text-base leading-relaxed"
                        style={{ color: 'var(--trust-text-gray)' }}
                    >
                        {t('desc')}
                    </p>
                </div>

                {/* Trust Features Grid */}
                <div className="grid grid-cols-1 gap-4 max-w-6xl mx-auto mb-10 md:mb-14">
                    {/* Feature 1: No Prepaid */}
                    <div
                        className="p-5 md:p-6 rounded-xl"
                        style={{ backgroundColor: 'var(--trust-bg-800)' }}
                    >
                        <div className="flex items-start gap-3">
                            <CheckCircle2
                                className="w-5 h-5 md:w-6 md:h-6"
                                style={{ color: 'var(--trust-safe)', flexShrink: 0, marginTop: '2px' }}
                            />
                            <div>
                                <h3
                                    className="font-bold text-base mb-1"
                                    style={{ color: 'var(--trust-text-white)' }}
                                >
                                    {t('feat1_title')}
                                </h3>
                                <p
                                    className="text-sm"
                                    style={{ color: 'var(--trust-text-gray)' }}
                                >
                                    {t('feat1_desc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2: Installments Available */}
                    <div
                        className="p-5 md:p-6 rounded-xl"
                        style={{ backgroundColor: 'var(--trust-bg-800)' }}
                    >
                        <div className="flex items-start gap-3">
                            <CheckCircle2
                                className="w-5 h-5 md:w-6 md:h-6"
                                style={{ color: 'var(--trust-safe)', flexShrink: 0, marginTop: '2px' }}
                            />
                            <div>
                                <h3
                                    className="font-bold text-base mb-1"
                                    style={{ color: 'var(--trust-text-white)' }}
                                >
                                    {t('feat2_title')}
                                </h3>
                                <p
                                    className="text-sm"
                                    style={{ color: 'var(--trust-text-gray)' }}
                                >
                                    {t('feat2_desc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Feature 3: Multi-language Support */}
                    <div
                        className="p-5 md:p-6 rounded-xl"
                        style={{ backgroundColor: 'var(--trust-bg-800)' }}
                    >
                        <div className="flex items-start gap-3">
                            <CheckCircle2
                                className="w-5 h-5 md:w-6 md:h-6"
                                style={{ color: 'var(--trust-safe)', flexShrink: 0, marginTop: '2px' }}
                            />
                            <div>
                                <h3
                                    className="font-bold text-base mb-1"
                                    style={{ color: 'var(--trust-text-white)' }}
                                >
                                    {t('feat3_title')}
                                </h3>
                                <p
                                    className="text-sm"
                                    style={{ color: 'var(--trust-text-gray)' }}
                                >
                                    {t('feat3_desc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="flex justify-center">
                    <a
                        href="#eligibility-section"
                        className="inline-flex items-center justify-center h-14 md:h-16 px-8 md:px-12 text-lg md:text-xl font-bold rounded-lg transition-all hover:opacity-90 cursor-pointer"
                        style={{
                            backgroundColor: 'var(--trust-accent)',
                            color: 'var(--trust-text-white)',
                            boxShadow: '0 4px 20px rgba(255, 59, 48, 0.3)'
                        }}
                    >
                        {t('cta_check')}
                    </a>
                </div>

                {/* No Hidden Conditions Badge - Bottom */}
                <div className="mt-6 md:mt-8 flex items-center justify-center gap-2 text-sm md:text-base" style={{ color: 'var(--trust-text-gray)' }}>
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--trust-safe)' }} />
                    <span>{t('no_hidden')}</span>
                </div>
            </div>
        </section>
    );
}
