"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"

interface OptionSummaryProps {
  selectedColor: string
  selectedColorName: string
  selectedCapacity: string
  imageUrl: string
  onClick: () => void
}

export default function OptionSummary({
  selectedColor,
  selectedColorName,
  selectedCapacity,
  imageUrl,
  onClick
}: OptionSummaryProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-[28px] p-5 hover:border-blue-500 transition-colors group text-left shadow-sm cursor-pointer"
    >
      <div className="flex items-center gap-5">
        <div className="relative w-[60px] h-[60px] bg-gray-50 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={selectedColorName}
              fill
              className="object-contain p-1.5"
            />
          )}
        </div>
        <div>
          <div className="text-[19px] font-bold text-gray-900 leading-tight">{selectedColorName} - {selectedCapacity}GB</div>
        </div>
      </div>
      <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
    </button>
  )
}
