import type { Metadata } from "next";
import localFont from 'next/font/local'; // (기존 폰트 설정 유지)
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "@/app/globals.css";
import ChatBot from '@/components/feature/ChatBot'; // 챗봇 컴포넌트

// ... (폰트나 메타데이터 설정은 기존 코드 유지) ...

// ✅ 타입 수정: params를 Promise로 감싸야 합니다.
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
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          <ChatBot />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}