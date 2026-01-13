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
      <div className="w-20 h-20 flex items-center justify-center bg-base rounded-xl overflow-hidden shrink-0 shadow-sm border border-border-default">
        {image ? (
          <Image src={image} alt={title} width={72} height={72} className="w-[90%] h-[90%] object-contain" />
        ) : (
          <div className="w-full h-full bg-grey-100" />
        )}
      </div>
      <div className="flex flex-col justify-center gap-1">
        <div className="text-lg font-bold text-grey-900">{title}</div>
        <div className="text-sm text-grey-500 font-medium">{spec}</div>
        <div className="text-base font-bold text-primary mt-0.5">{price}</div>
      </div>
    </div>
  )
}
