"use client"

import * as React from "react"
import {
  calcKTmarketSubsidy,
  getDeviceImageUrl,
  getDeviceImageUrls,
  type RegType,
} from "@/features/phone/lib/asamo-utils"
import GongguDealCard from "@/shared/components/ui/GongguDealCard"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"

// --- Constants ---
const GONGGU_MODELS = [
  "aip17-256",
  "sm-m366k",
  "aip16e-128",
  "sm-s931nk",
  "aip17p-256"
]

const CARRIERS = ["SKT", "KT", "LG U+", "알뜰폰", "없음"]

// 브랜드 타입 정의
type Brand = "iphone" | "galaxy"

interface ModelList {
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
}

interface Props {
  sectionTitle?: string
  planId?: string
  userCarrier?: string
  registrationType?: RegType
  initialDevices: Record<string, unknown>[]
  initialSubsidies: Record<string, unknown>[] | null
}

export default function ModelListClient({
  sectionTitle,
  planId = "ppllistobj_0808",
  userCarrier: initialCarrier,
  registrationType: initialRegType,
  initialDevices,
  initialSubsidies
}: Props) {
  const t = useTranslations()

  // 브랜드 선택 상태 (기본값: iphone)
  const [brand, setBrand] = React.useState<Brand>("iphone")

  const [deals, setDeals] = React.useState<ModelList[]>([])

  // --- 1. 통신사 & 가입유형 상태 관리 ---
  const [selectedCarrier, setSelectedCarrier] = React.useState<string>("KT")
  const [registrationType, setRegistrationType] = React.useState<RegType>("mnp")

  // 팝업 열림 상태 (초기값 false)
  const [isSelectorOpen, setIsSelectorOpen] = React.useState(false)

  React.useEffect(() => {
    // 세션 스토리지 확인
    if (typeof window !== "undefined") {
      try {
        const prefStr = sessionStorage.getItem("asamo_user_preference")
        if (prefStr) {
          const pref = JSON.parse(prefStr)
          if (pref.userCarrier) setSelectedCarrier(pref.userCarrier)
          if (pref.registrationType) setRegistrationType(pref.registrationType)
          else if (pref.userCarrier) {
            setRegistrationType(pref.userCarrier === "KT" ? "chg" : "mnp")
          }
        } else {
          // 저장된 정보가 없으면(처음 방문) 팝업을 강제로 엽니다.
          setIsSelectorOpen(true)
        }
      } catch (e) {
        console.error(e)
      }
    }
    // 부모 Props가 있으면 우선 적용
    if (initialCarrier) setSelectedCarrier(initialCarrier)
    if (initialRegType) setRegistrationType(initialRegType)
  }, [initialCarrier, initialRegType])

  // --- 2. 데이터 페칭 제거 (SSR로 대체) ---
  const loading = false
  const error = null

  // --- 3. 데이터 가공 ---
  React.useEffect(() => {
    const rawDevices = initialDevices;
    const rawSubsidies = initialSubsidies;

    if (rawDevices.length === 0) return

    const planTableKey =
      registrationType === "chg" ? "device_plans_chg" : "device_plans_mnp"

    const mapped: ModelList[] = rawDevices
      .map((device) => {
        const deviceData = device as Record<string, unknown>
        const planList = (deviceData[planTableKey] as unknown[] | undefined) || []
        // ppllistobj_0808 is 69000 KRW
        const plan = planList.find((p) => (p as { price: number }).price === 69000) as Record<string, unknown> | undefined || planList[0] as Record<string, unknown> | undefined
        if (!plan) return null

        const originPrice = (deviceData.price as number) ?? 0
        const disclosureSubsidy = (plan.disclosure_subsidy as number) ?? 0
        const subsidyRow = rawSubsidies?.find((s) => (s as Record<string, unknown>).model === deviceData.model) as Record<string, unknown> | undefined

        const ktmarketDiscount = calcKTmarketSubsidy(
          planId,
          (plan.price as number) ?? 0,
          subsidyRow,
          deviceData.model as string,
          registrationType
        )

        const specialDiscount = 0

        const planMonthlyDiscount = Math.floor(((plan.price as number) ?? 0) * 0.25)
        const imageUrls = getDeviceImageUrls(deviceData)

        return {
          model: deviceData.model as string,
          title: (deviceData.pet_name as string) ?? (deviceData.model as string),
          capacity: (deviceData.capacity as string) ?? "",
          originPrice,
          disclosureSubsidy,
          ktmarketDiscount,
          specialDiscount,
          planMonthlyDiscount,
          imageUrl: getDeviceImageUrl(deviceData),
          imageUrls: imageUrls,
        }
      })
      .filter((item): item is ModelList => Boolean(item))

    mapped.sort(
      (a, b) =>
        GONGGU_MODELS.indexOf(a.model) - GONGGU_MODELS.indexOf(b.model)
    )

    setDeals(mapped)
  }, [initialDevices, initialSubsidies, planId, registrationType])

  // --- 핸들러 ---
  const handleCarrierChange = (newCarrier: string) => {
    const newRegType: RegType = newCarrier === "KT" ? "chg" : "mnp"

    setSelectedCarrier(newCarrier)
    setRegistrationType(newRegType)
    setIsSelectorOpen(false) // 선택 완료 시 닫기

    if (typeof window !== "undefined") {
      try {
        const prefData = {
          carrierSelected: true,
          userCarrier: newCarrier,
          registrationType: newRegType,
          savedAt: new Date().toISOString(),
        }
        sessionStorage.setItem("asamo_user_preference", JSON.stringify(prefData))

        // 기존 asamoDeal 업데이트
        const existing = sessionStorage.getItem("asamoDeal")
        const parsed = existing ? JSON.parse(existing) : {}
        sessionStorage.setItem("asamoDeal", JSON.stringify({ ...parsed, ...prefData }))
      } catch (e) {
        console.error("Session Save Error", e)
      }
    }
  }

  // 브랜드 필터링 로직
  const filteredDeals = deals.filter((deal) => {
    if (brand === "iphone") {
      return deal.model.startsWith("aip")
    } else {
      return deal.model.startsWith("sm")
    }
  })

  return (
    <div className="w-full flex flex-col py-5">
      {/* 섹션 타이틀 */}
      <div className="text-left">
        <h2 className="text-[26px] font-bold text-label-900 m-0 mb-4">
          {sectionTitle || t('Phone.ModelList.section_title')}
        </h2>
      </div>

      {/* 1. 통신사 선택 (모달 제어) */}
      <CarrierSelector
        selected={selectedCarrier}
        isOpen={isSelectorOpen}
        onToggle={() => setIsSelectorOpen(!isSelectorOpen)}
        onChange={handleCarrierChange}
      />

      <div className="text-[13px] text-label-700 mt-2 flex items-center">
        <span>
          {registrationType === "chg"
            ? t('Phone.ModelList.kt_device_change_desc')
            : t('Phone.ModelList.mnp_desc', { carrier: selectedCarrier })}
        </span>
      </div>

      {/* 2. 브랜드 선택 (iPhone vs Galaxy) */}
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

      {/* 3. 리스트 영역 (필터링된 목록 표시) */}
      <div className="flex flex-col gap-4 mt-[30px]">
        {loading && (
          <div className="text-center p-10 text-label-500 text-sm">
            {t('Phone.ModelList.loading')}
          </div>
        )}
        {error && (
          <div className="text-center p-10 text-status-error text-sm">
            {error}
          </div>
        )}
        {!loading && !error && filteredDeals.length === 0 && (
          <div className="text-center p-10 text-label-500 text-sm">
            {t('Phone.ModelList.no_models')}
          </div>
        )}
        {!loading &&
          !error &&
          filteredDeals.map((deal) => (
            <GongguDealCard
              key={deal.model}
              title={deal.title}
              capacity={deal.capacity}
              originPrice={deal.originPrice}
              disclosureSubsidy={deal.disclosureSubsidy}
              ktmarketDiscount={deal.ktmarketDiscount}
              planMonthlyDiscount={deal.planMonthlyDiscount}
              mode="device" // 무조건 기기 할인 모드로 고정
              model={deal.model}
              detailPath="/phone"
              imageUrl={deal.imageUrl}
              imageUrls={deal.imageUrls}
            />
          ))}
      </div>
    </div>
  )
}

