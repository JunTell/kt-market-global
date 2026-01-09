"use client"

import React from "react"
import { useTranslations, useLocale } from "next-intl"
import { formatPrice, formatManWon } from "@/shared/lib/format"
import { calculateFinalDevicePrice, calculateDiscountedMonthlyPrice, calculateTotalDeviceDiscount } from "@/features/phone/lib/priceCalculation"

export interface PlanData {
  id: string
  price: number
  data: string
  name: string
  description: string
  calls: string
  texts: string
  disclosureSubsidy: number
  marketSubsidy?: number
}

interface Props {
  plans: PlanData[]
  selectedPlanId: string
  discountMode: "device" | "plan"
  originPrice: number
  ktMarketDiscount: number
  onSelectPlan: (id: string) => void
  onChangeMode: (mode: "device" | "plan") => void
  registrationType: "chg" | "mnp"
  modelPrefix: string
}

export default function PlanSelector({
  plans,
  selectedPlanId,
  discountMode,
  originPrice,
  ktMarketDiscount,
  onSelectPlan,
  onChangeMode,
  registrationType,
  modelPrefix
}: Props) {
  const t = useTranslations()
  const locale = useLocale()

  const isDeviceMode = discountMode === "device"
  const selectedPlan = plans.find((p) => p.id === selectedPlanId)

  // 가격 계산
  const isNetflixSelected = selectedPlanId === "plan_90_v"
  const additionalNetflixCost = isNetflixSelected ? 4450 : 0
  const currentPlanPrice = (selectedPlan?.price ?? 0) + additionalNetflixCost
  const currentDiscountedPrice = calculateDiscountedMonthlyPrice(currentPlanPrice, discountMode)
  const currentDisclosureSubsidy = selectedPlan?.disclosureSubsidy ?? 0
  const currentMarketSubsidy = selectedPlan?.marketSubsidy ?? ktMarketDiscount
  const specialDiscount = 0 // 특별 할인은 현재 적용하지 않음

  const finalPrice = calculateFinalDevicePrice({
    originPrice,
    plan: selectedPlan,
    discountMode,
    registrationType,
    modelPrefix,
    ktMarketDiscount: currentMarketSubsidy
  })

  // 69 요금제 필터링 (화면엔 하나만 표시하고 내부에서 select로 분기)
  const visiblePlans = plans.filter((p) => p.id !== "plan_69_v")

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === "video") onSelectPlan("plan_69")
    else if (value === "simple") onSelectPlan("plan_69_v")
  }

  return (
    <div className="w-full flex flex-col gap-8 py-4">

      {/* 1. 할인 방법 탭 */}
      <div className="flex flex-col gap-3">
        <div className="text-[18px] font-semibold text-[#1d1d1f] flex items-center gap-2">
          {t('Phone.PlanSelector.discount_method_title')}
        </div>
        <div className="flex bg-[#F3F4F6] rounded-xl p-1 h-12 cursor-pointer">
          <div
            className={`flex-1 flex items-center justify-center text-sm rounded-lg transition-all ${isDeviceMode ? 'bg-white text-[#1d1d1f] font-semibold shadow-sm' : 'text-gray-500'}`}
            onClick={() => onChangeMode("device")}
          >
            {t('Phone.PlanSelector.device_discount')}
          </div>
          <div
            className={`flex-1 flex items-center justify-center text-sm rounded-lg transition-all ${!isDeviceMode ? 'bg-white text-[#1d1d1f] font-semibold shadow-sm' : 'text-gray-500'}`}
            onClick={() => onChangeMode("plan")}
          >
            {t('Phone.PlanSelector.plan_discount')}
          </div>
        </div>
        <div className="text-[13px] text-[#86868b] mt-1">
          <span className="mr-1">ℹ️</span>
          {isDeviceMode ? t('Phone.PlanSelector.device_discount_info') : t('Phone.PlanSelector.plan_discount_info')}
        </div>
      </div>

      {/* 2. 요금제 리스트 */}
      <div className="flex flex-col gap-3">
        <div className="text-[18px] font-semibold text-[#1d1d1f] flex items-center gap-2">
          {t('Phone.PlanSelector.select_plan_title')}
          {!isDeviceMode && <span className="text-xs text-red-500 bg-red-50 px-1.5 py-0.5 rounded font-bold">{t('Phone.PlanSelector.discount_badge')}</span>}
        </div>

        <div className="flex flex-col gap-3">
          {visiblePlans.map((plan) => {
            const is69PlanGroup = plan.id === "plan_69" || plan.price === 69000
            const isSelected = plan.id === selectedPlanId || (is69PlanGroup && (selectedPlanId === "plan_69_v" || selectedPlanId === "plan_69"))

            // 넷플릭스 초이스 베이직이면 4,450원 추가
            const isNetflixPlan = plan.id === "plan_90_v"
            const additionalCost = isNetflixPlan ? 4450 : 0
            const totalPlanPrice = plan.price + additionalCost

            const discountedMonthly = calculateDiscountedMonthlyPrice(totalPlanPrice, discountMode)
            const rightTextValue = calculateTotalDeviceDiscount({
              plan,
              discountMode,
              registrationType,
              modelPrefix,
              ktMarketDiscount: plan.marketSubsidy ?? ktMarketDiscount
            })
            const formattedPrice = formatPrice(plan.price, locale)
            const formattedAdditionalCost = formatPrice(additionalCost, locale)
            const formattedDiscountedMonthly = formatPrice(discountedMonthly, locale)
            const formattedRightTextValue = formatManWon(rightTextValue, t('Phone.Common.man'), t('Phone.Common.won'), locale)

            let dropdownValue = "video"
            if (selectedPlanId === "plan_69_v") dropdownValue = "simple"

            return (
              <div
                key={plan.id}
                onClick={() => {
                  if (is69PlanGroup) {
                    if (!isSelected || selectedPlanId !== "plan_69") onSelectPlan("plan_69")
                  } else {
                    onSelectPlan(plan.id)
                  }
                }}
                className={`flex items-center justify-between p-6 rounded-2xl cursor-pointer transition-all border-2 bg-white ${isSelected ? 'border-blue-500' : 'border-gray-200'}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-xl font-bold text-[#1d1d1f]">
                      {isNetflixPlan ? `${formattedPrice}${t('Phone.Common.won')} + ${formattedAdditionalCost}${t('Phone.Common.won')}` : `${formattedPrice}${t('Phone.Common.won')}`}
                    </div>

                    {is69PlanGroup ? (
                      <div onClick={(e) => e.stopPropagation()}>
                        <select
                          className="text-sm font-medium text-gray-600 p-1.5 rounded-lg border border-gray-300 bg-gray-50 outline-none cursor-pointer mt-0.5"
                          value={dropdownValue}
                          onChange={(e) => handleVariantChange(e)}
                        >
                          <option value="video">{t('Phone.PlanSelector.data_on_video')}</option>
                          <option value="simple">{t('Phone.PlanSelector.simple_110gb')}</option>
                        </select>
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-gray-500 mt-0.5">{plan.name}</div>
                    )}

                    {!isDeviceMode && (
                      <div className="text-xs text-blue-500 mt-0.5">{t('Phone.Order.monthly_price')} {formattedDiscountedMonthly}{t('Phone.Common.won')}</div>
                    )}
                  </div>
                </div>
                <div className="text-[15px] font-semibold text-blue-500 text-right whitespace-nowrap self-center">
                  {formattedRightTextValue} {t('Phone.PlanSelector.discount_suffix')}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. 가격 요약 */}
      <div className="flex flex-col gap-3 pb-5">
        <div className="w-full h-px bg-gray-200 mb-2" />

        <div className="flex justify-between items-center">
          <span className="text-[15px] text-gray-600">{t('Phone.PlanSelector.release_price')}</span>
          <span className="text-[16px] font-medium text-[#1d1d1f]">{formatPrice(originPrice, locale)}{t('Phone.Common.won')}</span>
        </div>

        {isDeviceMode && (
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-gray-600">{t('Phone.PlanSelector.disclosure_subsidy')}</span>
            <span className="text-[16px] font-medium text-blue-500">-{formatPrice(currentDisclosureSubsidy, locale)}{t('Phone.Common.won')}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-[15px] text-blue-500 font-semibold">{t('Phone.PlanSelector.market_subsidy')}</span>
          <span className="text-[16px] font-medium text-blue-500">-{formatPrice(currentMarketSubsidy, locale)}{t('Phone.Common.won')}</span>
        </div>

        {/* specialDiscount가 0이므로 이 부분은 렌더링되지 않음 */}
        {specialDiscount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-red-500 font-semibold">{t('Phone.PlanSelector.special_discount')}</span>
            <span className="text-[16px] font-medium text-red-500">-{formatPrice(specialDiscount, locale)}{t('Phone.Common.won')}</span>
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <span className="text-[18px] font-semibold text-[#1d1d1f]">{t('Phone.PlanSelector.final_purchase_price')}</span>
          <span className="text-[22px] font-bold text-[#1d1d1f]">{formatPrice(finalPrice, locale)}{t('Phone.Common.won')}</span>
        </div>
      </div>

      {/* 4. 요금제 정보 상세 */}
      <div className="flex flex-col gap-4 pt-6 border-t border-gray-200">
        <div className="text-[18px] font-semibold text-[#1d1d1f]">{t('Phone.PlanSelector.plan_info_title')}</div>
        {[
          { label: t('Phone.PlanSelector.plan_name'), value: selectedPlan?.name },
          { label: t('Phone.PlanSelector.plan_data'), value: selectedPlan?.description },
          { label: t('Phone.PlanSelector.plan_calls'), value: selectedPlan?.calls },
          { label: t('Phone.PlanSelector.plan_texts'), value: selectedPlan?.texts },
        ].map((item, idx) => (
          <div key={idx} className="flex justify-between items-start">
            <span className="w-20 text-[15px] text-gray-500">{item.label}</span>
            <span className="flex-1 text-[15px] text-[#1d1d1f] text-right">{item.value}</span>
          </div>
        ))}

        <div className="flex justify-between items-start">
          <span className="w-20 text-[15px] text-gray-500">{t('Phone.PlanSelector.monthly_fee')}</span>
          <div className="flex flex-col items-end">
            {!isDeviceMode && (
              <span className="text-[13px] text-gray-400 line-through mb-0.5">
                <span className="text-[#FF6B6B] font-semibold no-underline mr-1">25%</span>
                {formatPrice(currentPlanPrice, locale)}{t('Phone.Common.won')}
              </span>
            )}
            <span className="text-[15px] text-[#1d1d1f] font-semibold">
              {t('Phone.Order.monthly_price')} {formatPrice(!isDeviceMode ? currentDiscountedPrice : currentPlanPrice, locale)}{t('Phone.Common.won')}
            </span>
          </div>
        </div>

        {selectedPlanId === "plan_69" && (
          <div className="bg-gray-100 rounded-xl p-4 mt-2 flex gap-2.5 items-start">
            <div className="w-[18px] h-[18px] rounded-full bg-gray-400 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-serif">i</div>
            <div className="text-[11px] text-gray-600 leading-normal font-medium tracking-tight break-keep">
              {t('Phone.PlanSelector.data_on_video_notice')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}