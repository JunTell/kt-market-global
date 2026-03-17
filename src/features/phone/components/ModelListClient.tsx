"use client"

import * as React from "react"
import {
  type RegType,
} from "@/features/phone/lib/asamo-utils"
import GongguDealCard from "@/shared/components/ui/GongguDealCard"
import { useTranslations } from "next-intl"

// 브랜드 타입 정의
type Brand = "iphone" | "galaxy"

export interface ModelList {
  model: string
  title: string
  capacity: string
  originPrice: number
  disclosureSubsidy: number
  ktmarketDiscount: number
  specialDiscount: number
  planMonthlyDiscount: number
  imageUrl: string
  imageUrls: string[]
  isSoldOut?: boolean
}

export interface ModelListClientProps {
  sectionTitle?: string
  planId?: string
  userCarrier?: string
  registrationType?: RegType
  initialDealsChg: ModelList[]
  initialDealsMnp: ModelList[]
}

export default function ModelListClient({
  sectionTitle,
  userCarrier: initialCarrier,
  registrationType: initialRegType,
  initialDealsChg,
  initialDealsMnp
}: ModelListClientProps) {
  const t = useTranslations()

  const [brand, setBrand] = React.useState<Brand>("iphone")
  const [deals, setDeals] = React.useState<ModelList[]>([])
  const [selectedCarrier, setSelectedCarrier] = React.useState<string>("KT")
  const [registrationType, setRegistrationType] = React.useState<RegType>("mnp")

  React.useEffect(() => {
    if (initialCarrier) setSelectedCarrier(initialCarrier)
    if (initialRegType) setRegistrationType(initialRegType)
  }, [initialCarrier, initialRegType])

  React.useEffect(() => {
    const activeDeals = registrationType === "chg" ? initialDealsChg : initialDealsMnp
    setDeals(activeDeals)
  }, [initialDealsChg, initialDealsMnp, registrationType])

  const filteredDeals = deals.filter((deal) => {
    if (brand === "iphone") {
      return deal.model.startsWith("aip")
    } else {
      return deal.model.startsWith("sm")
    }
  })

  return (
    <div className="w-full flex flex-col py-5">
      <div className="text-left">
        <h2 className="text-[26px] font-bold text-label-900 m-0 mb-4">
          {sectionTitle || t('Phone.ModelList.section_title')}
        </h2>
      </div>

      <div className="text-[13px] text-label-700 mt-2 flex items-center">
        <span>
          {registrationType === "chg"
            ? t('Phone.ModelList.kt_device_change_desc')
            : t('Phone.ModelList.mnp_desc', { carrier: selectedCarrier })}
        </span>
      </div>

      <div className="mt-[30px] mb-[10px]">
        <h3 className="text-[20px] font-bold text-label-900 mb-3 mt-0">
          {t('Phone.ModelList.select_model_title')}
        </h3>

        <div className="w-full h-[50px] rounded-xl bg-bg-grouped p-1 flex box-border border border-grey-200">
          <div
            className={`flex-1 rounded-[9px] flex items-center justify-center text-[16px] font-medium cursor-pointer transition-all duration-200 select-none ${brand === "iphone"
              ? "bg-white text-grey-900 shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
              : "bg-transparent text-grey-500 shadow-none"
              }`}
            onClick={() => setBrand("iphone")}
          >
            iPhone
          </div>
          <div
            className={`flex-1 rounded-[9px] flex items-center justify-center text-[16px] font-medium cursor-pointer transition-all duration-200 select-none ${brand === "galaxy"
              ? "bg-white text-grey-900 shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
              : "bg-transparent text-grey-500 shadow-none"
              }`}
            onClick={() => setBrand("galaxy")}
          >
            Galaxy
          </div>
        </div>

        <div className="text-[13px] text-grey-500 mt-2 flex items-center">
          <span className="mr-1">ℹ️</span>
          {t('Phone.ModelList.subsidy_info')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-[30px]">
        {filteredDeals.length === 0 && (
          <div className="text-center p-10 text-label-500 text-sm md:col-span-2">
            {t('Phone.ModelList.no_models')}
          </div>
        )}
        {filteredDeals.map((deal) => (
          <GongguDealCard
            key={deal.model}
            title={deal.title}
            capacity={deal.capacity}
            originPrice={deal.originPrice}
            disclosureSubsidy={deal.disclosureSubsidy}
            ktmarketDiscount={deal.ktmarketDiscount}
            planMonthlyDiscount={deal.planMonthlyDiscount}
            mode="device"
            model={deal.model}
            detailPath="/phone"
            imageUrl={deal.imageUrl}
            imageUrls={deal.imageUrls}
            isSoldOut={deal.isSoldOut}
          />
        ))}
      </div>
    </div>
  )
}