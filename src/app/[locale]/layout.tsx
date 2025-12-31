import type { Metadata } from "next";
import localFont from 'next/font/local'; 
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "@/app/globals.css";
import ChatBot from '@/components/feature/ChatBot'; 
import Header from "@/components/layout/Header";
import ScrollToTop from "@/components/common/ScrollToTop";
import Footer from "@/components/layout/Footer";

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2', 
  display: 'swap',
  weight: "45 920",
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: "KT Market Admin",
  description: "KT Market Admin Page",
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
        className={`${pretendard.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <NextIntlClientProvider messages={messages}>
          <div
            id="main-scroll-container"
            className="w-full h-full max-w-[480px] min-w-[360px] min-h-screen shadow-2xl overflow-x-hidden font-sans relative overflow-y-auto scrollbar-hide"
          >
            <ScrollToTop /> 
            
            <Header />
            <main>
              {children}
            </main>
            <Footer />
            <ChatBot />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}