'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ChatBot from '@/components/feature/ChatBot';
import EligibilityChecker from '@/components/feature/EligibilityChecker';
import ProcessGuide from '@/components/feature/ProcessGuide';
import TargetAudience from '@/components/feature/TargetAudience';
import WhyChooseUs from '@/components/feature/WhyChooseUs';
import { ServiceGuideCard } from '@/components/feature/ServiceGuideCard';
import { Notice } from '@/components/feature/Notice';
import ModelList from '@/components/feature/ModelList';

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
      
      <div className="px-4 py-10">
        <ModelList
          sectionTitle="휴대폰 모델" 
          planId="ppllistobj_0808" 
        />
      </div>
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
      <Notice
        title="유의사항"
        items={[
          {
            title: "작성하신 정보는 어디로 전달되나요?",
            content: "작성해주신 모든 정보는 상담을 위해 담당 부서로 안전하게 전달되며, 상담 완료 후 파기됩니다."
          },
          {
            title: "답변은 언제 받을 수 있나요?",
            content: "평일 기준 24시간 이내에 기재해주신 연락처로 안내해 드립니다.\n주말 및 공휴일에는 답변이 지연될 수 있습니다."
          },
          {
            title: "정보를 잘못 입력했어요.",
            content: "이미 제출된 정보는 수정이 어렵습니다. 다시 작성하여 제출해주시면 최신 정보로 접수됩니다."
          }
        ]}
        className="mt-6"
      />
      
      <ChatBot 
        externalIsOpen={isChatOpen} 
        onOpenChange={setIsChatOpen} 
      />
    </main>
  );
}