"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { calcKTmarketSubsidy } from "@/lib/asamo-utils"
import { useTranslations } from "next-intl"
import { formatPrice } from "@/utils/format"
import { parsePhoneModel, getDBModelKey } from "@/utils/phoneModel"
import { calculateFinalDevicePrice } from "@/utils/priceCalculation"

import JunCarousel from "@/components/feature/phone/JunCarousel"
import OptionSelector, { CapacityOption, ColorOption } from "@/components/feature/phone/OptionSelector"
import PlanSelector from "@/components/feature/phone/PlanSelector"
import StickyBar from "@/components/feature/phone/StickyBar"
import { usePhoneStore } from "@/store/usePhoneStore"
import { MODEL_VARIANTS, getPlanMetadata, getColorMap } from "@/constants/phonedata"

export default function PhonePage() {
  const t = useTranslations()

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">{t('Phone.Common.loading')}</div>}>
      <PhoneContent />
    </Suspense>
  )
}

function PhoneContent() {
    const t = useTranslations()
    const searchParams = useSearchParams()
    const router = useRouter()
    const params = useParams()
    const locale = params.locale as string
    const supabase = createClient()
    const store = usePhoneStore()

    const [step, setStep] = useState<1 | 2>(1)
    const [loading, setLoading] = useState(true)

    const lastFetchedKey = useRef<string>("")

    // 다국어 데이터
    const PLAN_METADATA = getPlanMetadata(t)
    const COLOR_MAP = getColorMap(t) 

    const [availableColors, setAvailableColors] = useState<string[]>([])
    const [colorImages, setColorImages] = useState<Record<string, string[]>>({})

    // URL 파싱
    const urlModel = searchParams.get("model") || "aip17-256"
    const { prefix, capacity, color: colorFromUrl } = parsePhoneModel(urlModel)

    useEffect(() => {
        const fetchData = async () => {
            const dbModelKey = getDBModelKey(prefix, capacity)

            if (lastFetchedKey.current === dbModelKey && availableColors.length > 0) {
                const selectedColor = colorFromUrl && availableColors.includes(colorFromUrl) 
                    ? colorFromUrl 
                    : availableColors[0]
                
                const newImageUrls = colorImages[selectedColor] || []
                const newImageUrl = newImageUrls[0] || store.imageUrl

                store.setStore({
                    model: urlModel,
                    color: selectedColor,
                    imageUrl: newImageUrl,
                    imageUrls: newImageUrls,
                })
                return 
            }

            if (!store.title) setLoading(true) 
            
            try {
                const prefStr = sessionStorage.getItem("asamo_user_preference")
                const pref = prefStr ? JSON.parse(prefStr) : {}
                const regType = pref.registrationType || "chg"
                const carrier = pref.userCarrier || ""
                const planTable = regType === "chg" ? "device_plans_chg" : "device_plans_mnp"

                // DB 쿼리 (getDBModelKey에서 이미 예외 처리됨)
                const [deviceRes, subsidyRes, planRes] = await Promise.all([
                    supabase.from("devices").select("*").eq("model", dbModelKey).maybeSingle(),
                    supabase.from("ktmarket_subsidy").select("*").eq("model", dbModelKey).maybeSingle(),
                    supabase.from(planTable).select("plan_id, price, disclosure_subsidy").eq("model", dbModelKey).in("plan_id", PLAN_METADATA.map(p => p.dbId))
                ])

                if (!deviceRes.data) {
                    console.error("Device not found for:", dbModelKey)
                    throw new Error("Device not found")
                }

                const device = deviceRes.data
                const subsidies = subsidyRes.data || {}
                const dbPlans = planRes.data || []

                // 요금제 데이터 병합
                const mergedPlans = PLAN_METADATA.map(meta => {
                    const dbData = dbPlans.find(p => p.plan_id === meta.dbId)
                    const price = meta.fixedPrice || dbData?.price || 0
                    const marketSubsidy = calcKTmarketSubsidy(meta.dbId, price, subsidies, dbModelKey, regType)
                    
                    return {
                        id: meta.uuid,
                        dbId: meta.dbId,
                        name: meta.name,
                        data: meta.data,
                        description: meta.description,
                        calls: meta.calls,
                        texts: meta.texts,
                        price,
                        disclosureSubsidy: dbData?.disclosure_subsidy || 0,
                        marketSubsidy
                    }
                })

                // 색상 및 이미지 처리
                const colors = device.colors_en || []
                setAvailableColors(colors)

                const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || ""
                const imagesMap: Record<string, string[]> = {}
                
                colors.forEach((c: string) => {
                    const files = device.images?.[c] || []
                    imagesMap[c] = files.map((f: string) => 
                        `${cdnUrl}/phone/${device.category}/${c}/${f}.png`
                    )
                })
                setColorImages(imagesMap)

                const selectedColor = colorFromUrl && colors.includes(colorFromUrl) ? colorFromUrl : colors[0]
                const currentImageUrls = imagesMap[selectedColor] || []
                const currentImageUrl = currentImageUrls[0] || ""

                store.setStore({
                    model: urlModel,
                    title: device.pet_name,
                    capacity: device.capacity,
                    originPrice: device.price, 
                    color: selectedColor,
                    imageUrl: currentImageUrl,
                    imageUrls: currentImageUrls,
                    plans: mergedPlans,
                    subsidies,
                    registrationType: regType,
                    userCarrier: carrier,
                })

                lastFetchedKey.current = dbModelKey

            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlModel, prefix, capacity, colorFromUrl])

    // --- 핸들러 ---
    const handleCapacityChange = (newCap: string) => {
        store.setStore({ capacity: newCap })
        const newModel = `${prefix}-${newCap}-${store.color}`
        router.replace(`/${locale}/phone?model=${newModel}`, { scroll: false })
    }

    const handleColorChange = (newColor: string) => {
        const newImageUrls = colorImages[newColor] || []
        const newImageUrl = newImageUrls[0] || store.imageUrl

        store.setStore({
            color: newColor,
            imageUrl: newImageUrl,
            imageUrls: newImageUrls, // 전체 리스트 업데이트
        })
        const newModel = `${prefix}-${capacity}-${newColor}`
        router.replace(`/${locale}/phone?model=${newModel}`, { scroll: false })
    }

    const handleNextStep = () => {
        setStep(2)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const handleOrder = () => {
        const payload = {
           model: store.model,
           title: store.title,
           capacity: store.capacity,
           color: store.color,
           originPrice: store.originPrice,
           imageUrl: store.imageUrl,
           selectedPlanId: store.selectedPlanId,
           discountMode: store.discountMode,
           finalDevicePrice: finalPriceInfo.finalDevicePrice,
           userCarrier: store.userCarrier,
           registrationType: store.registrationType,
           savedAt: new Date().toISOString()
        }
        sessionStorage.setItem("asamoDeal", JSON.stringify(payload))
        router.push(`/${locale}/phone/order?model=${store.model}`)
    }

    // --- 옵션 데이터 ---
    const capacityOpts: CapacityOption[] = (MODEL_VARIANTS[prefix] || []).map(c => ({
        label: c === "1t" ? "1TB" : c === "2t" ? "2TB" : `${c}GB`,
        value: c
    }))

    const colorOpts: ColorOption[] = availableColors.map(c => ({
        label: COLOR_MAP[c] || c,
        value: c,
        // 대표 이미지만 전달 (썸네일용)
        image: colorImages[c]?.[0] || "",
        isSoldOut: false
    }))

    // --- 가격 계산 ---
    const currentPlan = store.plans.find(p => p.id === store.selectedPlanId)

    const finalDevicePrice = calculateFinalDevicePrice({
        originPrice: store.originPrice,
        plan: currentPlan,
        discountMode: store.discountMode,
        registrationType: store.registrationType,
        modelPrefix: prefix
    })

    const finalPriceInfo = { finalDevicePrice }

    if (loading && !store.title) {
        return <div className="min-h-screen flex items-center justify-center">{t('Phone.Common.loading')}</div>
    }

    return (
        <div className="w-full max-w-[480px] mx-auto bg-white min-h-screen pb-24">
            <JunCarousel urls={store.imageUrls} />

            <div className="px-5">
                <div className="py-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-[#1d1d1f] mb-1">{store.title}</h1>
                    <div className="text-sm text-gray-500">{store.capacity} · {COLOR_MAP[store.color] || store.color}</div>
                </div>

                {step === 1 && (
                    <>
                        <OptionSelector 
                           modelPrefix={prefix}
                           selectedCapacity={capacity}
                           selectedColorValue={store.color}
                           capacityOptions={capacityOpts}
                           colorOptions={colorOpts} 
                           onSelectCapacity={handleCapacityChange}
                           onSelectColor={handleColorChange}
                        />
                        <StickyBar
                            finalPrice=""
                            label={t('Phone.Page.select_plan_button')}
                            onClick={handleNextStep}
                        />
                    </>
                )}

                {step === 2 && (
                    <>
                         <PlanSelector
                             plans={store.plans}
                             selectedPlanId={store.selectedPlanId}
                             discountMode={store.discountMode}
                             originPrice={store.originPrice}
                             ktMarketDiscount={0}
                             registrationType={store.registrationType}
                             modelPrefix={prefix}
                             onSelectPlan={(id) => store.setStore({ selectedPlanId: id })}
                             onChangeMode={(mode) => store.setStore({ discountMode: mode })}
                         />
                         <StickyBar
                            finalPrice={`${formatPrice(finalPriceInfo.finalDevicePrice, locale)}${t('Phone.Common.won')}`}
                            label={t('Phone.Page.submit_application')}
                            onClick={handleOrder}
                         />
                    </>
                )}
            </div>
        </div>
    )
}