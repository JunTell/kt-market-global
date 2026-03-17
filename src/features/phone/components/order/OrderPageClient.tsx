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

    const PLAN_DETAILS = getPlanDetails(t)
    const COLOR_MAP = getColorMap(t)

    const [store, setStore] = useState({
        imageUrl: "",
        title: "",
        spec: "",
        price: "",
        userName: "",
        userPhone: "",
        foreignerId: "",
        zipCode: "",
        address: "",
        detailAddress: "",
        country: DEFAULT_COUNTRY,
        joinType: t('Phone.Order.join_type_change'),
        contract: t('Phone.Order.contract_24'),
        discountType: "device",
        selectedPlanId: "plan_69",
        deviceModel: "",
        modelBase: "",
        deviceCapacity: "",
        deviceColor: "",
        telecomCompany: t('Phone.Order.telecom_kt'),
        funnel: t('Phone.Order.funnel_asamo'),
        isReady: false,
    })

    const [isReadOnly, setIsReadOnly] = useState(false)

    useEffect(() => {
        if (store.isReady) {
            if (typeof window !== 'undefined' && window.history) {
                window.history.scrollRestoration = 'manual'
            }
            const timer = setTimeout(() => {
                window.scrollTo(0, 0)
            }, 10)
            return () => clearTimeout(timer)
        }
    }, [store.isReady])

    useEffect(() => {
        if (typeof window === "undefined") return

        const initializeData = async () => {
            let sessionData = null
            try {
                const sessionDataStr = sessionStorage.getItem("asamoDeal")
                if (sessionDataStr) {
                    sessionData = JSON.parse(sessionDataStr)
                }
            } catch (e) {
                console.error(e)
            }

            let dataToApply = null
            if (sessionData && modelFromUrl && sessionData.model === modelFromUrl) {
                dataToApply = sessionData
            } else if (initialDeviceData) {
                dataToApply = initialDeviceData
            } else if (sessionData && !modelFromUrl) {
                dataToApply = sessionData
            }

            if (dataToApply) {
                if (initialDeviceData && dataToApply === initialDeviceData) {
                    applyServerDataToStore(initialDeviceData)
                } else {
                    applyDataToStore(dataToApply)
                }
            }

            // session restore
            try {
                const userInfoStr = sessionStorage.getItem("user-info")
                if (userInfoStr) {
                    const userInfo = JSON.parse(userInfoStr)
                    setStore(prev => ({
                        ...prev,
                        userName: userInfo.userName || prev.userName,
                        userPhone: userInfo.userPhone || prev.userPhone,
                        foreignerId: userInfo.foreignerId || prev.foreignerId,
                        zipCode: userInfo.zipCode || prev.zipCode,
                        address: userInfo.address || prev.address,
                        detailAddress: userInfo.detailAddress || prev.detailAddress,
                        country: userInfo.country || prev.country,
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

    const applyDataToStore = (data: Record<string, unknown>) => {
        const colorKey = String(data.color || "random")
        const colorName = COLOR_MAP[colorKey] || colorKey || t('Phone.Common.default_color')
        const planId = String(data.selectedPlanId || "plan_69")
        const joinTypeKr = data.registrationType === "mnp" ? t('Phone.Order.join_type_mnp') : t('Phone.Order.join_type_change')
        const discountTypeKr = String(data.discountType || data.discountMode || data.mode || "device")
        const { prefix } = parsePhoneModel(String(data.model || ""))
        const modelBase = prefix

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

    const applyServerDataToStore = (device: Record<string, unknown>) => {
        const fullModelStr = modelFromUrl || ""
        const { prefix, capacity, color: colorKey } = parsePhoneModel(fullModelStr)

        const availableColors = ((device.colors_en as string[]) || []).filter((c: string) => {
            if (!c || !(device.images as Record<string, string[]>)?.[c]?.length) return false
            return !checkIsSoldOut(prefix, capacity, c)
        })

        const isUrlColorAvailable = availableColors.includes(colorKey)
        const selectedColor = isUrlColorAvailable ? colorKey : (availableColors[0] || (device.colors_en as string[])?.[0] || "black")
        const colorName = COLOR_MAP[selectedColor] || selectedColor

        const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || ""
        const imageFile = (device.images as Record<string, string[]>)?.[selectedColor]?.[0] || "01"
        const imageUrl = `${cdnUrl}/phone/${prefix}/${selectedColor}/${imageFile}.png`

        setStore(prev => ({
            ...prev,
            imageUrl: imageUrl,
            title: device.pet_name as string,
            spec: `${device.capacity} · ${colorName}`,
            price: `${t('Phone.Order.release_price')} ${formatPrice(device.price as number, locale)}${t('Phone.Common.won')}`,
            deviceModel: fullModelStr,
            modelBase: device.model as string,
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
        userPhone: string
        foreignerId: string
        zipCode: string
        address: string
        detailAddress: string
        country: string
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
                capacity: store.deviceCapacity,
                pet_name: store.modelBase,
                register: toKorean('join_type', store.joinType),
                sub_phone: finalInput.userPhone,
                isAgreedTOS: true,
                planName: toKorean('plan_name', finalInput.planName || ''),
                contract: toKorean('contract', store.contract),
                discountType: toKorean('discount_type', store.discountType),
                foreignerId: finalInput.foreignerId,
                zipCode: finalInput.zipCode,
                address: finalInput.address,
                detailAddress: finalInput.detailAddress,
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
                birthday: finalInput.foreignerId.slice(0, 6),
                phone: finalInput.userPhone,
                funnel: toKorean('funnel', store.funnel),
                country: toKorean('country', finalInput.country),
                plan_name: toKorean('plan_name', finalInput.planName || ''),
                join_type: toKorean('join_type', store.joinType),
                contract: toKorean('contract', store.contract),
                discount_type: toKorean('discount_type', store.discountType),
                form_data: formDataJson,
                // New Fields
                foreigner_id: finalInput.foreignerId,
                zip_code: finalInput.zipCode,
                address: finalInput.address,
                detail_address: finalInput.detailAddress,
            }

            const result = await submitOrder({}, payload)

            if (!result.success) {
                throw new Error(result.error || "Submission failed")
            }

            const userInfoToSave = {
                userName: finalInput.userName,
                userPhone: finalInput.userPhone,
                foreignerId: finalInput.foreignerId,
                zipCode: finalInput.zipCode,
                address: finalInput.address,
                detailAddress: finalInput.detailAddress,
                country: finalInput.country,
            }
            sessionStorage.setItem("user-info", JSON.stringify(userInfoToSave))

            const currentQueryParams = window.location.search
            window.location.href = `/${locale}/phone/result` + currentQueryParams

        } catch (e) {
            console.error("Action Error:", e)
            alert(`Fail: ${e instanceof Error ? e.message : String(e)}`)
        }
    }

    if (!store.isReady) return <OrderSkeleton />

    const planInfo = PLAN_DETAILS[store.selectedPlanId] || PLAN_DETAILS["plan_69"]
    const additionalCost = store.selectedPlanId === 'plan_90_v' ? 4450 : 0
    const finalPlanPrice = planInfo.price + additionalCost
    const planPriceText = `${t('Phone.Order.monthly_price')} ${formatPrice(finalPlanPrice, locale)}${t('Phone.Common.won')}`

    return (
        <div className="flex flex-col w-full max-w-[480px] mx-auto min-h-screen pb-10 bg-white relative">
            <h2 className="text-[20px] font-bold text-grey-900 leading-[1.4] m-0 px-5 pt-5 pb-5 whitespace-pre-line">
                {t('Phone.Order.confirm_info_title')}
            </h2>
            
            <OrderUserForm
                imageUrl={store.imageUrl}
                title={store.title}
                spec={store.spec}
                price={store.price}
                userName={store.userName}
                userPhone={store.userPhone}
                foreignerId={store.foreignerId}
                zipCode={store.zipCode}
                address={store.address}
                detailAddress={store.detailAddress}
                country={store.country}
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
