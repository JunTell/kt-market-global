"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { formatPrice } from "@/shared/lib/format"

type Mode = "device" | "plan"

interface Props {
  title: string
  capacity: string
  originPrice: number
  disclosureSubsidy: number
  ktmarketDiscount: number
  planMonthlyDiscount: number
  mode: Mode
  detailPath: string
  model?: string
  imageUrl?: string
  imageUrls?: string[]
  isSoldOut?: boolean
}

export default function GongguDealCard(props: Props) {
  const {
    title,
    // capacity,
    originPrice,
    disclosureSubsidy,
    ktmarketDiscount,
    planMonthlyDiscount,
    mode,
    detailPath,
    model,
    imageUrl,
    imageUrls,
    isSoldOut = false,
  } = props

  const router = useRouter()
  const t = useTranslations()
  const locale = useLocale()

  // ✅ [수정] specialDiscount(7만원) 제외
  const totalDeviceDiscount =
    disclosureSubsidy + ktmarketDiscount
  // + specialDiscount (제거됨)

  const totalPlanDiscount = planMonthlyDiscount * 24

  const salePrice =
    mode === "device"
      ? Math.max(0, originPrice - totalDeviceDiscount)
      : Math.max(0, originPrice - totalPlanDiscount)

  const originPriceText = `${formatPrice(originPrice, locale)}${t('Phone.Common.won')}`
  const salePriceText = `${formatPrice(salePrice, locale)}${t('Phone.Common.won')}`

  const description =
    mode === "device"
      ? `${t('Phone.GongguDealCard.total_discount')} ${formatPrice(totalDeviceDiscount, locale)}${t('Phone.Common.won')} ${t('Phone.GongguDealCard.discount_suffix')}\n${t('Phone.GongguDealCard.discount_source')}`
      : t('Phone.GongguDealCard.plan_discount_desc')

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()

    // 품절이어도 /phone 페이지로 이동 (다른 용량/색상 확인 가능)
    if (isSoldOut) {
      const targetUrl = model ? `/${locale}${detailPath}?model=${model}` : `/${locale}${detailPath}`
      router.push(targetUrl)
      return
    }

    if (typeof window !== "undefined") {
      const payload = {
        model: model ?? null,
        title,
        originPrice,
        disclosureSubsidy,
        ktmarketDiscount,
        specialDiscount: 0, // 저장 시에도 0으로 고정
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

    const targetUrl = model ? `/${locale}${detailPath}?model=${model}` : `/${locale}${detailPath}`
    router.push(targetUrl)
  }

  return (
    <div
      className={cn(
        "group relative w-full p-5 rounded-[20px] bg-white flex flex-row items-center gap-4 box-border transition-all duration-300 border border-grey-200",
        isSoldOut
          ? "cursor-pointer opacity-75 grayscale-[0.5]"
          : "cursor-pointer hover:-translate-y-1 hover:border-transparent"
      )}
      onClick={handleClick}
    >
      {/* 테두리 그라데이션 효과 (Hover시 나타남, 품절시 비활성) */}
      {!isSoldOut && (
        <div className="absolute inset-0 rounded-[20px] p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 -z-10 pointer-events-none" />
      )}

      {/* 배경색 유지 (내부 컨텐츠 배경) */}
      <div className="absolute inset-px rounded-[19px] bg-white z-0" />

      {/* 컨텐츠 영역 */}
      <div className="relative z-10 flex flex-row items-center gap-4 w-full">
        {/* 썸네일 */}
        <div className="w-20 h-20 rounded-[14px] bg-bg-grouped flex items-center justify-center shrink-0 overflow-hidden p-2 transition-colors relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className={cn("object-contain", isSoldOut && "opacity-50")}
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full bg-grey-200" />
          )}

          {isSoldOut && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-[10px] font-black tracking-wider uppercase">SOLD OUT</span>
            </div>
          )}
        </div>

        {/* 텍스트 정보 */}
        <div className="flex-1 flex flex-col justify-center gap-[3px] min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={cn(
              "text-[17px] font-bold tracking-[-0.5px] whitespace-nowrap",
              isSoldOut ? "text-grey-400" : "text-grey-900"
            )}>
              {title}
            </span>
          </div>

          <div className="text-[12px] text-grey-500 line-through mt-0.5">
            {t('Phone.GongguDealCard.original_price')} {originPriceText}
          </div>

          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
            <div className={cn(
              "text-[10px] font-bold px-1.5 py-[3px] rounded-md text-white whitespace-nowrap",
              isSoldOut ? "bg-grey-400" : "bg-status-error"
            )}>
              {t('Phone.GongguDealCard.global_special')}
            </div>
            <span className={cn(
              "text-[20px] font-bold tracking-[-0.5px]",
              isSoldOut ? "text-grey-400" : "text-grey-900"
            )}>
              {salePriceText}
            </span>
          </div>

          <div
            className={cn(
              "mt-1 text-[12px] font-semibold break-keep leading-[1.4] whitespace-pre-wrap min-[400px]:whitespace-normal",
              isSoldOut 
                ? "text-grey-400" 
                : mode === "device" ? "text-status-correct" : "text-primary"
            )}
          >
            {isSoldOut ? t('Phone.ModelList.no_models') : description}
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}