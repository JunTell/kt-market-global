import type { Metadata } from "next";
import localFont from 'next/font/local';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "@/app/globals.css";

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: "45 920",
  variable: '--font-pretendard',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const keywordsByLocale = {
  en: ['Korea SIM Card', 'Buy Phone in Korea', 'SIM Free Smartphone', 'KT Mobile Service', 'Prepaid SIM'],
  ja: ['韓国SIM', '韓国スマホ購入', 'SIMフリー', 'KTモバイル', 'プリペイドSIM'],
  zh: ['韩国电话卡', '韩国买手机', '无锁版手机', 'KT通讯', '预付费卡'],
  ko: ['외국인 휴대폰 개통', '선불유심', '알뜰폰', '중고폰 매입', 'KT 마켓'],
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const keywords = keywordsByLocale[locale as keyof typeof keywordsByLocale] ?? keywordsByLocale.en;

  return {
    metadataBase: new URL('https://global.ktmarket.co.kr'),
    title: {
      template: '%s | KT Market Global',
      default: 'Phone Plan in Korea for Foreigners | KT Market Global',
    },
    description: "Official KT Authorized Agency. Provides the best mobile plans and smartphones for foreigners in Korea with English support. Check eligibility and apply online.",
    keywords: keywords,
    openGraph: {
      title: "Phone Plan in Korea for Foreigners – KT Market Global",
      description: "Official KT Authorized Agency. Best mobile plans for foreigners in Korea.",
      url: 'https://global.ktmarket.co.kr',
      siteName: 'KT Market Global',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'KT Market Global',
      description: 'Phone Plan in Korea for Foreigners',
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: '/images/logo.svg',
    },
    alternates: {
      canonical: 'https://global.ktmarket.co.kr',
    },
    verification: {
      other: {
        'facebook-domain-verification': '6xvpfpw3l0zkmhciw1puskq27akblq',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${pretendard.variable} antialiased bg-white`}
        suppressHydrationWarning={true}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}