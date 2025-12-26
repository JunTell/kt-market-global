"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import {
  calcKTmarketSubsidy,
  getDeviceImageUrl,
  getDeviceImageUrls,
  type RegType,
} from "@/lib/asamo-utils"
import GongguDealCard from "../common/GongguDealCard"

// --- Constants ---
const GONGGU_MODELS = [
  "aip17-256",
  "sm-m366k",
  "aip16e-128",
  "sm-s931nk",
  "aip17p-256"
]

// const CARRIERS = ["SKT", "KT", "LG U+", "알뜰폰"]

type Mode = "device" | "plan"

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
}

export default function ModelList({
  sectionTitle = "오늘의 공구",
  planId = "ppllistobj_0808",
  userCarrier: initialCarrier,
  registrationType: initialRegType,
}: Props) {
  const supabase = createClient()
  
  const [mode, setMode] = React.useState<Mode>("device")
  const [deals, setDeals] = React.useState<ModelList[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // --- 1. 통신사 & 가입유형 상태 관리 ---
  const [selectedCarrier, setSelectedCarrier] = React.useState<string>("LG U+")
  const [registrationType, setRegistrationType] = React.useState<RegType>("mnp")

  React.useEffect(() => {
    // 세션 스토리지 확인 (새로고침 시 유지)
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
        }
      } catch (e) {
        console.error(e)
      }
    }
    // 부모 Props가 있으면 우선 적용
    if (initialCarrier) setSelectedCarrier(initialCarrier)
    if (initialRegType) setRegistrationType(initialRegType)
  }, [initialCarrier, initialRegType])

  // --- 2. 데이터 페칭 ---
  const [rawDevices, setRawDevices] = React.useState<any[]>([])
  const [rawSubsidies, setRawSubsidies] = React.useState<any[]>([])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const planTable =
          registrationType === "chg" ? "device_plans_chg" : "device_plans_mnp"

        const { data: devicesData, error: devicesError } = await supabase
          .from("devices")
          .select(`*, ${planTable} (*)`)
          .in("model", GONGGU_MODELS)
          .eq(`${planTable}.plan_id`, planId)

        if (devicesError) throw devicesError

        const { data: subsidiesData, error: subsidiesError } = await supabase
          .from("ktmarket_subsidy")
          .select("*")
          .in("model", GONGGU_MODELS)

        if (subsidiesError) throw subsidiesError

        setRawDevices(devicesData ?? [])
        setRawSubsidies(subsidiesData ?? [])
        setError(null)
      } catch (err: any) {
        console.error("Fetch Error:", err)
        setError("공구 정보를 불러오지 못했습니다.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [planId, registrationType, supabase])

  // --- 3. 데이터 가공 ---
  React.useEffect(() => {
    if (rawDevices.length === 0) return

    const planTableKey =
      registrationType === "chg" ? "device_plans_chg" : "device_plans_mnp"

    const mapped: ModelList[] = rawDevices
      .map((device: any) => {
        const planList = device[planTableKey] || []
        const plan = planList[0]
        if (!plan) return null

        const originPrice = device.price ?? 0
        const disclosureSubsidy = plan.disclosure_subsidy ?? 0
        const subsidyRow = rawSubsidies?.find((s) => s.model === device.model)

        const ktmarketDiscount = calcKTmarketSubsidy(
          planId,
          plan.price ?? 0,
          subsidyRow,
          device.model,
          registrationType
        )

        // MNP 7만원 추가 할인 (16e 제외)
        let specialDiscount = 0
        const isMnp = registrationType === "mnp"
        const isNot16e = !device.model.includes("aip16e")

        if (isMnp && isNot16e) {
          specialDiscount = 70000
        }

        const planMonthlyDiscount = Math.floor((plan.price ?? 0) * 0.25)
        const imageUrls = getDeviceImageUrls(device)

        return {
          model: device.model,
          title: device.pet_name ?? device.model,
          capacity: device.capacity ?? "",
          originPrice,
          disclosureSubsidy,
          ktmarketDiscount,
          specialDiscount,
          planMonthlyDiscount,
          imageUrl: getDeviceImageUrl(device),
          imageUrls: imageUrls,
        }
      })
      .filter((item): item is ModelList => Boolean(item))

    mapped.sort(
      (a, b) =>
        GONGGU_MODELS.indexOf(a.model) - GONGGU_MODELS.indexOf(b.model)
    )

    setDeals(mapped)
  }, [rawDevices, rawSubsidies, planId, registrationType])

  // --- 핸들러 ---
  // const handleCarrierChange = (newCarrier: string) => {
  //   const newRegType: RegType = newCarrier === "KT" ? "chg" : "mnp"

  //   setSelectedCarrier(newCarrier)
  //   setRegistrationType(newRegType)

  //   if (typeof window !== "undefined") {
  //     try {
  //       const prefData = {
  //         carrierSelected: true,
  //         userCarrier: newCarrier,
  //         registrationType: newRegType,
  //         savedAt: new Date().toISOString(),
  //       }
  //       sessionStorage.setItem("asamo_user_preference", JSON.stringify(prefData))
        
  //       // 기존 asamoDeal 업데이트 (선택 사항)
  //       const existing = sessionStorage.getItem("asamoDeal")
  //       const parsed = existing ? JSON.parse(existing) : {}
  //       sessionStorage.setItem("asamoDeal", JSON.stringify({ ...parsed, ...prefData }))
  //     } catch (e) {
  //       console.error("Session Save Error", e)
  //     }
  //   }
  // }

  return (
    <div className="w-full flex flex-col py-5">
      {/* 섹션 타이틀 */}
      <div className="text-left">
        <h2 className="text-[26px] font-bold text-label-900 m-0">
          {sectionTitle}
        </h2>
      </div>

      {/* 1. 통신사 선택
      <CarrierSelector
        selected={selectedCarrier}
        onChange={handleCarrierChange}
      /> */}

      {/* <div className="text-[13px] text-label-700 mt-2 flex items-center">
        <span>
          {registrationType === "chg"
            ? "이용중인 KT 번호 그대로 핸드폰만 바꿀 수 있어요"
            : `쓰던 번호 그대로 ${selectedCarrier} 통신사를 KT로 바꿀 수 있어요`}
        </span>
      </div> */}

      {/* 2. 할인 방법 선택 */}
      <div className="mt-[30px] mb-[10px]">
        <h3 className="text-[20px] font-bold text-label-900 mb-3 mt-0">
          할인 방법을 선택해주세요
        </h3>

        <div className="w-full h-[50px] rounded-xl bg-background-alt p-1 flex box-border">
          <div
            className={`flex-1 rounded-[9px] flex items-center justify-center text-[16px] font-medium cursor-pointer transition-all duration-200 select-none ${
              mode === "device"
                ? "bg-background text-label-900 shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
                : "bg-transparent text-label-500 shadow-none"
            }`}
            onClick={() => setMode("device")}
          >
            기기 할인
          </div>
          <div
            className={`flex-1 rounded-[9px] flex items-center justify-center text-[16px] font-medium cursor-pointer transition-all duration-200 select-none ${
              mode !== "device"
                ? "bg-background text-label-900 shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
                : "bg-transparent text-label-500 shadow-none"
            }`}
            onClick={() => setMode("plan")}
          >
            요금 할인
          </div>
        </div>

        <div className="text-[13px] text-label-700 mt-2 flex items-center">
          <span className="mr-1">ℹ️</span>
          {mode === "device"
            ? "공통지원금과 KT마켓지원금을 함께 받아요"
            : "매월 요금25%와 KT마켓지원금을 함께 받아요"}
        </div>
      </div>

      {/* 3. 리스트 영역 */}
      <div className="flex flex-col gap-4 mt-[30px]">
        {loading && (
          <div className="text-center p-10 text-label-500 text-sm">
            정보를 불러오는 중...
          </div>
        )}
        {error && (
          <div className="text-center p-10 text-status-error text-sm">
            {error}
          </div>
        )}
        {!loading &&
          !error &&
          deals.map((deal) => (
            <GongguDealCard
              key={deal.model}
              title={deal.title}
              capacity={deal.capacity}
              originPrice={deal.originPrice}
              disclosureSubsidy={deal.disclosureSubsidy}
              ktmarketDiscount={deal.ktmarketDiscount}
              specialDiscount={deal.specialDiscount}
              planMonthlyDiscount={deal.planMonthlyDiscount}
              mode={mode}
              model={deal.model}
              detailPath="/phone" // 상세 페이지 경로 수정 필요
              imageUrl={deal.imageUrl}
              imageUrls={deal.imageUrls}
            />
          ))}
      </div>
    </div>
  )
}

// --- 하위 컴포넌트: 통신사 선택기 ---
// function CarrierSelector({
//   selected,
//   onChange,
// }: {
//   selected: string
//   onChange: (v: string) => void
// }) {
//   const [isOpen, setIsOpen] = React.useState(false)

//   const toggle = () => setIsOpen(!isOpen)
//   const handleSelect = (val: string) => {
//     onChange(val)
//     setIsOpen(false)
//   }

//   if (isOpen) {
//     return (
//       <div className="w-full bg-background rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.1)] p-6 flex flex-col gap-3 border border-line-200">
//         <div className="text-[18px] font-bold text-label-900 mb-2">
//           어떤 통신사를 이용 중인가요?
//         </div>
//         {CARRIERS.map((carrier) => (
//           <div
//             key={carrier}
//             onClick={() => handleSelect(carrier)}
//             className="w-full p-4 rounded-2xl bg-background-alt flex items-center justify-between cursor-pointer transition-colors hover:bg-line-200"
//           >
//             <span className="text-[16px] font-medium text-label-900">
//               {carrier}
//             </span>
//             {selected === carrier ? (
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                 <circle cx="12" cy="12" r="12" fill="var(--status-correct)" />
//                 <path
//                   d="M8 12L11 15L16 9"
//                   stroke="white"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             ) : (
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                 <circle cx="12" cy="12" r="12" fill="var(--status-disable)" />
//                 <path
//                   d="M8 12L11 15L16 9"
//                   stroke="white"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             )}
//           </div>
//         ))}
//       </div>
//     )
//   }

//   return (
//     <div
//       onClick={toggle}
//       className="w-full h-[60px] bg-background rounded-[20px] border border-line-200 flex items-center justify-between px-6 cursor-pointer transition-all hover:bg-background-alt"
//     >
//       <div className="flex gap-2 text-[16px]">
//         <span className="text-label-500 font-medium">현재 통신사</span>
//         <span className="text-label-900 font-bold">
//           {selected} 사용 중
//         </span>
//       </div>
//       <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
//         <path
//           d="M1 1L7 7L13 1"
//           stroke="var(--label-500)"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </svg>
//     </div>
//   )
// }