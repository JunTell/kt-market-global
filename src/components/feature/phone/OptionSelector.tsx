"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"

export interface ColorOption {
  label: string
  value: string
  image: string
  isSoldOut: boolean
}

export interface CapacityOption {
  label: string
  value: string
}

interface Props {
  modelPrefix: string
  selectedCapacity: string
  selectedColorValue: string
  capacityOptions: CapacityOption[]
  colorOptions: ColorOption[]
  onSelectCapacity: (val: string) => void
  onSelectColor: (val: string) => void
}

export default function OptionSelector({
  modelPrefix,
  selectedCapacity,
  selectedColorValue,
  capacityOptions,
  colorOptions,
  onSelectCapacity,
  onSelectColor,
}: Props) {
  const t = useTranslations()

  // 품절 로직 계산
  const processedOptions = useMemo(() => {
    return [...colorOptions].map((color) => {
      let isSoldOutByRule = false

      // 규칙 1: 아이폰 17 (aip17) + 256GB -> 블랙, 미스트블루, 라벤더 품절
      if (modelPrefix === "aip17" && selectedCapacity === "256") {
        if (["black", "mist_blue", "lavender"].includes(color.value)) {
          isSoldOutByRule = true
        }
      }
      // 규칙 2: 아이폰 17 (aip17) + 512GB -> 블랙 품절
      if (modelPrefix === "aip17" && selectedCapacity === "512") {
        if (["black"].includes(color.value)) isSoldOutByRule = true
      }
      // 규칙 3: 아이폰 17 프로 (aip17p) + 1TB -> 실버 제외 품절
      if (modelPrefix === "aip17p" && selectedCapacity === "1t") {
        if (color.value !== "silver") isSoldOutByRule = true
      }
      // 규칙 4: 아이폰 17 프로 맥스 (aip17pm)
      if (modelPrefix === "aip17pm") {
        if (selectedCapacity === "1t") isSoldOutByRule = true
        else if (color.value !== "silver") isSoldOutByRule = true
      }

      return {
        ...color,
        isDisabled: color.isSoldOut || isSoldOutByRule,
      }
    }).sort((a, b) => {
        if (a.isDisabled === b.isDisabled) return 0
        return a.isDisabled ? 1 : -1
    })
  }, [colorOptions, modelPrefix, selectedCapacity])

  return (
    <div className="w-full flex flex-col gap-3 py-6 box-border">
      <h3 className="text-[20px] font-bold text-[#1d1d1f] mb-2 mt-0">{t('Phone.OptionSelector.title')}</h3>

      {/* 용량 선택 */}
      <div className="flex bg-[#F3F4F6] p-1 rounded-[14px] mb-4 w-full box-border">
        {capacityOptions.map((opt) => {
          const isSelected = opt.value === selectedCapacity
          return (
            <div
              key={opt.value}
              onClick={() => onSelectCapacity(opt.value)}
              className={`flex-1 py-3 rounded-[12px] text-[15px] font-semibold text-center cursor-pointer transition-all duration-200 select-none ${
                isSelected 
                  ? "bg-white text-[#1D1D1F] shadow-[0_1px_4px_rgba(0,0,0,0.08)]" 
                  : "bg-transparent text-[#6B7280]"
              }`}
            >
              {opt.label}
            </div>
          )
        })}
      </div>

      {/* 색상 선택 */}
      <div className="flex flex-col">
        {processedOptions.map((color, index) => {
          const isSelected = color.value === selectedColorValue
          const isDisabled = color.isDisabled

          return (
            <div
              key={`${color.value}-${index}`}
              onClick={() => !isDisabled && onSelectColor(color.value)}
              className={`flex items-center justify-between py-3 cursor-pointer transition-opacity border-b border-[#F5F5F7] select-none ${
                isDisabled ? "opacity-50 cursor-not-allowed" : "opacity-100"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* 이미지 영역 */}
                <div className="w-16 h-16 rounded-[12px] overflow-hidden bg-[#F5F5F7] flex items-center justify-center shrink-0 p-1.5 box-border relative">
                  {color.image && (
                     // ✅ Next.js Image -> 표준 img 태그로 변경
                     <img 
                        src={color.image} 
                        alt={color.label} 
                        className="w-full h-full object-contain"
                     />
                  )}
                </div>
                <span className="text-[17px] font-semibold text-[#1d1d1f]">{color.label}</span>
              </div>

              <div className="flex items-center justify-end min-w-[60px]">
                {isDisabled ? (
                  <span className="bg-[#F3F4F6] text-[#86868b] text-[13px] px-2.5 py-1.5 rounded-lg font-semibold">{t('Phone.OptionSelector.sold_out')}</span>
                ) : isSelected ? (
                  <div className="w-7 h-7 rounded-full bg-[#0071e3] flex items-center justify-center">
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                      <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}