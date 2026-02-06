import type { Metadata } from "next";
import localFont from 'next/font/local';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "@/app/globals.css";
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';

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
      apple: '/images/logo.svg',
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
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-11271910125"
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-11271910125');
          `}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '865290846335788');
            fbq('track', 'PageView');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'KT Market Global',
              url: 'https://global.ktmarket.co.kr',
              logo: 'https://global.ktmarket.co.kr/images/logo.svg',
              sameAs: [
                'https://www.facebook.com/ktmarketglobal',
              ]
            })
          }}
        />

        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=865290846335788&ev=PageView&noscript=1"
            alt="facebook pixel"
          />
        </noscript>
      </head>
      <body
        className={`${inter.variable} ${pretendard.variable} antialiased bg-white`}
        suppressHydrationWarning={true}
      >

        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID as string} />
    </html>
  );
}