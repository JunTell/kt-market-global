import { create } from 'zustand'

export type DiscountMode = "device" | "plan"
export type RegistrationType = "chg" | "mnp"

interface PhoneState {
  // 기본 정보
  model: string
  title: string
  capacity: string
  color: string
  originPrice: number
  
  // 이미지
  imageUrl: string
  imageUrls: string[]
  
  // 데이터
  plans: any[]
  selectedPlanId: string
  subsidies: any
  
  // 설정
  discountMode: DiscountMode
  registrationType: RegistrationType
  userCarrier: string
  
  // 계산된 값들
  ktMarketDiscount: number
  specialDiscount: number
  finalPrice: number
  
  // 액션
  setStore: (data: Partial<PhoneState>) => void
}

export const usePhoneStore = create<PhoneState>((set) => ({
  model: "",
  title: "",
  capacity: "",
  color: "",
  originPrice: 0,
  
  imageUrl: "",
  imageUrls: [],
  
  plans: [],
  selectedPlanId: "plan_69", // 기본값
  subsidies: null,
  
  discountMode: "device",
  registrationType: "chg",
  userCarrier: "",
  
  ktMarketDiscount: 0,
  specialDiscount: 0,
  finalPrice: 0,
  
  setStore: (data) => set((state) => ({ ...state, ...data })),
}))