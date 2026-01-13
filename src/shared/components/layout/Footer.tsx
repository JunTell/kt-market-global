import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

const KakaoIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M12 3C6.48 3 2 6.48 2 10.77C2 13.54 3.79 16 6.6 17.47L5.6 21.08C5.55 21.28 5.76 21.46 5.95 21.34L10.3 18.52C10.85 18.61 11.42 18.66 12 18.66C17.52 18.66 22 15.18 22 10.89C22 6.6 17.52 3 12 3Z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="w-full">
      {/* Top Banner (Policy & Channels) */}
      <div className="bg-[#eee] border-b border-gray-200">
        <div className="flex flex-col items-center justify-between">
          {/* Links */}
          <div className="flex flex-wrap justify-center gap-2 py-4 text-sm text-[#555] bg-[#EAEBEC] font-medium">
            <Link href="/company" className="hover:text-black hover:underline">{t('policy_privacy')}</Link>
            <span className="text-gray-300">|</span>
            <Link href="/company" className="hover:text-black hover:underline">{t('policy_usage')}</Link>
            <span className="text-gray-300">|</span>
            <Link href="/company" className="hover:text-black hover:underline">{t('policy_notice')}</Link>
            <span className="text-gray-300">|</span>
            <Link href="/company" className="hover:text-black hover:underline">{t('policy_company')}</Link>
          </div>

          {/* Buttons */}
          <div className="w-full flex justify-center gap-3 bg-[#FFFFFF] py-2">
            <Link href="https://www.youtube.com/" target="_blank" className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span className="text-xs font-bold text-[#333]">{t('channel_youtube')}</span>
            </Link>
            <Link href="http://pf.kakao.com/_HfItxj" target="_blank" className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <svg className="w-5 h-5 text-[#3C1E1E] bg-[#FEE500] rounded" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.48 3 2 6.48 2 10.77C2 13.54 3.79 16 6.6 17.47L5.6 21.08C5.55 21.28 5.76 21.46 5.95 21.34L10.3 18.52C10.85 18.61 11.42 18.66 12 18.66C17.52 18.66 22 15.18 22 10.89C22 6.6 17.52 3 12 3Z" />
              </svg>
              <span className="text-xs font-bold text-[#333]">{t('channel_kakao')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top Section - Dark */}
      <div className="bg-[#191919] text-white pt-4 pb-4">
        <div className="max-w-[1200px] mx-auto px-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Left */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full px-3 py-1.5">
                <Image
                  src="/images/logo.svg"
                  alt="KT Market Global"
                  width={100}
                  height={30}
                  className="h-6 w-auto"
                />
              </div>
            </div>
            <p className="text-lg font-bold text-white/90">{t('tagline')}</p>
          </div>

          {/* Right */}
          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="text-white/80 font-medium">{t('partner_support')}</p>
            <p className="text-xl font-bold">{t('cs_hours')}</p>
            <div className="flex gap-3 mt-1">
              <a
                href="http://pf.kakao.com/_HfItxj/friend"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-[#FEE500] text-[#191919] rounded-xl hover:bg-[#FDD835] transition-colors"
              >
                <KakaoIcon />
              </a>
              <a
                href="https://wa.me/821012345678"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-[#25D366] text-white rounded-xl hover:bg-[#20bd5a] transition-colors"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Dark (Unified) */}
      <div className="bg-[#191919] text-[#999] py-10 text-xs border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="mb-8">
            <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-1 cursor-pointer">
              {t('business_info_title')}
            </h3>

            <div className="flex flex-col gap-1.5 leading-relaxed text-[#888]">
              <p className="font-bold text-[#b0b0b0] text-[13px]">{t('company_name_full')}</p>
              <p>
                <span>{t('ceo_label')} : {t('ceo_name')}</span>
              </p>
              <p>
                <span>{t('business_no_label')} : {t('business_no_value')}</span>
              </p>
              <p>
                <span>{t('telecom_license_label')} : {t('telecom_license_value')}</span>
              </p>
              <p>
                <span>{t('privacy_officer_label')} : {t('privacy_officer_name')}</span>
              </p>
              <p>
                <span>{t('address_value')}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-6 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-lg">kt</span>
                <span className="text-[10px] bg-white/10 text-[#ccc] px-1 rounded">{t('cert_kt_official')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">KAIT</span>
                <span className="text-[10px] text-[#ccc]">{t('cert_kait')}</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10 w-full mb-6" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-6 text-[13px]">
              <Link href="/company" className="text-[#888] hover:text-white transition-colors">
                {t('terms_of_service')}
              </Link>
              <Link href="/company" className="font-bold text-[#b0b0b0] hover:text-white transition-colors">
                {t('privacy_policy')}
              </Link>
            </div>
            <p className="text-[#666] text-[11px]">
              COPYRIGHT © 2026 KT MARKET GLOBAL. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}