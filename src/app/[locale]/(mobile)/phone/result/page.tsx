"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { formatPrice } from "@/shared/lib/format"
import { getPlanDetails } from "@/features/phone/lib/phonedata"
import IntroOverlay from "@/features/phone/components/result/IntroOverlay"
import OrderProductSummary from "@/features/phone/components/order/OrderProductSummary"
import OrderUserForm from "@/features/phone/components/order/OrderUserForm"
import EligibilityChecker from "@/features/phone/components/EligibilityChecker"
import OrderSkeleton from "@/features/phone/components/skeleton/OrderSkeleton"

export default function ResultPage() {
  const t = useTranslations()
  const router = useRouter()
  // const params = useParams() // Unused
  const locale = useLocale()
  const [orderData, setOrderData] = useState<Record<string, unknown> | null>(null)
  const PLAN_DETAILS = getPlanDetails(t)

  // 클라이언트에서만 sessionStorage 읽기 (Hydration 오류 방지)
  useEffect(() => {
    const data = sessionStorage.getItem("asamoDeal")
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrderData(JSON.parse(data))
    }
  }, [])

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

  const [savedUserInfo, setSavedUserInfo] = useState<UserInfo | null>(null)

  // user-info에서 저장된 사용자 정보를 우선 사용
  useEffect(() => {
    try {
      const userInfoStr = sessionStorage.getItem("user-info")
      if (userInfoStr) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSavedUserInfo(JSON.parse(userInfoStr) as UserInfo)
      }
    } catch (e) {
      console.error("Failed to load user-info:", e)
    }
  }, [])

  // asamoDeal에서 제품 정보 추출
  const productInfo: ProductInfo = orderData ? {
    title: String(orderData.title || ""),
    spec: `${String(orderData.capacity || "")} · ${String(orderData.color || "")}`,
    price: orderData.finalDevicePrice
      ? `${t('Phone.Order.installment_price')} ${formatPrice(Number(orderData.finalDevicePrice), locale)}${t('Phone.Common.won')}`
      : `${t('Phone.Order.release_price')} ${formatPrice(Number(orderData.originPrice) || 0, locale)}${t('Phone.Common.won')}`,
    image: String(orderData.imageUrl || "")
  } : {
    title: "",
    spec: "",
    price: "-",
    image: ""
  }

  const userInfo: UserInfo = savedUserInfo || {
    userName: "",
    userDob: "",
    userPhone: "",
    country: t('Phone.Order.default_country'),
    requirements: "",
  }

  // 요금제 정보 추출
  const selectedPlanId = String(orderData?.selectedPlanId || "plan_69")
  const planData = PLAN_DETAILS[selectedPlanId] || PLAN_DETAILS["plan_69"]
  const additionalCost = selectedPlanId === 'plan_90_v' ? 4450 : 0
  const finalPlanPrice = planData.price + additionalCost

  const planInfo: PlanInfo = {
    planName: planData.name,
    planData: planData.data,
    planPrice: `${t('Phone.Order.monthly_price')} ${formatPrice(finalPlanPrice, locale)}${t('Phone.Common.won')}`
  }

  if (!orderData) {
    return <OrderSkeleton />
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="p-4">
        <EligibilityChecker />
      </div>
      {/* 1. 성공 오버레이 */}
      <IntroOverlay />

      <div className="max-w-[480px] mx-auto px-5 pt-5 pb-[120px]">
        <h1 className="text-2xl font-bold text-[#191F28] mb-6 mt-2.5 whitespace-pre-line">
          {t('Phone.Result.application_complete_title')}
        </h1>

        {/* 2. 상품 정보 요약 */}
        <OrderProductSummary
          image={productInfo.image}
          title={productInfo.title}
          spec={productInfo.spec}
          price={productInfo.price}
        />

        <div className="w-full h-px bg-[#F2F4F6] my-6" />

        {/* 3. 신청 정보 확인 (Read Only) */}
        {/* 스타일 여백 제거를 위해 -20px margin 사용 혹은 컴포넌트 내부 padding 조절 필요 */}
        <div className="-mx-5">
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
        <div className="mt-5">
          <button
            className="w-full p-4 bg-[#F2F4F6] text-[#4B5563] text-base font-bold rounded-[14px] hover:bg-gray-200 transition-colors cursor-pointer"
            onClick={() => router.push(`/${locale}`)}
          >
            {t('Phone.Result.go_home_button')}
          </button>
        </div>
      </div>
    </main>
  )
}