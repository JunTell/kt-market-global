"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { createClient } from "@/shared/api/supabase/client"
import { calcKTmarketSubsidy } from "@/features/phone/lib/asamo-utils"
import { useTranslations } from "next-intl"
import { formatPrice } from "@/shared/lib/format"
import { parsePhoneModel, getDBModelKey } from "@/features/phone/lib/phoneModel"
import { calculateFinalDevicePrice } from "@/features/phone/lib/priceCalculation"

import JunCarousel from "@/features/phone/components/JunCarousel"
import OptionSelector, { CapacityOption, ColorOption } from "@/features/phone/components/OptionSelector"
import PlanSelector from "@/features/phone/components/PlanSelector"
import StickyBar from "@/features/phone/components/StickyBar"
import { usePhoneStore } from "@/features/phone/model/usePhoneStore"
import { MODEL_VARIANTS, getPlanMetadata, getColorMap } from "@/features/phone/lib/phonedata"
import { checkIsSoldOut } from "@/features/phone/lib/stock"

import PhoneDetailSkeleton from "@/features/phone/components/skeleton/PhoneDetailSkeleton"

export default function PhonePage() {
    // const t = useTranslations() // Unused

    return (
        <Suspense fallback={<PhoneDetailSkeleton />}>
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

                    const planData = {
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

                    return planData
                })

                // 색상 및 이미지 처리
                // 1. 이미지가 있는 모든 색상을 가져옴 (품절 여부 관계없이)
                const colors = (device.colors_en || []).filter((c: string) => {
                    return device.images?.[c]?.length > 0
                })
                setAvailableColors(colors)

                const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || ""
                const imagesMap: Record<string, string[]> = {}

                // 이미지 맵 생성
                colors.forEach((c: string) => {
                    const files = device.images?.[c] || []
                    imagesMap[c] = files.map((f: string) =>
                        `${cdnUrl}/phone/${device.category}/${c}/${f}.png`
                    )
                })
                setColorImages(imagesMap)

                // 기본 선택 로직: URL 색상이 유효하고 재고가 있으면 사용, 아니면 첫 번째 "재고 있는" 색상 사용
                const inStockColors = colors.filter((c: string) => !checkIsSoldOut(prefix, capacity, c))

                const isUrlColorValid = colorFromUrl && colors.includes(colorFromUrl)
                const isUrlColorInStock = isUrlColorValid && !checkIsSoldOut(prefix, capacity, colorFromUrl)

                // 선택 우선순위:
                // 1. URL 색상이 유효하고 재고가 있음 -> URL 색상
                // 2. URL 색상이 유효하지만 재고가 없음 -> 첫 번째 재고 있는 색상으로 변경 (사용자 편의)
                // 3. 첫 번째 재고 있는 색상
                // 4. 재고가 하나도 없으면 그냥 첫 번째 색상 (품절 상태로 보여줌)
                const selectedColor = isUrlColorInStock
                    ? colorFromUrl
                    : (inStockColors[0] || colors[0] || (device.colors_en || [])[0] || "black")

                const currentImageUrls = imagesMap[selectedColor] || []
                const currentImageUrl = currentImageUrls[0] || ""

                // URL 업데이트 조건: 
                // 1. URL 색상이 아예 유효하지 않음 (목록에 없음)
                // 2. URL 색상이 품절임 (이 경우 재고 있는 색상으로 이동시켜주는 것이 좋음)
                if (colorFromUrl !== selectedColor) {
                    const correctedModel = `${prefix}-${capacity}-${selectedColor}`
                    router.replace(`/${locale}/phone?model=${correctedModel}`, { scroll: false })
                }

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
        isSoldOut: checkIsSoldOut(prefix, capacity, c)
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
        return <PhoneDetailSkeleton />
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