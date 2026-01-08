"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { createClient } from "@/shared/api/supabase/client"
import { getPlanDetails, getColorMap } from "@/features/phone/lib/phonedata"
import { toKorean } from "@/shared/lib/toKorean"
import { formatPrice } from "@/shared/lib/format"
import { parsePhoneModel, getDBModelKey } from "@/features/phone/lib/phoneModel"
import OrderProductSummary from "@/features/phone/components/order/OrderProductSummary"
import OrderUserForm from "@/features/phone/components/order/OrderUserForm"

export default function OrderPage() {
  const t = useTranslations()
  const params = useParams()
  const locale = params.locale as string
  const supabase = createClient()

  // 다국어 데이터
  const PLAN_DETAILS = getPlanDetails(t)
  const COLOR_MAP = getColorMap(t)

  // 통합 State
  const [store, setStore] = useState({
    // 표시용
    imageUrl: "",
    title: "",
    spec: "",
    price: "",
    // 사용자 정보
    userName: "",
    userDob: "",
    userPhone: "",
    country: t('Phone.Order.default_country'),
    requirements: "",
    // 신청 정보
    joinType: t('Phone.Order.join_type_change'),
    contract: t('Phone.Order.contract_24'),
    discountType: "device",
    selectedPlanId: "plan_69",
    // DB 저장용
    deviceModel: "",
    modelBase: "",
    deviceCapacity: "",
    deviceColor: "",
    telecomCompany: t('Phone.Order.telecom_kt'),
    funnel: t('Phone.Order.funnel_asamo'),
    isReady: false,
  })

  const [isReadOnly, setIsReadOnly] = useState(false)

  // 스크롤 강제 이동 로직
  useEffect(() => {
    if (store.isReady) {
      if (typeof window !== 'undefined' && window.history) {
        window.history.scrollRestoration = 'manual';
      }
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [store.isReady])

  useEffect(() => {
    if (typeof window === "undefined") return

    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search)
      const modelFromUrl = params.get("model")

      // 1. 세션에서 제품 정보 로드
      let sessionData = null
      try {
        const sessionDataStr = sessionStorage.getItem("asamoDeal")
        if (sessionDataStr) {
          sessionData = JSON.parse(sessionDataStr)
        }
      } catch (e) { console.error(e) }

      if (sessionData && modelFromUrl && sessionData.model === modelFromUrl) {
        applyDataToStore(sessionData)
      } else if (modelFromUrl) {
        await fetchFromDB(modelFromUrl)
      }

      // 2. 세션에서 사용자 정보 로드
      try {
        const userInfoStr = sessionStorage.getItem("user-info")
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr)
          setStore(prev => ({
            ...prev,
            userName: userInfo.userName || prev.userName,
            userDob: userInfo.userDob || prev.userDob,
            userPhone: userInfo.userPhone || prev.userPhone,
            country: userInfo.country || prev.country,
            requirements: userInfo.requirements || prev.requirements,
          }))
          setIsReadOnly(true)
        }
      } catch (e) { console.error(e) }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 데이터 적용 헬퍼
  const applyDataToStore = (data: Record<string, unknown>) => {
    const colorKey = String(data.color || "random")
    const colorName = COLOR_MAP[colorKey] || colorKey || t('Phone.Common.default_color')
    const planId = String(data.selectedPlanId || "plan_69")
    const joinTypeKr = data.registrationType === "mnp" ? t('Phone.Order.join_type_mnp') : t('Phone.Order.join_type_change')
    const discountTypeKr = String(data.discountType || data.discountMode || data.mode || "device")
    const { prefix } = parsePhoneModel(String(data.model || ""))
    const modelBase = prefix

    // 가격 계산 로직
    let priceText = ""
    if (data.finalDevicePrice) {
      priceText = `${t('Phone.Order.installment_price')} ${formatPrice(Number(data.finalDevicePrice), locale)}${t('Phone.Common.won')}`
    } else {
      priceText = `${t('Phone.Order.release_price')} ${formatPrice(Number(data.originPrice) || 0, locale)}${t('Phone.Common.won')}`
    }

    setStore(prev => ({
      ...prev,
      imageUrl: String(data.imageUrl || ""),
      title: String(data.title || t('Phone.Common.model_loading')),
      spec: `${String(data.capacity || "")} · ${colorName}`,
      price: priceText,
      deviceModel: String(data.model || ""),
      modelBase: modelBase,
      deviceCapacity: String(data.capacity || ""),
      deviceColor: colorName,
      joinType: joinTypeKr,
      discountType: discountTypeKr,
      selectedPlanId: planId,
      isReady: true,
    }))
  }

  const fetchFromDB = async (fullModelStr: string) => {
    const { prefix, capacity, color: colorKey } = parsePhoneModel(fullModelStr)
    const dbModelKey = getDBModelKey(prefix, capacity)

    const { data: device } = await supabase
      .from("devices")
      .select("*")
      .eq("model", dbModelKey)
      .single()

    if (device) {
      // 사용 가능한 색상 목록 확인
      // 사용 가능한 색상 목록 확인 (이미지가 없거나 빈 값인 색상 제외)
      const availableColors = (device.colors_en || []).filter((c: string) => c && device.images?.[c]?.length > 0)

      // URL의 색상이 사용 가능한 색상 목록에 있는지 확인, 없으면 첫 번째 색상 사용
      const selectedColor = availableColors.includes(colorKey) ? colorKey : availableColors[0] || "black"
      const colorName = COLOR_MAP[selectedColor] || selectedColor

      const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || ""
      const imageFile = device.images?.[selectedColor]?.[0] || "01"
      const imageUrl = `${cdnUrl}/phone/${device.category}/${selectedColor}/${imageFile}.png`

      setStore(prev => ({
        ...prev,
        imageUrl: imageUrl,
        title: device.pet_name,
        spec: `${device.capacity} · ${colorName}`,
        price: `${t('Phone.Order.release_price')} ${formatPrice(device.price, locale)}${t('Phone.Common.won')}`,
        deviceModel: fullModelStr,
        modelBase: dbModelKey,
        deviceCapacity: device.capacity,
        deviceColor: colorName,
        joinType: t('Phone.Order.join_type_change'),
        discountType: "device",
        selectedPlanId: "plan_69",
        isReady: true,
      }))
    }
  }

  interface UserFormData {
    userName: string
    userDob: string
    userPhone: string
    country: string
    requirements: string
    planName?: string
  }

  const handleConfirm = async (userInput: UserFormData) => {
    try {
      const finalInput = userInput

      if (!finalInput || !finalInput.userName || !finalInput.userPhone) {
        alert(t('Phone.Order.form_alert'))
        return
      }

      let sessionData: Record<string, unknown> = {}
      try {
        const stored = sessionStorage.getItem("asamoDeal")
        if (stored) sessionData = JSON.parse(stored)
      } catch (e) { console.error(e) }

      const companyName = t('Phone.Order.telecom_kt')
      const deviceName = store.title.replace(/\s\d+(GB|TB)$/i, "").trim()

      // DB 저장용 데이터 구성
      const formDataJson = {
        ...sessionData,
        name: finalInput.userName,
        color: toKorean('color', store.deviceColor),
        phone: finalInput.userPhone,
        device: deviceName,
        funnel: toKorean('funnel', store.funnel || t('Phone.Order.funnel_asamo')),
        country: toKorean('country', finalInput.country),
        company: toKorean('company', companyName),
        birthday: finalInput.userDob,
        capacity: store.deviceCapacity,
        pet_name: store.modelBase,
        register: toKorean('join_type', store.joinType),
        sub_phone: finalInput.userPhone,
        isAgreedTOS: true,
        requirements: finalInput.requirements || t('Phone.Order.default_requirements'),
        planName: toKorean('plan_name', finalInput.planName || ''),
        contract: toKorean('contract', store.contract),
        discountType: toKorean('discount_type', store.discountType),
        ...(sessionData?.['eligibility_data'] ? {
          'eligibility_data': sessionData['eligibility_data']
        } : {}),
      }

      const insertPayload = {
        company: toKorean('company', companyName),
        device: deviceName,
        capacity: store.deviceCapacity,
        color: toKorean('color', store.deviceColor),
        name: finalInput.userName,
        birthday: finalInput.userDob,
        phone: finalInput.userPhone,
        funnel: toKorean('funnel', store.funnel),
        is_agreed_tos: true,

        country: toKorean('country', finalInput.country),
        plan_name: toKorean('plan_name', finalInput.planName || ''),
        join_type: toKorean('join_type', store.joinType),
        contract: toKorean('contract', store.contract),
        discount_type: toKorean('discount_type', store.discountType),
        requirements: finalInput.requirements,

        form_data: formDataJson,
      }

      const { error } = await supabase.from("foreigner_order").insert([insertPayload])
      if (error) throw error

      // 세션 저장
      const userInfoToSave = {
        userName: finalInput.userName,
        userDob: finalInput.userDob,
        userPhone: finalInput.userPhone,
        country: finalInput.country,
        requirements: finalInput.requirements,
      }
      sessionStorage.setItem("user-info", JSON.stringify(userInfoToSave))

      const currentQueryParams = window.location.search
      window.location.href = `/${locale}/phone/result` + currentQueryParams

    } catch (e) {
      console.error("DB Error:", e)
      alert(`접수 실패: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  if (!store.isReady) return <div className="min-h-screen flex items-center justify-center bg-white">{t('Phone.Common.loading')}</div>

  const planInfo = PLAN_DETAILS[store.selectedPlanId] || PLAN_DETAILS["plan_69"]

  // ✅ [수정] 넷플릭스 요금제(plan_90_v)일 경우 4,450원 추가
  const additionalCost = store.selectedPlanId === 'plan_90_v' ? 4450 : 0
  const finalPlanPrice = planInfo.price + additionalCost

  const planPriceText = `${t('Phone.Order.monthly_price')} ${formatPrice(finalPlanPrice, locale)}${t('Phone.Common.won')}`

  return (
    <div className="flex flex-col gap-5 w-full max-w-[480px] mx-auto min-h-screen pb-10 bg-white">
      <div className="px-5 pt-4">
        <p className="font-bold text-xl whitespace-pre-wrap text-label-900">{t('Phone.Order.confirm_info_title')}</p>
      </div>
      <div className="bg-white px-5 pt-4 pb-2">
        <OrderProductSummary
          image={store.imageUrl}
          title={store.title}
          spec={store.spec}
          price={store.price}
        />
      </div>

      <OrderUserForm
        userName={store.userName}
        userDob={store.userDob}
        userPhone={store.userPhone}

        country={store.country}

        requirements={store.requirements}
        joinType={store.joinType}
        contract={store.contract}
        discountType={store.discountType}
        planName={planInfo.name}
        planData={planInfo.data}
        planPrice={planPriceText}
        onConfirm={handleConfirm}
        isReadOnly={isReadOnly}
      />
    </div>
  )
}