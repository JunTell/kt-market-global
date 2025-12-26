"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { calcKTmarketSubsidy } from "@/lib/asamo-utils"
import { useTranslations } from "next-intl"

import JunCarousel from "@/components/feature/phone/JunCarousel"
import OptionSelector, { CapacityOption, ColorOption } from "@/components/feature/phone/OptionSelector"
import PlanSelector from "@/components/feature/phone/PlanSelector"
import StickyBar from "@/components/feature/phone/StickyBar"
import { usePhoneStore } from "@/store/usePhoneStore"
import { COLOR_MAP, MODEL_VARIANTS, PLAN_METADATA } from "@/constants/phonedata"

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

    const [availableColors, setAvailableColors] = useState<string[]>([])
    const [colorImages, setColorImages] = useState<Record<string, string[]>>({})

    // URL 파싱
    const urlModel = searchParams.get("model") || "aip17-256"
    const parts = urlModel.split("-")
    
    let prefix = parts[0]
    let capacityIndex = 1

    if (prefix === "sm") {
        prefix = `${parts[0]}-${parts[1]}` 
        capacityIndex = 2
    }

    const defaultCapacity = MODEL_VARIANTS[prefix]?.[0] || "256"
    const capacity = parts[capacityIndex] || defaultCapacity
    const colorFromUrl = parts.slice(capacityIndex + 1).join("-")

    useEffect(() => {
        const fetchData = async () => {
            const dbModelKey = `${prefix}-${capacity}`

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

                // 삼성 모델 예외 처리
                let queryModelKey = dbModelKey
                if (prefix === "sm-m366k") {
                    queryModelKey = "sm-m366k"
                } else if (prefix === "sm-s931nk") {
                    if (capacity === "512") queryModelKey = "sm-s931nk512"
                    else queryModelKey = "sm-s931nk"
                }

                const [deviceRes, subsidyRes, planRes] = await Promise.all([
                    supabase.from("devices").select("*").eq("model", queryModelKey).maybeSingle(),
                    supabase.from("ktmarket_subsidy").select("*").eq("model", queryModelKey).maybeSingle(),
                    supabase.from(planTable).select("plan_id, price, disclosure_subsidy").eq("model", queryModelKey).in("plan_id", PLAN_METADATA.map(p => p.dbId))
                ])

                if (!deviceRes.data) {
                    console.error("Device not found for:", queryModelKey)
                    throw new Error("Device not found")
                }

                const device = deviceRes.data
                const subsidies = subsidyRes.data || {}
                const dbPlans = planRes.data || []

                // 요금제 데이터 병합
                const mergedPlans = PLAN_METADATA.map(meta => {
                    const dbData = dbPlans.find(p => p.plan_id === meta.dbId)
                    const price = meta.fixedPrice || dbData?.price || 0
                    let marketSubsidy = calcKTmarketSubsidy(meta.dbId, price, subsidies, dbModelKey, regType)
                    
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
    const isSpecial = prefix.startsWith("aip17") || prefix.startsWith("aipa")
    const specialDiscount = isSpecial && store.registrationType === "mnp" ? 70000 : 0
    
    let finalPriceInfo = { finalDevicePrice: 0 } 
    if (currentPlan) {
       const mSubsidy = currentPlan.marketSubsidy || 0
       const dSubsidy = currentPlan.disclosureSubsidy || 0
       
       if (store.discountMode === 'device') {
           finalPriceInfo.finalDevicePrice = Math.max(0, store.originPrice - mSubsidy - dSubsidy - specialDiscount)
       } else {
           finalPriceInfo.finalDevicePrice = Math.max(0, store.originPrice - mSubsidy - specialDiscount)
       }
    }

    if (loading && !store.title) {
        return <div className="min-h-screen flex items-center justify-center">{t('Phone.Common.loading')}</div>
    }

    return (
        <div className="w-full max-w-[430px] mx-auto bg-white min-h-screen pb-24">
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
                             isSpecialModel={isSpecial}
                             onSelectPlan={(id) => store.setStore({ selectedPlanId: id })}
                             onChangeMode={(mode) => store.setStore({ discountMode: mode })}
                         />
                         <StickyBar
                            finalPrice={`${new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : 'en-US').format(finalPriceInfo.finalDevicePrice)}${t('Phone.Common.won')}`}
                            label={t('Phone.Page.submit_application')}
                            onClick={handleOrder}
                         />
                    </>
                )}
            </div>
        </div>
    )
}