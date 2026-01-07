'use client';

import { useTranslations } from 'next-intl';
import { useUIStore } from '@/shared/model/useUIStore';

interface ServiceGuideCardProps {
  className?: string;
  onCheckClick?: () => void;
}

export const ServiceGuideCard = ({
  className,
  onCheckClick
}: ServiceGuideCardProps) => {
  const t = useTranslations('ServiceGuide');
  const openChat = useUIStore((state) => state.openChat);

  const handleConsultClick = () => {
    openChat();
  };

  const handleCheckClick = () => {
    if (onCheckClick) {
      onCheckClick();
    } else {
      // Default behavior: scroll to eligibility section if onCheckClick is not provided
      const section = document.getElementById('eligibility-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div
      className={`relative w-full h-[738px] flex flex-col items-center justify-between px-6 py-10 ${className}`}
      style={{ backgroundColor: '#3C83EC' }}
    >
      {/* Logo */}
      {/* <div className="absolute top-4 left-4 bg-white rounded-full px-4 py-1.5 flex justify-start gap-2">
        <Image 
          src="/images/logo.svg"
          alt="KT Market Logo" 
          width={60}          
          height={40}          
          priority             
        />
      </div> */}

      {/* Main Content */}
      <div className="flex flex-col items-center text-center text-white space-y-4 mt-20">
        <p className="text-[22px] font-light">
          {t('label')}
        </p>

        <h1 className="text-[36px] font-bold leading-tight whitespace-pre-line">
          {t.raw('title')}
        </h1>

        <div className="text-[18px] font-light mt-8 space-y-1">
          <p>{t('sub_arc')}</p>
          <p>{t('sub_benefit')}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-md space-y-3">
        <button
          type="button"
          onClick={handleCheckClick}
          className="w-full bg-white text-black text-base font-semibold py-3 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          {t('btn_check')}
        </button>

        <button
          type="button"
          onClick={handleConsultClick}
          className="w-full bg-black text-white text-base font-semibold py-3 rounded-full hover:bg-gray-900 transition-colors cursor-pointer"
        >
          {t('btn_consult')}
        </button>
      </div>
    </div>
  );
};