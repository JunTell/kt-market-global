"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

type Mode = "device" | "plan"

interface Props {
  title: string
  capacity: string
  originPrice: number
  disclosureSubsidy: number
  ktmarketDiscount: number
  planMonthlyDiscount: number
  specialDiscount?: number
  mode: Mode
  detailPath: string
  model?: string
  imageUrl?: string
  imageUrls?: string[]
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("ko-KR").format(value)

export default function GongguDealCard(props: Props) {
  const {
    title,
    capacity,
    originPrice,
    disclosureSubsidy,
    ktmarketDiscount,
    planMonthlyDiscount,
    specialDiscount = 0,
    mode,
    detailPath,
    model,
    imageUrl,
    imageUrls,
  } = props

  const router = useRouter()

  const totalDeviceDiscount =
    disclosureSubsidy + ktmarketDiscount + specialDiscount
  const totalPlanDiscount = planMonthlyDiscount * 24

  const salePrice =
    mode === "device"
      ? Math.max(0, originPrice - totalDeviceDiscount)
      : Math.max(0, originPrice - totalPlanDiscount)

  const originPriceText = `${formatPrice(originPrice)}원`
  const salePriceText = `${formatPrice(salePrice)}원`

  const description =
    mode === "device"
      ? `총 ${formatPrice(totalDeviceDiscount)}원 할인 (공통+KT마켓 글로벌)`
      : `+ 선택약정 요금할인25%`

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()

    // SessionStorage 저장 로직 (기존 유지)
    if (typeof window !== "undefined") {
      const payload = {
        model: model ?? null,
        title,
        capacity,
        originPrice,
        disclosureSubsidy,
        ktmarketDiscount,
        specialDiscount,
        totalDeviceDiscount,
        finalDevicePrice: Math.max(0, originPrice - totalDeviceDiscount),
        planMonthlyDiscount,
        mode,
        imageUrl,
        imageUrls: imageUrls && imageUrls.length > 0 ? imageUrls : [imageUrl],
        savedAt: new Date().toISOString(),
      }
      sessionStorage.setItem("asamoDeal", JSON.stringify(payload))
    }

    // 상세 페이지 이동
    const targetUrl = model ? `${detailPath}?model=${model}` : detailPath
    router.push(targetUrl)
  }

  return (
    <motion.div
      className="w-full p-5 rounded-[20px] bg-background flex flex-row items-center gap-4 box-border cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-line-200"
      onClick={handleClick}
      whileHover={{
        scale: 1.02,
        backgroundColor: "var(--bg-alternative)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.96,
        transition: { duration: 0.1 },
      }}
    >
      {/* 썸네일 */}
      <div className="w-20 h-20 rounded-[14px] bg-background-alt flex items-center justify-center shrink-0 overflow-hidden p-2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-line-200" />
        )}
      </div>

      {/* 내용 */}
      <div className="flex-1 flex flex-col justify-center gap-[3px] min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[17px] font-bold text-label-900 tracking-[-0.5px] whitespace-nowrap">
            {title}
          </span>
        </div>

        <div className="text-[12px] text-label-500 line-through mt-0.5">
          정가 {originPriceText}
        </div>

        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
          <div className="text-[10px] font-bold px-1.5 py-[3px] rounded-md bg-status-error text-white whitespace-nowrap">
            Global 특가
          </div>
          <span className="text-[20px] font-bold text-label-900 tracking-[-0.5px]">
            {salePriceText}
          </span>
        </div>

        <div
          className={`mt-1 text-[12px] font-semibold break-keep leading-[1.4] ${
            mode === "device"
              ? "text-status-correct"
              : "text-primary"
          }`}
        >
          {description}
        </div>
      </div>
    </motion.div>
  )
}