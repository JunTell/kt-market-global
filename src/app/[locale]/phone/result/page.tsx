"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import IntroOverlay from "@/components/feature/phone/result/IntroOverlay"
import OrderProductSummary from "@/components/feature/phone/order/OrderProductSummary"
import OrderUserForm from "@/components/feature/phone/order/OrderUserForm"

export default function ResultPage() {
  const t = useTranslations()
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const [orderData, setOrderData] = useState<any>(null)

  useEffect(() => {
    // sessionStorage에서 데이터 로드 (OrderPage에서 저장한 키값 사용)
    const data = sessionStorage.getItem("asamoDeal")
    if (data) {
      setOrderData(JSON.parse(data))
    }
  }, [router])

  // 데이터가 없을 때의 기본값 (Loading or Fallback)
  const productInfo = orderData?.product || {
    title: "iPhone 17",
    spec: "256GB · Lavender",
    price: "-",
    image: ""
  }

  const userInfo = orderData?.user || {
    userName: "",
    userDob: "",
    userPhone: "",
    country: t('Phone.Order.default_country'),
  }

  const planInfo = orderData?.plan || {
    planName: t('Phone.Plans.plan_69_v_name'),
    planData: t('Phone.Plans.plan_69_v_desc'),
    planPrice: "69,000 " + t('Phone.Common.won')
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      {/* 1. 성공 오버레이 */}
      <IntroOverlay />

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "20px 20px 120px 20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#191F28", marginBottom: "24px", marginTop: "10px", whiteSpace: "pre-line" }}>
          {t('Phone.Result.application_complete_title')}
        </h1>

        {/* 2. 상품 정보 요약 */}
        <OrderProductSummary
          image={productInfo.image}
          title={productInfo.title}
          spec={productInfo.spec}
          price={planInfo.planPrice}
        />

        <div style={{ width: "100%", height: "1px", backgroundColor: "#F2F4F6", margin: "24px 0" }} />

        {/* 3. 신청 정보 확인 (Read Only) */}
        {/* 스타일 여백 제거를 위해 -20px margin 사용 혹은 컴포넌트 내부 padding 조절 필요 */}
        <div style={{ margin: "0 -20px" }}>
            <OrderUserForm
            isReadOnly={true}
            userName={userInfo.userName}
            userDob={userInfo.userDob}
            userPhone={userInfo.userPhone}
            country={userInfo.country}
            // 기타 props
            joinType={orderData?.joinType || t('Phone.Order.join_type_change')}
            contract={orderData?.contract || t('Phone.Order.contract_24')}
            discountType={orderData?.discountType || "device"}
            planName={planInfo.planName}
            planData={planInfo.planData}
            planPrice={planInfo.planPrice}
            />
        </div>

        {/* 4. 홈으로 돌아가기 버튼 */}
        <div style={{ marginTop: "20px" }}>
            <button
                style={{
                    width: "100%",
                    padding: "16px",
                    backgroundColor: "#F2F4F6",
                    color: "#4B5563",
                    fontSize: "16px",
                    fontWeight: "700",
                    border: "none",
                    borderRadius: "14px",
                    cursor: "pointer"
                }}
                onClick={() => router.push(`/${locale}`)}
            >
                {t('Phone.Result.go_home_button')}
            </button>
        </div>
      </div>
    </main>
  )
}