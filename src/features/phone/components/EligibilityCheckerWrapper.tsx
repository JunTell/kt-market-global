'use client';

import dynamic from 'next/dynamic';

const EligibilityChecker = dynamic(
  () => import('@/features/phone/components/EligibilityChecker'),
  {
    ssr: false,
    loading: () => <div className="h-[460px] bg-white rounded-lg shadow-sm border border-grey-200 animate-pulse" />
  }
);

export default function EligibilityCheckerWrapper() {
  return <EligibilityChecker />;
}
