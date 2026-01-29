import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import HeroSection from '@/features/phone/components/HeroSection';
import ModelListContainer from '@/features/phone/components/ModelListContainer';
import Footer from '@/shared/components/layout/Footer';
import EligibilityCheckerWrapper from '@/features/phone/components/EligibilityCheckerWrapper';

// Dynamic Imports for Heavy Client Components - SSR enabled for Server Component compatibility
const ProcessFlow = dynamic(() => import('@/features/phone/components/ProcessFlow'), { ssr: true });
const ProcessGuide = dynamic(() => import('@/features/phone/components/ProcessGuide'), { ssr: true });
const TargetAudience = dynamic(() => import('@/features/phone/components/TargetAudience'), { ssr: true });
const WhyChooseUs = dynamic(() => import('@/features/phone/components/WhyChooseUs'), { ssr: true });
const Notice = dynamic(() => import('@/features/phone/components/Notice').then(mod => mod.Notice), { ssr: true });
import ChatBotWrapper from '@/features/inquiry/components/ChatBotWrapper';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Home' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t.has('keywords') ? (t.raw('keywords') as string[]) : [],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: t('og_title'),
      description: t('og_description'),
      url: `https://global.ktmarket.co.kr/${locale}`,
      siteName: 'KT Market Global',
      locale: locale === 'en' ? 'en_US' : locale,
      type: 'website',
      images: [
        {
          url: locale === 'en' ? '/images/og-image-en.jpg' : '/images/logo.svg',
          width: 1200,
          height: 630,
          alt: 'Global KT Market - Mobile Service for Foreigners',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.has('twitter_title') ? t('twitter_title') : t('og_title'),
      description: t.has('twitter_description') ? t('twitter_description') : t('og_description'),
      images: [locale === 'en' ? '/images/og-image-en.jpg' : '/images/logo.svg'],
    },
    alternates: {
      canonical: `https://global.ktmarket.co.kr/${locale}`,
    },
  };
}

export default function Home() {
  const t = useTranslations();

  return (
    <main className="min-h-screen bg-white font-sans max-w-[940px] mx-auto">
      {/* Trust-First: Hero Section at Top */}
      <HeroSection />

      {/* Short Brand Description */}
      <section className="py-8 px-6 md:px-12 bg-white text-center border-b border-grey-50">
        <p className="text-xs md:text-sm text-grey-500 max-w-2xl mx-auto leading-relaxed font-medium">
          {t('Home.Brand.description')}
        </p>
      </section>

      {/* Trust Building: Why Choose Us */}
      <WhyChooseUs />
      {/* Eligibility Checker */}
      <section
        id="eligibility-section"
        className="py-10 md:py-16 bg-base px-4 md:px-12 border-y border-grey-200"
      >
        <div className="w-full max-w-layout-max mx-auto">
          <div className="max-w-md mx-auto text-center mb-6 md:mb-8">
            <span className="text-primary font-bold tracking-wider uppercase text-[10px] md:text-xs mb-1.5 block">
              {t('Home.Eligibility.badge')}
            </span>
            <h2 className="text-xl md:text-3xl font-bold text-grey-900 mb-2 md:mb-3">
              {t('Home.Eligibility.title')}
            </h2>
            <p className="text-grey-700 text-xs md:text-sm whitespace-pre-line leading-relaxed">
              {t('Home.Eligibility.desc')}
            </p>
          </div>
          <EligibilityCheckerWrapper />
        </div>
      </section>
      {/* Price Information LAST (Trust-First Strategy) */}
      <div id="products-section" className="px-4 py-10">
        <ModelListContainer
          sectionTitle={t('Phone.ModelList.section_title')}
          planId="ppllistobj_0808"
        />
      </div>
      {/* Target Audience */}
      <TargetAudience />

      <ProcessGuide />

      {/* Process Transparency */}
      <div className="py-12 md:py-20">
        <ProcessFlow />
      </div>

      {/* Notice Section */}
      <Notice
        title={t('Main.Notice.section_title')}
        items={[
          {
            title: t('Main.Notice.common_title'),
            content: t('Main.Notice.common_content')
          },
          {
            title: t('Main.Notice.kt_subsidy_title'),
            content: t('Main.Notice.kt_subsidy_content')
          },
          {
            title: t('Main.Notice.public_subsidy_title'),
            content: t('Main.Notice.public_subsidy_content')
          },
          {
            title: t('Main.Notice.selective_contract_title'),
            content: t('Main.Notice.selective_contract_content')
          },
          {
            title: t('Main.Notice.payment_title'),
            content: t('Main.Notice.payment_content')
          },
          {
            title: t('Main.Notice.cancellation_title'),
            content: t('Main.Notice.cancellation_content')
          },
          {
            title: t('Main.Notice.application_guide_title'),
            content: t('Main.Notice.application_guide_content')
          }
        ]}
      />

      <Footer />
      <ChatBotWrapper />
    </main>
  );
}
