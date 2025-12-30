"use client"

import React from "react"

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
  isSpecialModel: boolean
}

const formatPrice = (n: number) => new Intl.NumberFormat("ko-KR").format(n)
const formatManWon = (n: number) => n >= 10000 ? `${Math.floor(n / 10000)}만원` : `${formatPrice(n)}원`

export default function PlanSelector({
  plans,
  selectedPlanId,
  discountMode,
  originPrice,
  ktMarketDiscount,
  onSelectPlan,
  onChangeMode,
  registrationType,
  isSpecialModel
}: Props) {
  
  const isDeviceMode = discountMode === "device"
  const selectedPlan = plans.find((p) => p.id === selectedPlanId)

  // 가격 계산
  const currentPlanPrice = selectedPlan?.price ?? 0
  const currentMonthlyDiscount = Math.floor((currentPlanPrice * 0.25) / 10) * 10
  const currentDiscountedPrice = currentPlanPrice - currentMonthlyDiscount

  const currentDisclosureSubsidy = selectedPlan?.disclosureSubsidy ?? 0
  const currentMarketSubsidy = selectedPlan?.marketSubsidy ?? ktMarketDiscount
  
  // ✅ [수정] MNP 7만원 추가 할인 제거 (항상 0으로 설정)
  const specialDiscount = 0 

  let finalPrice = 0
  if (isDeviceMode) {
    finalPrice = Math.max(0, originPrice - currentDisclosureSubsidy - currentMarketSubsidy - specialDiscount)
  } else {
    finalPrice = Math.max(0, originPrice - currentMarketSubsidy - specialDiscount)
  }

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
          할인 방법을 선택해주세요
        </div>
        <div className="flex bg-[#F3F4F6] rounded-xl p-1 h-12 cursor-pointer">
          <div
            className={`flex-1 flex items-center justify-center text-sm rounded-lg transition-all ${isDeviceMode ? 'bg-white text-[#1d1d1f] font-semibold shadow-sm' : 'text-gray-500'}`}
            onClick={() => onChangeMode("device")}
          >
            기기할인
          </div>
          <div
            className={`flex-1 flex items-center justify-center text-sm rounded-lg transition-all ${!isDeviceMode ? 'bg-white text-[#1d1d1f] font-semibold shadow-sm' : 'text-gray-500'}`}
            onClick={() => onChangeMode("plan")}
          >
            요금할인
          </div>
        </div>
        <div className="text-[13px] text-[#86868b] mt-1">
          <span className="mr-1">ℹ️</span>
          {isDeviceMode ? "KT 공시지원금과 KT마켓 글로벌 추가할인을 함께 받아요" : "매월 요금할인(25%)과 KT마켓 글로벌 추가할인을 함께 받아요"}
        </div>
      </div>

      {/* 2. 요금제 리스트 */}
      <div className="flex flex-col gap-3">
        <div className="text-[18px] font-semibold text-[#1d1d1f] flex items-center gap-2">
          요금제를 선택해주세요
          {!isDeviceMode && <span className="text-xs text-red-500 bg-red-50 px-1.5 py-0.5 rounded font-bold">25% 할인</span>}
        </div>
        
        <div className="flex flex-col gap-3">
          {visiblePlans.map((plan) => {
            const is69PlanGroup = plan.id === "plan_69" || plan.price === 69000
            const isSelected = plan.id === selectedPlanId || (is69PlanGroup && (selectedPlanId === "plan_69_v" || selectedPlanId === "plan_69"))
            
            const mDiscount = Math.floor((plan.price * 0.25) / 10) * 10
            const discountedMonthly = plan.price - mDiscount
            const rightTextValue = isDeviceMode ? (plan.disclosureSubsidy || 0) + (plan.marketSubsidy || 0) + specialDiscount : (plan.marketSubsidy || 0)

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
                    <div className="text-xl font-bold text-[#1d1d1f]">{formatPrice(plan.price)}원</div>
                    
                    {is69PlanGroup ? (
                      <div onClick={(e) => e.stopPropagation()}>
                        <select 
                          className="text-sm font-medium text-gray-600 p-1.5 rounded-lg border border-gray-300 bg-gray-50 outline-none cursor-pointer mt-0.5"
                          value={dropdownValue}
                          onChange={(e) => handleVariantChange(e)}
                        >
                          <option value="video">데이터ON 비디오</option>
                          <option value="simple">5G 심플 110GB</option>
                        </select>
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-gray-500 mt-0.5">{plan.name}</div>
                    )}

                    {!isDeviceMode && (
                      <div className="text-xs text-blue-500 mt-0.5">월 {formatPrice(discountedMonthly)}원 납부</div>
                    )}
                  </div>
                </div>
                <div className="text-[15px] font-semibold text-blue-500 text-right whitespace-nowrap self-center">
                  {formatManWon(rightTextValue)} 할인
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
          <span className="text-[15px] text-gray-600">출시 가격</span>
          <span className="text-[16px] font-medium text-[#1d1d1f]">{formatPrice(originPrice)}원</span>
        </div>

        {isDeviceMode && (
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-gray-600">공통지원금 (KT)</span>
            <span className="text-[16px] font-medium text-blue-500">-{formatPrice(currentDisclosureSubsidy)}원</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-[15px] text-blue-500 font-semibold">KT마켓 글로벌 추가지원금</span>
          <span className="text-[16px] font-medium text-blue-500">-{formatPrice(currentMarketSubsidy)}원</span>
        </div>

        {/* specialDiscount가 0이므로 이 부분은 렌더링되지 않음 */}
        {specialDiscount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-red-500 font-semibold">KT마켓 글로벌 연말특가 (번호이동)</span>
            <span className="text-[16px] font-medium text-red-500">-{formatPrice(specialDiscount)}원</span>
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <span className="text-[18px] font-semibold text-[#1d1d1f]">최종 구매가(체감가)</span>
          <span className="text-[22px] font-bold text-[#1d1d1f]">{formatPrice(finalPrice)}원</span>
        </div>
      </div>

      {/* 4. 요금제 정보 상세 */}
      <div className="flex flex-col gap-4 pt-6 border-t border-gray-200">
        <div className="text-[18px] font-semibold text-[#1d1d1f]">요금제 정보</div>
        {[
            { label: '이름', value: selectedPlan?.name },
            { label: '데이터', value: selectedPlan?.description },
            { label: '통화', value: selectedPlan?.calls },
            { label: '문자', value: selectedPlan?.texts },
        ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-start">
                <span className="w-20 text-[15px] text-gray-500">{item.label}</span>
                <span className="flex-1 text-[15px] text-[#1d1d1f] text-right">{item.value}</span>
            </div>
        ))}
        
        <div className="flex justify-between items-start">
           <span className="w-20 text-[15px] text-gray-500">월 요금</span>
           <div className="flex flex-col items-end">
              {!isDeviceMode && (
                  <span className="text-[13px] text-gray-400 line-through mb-0.5">
                      <span className="text-[#FF6B6B] font-semibold no-underline mr-1">25%</span>
                      {formatPrice(currentPlanPrice)}원
                  </span>
              )}
              <span className="text-[15px] text-[#1d1d1f] font-semibold">
                  월 {formatPrice(!isDeviceMode ? currentDiscountedPrice : currentPlanPrice)}원
              </span>
           </div>
        </div>

        {selectedPlanId === "plan_69" && (
           <div className="bg-gray-100 rounded-xl p-4 mt-2 flex gap-2.5 items-start">
              <div className="w-[18px] h-[18px] rounded-full bg-gray-400 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-serif">i</div>
              <div className="text-[11px] text-gray-600 leading-normal font-medium tracking-tight break-keep">
                 데이터ON비디오요금제는 현재 가입불가인 요금제로, 기존가입자만 유지되며 신규가입자는 데이터ON비디오 플러스로 가입돼요
              </div>
           </div>
        )}
      </div>
    </div>
  )
}