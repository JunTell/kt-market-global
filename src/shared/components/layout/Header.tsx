// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image'; // Image 컴포넌트 임포트
import { useParams } from 'next/navigation';
import LanguageSelector from '@/shared/components/ui/LanguageSelector';

export default function Header() {
  const params = useParams();
  const locale = params?.locale as string;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-grey-200 px-5 py-2">
      <div className="flex justify-between items-center">
        <Link href={`/${locale}`} className="flex items-center transition-opacity hover:opacity-80">
          <Image
            src="/images/logo.svg"
            alt="KT Market Logo"
            width={80}
            height={60}
            priority
          />
        </Link>
        <LanguageSelector />
      </div>
    </header>
  );
}