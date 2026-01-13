"use client"

import { useMemo } from "react"
import Image from "next/image"
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
  selectedCapacity: string
  selectedColorValue: string
  capacityOptions: CapacityOption[]
  colorOptions: ColorOption[]
  onSelectCapacity: (val: string) => void
  onSelectColor: (val: string) => void
}

export default function OptionSelector({
  selectedCapacity,
  selectedColorValue,
  capacityOptions,
  colorOptions,
  onSelectCapacity,
  onSelectColor,
}: Props) {
  const t = useTranslations()

  // 품절 로직 계산 (props로 전달된 isSoldOut 사용)
  const processedOptions = useMemo(() => {
    return [...colorOptions].map((color) => ({
      ...color,
      isDisabled: color.isSoldOut,
    })).sort((a, b) => {
      if (a.isDisabled === b.isDisabled) return 0
      return a.isDisabled ? 1 : -1
    })
  }, [colorOptions])

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
              className={`flex-1 py-3 rounded-[12px] text-[15px] font-semibold text-center cursor-pointer transition-all duration-200 select-none ${isSelected
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
              className={`flex items-center justify-between py-3 cursor-pointer transition-opacity border-b border-[#F5F5F7] select-none ${isDisabled ? "opacity-50 cursor-not-allowed" : "opacity-100"
                }`}
            >
              <div className="flex items-center gap-4">
                {/* 이미지 영역 */}
                <div className="w-16 h-16 rounded-[12px] overflow-hidden bg-[#F5F5F7] flex items-center justify-center shrink-0 p-1.5 box-border relative">
                  {color.image && (
                    // ✅ Next.js Image 사용
                    <Image
                      src={color.image}
                      alt={color.label}
                      fill
                      className="object-contain"
                      sizes="64px"
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