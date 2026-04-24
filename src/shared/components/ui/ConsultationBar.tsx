'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MessageCircle, Phone } from 'lucide-react';

/**
 * Hidden on routes that already have a bottom sticky (phone detail & order).
 * Match against the locale-prefixed pathname.
 */
function isHiddenRoute(pathname: string): boolean {
  return (
    /\/phone(\/|$)/.test(pathname) ||
    /\/admin(\/|$)/.test(pathname)
  );
}

export default function ConsultationBar() {
  const pathname = usePathname() || '';
  const t = useTranslations('Consultation');

  if (isHiddenRoute(pathname)) return null;

  const kakao = t.has('kakao_url') ? t('kakao_url') : '';
  const wa    = t.has('whatsapp_url') ? t('whatsapp_url') : '';
  const call  = t.has('call_tel') ? t('call_tel') : '';
  const shown = [kakao, wa, call].filter(Boolean);
  if (shown.length === 0) return null;

  return (
    <nav
      className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-[#E5E8EB] bg-white pb-safe"
      aria-label={t('cta_label')}
    >
      <ul className="mx-auto grid h-14 max-w-mobile-max grid-cols-3 divide-x divide-[#E5E8EB]">
        {kakao && (
          <li>
            <a
              href={kakao}
              target="_blank"
              rel="noreferrer"
              className="flex h-full flex-col items-center justify-center gap-0.5 text-[#111827] min-h-[44px]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span className="text-[11px] font-semibold">{t('kakao_label')}</span>
            </a>
          </li>
        )}
        {wa && (
          <li>
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="flex h-full flex-col items-center justify-center gap-0.5 text-[#111827] min-h-[44px]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span className="text-[11px] font-semibold">{t('whatsapp_label')}</span>
            </a>
          </li>
        )}
        {call && (
          <li>
            <a
              href={`tel:${call}`}
              className="flex h-full flex-col items-center justify-center gap-0.5 text-[#111827] min-h-[44px]"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span className="text-[11px] font-semibold">{t('call_label')}</span>
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}