function CarrierSelector({
  selected,
  isOpen,
  onToggle,
  onChange,
}: {
  selected: string
  isOpen: boolean
  onToggle: () => void
  onChange: (v: string) => void
}) {
  const t = useTranslations()

  const handleSelect = (val: string) => {
    onChange(val)
  }

  return (
    <>
      {/* 1. 기본 바 (Trigger) - 항상 렌더링하여 레이아웃 흔들림 방지 */}
      <div
        onClick={onToggle}
        className="w-full h-[60px] bg-white rounded-[20px] border border-grey-200 flex items-center justify-between px-6 cursor-pointer transition-all duration-200 hover:bg-grey-50 hover:border-grey-300 hover:shadow-sm active:scale-[0.99]"
      >
        <div className="flex gap-2 text-[16px]">
          <span className="text-grey-500 font-medium">{t('Phone.ModelList.current_carrier')}</span>
          <span className="text-grey-900 font-bold">
            {selected} {t('Phone.ModelList.using_carrier')}
          </span>
        </div>
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
          <path
            d="M1 1L7 7L13 1"
            stroke="var(--label-500)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* 2. 모달 (Portal 역할) - AnimatePresence로 등장/퇴장 애니메이션 처리 */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-9999 flex items-center justify-center p-5">
            {/* 배경 (Backdrop) - 페이드 효과 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
              onClick={(e) => {
                e.stopPropagation()
                // 필요하다면 배경 클릭 시 닫기 기능 추가 가능: onToggle()
              }}
            />

            {/* 모달 박스 - 스프링 팝업 효과 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 350,
                mass: 0.5
              }}
              className="relative w-full max-w-[360px] bg-white rounded-[28px] shadow-2xl p-6 flex flex-col gap-5 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center pt-1">
                <h2 className="text-[22px] font-bold text-label-900 mb-1.5">{t('Phone.ModelList.select_carrier_title')}</h2>
                <p className="text-[14px] text-label-500">{t('Phone.ModelList.select_carrier_desc')}</p>
              </div>

              <div className="flex flex-col gap-2.5">
                {CARRIERS.map((carrier) => (
                  <motion.button
                    key={carrier}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(carrier)}
                    className={`group w-full h-[56px] rounded-[20px] transition-all duration-200 flex items-center justify-between px-5 cursor-pointer border ${selected === carrier
                      ? "bg-white border-primary shadow-sm ring-1 ring-primary/20"
                      : "bg-bg-grouped border-transparent hover:bg-grey-200 hover:border-border-strong"
                      }`}
                  >
                    <span className={`text-[17px] font-semibold transition-colors ${selected === carrier
                      ? "text-primary"
                      : "text-label-900 group-hover:text-black"
                      }`}>
                      {carrier}
                    </span>

                    {selected === carrier ? (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          width="14" height="10" viewBox="0 0 14 10" fill="none"
                        >
                          <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-line-400 group-hover:border-label-500 transition-colors" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}