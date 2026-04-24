"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import StickyBar from "@/features/phone/components/StickyBar"
import JoinTypeSelector from "@/features/phone/components/JoinTypeSelector"

import dynamic from "next/dynamic"
import { formatPrice } from "@/shared/lib/format"
import { calculateFinalDevicePrice } from "@/features/phone/lib/priceCalculation"

import ProductImageCarousel from "@/shared/components/ui/ProductImageCarousel"
import OptionPills, { type ColorPill, type CapacityPill } from "@/shared/components/ui/OptionPills"
import WhyCheapCard from "@/shared/components/ui/WhyCheapCard"
import ReviewCardList from "@/shared/components/ui/ReviewCardList"
import FAQAccordion from "@/shared/components/ui/FAQAccordion"

const PlanSelector = dynamic(() => import("@/features/phone/components/PlanSelector"), { ssr: true })

import { usePhoneStore, Plan } from "@/features/phone/model/usePhoneStore"
import { MODEL_VARIANTS, getColorMap } from "@/features/phone/lib/phonedata"
import { checkIsSoldOut } from "@/features/phone/lib/stock"

interface InitialData {
  model: string
  title: string
  capacity: string
  color: string
  originPrice: number
  imageUrl: string
  imageUrls: string[]
  plans: Plan[]
  subsidies: unknown
  registrationType: "chg" | "mnp"
  userCarrier: string
  availableColors: string[]
  colorImages: Record<string, string[]>
  prefix: string
}

interface Props {
  initialData: InitialData
  locale: string
}

