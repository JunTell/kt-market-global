"use client"

import { useTranslations } from "next-intl"

interface Props {
  finalPrice: string
  onClick: () => void
  disabled?: boolean
  label?: string
}

export default function StickyBar({ finalPrice, onClick, disabled = false, label }: Props) {
  const t = useTranslations()
  const defaultLabel = label || t('Phone.StickyBar.submit_button')
  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[480px] bg-white border-t border-gray-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50">
      <div className="flex items-center justify-between gap-4">
        {finalPrice && (
            <div className="flex flex-col">
            <span className="text-xs text-gray-500">{t('Phone.StickyBar.final_price_label')}</span>
            <span className="text-xl font-bold text-[#1d1d1f]">{finalPrice}</span>
            </div>
        )}
        <button
          onClick={onClick}
          disabled={disabled}
          className={`flex-1 h-12 rounded-xl text-white text-[16px] font-bold transition-all ${disabled ? 'bg-gray-300' : 'bg-[#0071e3] active:scale-95'} cursor-pointer`}
        >
          {defaultLabel}
        </button>
      </div>
    </div>
  )
}