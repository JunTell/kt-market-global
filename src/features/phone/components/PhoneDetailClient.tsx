"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import Modal from "@/shared/components/ui/Modal"
import OptionSelector, { type CapacityOption, type ColorOption } from "@/features/phone/components/OptionSelector"
import OptionSummary from "@/features/phone/components/OptionSummary"
import StickyBar from "@/features/phone/components/StickyBar"
import JoinTypeSelector from "@/features/phone/components/JoinTypeSelector"

import dynamic from "next/dynamic"
import JunCarousel from "@/features/phone/components/JunCarousel"
import { formatPrice } from "@/shared/lib/format"
import { calculateFinalDevicePrice } from "@/features/phone/lib/priceCalculation"

const PlanSelector = dynamic(() => import("@/features/phone/components/PlanSelector"), { ssr: true })
import { usePhoneStore, Plan } from "@/features/phone/model/usePhoneStore"
import { MODEL_VARIANTS, getColorMap } from "@/features/phone/lib/phonedata"
import { checkIsSoldOut } from "@/features/phone/lib/stock"
import { BadgeCheck, ChevronLeft, Globe2, ShieldCheck, Truck } from "lucide-react"

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

  const [step, setStep] = useState<1 | 2>(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Data merging: Use store if populated (client interaction), else initialData (SSR/First load)
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
  const currentImageUrl = (isStoreSynced && store.imageUrl) || initialData.imageUrl
  const currentPlans = (isStoreSynced && store.plans && store.plans.length > 0) ? store.plans : initialData.plans

  const { availableColors, colorImages, prefix } = initialData
  const COLOR_MAP = getColorMap(t)

  const isCurrentlySoldOut = checkIsSoldOut(prefix, currentCapacity, currentColor)

  const handleCapacityChange = (newCap: string) => {
    store.setStore({ capacity: newCap })
  }

  const handleColorChange = (newColor: string) => {
    const newImageUrls = colorImages[newColor] || []
    const newImageUrl = newImageUrls[0] || currentImageUrl

    store.setStore({
      color: newColor,
      imageUrl: newImageUrl,
      imageUrls: newImageUrls,
    })

    const newModel = `${prefix}-${currentCapacity}-${newColor}`
    router.replace(`/${locale}/phone?model=${encodeURIComponent(newModel)}`, { scroll: false })
  }

  const handleNextStep = () => {
    if (isCurrentlySoldOut) return
    setStep(2)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleOrder = () => {
    if (isCurrentlySoldOut) return
    const payload = {
      model: store.model || initialData.model,
      title: currentTitle,
      capacity: currentCapacity,
      color: currentColor,
      originPrice: currentOriginPrice,
      imageUrl: currentImageUrl,
      selectedPlanId: store.selectedPlanId,
      discountMode: store.discountMode,
      finalDevicePrice: finalPriceInfo.finalDevicePrice,
      userCarrier: store.userCarrier || initialData.userCarrier,
      registrationType: store.registrationType || initialData.registrationType,
      savedAt: new Date().toISOString()
    }

    sessionStorage.setItem("asamoDeal", JSON.stringify(payload))
    router.push(`/${locale}/phone/order?model=${store.model || initialData.model}`)
  }

  const capacityOpts: CapacityOption[] = (MODEL_VARIANTS[prefix] || []).map(c => ({
    label: c === "1t" ? "1TB" : c === "2t" ? "2TB" : `${c}GB`,
    value: c
  }))

  const colorOpts: ColorOption[] = availableColors.map(c => ({
    label: COLOR_MAP[c] || c,
    value: c,
    image: colorImages[c]?.[0] || "",
    isSoldOut: checkIsSoldOut(prefix, currentCapacity, c)
  }))

  const currentPlan = currentPlans.find(p => p.id === store.selectedPlanId)

  const finalDevicePrice = calculateFinalDevicePrice({
    originPrice: currentOriginPrice,
    plan: currentPlan,
    discountMode: store.discountMode,
    registrationType: store.registrationType || initialData.registrationType,
    modelPrefix: prefix
  })

  const finalPriceInfo = { finalDevicePrice }
  const purchaseHighlights = [
    { key: "highlight1", Icon: ShieldCheck },
    { key: "highlight2", Icon: Globe2 },
    { key: "highlight3", Icon: Truck },
  ] as const

  return (
    <div className="w-full max-w-[780px] mx-auto bg-white min-h-screen pb-24 md:pb-8">
      <div className={`md:flex md:gap-8 md:items-start md:py-12 ${step === 2 ? 'justify-center' : ''}`}>
        {step === 1 && (
          <div className="w-full md:w-1/2 md:sticky md:top-24">
            <div className="rounded-[2rem] overflow-hidden bg-gray-50/50 md:w-[350px] mx-auto">
              <JunCarousel urls={currentImageUrls} className="md:h-[350px]" />
            </div>
          </div>
        )}

        <div className={`px-5 md:px-0 w-full mt-6 md:mt-0 ${step === 2 ? 'md:max-w-xl mx-auto' : 'md:w-1/2'}`}>
          {step === 1 && (
            <>
              <div className="mb-4 rounded-[28px] border border-[#dbe8f8] bg-[#f7fbff] p-4 md:p-5">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0055d4] shadow-sm">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  <span>{t('Phone.Page.purchase_ready')}</span>
                </div>
                <h2 className="text-lg font-bold text-[#111827] md:text-xl">
                  {t('Phone.Page.selection_title')}
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#5b6473]">
                  {t('Phone.Page.selection_desc')}
                </p>
                <div className="mt-4 grid gap-3">
                  {purchaseHighlights.map(({ key, Icon }) => (
                    <div key={key} className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-[#e6eef9]">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#0055d4]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#111827]">{t(`Phone.Page.${key}_title`)}</p>
                        <p className="text-xs leading-5 text-[#6b7280]">{t(`Phone.Page.${key}_desc`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <JoinTypeSelector
                registrationType={store.registrationType || initialData.registrationType}
                onChange={(type) => store.setStore({ registrationType: type })}
                t={t}
              />

              <div className="py-6 md:py-0 border-b border-gray-100 md:border-none mb-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h1 className="text-2xl md:text-2xl font-bold text-[#1d1d1f] mb-2">{currentTitle}</h1>
                    <div className="hidden md:block">
                      <div className="flex items-baseline gap-2 mt-4">
                        <span className="text-xl font-bold text-[#1d1d1f]">
                          {formatPrice(finalPriceInfo.finalDevicePrice, locale)}{t('Phone.Common.won')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="md:hidden text-sm text-gray-500 text-right">
                    {currentCapacity}GB · {COLOR_MAP[currentColor] || currentColor}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <OptionSummary
                  selectedColorName={COLOR_MAP[currentColor] || currentColor}
                  selectedCapacity={currentCapacity}
                  imageUrl={currentImageUrl}
                  onClick={() => setIsModalOpen(true)}
                />
              </div>

              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={t('Phone.OptionSelector.title')}
              >
                <OptionSelector
                  selectedCapacity={currentCapacity}
                  selectedColorValue={currentColor}
                  capacityOptions={capacityOpts}
                  colorOptions={colorOpts}
                  onSelectCapacity={handleCapacityChange}
                  onSelectColor={(val: string) => {
                    handleColorChange(val)
                    setIsModalOpen(false)
                  }}
                />
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isCurrentlySoldOut}
                  className={cn(
                    "w-full mt-6 text-white text-lg font-bold py-3.5 rounded-xl transition-colors cursor-pointer",
                    isCurrentlySoldOut ? "bg-gray-400 cursor-not-allowed" : "bg-[#0071e3] hover:bg-[#0077ED]"
                  )}
                >
                  {isCurrentlySoldOut ? "Sold Out" : t('Phone.Page.select_plan_button')}
                </button>
              </Modal>

              <div className="hidden md:block mt-8">
                <button
                  onClick={handleNextStep}
                  disabled={isCurrentlySoldOut}
                  className={cn(
                    "w-full text-white text-lg font-bold py-4 rounded-xl transition-colors shadow-lg cursor-pointer",
                    isCurrentlySoldOut ? "bg-gray-400 cursor-not-allowed shadow-none" : "bg-[#0071e3] hover:bg-[#0077ED] shadow-blue-500/20"
                  )}
                >
                  {isCurrentlySoldOut ? "Sold Out" : t('Phone.Page.select_plan_button')}
                </button>
              </div>

              <div className="md:hidden">
                <StickyBar
                  finalPrice=""
                  label={isCurrentlySoldOut ? "Sold Out" : t('Phone.Page.select_plan_button')}
                  onClick={handleNextStep}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-4 rounded-[28px] border border-[#e5edf8] bg-[#f9fbff] p-4 md:p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0055d4]">
                  {t('Phone.Page.pricing_eyebrow')}
                </p>
                <h3 className="mt-2 text-lg font-bold text-[#111827] md:text-xl">
                  {t('Phone.Page.pricing_title')}
                </h3>
                <p className="mt-1 text-sm leading-6 text-[#5b6473]">
                  {t('Phone.Page.pricing_desc')}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#111827] ring-1 ring-[#e2e8f0]">
                    {currentTitle}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#111827] ring-1 ring-[#e2e8f0]">
                    {currentCapacity}GB
                  </span>
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#111827] ring-1 ring-[#e2e8f0]">
                    {COLOR_MAP[currentColor] || currentColor}
                  </span>
                </div>
              </div>

              <div className="mb-6 flex items-center gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                  aria-label="go back"
                >
                  <ChevronLeft size={24} className="text-gray-600" />
                </button>
                <h2 className="text-xl font-bold text-[#1d1d1f]">{t('Phone.Page.price_info')}</h2>
              </div>

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

              <div className="hidden md:block mt-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500 font-medium">{t('Phone.Page.final_price')}</span>
                  <span className="text-2xl font-bold text-[#1d1d1f]">
                    {formatPrice(finalPriceInfo.finalDevicePrice, locale)}원
                  </span>
                </div>
                <button
                  onClick={handleOrder}
                  disabled={isCurrentlySoldOut}
                  className={cn(
                    "w-full text-white text-lg font-bold py-4 rounded-xl transition-colors shadow-lg cursor-pointer",
                    isCurrentlySoldOut ? "bg-gray-400 cursor-not-allowed shadow-none" : "bg-[#0071e3] hover:bg-[#0077ED] shadow-blue-500/20"
                  )}
                >
                  {isCurrentlySoldOut ? "Sold Out" : t('Phone.Page.submit_application')}
                </button>
              </div>

              <div className="md:hidden">
                <StickyBar
                  finalPrice={`${formatPrice(finalPriceInfo.finalDevicePrice, locale)}${t('Phone.Common.won')}`}
                  label={isCurrentlySoldOut ? "Sold Out" : t('Phone.Page.submit_application')}
                  onClick={handleOrder}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