export default function PhoneDetailClient({ initialData, locale }: Props) {
  const t = useTranslations()
  const router = useRouter()
  const store = usePhoneStore()

  useEffect(() => {
    store.setStore({
      model: initialData.model,
      title: initialData.title,
      capacity: initialData.capacity,
      originPrice: initialData.originPrice,
      color: initialData.color,
      imageUrl: initialData.imageUrl,
      imageUrls: initialData.imageUrls,
      plans: initialData.plans,
      subsidies: initialData.subsidies,
      registrationType: initialData.registrationType,
      userCarrier: initialData.userCarrier,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData])

  const isStoreSynced = store.model === initialData.model
  const currentTitle = (isStoreSynced && store.title) || initialData.title
  const currentCapacity = (isStoreSynced && store.capacity) || initialData.capacity
  const currentColor = (isStoreSynced && store.color) || initialData.color
  const currentOriginPrice = (isStoreSynced && store.originPrice) || initialData.originPrice
  const currentImageUrls = (isStoreSynced && store.imageUrls && store.imageUrls.length > 0) ? store.imageUrls : initialData.imageUrls
  const currentPlans = (isStoreSynced && store.plans && store.plans.length > 0) ? store.plans : initialData.plans

  const { availableColors, colorImages, prefix } = initialData
  const COLOR_MAP = getColorMap(t)

  const isCurrentlySoldOut = checkIsSoldOut(prefix, currentCapacity, currentColor)
  const allVariantsSoldOut = availableColors.every((c) => checkIsSoldOut(prefix, currentCapacity, c))

  const handleCapacityChange = (newCap: string) => {
    store.setStore({ capacity: newCap })
  }

  const handleColorChange = (newColor: string) => {
    const newImageUrls = colorImages[newColor] || []
    const newImageUrl = newImageUrls[0] || ""
    store.setStore({ color: newColor, imageUrl: newImageUrl, imageUrls: newImageUrls })
    const newModel = `${prefix}-${currentCapacity}-${newColor}`
    router.replace(`/${locale}/phone?model=${encodeURIComponent(newModel)}`, { scroll: false })
  }

  const handleOrder = () => {
    if (isCurrentlySoldOut) return
    const payload = {
      model: store.model || initialData.model,
      title: currentTitle,
      capacity: currentCapacity,
      color: currentColor,
      originPrice: currentOriginPrice,
      imageUrl: currentImageUrls[0] || "",
      selectedPlanId: store.selectedPlanId,
      discountMode: store.discountMode,
      finalDevicePrice,
      userCarrier: store.userCarrier || initialData.userCarrier,
      registrationType: store.registrationType || initialData.registrationType,
      savedAt: new Date().toISOString(),
    }
    sessionStorage.setItem("asamoDeal", JSON.stringify(payload))
    router.push(`/${locale}/phone/order?model=${store.model || initialData.model}`)
  }

  const capacityOpts: CapacityPill[] = (MODEL_VARIANTS[prefix] || []).map((c) => ({
    label: c === "1t" ? "1TB" : c === "2t" ? "2TB" : `${c}GB`,
    value: c,
  }))

  const colorOpts: ColorPill[] = availableColors.map((c) => ({
    label: COLOR_MAP[c] || c,
    value: c,
    image: colorImages[c]?.[0] || "",
    isSoldOut: checkIsSoldOut(prefix, currentCapacity, c),
  }))

  const currentPlan = currentPlans.find((p) => p.id === store.selectedPlanId)

  const finalDevicePrice = calculateFinalDevicePrice({
    originPrice: currentOriginPrice,
    plan: currentPlan,
    discountMode: store.discountMode,
    registrationType: store.registrationType || initialData.registrationType,
    modelPrefix: prefix,
  })

  const priceText = `${formatPrice(finalDevicePrice, locale)}${t("Phone.Common.won")}`
  const originText = `${formatPrice(currentOriginPrice, locale)}${t("Phone.Common.won")}`

  return (
    <div className="w-full max-w-[780px] mx-auto bg-white min-h-screen pb-28 md:pb-12">
      <div className="md:flex md:gap-8 md:items-start md:py-12">
        <div className="w-full md:w-1/2 md:sticky md:top-24">
          <ProductImageCarousel urls={currentImageUrls} altBase={currentTitle} className="md:max-w-[440px] md:mx-auto" />
        </div>

        <div className="px-5 md:px-0 w-full mt-6 md:mt-0 md:w-1/2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1d1d1f]">{currentTitle}</h1>
            <div className="mt-2 text-xs text-[#6B7280]">
              {currentCapacity}GB · {COLOR_MAP[currentColor] || currentColor}
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold tabular-nums text-[#1d1d1f]">{priceText}</span>
              <span className="text-xs text-[#9CA3AF] line-through tabular-nums">{originText}</span>
            </div>
          </div>

          <OptionPills
            selectedCapacity={currentCapacity}
            selectedColor={currentColor}
            capacities={capacityOpts}
            colors={colorOpts}
            onSelectCapacity={handleCapacityChange}
            onSelectColor={handleColorChange}
            capacityLabel={t("Phone.OptionSelector.capacity_label") || "Capacity"}
            colorLabel={t("Phone.OptionSelector.color_label") || "Color"}
            soldOutLabel={t("Phone.OptionSelector.sold_out")}
          />

          {allVariantsSoldOut && (
            <div className="rounded-[16px] border border-[#FDE8EA] bg-[#FEF2F2] p-3 text-xs font-semibold text-[#B91C1C]">
              All variants sold out for this capacity.
            </div>
          )}

          <WhyCheapCard />

          <JoinTypeSelector
            registrationType={store.registrationType || initialData.registrationType}
            onChange={(type) => store.setStore({ registrationType: type })}
            t={t}
          />

          <PlanSelector
            plans={currentPlans}
            selectedPlanId={store.selectedPlanId}
            discountMode={store.discountMode}
            originPrice={currentOriginPrice}
            ktMarketDiscount={0}
            registrationType={store.registrationType || initialData.registrationType}
            modelPrefix={prefix}
            onSelectPlan={(id: string) => store.setStore({ selectedPlanId: id })}
            onChangeMode={(mode: "device" | "plan") => store.setStore({ discountMode: mode })}
          />

          <div className="hidden md:block">
            <button
              onClick={handleOrder}
              disabled={isCurrentlySoldOut}
              className={
                "w-full text-white text-lg font-bold py-4 rounded-xl transition-colors shadow-lg cursor-pointer " +
                (isCurrentlySoldOut
                  ? "bg-gray-400 cursor-not-allowed shadow-none"
                  : "bg-[#0071e3] hover:bg-[#0077ED] shadow-blue-500/20")
              }
            >
              {isCurrentlySoldOut ? t("Phone.OptionSelector.sold_out") : t("Phone.Page.submit_application")}
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 md:px-8 mt-8">
        <ReviewCardList filterModel={currentTitle} autoGrid />
        <FAQAccordion namespace="Phone.FAQ" />
      </div>

      <div className="md:hidden">
        <StickyBar
          finalPrice={priceText}
          label={isCurrentlySoldOut ? t("Phone.OptionSelector.sold_out") : t("Phone.Page.submit_application")}
          onClick={handleOrder}
          disabled={isCurrentlySoldOut}
        />
      </div>
    </div>
  )
}
