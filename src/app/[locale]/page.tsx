'use client'; // ✅ Client Component 선언

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ChatBot from '@/components/feature/ChatBot';
import EligibilityChecker from '@/components/feature/EligibilityChecker';
import ProcessGuide from '@/components/feature/ProcessGuide';
import TargetAudience from '@/components/feature/TargetAudience';
import WhyChooseUs from '@/components/feature/WhyChooseUs';
import { ServiceGuideCard } from '@/components/feature/ServiceGuideCard';

export default function Home() {
  const t = useTranslations('Home');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const scrollToChecker = () => {
    const section = document.getElementById('eligibility-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="min-h-screen bg-background font-sans">
      <ServiceGuideCard 
        onCheckClick={scrollToChecker}         
        onConsultClick={() => setIsChatOpen(true)}
      />
      
      <TargetAudience />
      <ProcessGuide />
      <section 
        id="eligibility-section" 
        className="py-10 bg-background-alt px-4 border-y border-line-200/50"
      >
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
      
      <ChatBot 
        externalIsOpen={isChatOpen} 
        onOpenChange={setIsChatOpen} 
      />
    </main>
  );
}