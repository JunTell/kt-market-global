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

      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <ResultPageClient />
      </Suspense>
    </>
  )
}