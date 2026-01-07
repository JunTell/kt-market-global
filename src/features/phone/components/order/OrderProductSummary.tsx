"use client"

import React from "react"
import Image from "next/image"

interface Props {
  image: string
  title: string
  spec: string
  price: string
}

export default function OrderProductSummary({ image, title, spec, price }: Props) {
  return (
    <div className="w-full rounded-[20px] flex items-center gap-5 box-border py-2.5">
      <div className="w-20 h-20 flex items-center justify-center bg-white rounded-xl overflow-hidden shrink-0 shadow-sm border border-[#E5E8EB]">
        {image ? (
          <Image src={image} alt={title} width={72} height={72} className="w-[90%] h-[90%] object-contain" />
        ) : (
          <div className="w-full h-full bg-[#eee]" />
        )}
      </div>
      <div className="flex flex-col justify-center gap-1">
        <div className="text-lg font-bold text-[#1d1d1f]">{title}</div>
        <div className="text-sm text-[#86868b] font-medium">{spec}</div>
        <div className="text-base font-bold text-blue-500 mt-0.5">{price}</div>
      </div>
    </div>
  )
}
