'use client'; // 클라이언트 컴포넌트 예시

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import ChatBot from '@/components/feature/ChatBot';

export default function HomePage() {
  // json 파일의 'Index' 키를 바라봄
  const t = useTranslations('Index');
  const supabase = createClient();

  useEffect(() => {
    // Supabase 연결 테스트
    const checkSupabase = async () => {
      const { data, error } = await supabase.from('test').select('*');
      console.log('Supabase Check:', data, error);
    };
    checkSupabase();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex mb-10">
        <p className="text-xl font-bold text-blue-600">
          KT Market Global
        </p>
        <div className="flex gap-4">
            {/* 언어 변경 버튼 (실제로는 Select 박스로 구현) */}
            <Link href="/ko" className="hover:underline">🇰🇷 KO</Link>
            <Link href="/en" className="hover:underline">🇺🇸 EN</Link>
            <Link href="/ja" className="hover:underline">🇯🇵 JA</Link>
            <Link href="/zh" className="hover:underline">🇨🇳 ZH</Link>
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-slate-900">
          {t('title')} 
        </h1>
        <p className="text-lg text-slate-600">
          {t('desc')}
        </p>
      </div>
      <ChatBot />
      
      <button className="mt-10 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition">
        Get Started
      </button>
    </main>
  );
}