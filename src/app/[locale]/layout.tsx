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

export const metadata: Metadata = {
  metadataBase: new URL('https://global.ktmarket.co.kr'),
  title: {
    template: '%s | Global KT Market',
    default: 'Global KT Market | Korea\'s No.1 Mobile Service for Foreigners',
  },
  description: "Official KT Authorized Agency. Provides the best mobile plans and smartphones for foreigners in Korea with English support. Check eligibility and apply online.",
  keywords: ["KT", "Korea Telecom", "SIM Card", "eSIM", "Korea Mobile", "Expats in Korea", "Foreigner Registration Card"],
  openGraph: {
    title: "Global KT Market | Korea's No.1 Mobile Service",
    description: "Official KT Authorized Agency. Best mobile plans for foreigners in Korea.",
    url: 'https://global.ktmarket.co.kr',
    siteName: 'Global KT Market',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global KT Market',
    description: 'Korea\'s No.1 Mobile Service for Foreigners',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    canonical: 'https://global.ktmarket.co.kr',
  }
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${pretendard.variable} antialiased bg-bg-grouped flex justify-center`}
        suppressHydrationWarning={true}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}