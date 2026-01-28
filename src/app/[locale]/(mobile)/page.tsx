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
    openGraph: {
      title: t('og_title'),
      description: t('og_description'),
    },
  };
}

export default function Home() {
  const t = useTranslations();

  return (
    <main className="min-h-screen bg-white font-sans max-w-[940px] mx-auto">
      {/* Trust-First: Hero Section at Top */}
      <HeroSection />

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
