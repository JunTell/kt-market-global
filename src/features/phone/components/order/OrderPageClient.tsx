"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { submitOrder } from "@/features/phone/actions/order"
import { getPlanDetails, getColorMap } from "@/features/phone/lib/phonedata"
import { toKorean } from "@/shared/lib/toKorean"
import { formatPrice } from "@/shared/lib/format"
import { parsePhoneModel } from "@/features/phone/lib/phoneModel"
import { DEFAULT_COUNTRY } from "@/shared/constants/options"
import { checkIsSoldOut } from "@/features/phone/lib/stock"

import OrderProductSummary from "@/features/phone/components/order/OrderProductSummary"
import OrderUserForm from "@/features/phone/components/order/OrderUserForm"
import OrderSkeleton from "@/features/phone/components/skeleton/OrderSkeleton"

interface Props {
    initialDeviceData?: Record<string, unknown> | null
    modelFromUrl?: string | null
}

export default function OrderPageClient({ initialDeviceData, modelFromUrl }: Props) {
    const t = useTranslations()
    const params = useParams()
    const locale = params.locale as string


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
        country: DEFAULT_COUNTRY,
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

        const initializeData = async () => {
            // 1. 세션에서 제품 정보 로드
            let sessionData = null
            try {
                const sessionDataStr = sessionStorage.getItem("asamoDeal")
                if (sessionDataStr) {
                    sessionData = JSON.parse(sessionDataStr)
                }
            } catch (e) {
                console.error(e)
            }

            // 우선순위 결정:
            // 1. URL의 model과 세션의 model이 일치하면 세션 데이터 사용 (사용자 커스텀 정보 유지)
            // 2. 일치하지 않거나 세션이 없지만, 서버에서 받은 initialDeviceData가 있으면 그것을 사용
            // 3. 그 외의 경우 (세션만 있는데 URL과 불일치 - 보통 따르지 않음, 혹은 URL 모델 기준으로 DB 재조회 필요할 수 있으나 SSR에서 처리됨)

            let dataToApply = null;

            if (sessionData && modelFromUrl && sessionData.model === modelFromUrl) {
                dataToApply = sessionData;
            } else if (initialDeviceData) {
                dataToApply = initialDeviceData;
            } else if (sessionData && !modelFromUrl) {
                // URL 파라미터가 없으면 세션 데이터라도 보여줌 (예외 케이스)
                dataToApply = sessionData;
            }

            if (dataToApply) {
                // 서버 데이터일 경우 포맷팅이 필요할 수 있음
                // applyDataToStore 내에서 처리
                if (initialDeviceData && dataToApply === initialDeviceData) {
                    // Server Data Formatting
                    applyServerDataToStore(initialDeviceData);
                } else {
                    applyDataToStore(dataToApply);
                }
            } else if (modelFromUrl && !initialDeviceData) {
                // SSR 실패했거나 클라이언트 네비게이션으로 왔을 때 fallback fetching?
                // 이미 SSR에서 시도했으므로 여기선 생략 가능하지만, 안전장치로 둘 수 있음.
                // 하지만 여기선 SSR을 신뢰하고 생략.
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
            } catch (e) {
                console.error(e)
            }
        }

        initializeData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialDeviceData, modelFromUrl])

    // 기존 applyDataToStore (세션 데이터/클라이언트 포맷용)
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
        if (data.finalDevicePrice !== undefined) {
            priceText = `${t('Phone.Order.installment_price')} ${formatPrice(Number(data.finalDevicePrice), locale)}${t('Phone.Common.won')}`
        } else {
            priceText = `${t('Phone.Order.release_price')} ${formatPrice(Number(data.originPrice) || Number(data.price) || 0, locale)}${t('Phone.Common.won')}`
        }

        setStore(prev => ({
            ...prev,
            imageUrl: String(data.imageUrl || ""),
            title: String(data.title || data.pet_name || t('Phone.Common.model_loading')),
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

    // 서버 데이터 적용 (DB Raw Data -> Store)
    const applyServerDataToStore = (device: Record<string, unknown>) => {
        // url param model (fullModelStr) 복원 필요
        // initialDeviceData에 fullModelStr가 없으므로 modelFromUrl 사용
        // 하지만 DB data가 device table row 그대로라면 구조가 다름.

        const fullModelStr = modelFromUrl || "";
        const { prefix, capacity, color: colorKey } = parsePhoneModel(fullModelStr);

        // 사용 가능한 색상 및 이미지 처리
        const availableColors = ((device.colors_en as string[]) || []).filter((c: string) => {
            if (!c || !(device.images as Record<string, string[]>)?.[c]?.length) return false
            return !checkIsSoldOut(prefix, capacity, c)
        })

        // URL의 색상이 유효하고 재고가 있으면 사용, 아니면 첫 번째 사용 가능한 색상 사용
        const isUrlColorAvailable = availableColors.includes(colorKey)
        const selectedColor = isUrlColorAvailable ? colorKey : (availableColors[0] || (device.colors_en as string[])?.[0] || "black")
        const colorName = COLOR_MAP[selectedColor] || selectedColor

        const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || ""
        const imageFile = (device.images as Record<string, string[]>)?.[selectedColor]?.[0] || "01"
        const imageUrl = `${cdnUrl}/phone/${device.category}/${selectedColor}/${imageFile}.png`

        setStore(prev => ({
            ...prev,
            imageUrl: imageUrl,
            title: device.pet_name as string,
            spec: `${device.capacity} · ${colorName}`,
            price: `${t('Phone.Order.release_price')} ${formatPrice(device.price as number, locale)}${t('Phone.Common.won')}`,
            deviceModel: fullModelStr,
            modelBase: device.model as string, // DB key
            deviceCapacity: device.capacity as string,
            deviceColor: colorName,
            joinType: t('Phone.Order.join_type_change'),
            discountType: "device",
            selectedPlanId: "plan_69",
            isReady: true,
        }))
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
            } catch (e) {
                console.error(e)
            }

            const companyName = t('Phone.Order.telecom_kt')
            const deviceName = store.title.replace(/\s\d+(GB|TB)$/i, "").trim()

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

            const payload = {
                company: toKorean('company', companyName),
                device: deviceName,
                capacity: store.deviceCapacity,
                color: toKorean('color', store.deviceColor),
                name: finalInput.userName,
                birthday: finalInput.userDob,
                phone: finalInput.userPhone,
                funnel: toKorean('funnel', store.funnel),
                country: toKorean('country', finalInput.country),
                plan_name: toKorean('plan_name', finalInput.planName || ''),
                join_type: toKorean('join_type', store.joinType),
                contract: toKorean('contract', store.contract),
                discount_type: toKorean('discount_type', store.discountType),
                requirements: finalInput.requirements,
                form_data: formDataJson,
            }

            const result = await submitOrder({}, payload)

            if (!result.success) {
                throw new Error(result.error || "Submission failed")
            }

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
            console.error("Action Error:", e)
            alert(`접수 실패: ${e instanceof Error ? e.message : String(e)}`)
        }
    }

    if (!store.isReady) return <OrderSkeleton />

    const planInfo = PLAN_DETAILS[store.selectedPlanId] || PLAN_DETAILS["plan_69"]

    const additionalCost = store.selectedPlanId === 'plan_90_v' ? 4450 : 0
    const finalPlanPrice = planInfo.price + additionalCost

    const planPriceText = `${t('Phone.Order.monthly_price')} ${formatPrice(finalPlanPrice, locale)}${t('Phone.Common.won')}`

    return (
        <div className="flex flex-col gap-5 w-full max-w-[480px] mx-auto min-h-screen pb-10 bg-white">
            <div className="px-5 pt-4">
                <p className="font-bold text-xl whitespace-pre-wrap text-grey-900">{t('Phone.Order.confirm_info_title')}</p>
            </div>
            <div className="bg-base px-5 pt-4 pb-2">
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
