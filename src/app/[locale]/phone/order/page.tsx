"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"
import { getPlanDetails, getColorMap } from "@/constants/phonedata"
import OrderProductSummary from "@/components/feature/phone/order/OrderProductSummary"
import OrderUserForm from "@/components/feature/phone/order/OrderUserForm"

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
        if (sessionDataStr) sessionData = JSON.parse(sessionDataStr)
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
            country: userInfo.country || prev.country, // ✅ country 로드
            requirements: userInfo.requirements || prev.requirements,
          }))
          setIsReadOnly(true)
        }
      } catch (e) { console.error(e) }
    }

    fetchData()
  }, [])

  // 데이터 적용 헬퍼
  const applyDataToStore = (data: any) => {
    const format = (n: number) => new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : 'en-US').format(n)
    const colorKey = data.color || "random"
    const colorName = COLOR_MAP[colorKey] || colorKey || t('Phone.Common.default_color')
    const planId = data.selectedPlanId || "plan_69"
    const joinTypeKr = data.registrationType === "mnp" ? t('Phone.Order.join_type_mnp') : t('Phone.Order.join_type_change')
    const discountTypeKr = data.discountType || data.discountMode || data.mode || "device"
    const modelParts = (data.model || "").split("-")
    const modelBase = modelParts.length >= 2 ? `${modelParts[0]}-${modelParts[1]}` : data.model

    setStore(prev => ({
      ...prev,
      imageUrl: data.imageUrl || "",
      title: data.title || t('Phone.Common.model_loading'),
      spec: `${data.capacity || ""} · ${colorName}`,
      price: data.finalDevicePrice
        ? `${t('Phone.Order.installment_price')} ${format(data.finalDevicePrice)}${t('Phone.Common.won')}`
        : `${t('Phone.Order.release_price')} ${format(data.originPrice || 0)}${t('Phone.Common.won')}`,
      deviceModel: data.model,
      modelBase: modelBase,
      deviceCapacity: data.capacity,
      deviceColor: colorName,
      joinType: joinTypeKr,
      discountType: discountTypeKr,
      selectedPlanId: planId,
      isReady: true,
    }))
  }

  const fetchFromDB = async (fullModelStr: string) => {
    const parts = fullModelStr.split("-")
    const dbModelKey = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : fullModelStr
    const colorKey = parts.length >= 3 ? parts.slice(2).join("-") : "black"
    const colorName = COLOR_MAP[colorKey] || colorKey

    const { data: device } = await supabase
      .from("devices")
      .select("*")
      .eq("model", dbModelKey)
      .single()

    if (device) {
      const format = (n: number) => new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : 'en-US').format(n)
      const imageFile = device.images?.[colorKey]?.[0] || "01"
      const imageUrl = `https://juntell.s3.ap-northeast-2.amazonaws.com/phone/${device.category}/${colorKey}/${imageFile}.png`

      setStore(prev => ({
        ...prev,
        imageUrl: imageUrl,
        title: device.pet_name,
        spec: `${device.capacity} · ${colorName}`,
        price: `${t('Phone.Order.release_price')} ${format(device.price)}${t('Phone.Common.won')}`,
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

  const handleConfirm = async (userInput: any) => {
    try {
      const finalInput = userInput || store

      if (!finalInput || !finalInput.userName || !finalInput.userPhone) {
        alert(t('Phone.Order.form_alert'))
        return
      }

      let sessionData: any = {}
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
        color: store.deviceColor,
        phone: finalInput.userPhone,
        device: deviceName,
        funnel: store.funnel || t('Phone.Order.funnel_asamo'),
        country: finalInput.country,
        company: companyName,
        birthday: finalInput.userDob,
        capacity: store.deviceCapacity,
        pet_name: store.modelBase,
        register: store.joinType,
        sub_phone: finalInput.userPhone,
        isAgreedTOS: true,
        requirements: finalInput.requirements || t('Phone.Order.default_requirements'),
        planName: finalInput.planName,
        contract: store.contract,
        discountType: store.discountType,
        ...(sessionData?.['eligibility_data'] && {
          'eligibility_data': sessionData['eligibility_data']
        }),
      }

      const insertPayload = {
        company: companyName,
        device: deviceName,
        capacity: store.deviceCapacity,
        color: store.deviceColor,
        name: finalInput.userName,
        birthday: finalInput.userDob,
        phone: finalInput.userPhone,
        funnel: store.funnel,
        is_agreed_tos: true,
        
        // ✅ [추가된 컬럼 매핑]
        country: finalInput.country,       // 국적
        plan_name: finalInput.planName,    // 요금제
        join_type: store.joinType,         // 가입유형
        contract: store.contract,          // 약정
        discount_type: store.discountType, // 할인유형
        requirements: finalInput.requirements, // 요청사항
        
        form_data: formDataJson, 
      }
      
      const { error } = await supabase.from("foreigner_order").insert([insertPayload])
      if (error) throw error

      // 세션 저장
      const userInfoToSave = {
        userName: finalInput.userName,
        userDob: finalInput.userDob,
        userPhone: finalInput.userPhone,
        country: finalInput.country, // ✅ country 저장
        requirements: finalInput.requirements,
      }
      sessionStorage.setItem("user-info", JSON.stringify(userInfoToSave))

      const currentQueryParams = window.location.search
      window.location.href = `/${locale}/phone/result` + currentQueryParams

    } catch (e: any) {
      console.error("DB Error:", e)
      alert(`접수 실패: ${e.message}`)
    }
  }

  if (!store.isReady) return <div className="min-h-screen flex items-center justify-center bg-white">{t('Phone.Common.loading')}</div>

  const planInfo = PLAN_DETAILS[store.selectedPlanId] || PLAN_DETAILS["plan_69"]
  const planPriceText = `${t('Phone.Order.monthly_price')} ${new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : 'en-US').format(planInfo.price)}${t('Phone.Common.won')}`

  return (
    <div className="flex flex-col gap-5 w-full max-w-[480px] mx-auto min-h-screen pb-10">
      <div className="px-5 pt-4">
        <p className="font-bold text-xl whitespace-pre-wrap">{t('Phone.Order.confirm_info_title')}</p>
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