import { useTranslations } from 'next-intl';
import ChatBot from '@/components/feature/ChatBot';
import EligibilityChecker from '@/components/feature/EligibilityChecker';
import ProcessGuide from '@/components/feature/ProcessGuide';
import TargetAudience from '@/components/feature/TargetAudience';
import WhyChooseUs from '@/components/feature/WhyChooseUs';

export default function Home() {
  const t = useTranslations('Home');

  return (
    <main className="min-h-screen bg-background font-sans">
      {/* Hero Section */}
      <section className="pt-12 pb-8 px-5 text-center">
        <h1 className="text-2xl font-bold text-label-900 mb-3 leading-tight">
          {t('Hero.title_1')}<br />
          <span className="text-primary">{t('Hero.title_highlight')}</span>
        </h1>
        <p className="text-label-700 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
          {t('Hero.desc')}
        </p>
      </section>
      <TargetAudience />
      <ProcessGuide />

      <section className="py-10 bg-background-alt px-4 border-y border-line-200/50">
        <div className="max-w-md mx-auto text-center mb-6">
          <span className="text-primary font-bold tracking-wider uppercase text-[10px] mb-1.5 block">
            {t('Eligibility.badge')}
          </span>
          <h2 className="text-xl font-bold text-label-900 mb-2">
            {t('Eligibility.title')}
          </h2>
          <p className="text-label-700 text-xs whitespace-pre-line leading-relaxed">
            {t('Eligibility.desc')}
          </p>
        </div>
        <EligibilityChecker />
      </section>
      <WhyChooseUs />

      <section className="py-12 px-5 bg-background">
        <div className="grid gap-4 text-center">
          <div className="p-5 rounded-2xl bg-background-alt border border-transparent hover:border-line-200 transition-colors">
            <div className="text-3xl mb-2">🚫</div>
            <h3 className="font-bold text-base mb-1 text-label-900">{t('Features.feat1_title')}</h3>
            <p className="text-label-500 text-xs whitespace-pre-line leading-relaxed">{t('Features.feat1_desc')}</p>
          </div>
          
          <div className="p-5 rounded-2xl bg-background-alt border border-transparent hover:border-line-200 transition-colors">
            <div className="text-3xl mb-2">📱</div>
            <h3 className="font-bold text-base mb-1 text-label-900">{t('Features.feat2_title')}</h3>
            <p className="text-label-500 text-xs whitespace-pre-line leading-relaxed">{t('Features.feat2_desc')}</p>
          </div>
          
          <div className="p-5 rounded-2xl bg-background-alt border border-transparent hover:border-line-200 transition-colors">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="font-bold text-base mb-1 text-label-900">{t('Features.feat3_title')}</h3>
            <p className="text-label-500 text-xs whitespace-pre-line leading-relaxed">{t('Features.feat3_desc')}</p>
          </div>
        </div>
      </section>
      
      <ChatBot />
    </main>
  );
}