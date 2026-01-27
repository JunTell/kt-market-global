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
            className="relative w-full min-h-[500px] md:min-h-[600px] flex flex-col items-center justify-center px-6 md:px-12 py-12 md:py-24 overflow-hidden"
            style={{
                backgroundColor: 'var(--trust-bg-900)'
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center md:text-left">
                        {/* Trust Badges */}
                        <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
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

                        <h1
                            className="text-3xl md:text-5xl font-bold leading-tight mb-6"
                            style={{ color: 'var(--trust-text-white)' }}
                        >
                            {t('title_1')}
                            <br />
                            <span style={{ color: 'var(--trust-primary)' }}>
                                {t('title_highlight')}
                            </span>
                        </h1>

                        <p
                            className="text-base md:text-lg leading-relaxed mb-10"
                            style={{ color: 'var(--trust-text-gray)' }}
                        >
                            {t('desc')}
                        </p>

                        {/* CTA Button */}
                        <div className="flex justify-center md:justify-start mb-8 md:mb-0">
                            <a
                                href="#eligibility-section"
                                className="inline-flex items-center justify-center h-14 md:h-16 px-8 md:px-12 text-lg md:text-xl font-bold rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
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

                    {/* Right Column: Features Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        {/* Feature 1 */}
                        <div
                            className="p-5 md:p-6 rounded-2xl border border-white/5"
                            style={{ backgroundColor: 'var(--trust-bg-800)' }}
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-trust-safe/10">
                                    <CheckCircle2
                                        className="w-5 h-5 md:w-6 md:h-6"
                                        style={{ color: 'var(--trust-safe)' }}
                                    />
                                </div>
                                <div>
                                    <h3
                                        className="font-bold text-base md:text-lg mb-1"
                                        style={{ color: 'var(--trust-text-white)' }}
                                    >
                                        {t('feat1_title')}
                                    </h3>
                                    <p
                                        className="text-sm md:text-base opacity-80"
                                        style={{ color: 'var(--trust-text-gray)' }}
                                    >
                                        {t('feat1_desc')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div
                            className="p-5 md:p-6 rounded-2xl border border-white/5"
                            style={{ backgroundColor: 'var(--trust-bg-800)' }}
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-trust-safe/10">
                                    <CheckCircle2
                                        className="w-5 h-5 md:w-6 md:h-6"
                                        style={{ color: 'var(--trust-safe)' }}
                                    />
                                </div>
                                <div>
                                    <h3
                                        className="font-bold text-base md:text-lg mb-1"
                                        style={{ color: 'var(--trust-text-white)' }}
                                    >
                                        {t('feat2_title')}
                                    </h3>
                                    <p
                                        className="text-sm md:text-base opacity-80"
                                        style={{ color: 'var(--trust-text-gray)' }}
                                    >
                                        {t('feat2_desc')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div
                            className="p-5 md:p-6 rounded-2xl border border-white/5"
                            style={{ backgroundColor: 'var(--trust-bg-800)' }}
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-trust-safe/10">
                                    <CheckCircle2
                                        className="w-5 h-5 md:w-6 md:h-6"
                                        style={{ color: 'var(--trust-safe)' }}
                                    />
                                </div>
                                <div>
                                    <h3
                                        className="font-bold text-base md:text-lg mb-1"
                                        style={{ color: 'var(--trust-text-white)' }}
                                    >
                                        {t('feat3_title')}
                                    </h3>
                                    <p
                                        className="text-sm md:text-base opacity-80"
                                        style={{ color: 'var(--trust-text-gray)' }}
                                    >
                                        {t('feat3_desc')}
                                    </p>
                                </div>
                            </div>
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
