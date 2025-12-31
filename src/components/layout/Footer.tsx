import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="w-full bg-[#0D0E0E] border-t border-line-200 pt-10 pb-12">
      <div className="max-w-[1200px] mx-auto px-5">
        
        {/* 상단: 약관 및 정책 링크 */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-sm">
          <Link href="/terms" className="text-label-700 hover:text-label-900 transition-colors">
            {t('terms_of_service')}
          </Link>
          <Link href="/privacy" className="text-label-900 font-bold hover:underline transition-colors">
            {t('privacy_policy')}
          </Link>
          <Link href="/inquiry" className="text-label-700 hover:text-label-900 transition-colors">
            {t('customer_center')}
          </Link>
        </div>

        <div className="h-px bg-line-200 w-full mb-6" />

        {/* 중단: 회사 정보 (로고 + 텍스트) */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          
          {/* 회사 상세 정보 */}
          <div className="flex flex-col gap-1 text-xs text-label-700 leading-relaxed">
            <div className="mb-2">
              <span className="font-bold text-label-800 text-sm">{t('company_name')}</span>
            </div>
            
            <p>
              <span>{t('ceo_label')}: {t('ceo_name')}</span>
              <span className="mx-2 text-line-400">|</span>
              <span>{t('business_no_label')}: {t('business_no_value')}</span>
            </p>
            
            <p>
              <span>{t('address_label')}: {t('address_value')}</span>
            </p>
            
            <p>
              <span>{t('cs_label')}: {t('cs_phone')}</span>
              <span className="mx-2 text-line-400">|</span>
              <span>{t('email_label')}: {t('email_value')}</span>
            </p>
            
            <p className="mt-1 text-label-500">
              {t('cs_hours')}
            </p>
          </div>

          {/* 로고 (우측 혹은 하단 배치) */}
          <div className="opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
             {/* 로고 파일 경로에 맞게 수정해주세요 */}
             <Image 
               src="/images/logo.svg" 
               alt="KT Market Global" 
               width={100} 
               height={30}
               className="h-8 w-auto" 
             />
          </div>
        </div>

        {/* 하단: Copyright */}
        <div className="mt-8 text-[11px] text-label-500">
          COPYRIGHT © {new Date().getFullYear()} KT MARKET GLOBAL. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}