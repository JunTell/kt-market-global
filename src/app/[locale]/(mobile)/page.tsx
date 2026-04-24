import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import HeroSection from '@/features/phone/components/HeroSection';
import ModelListContainer from '@/features/phone/components/ModelListContainer';
import Footer from '@/shared/components/layout/Footer';
import ConversionHighlights from '@/features/phone/components/ConversionHighlights';
import ChatBotWrapper from '@/features/inquiry/components/ChatBotWrapper';
import TrustStatsStrip from '@/shared/components/ui/TrustStatsStrip';
import ReviewCardList from '@/shared/components/ui/ReviewCardList';
import FAQAccordion from '@/shared/components/ui/FAQAccordion';
import PartnerLogoGrid from '@/shared/components/ui/PartnerLogoGrid';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Home' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t.has('keywords') ? (t.raw('keywords') as string[]) : [],
    robots: {
      index: true, follow: true,
      googleBot: {
        index: true, follow: true,
        'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1,
      },
    },
    openGraph: {
      title: t('og_title'),
      description: t('og_description'),
      url: `https://global.ktmarket.co.kr/${locale}`,
      siteName: 'KT Market Global',
      locale: locale === 'en' ? 'en_US' : locale,
      type: 'website',
      images: [{
        url: locale === 'en' ? '/images/og-image-en.jpg' : '/images/logo.svg',
        width: 1200, height: 630,
        alt: 'Global KT Market - Mobile Service for Foreigners',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.has('twitter_title') ? t('twitter_title') : t('og_title'),
      description: t.has('twitter_description') ? t('twitter_description') : t('og_description'),
      images: [locale === 'en' ? '/images/og-image-en.jpg' : '/images/logo.svg'],
    },
    alternates: { canonical: `https://global.ktmarket.co.kr/${locale}` },
  };
}

export default function Home() {
  const t = useTranslations();

  return (
    <main className="min-h-screen bg-white font-sans max-w-[940px] mx-auto">
      <HeroSection />
      <TrustStatsStrip />
      <ReviewCardList />

      <section id="products-section" className="px-4 py-14 md:py-20 bg-[#f4f8fc]">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#0055D4]">
            {t('Phone.ModelList.eyebrow')}
          </p>
          <h2 className="text-2xl font-bold text-[#111827] md:text-3xl">
            {t('Phone.ModelList.section_title')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-grey-600 md:text-base">
            {t('Phone.ModelList.section_desc')}
          </p>
        </div>
        <ModelListContainer sectionTitle="" planId="ppllistobj_0808" />
      </section>

      <ConversionHighlights />
      <FAQAccordion namespace="Home.FAQ" />
      <PartnerLogoGrid />

      <Footer />
      <ChatBotWrapper />
    </main>
  );
}
