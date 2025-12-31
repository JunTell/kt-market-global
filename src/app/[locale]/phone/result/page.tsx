"use client"

import { useState } from "react"
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
  const [orderData] = useState<Record<string, unknown> | null>(() => {
    if (typeof window === 'undefined') return null
    const data = sessionStorage.getItem("asamoDeal")
    return data ? JSON.parse(data) : null
  })

  interface ProductInfo {
    title: string
    spec: string
    price: string
    image: string
  }

  interface UserInfo {
    userName: string
    userDob: string
    userPhone: string
    country: string
    requirements: string
  }

  interface PlanInfo {
    planName: string
    planData: string
    planPrice: string
  }

  // 데이터가 없을 때의 기본값 (Loading or Fallback)
  const productInfo: ProductInfo = (orderData?.product as ProductInfo) || {
    title: "iPhone 17",
    spec: "256GB · Lavender",
    price: "-",
    image: ""
  }

  // user-info에서 저장된 사용자 정보를 우선 사용
  const getSavedUserInfo = (): UserInfo | null => {
    if (typeof window !== 'undefined') {
      try {
        const userInfoStr = sessionStorage.getItem("user-info")
        if (userInfoStr) {
          return JSON.parse(userInfoStr) as UserInfo
        }
      } catch (e) {
        console.error("Failed to load user-info:", e)
      }
    }
    return null
  }

  const savedUserInfo = getSavedUserInfo()
  const userInfo: UserInfo = savedUserInfo || (orderData?.user as UserInfo) || {
    userName: "",
    userDob: "",
    userPhone: "",
    country: t('Phone.Order.default_country'),
    requirements: "",
  }

  const planInfo: PlanInfo = (orderData?.plan as PlanInfo) || {
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
            requirements={userInfo.requirements}
            // 기타 props
            joinType={String(orderData?.joinType || t('Phone.Order.join_type_change'))}
            contract={String(orderData?.contract || t('Phone.Order.contract_24'))}
            discountType={String(orderData?.discountType || "device")}
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