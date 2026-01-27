import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import ChatBot from '@/features/inquiry/components/ChatBot';

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

import HeroSection from '@/features/phone/components/HeroSection';
import ProcessGuide from '@/features/phone/components/ProcessGuide';
import TargetAudience from '@/features/phone/components/TargetAudience';
import WhyChooseUs from '@/features/phone/components/WhyChooseUs';
import { Notice } from '@/features/phone/components/Notice';
import ModelListContainer from '@/features/phone/components/ModelListContainer';
import Footer from '@/shared/components/layout/Footer';
import EligibilityChecker from '@/features/phone/components/EligibilityChecker';

export default function Home() {
  const t = useTranslations();

  return (
    <main className="min-h-screen bg-bg-grouped font-sans">
      {/* Trust-First: Hero Section at Top */}
      <HeroSection />

      {/* Trust Building: Why Choose Us */}
      <WhyChooseUs />

      {/* Process Transparency */}
      <ProcessGuide />

      {/* Eligibility Checker */}
      <section
        id="eligibility-section"
        className="py-10 md:py-16 bg-base px-4 md:px-12 border-y border-grey-200"
      >
        <div className="w-full max-w-7xl mx-auto">
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
          <EligibilityChecker />
        </div>
      </section>

      {/* Target Audience */}
      <TargetAudience />

      {/* Price Information LAST (Trust-First Strategy) */}
      <div className="px-4 py-10">
        <ModelListContainer
          sectionTitle={t('Phone.ModelList.section_title')}
          planId="ppllistobj_0808"
        />
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
      <ChatBot />
    </main>
  );
}
