import { Suspense } from "react"
import Script from "next/script"
import ResultPageClient from "./ResultPageClient"

// 모델별 컨버전 라벨 매핑
const CONVERSION_LABELS: Record<string, string> = {
  "default": "AW-11271910125/zZSOCKvkrO8bEO3l7v4p",
  // 예시: "aip17-256-mist_blue": "AW-XXXXX/YYYYY",
}

type Props = {
  searchParams: Promise<{ model?: string }>
}

export default async function ResultPage({ searchParams }: Props) {
  const { model } = await searchParams

  // 컨버전 라벨 결정 (URL 모델 기준, 없으면 default)
  const conversionLabel = (model && CONVERSION_LABELS[model]) || CONVERSION_LABELS["default"]

  return (
    <>
      <Script id="google-conversion-event" strategy="afterInteractive">
        {`
          gtag('event', 'conversion', {'send_to': '${conversionLabel}'});
        `}
      </Script>
      <Script id="meta-pixel-event" strategy="afterInteractive">
        {`
          fbq('track', 'InitiateCheckout');
        `}
      </Script>
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <ResultPageClient />
      </Suspense>
    </>
  )
}