/**
 * 가격 계산 관련 유틸리티 함수들
 */

/**
 * 할인 모드 타입
 */
export type DiscountMode = 'device' | 'plan'

/**
 * 가입 유형
 */
export type RegistrationType = 'chg' | 'mnp'

/**
 * 요금제 정보 인터페이스
 */
export interface PlanInfo {
  /** 요금제 월 가격 */
  price: number
  /** 공시지원금 */
  disclosureSubsidy?: number
  /** 마켓 할인 (kt마켓 할인) */
  marketSubsidy?: number
}

/**
 * 최종 기기 가격 계산 입력 파라미터
 */
export interface FinalPriceInput {
  /** 기기 원가 */
  originPrice: number
  /** 선택된 요금제 정보 */
  plan?: PlanInfo
  /** 할인 모드 */
  discountMode: DiscountMode
  /** 가입 유형 */
  registrationType: RegistrationType
  /** 모델 prefix (특별 할인 확인용) */
  modelPrefix: string
  /** 추가 kt마켓 할인 (plan에 없을 경우 사용) */
  ktMarketDiscount?: number
}

/**
 * 요금제 월 할인액 계산 (요금제 가격의 25%, 10원 단위 내림)
 *
 * @param planPrice - 요금제 월 가격
 * @returns 월 할인액
 *
 * @example
 * calculatePlanMonthlyDiscount(69000) // 17250
 * calculatePlanMonthlyDiscount(89000) // 22250
 */
export function calculatePlanMonthlyDiscount(planPrice: number): number {
  return Math.floor((planPrice * 0.25) / 10) * 10
}

/**
 * 할인 적용된 요금제 월 가격 계산
 *
 * @param planPrice - 요금제 월 가격
 * @param discountMode - 할인 모드
 * @returns 할인 적용된 월 가격
 *
 * @example
 * calculateDiscountedMonthlyPrice(69000, 'plan') // 51750 (69000 - 17250)
 * calculateDiscountedMonthlyPrice(69000, 'device') // 69000 (할인 없음)
 */
export function calculateDiscountedMonthlyPrice(
  planPrice: number,
  discountMode: DiscountMode
): number {
  if (discountMode === 'plan') {
    const discount = calculatePlanMonthlyDiscount(planPrice)
    return planPrice - discount
  }
  return planPrice
}

/**
 * 특별 할인 금액 계산 (iPhone 17 시리즈 + MNP)
 *
 * @param modelPrefix - 모델 prefix
 * @param registrationType - 가입 유형
 * @returns 특별 할인 금액
 *
 * @example
 * calculateSpecialDiscount('aip17', 'mnp') // 70000
 * calculateSpecialDiscount('aip17', 'chg') // 0
 * calculateSpecialDiscount('sm-s931nk', 'mnp') // 0
 */
export function calculateSpecialDiscount(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _modelPrefix: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _registrationType: RegistrationType
): number {
  return 0
}

/**
 * 최종 기기 가격 계산
 *
 * @param input - 가격 계산 입력 파라미터
 * @returns 최종 기기 가격
 *
 * @example
 * calculateFinalDevicePrice({
 *   originPrice: 1500000,
 *   plan: { price: 69000, disclosureSubsidy: 300000, marketSubsidy: 100000 },
 *   discountMode: 'device',
 *   registrationType: 'mnp',
 *   modelPrefix: 'aip17'
 * })
 * // 1500000 - 300000 - 100000 - 70000 = 1030000
 */
export function calculateFinalDevicePrice(input: FinalPriceInput): number {
  const {
    originPrice,
    plan,
    discountMode,
    registrationType,
    modelPrefix,
    ktMarketDiscount = 0
  } = input

  if (!plan) {
    return originPrice
  }

  // 할인 항목들
  const marketSubsidy = plan.marketSubsidy ?? ktMarketDiscount
  const disclosureSubsidy = plan.disclosureSubsidy ?? 0
  const specialDiscount = calculateSpecialDiscount(modelPrefix, registrationType)

  // 할인 모드에 따라 다른 계산
  if (discountMode === 'device') {
    // 기기 할인 모드: 공시지원금 + 마켓 할인 + 특별 할인
    return Math.max(0, originPrice - disclosureSubsidy - marketSubsidy - specialDiscount)
  } else {
    // 요금 할인 모드: 마켓 할인 + 특별 할인만 적용
    return Math.max(0, originPrice - marketSubsidy - specialDiscount)
  }
}

/**
 * 총 기기 할인액 계산
 *
 * @param input - 가격 계산 입력 파라미터
 * @returns 총 할인액
 *
 * @example
 * calculateTotalDeviceDiscount({
 *   plan: { disclosureSubsidy: 300000, marketSubsidy: 100000 },
 *   discountMode: 'device',
 *   registrationType: 'mnp',
 *   modelPrefix: 'aip17'
 * })
 * // 300000 + 100000 + 70000 = 470000
 */
export function calculateTotalDeviceDiscount(
  input: Omit<FinalPriceInput, 'originPrice'>
): number {
  const {
    plan,
    discountMode,
    registrationType,
    modelPrefix,
    ktMarketDiscount = 0
  } = input

  if (!plan) {
    return 0
  }

  const marketSubsidy = plan.marketSubsidy ?? ktMarketDiscount
  const disclosureSubsidy = plan.disclosureSubsidy ?? 0
  const specialDiscount = calculateSpecialDiscount(modelPrefix, registrationType)

  if (discountMode === 'device') {
    return disclosureSubsidy + marketSubsidy + specialDiscount
  } else {
    return marketSubsidy + specialDiscount
  }
}

/**
 * 요금제 할인 모드의 24개월 총 할인액 계산
 *
 * @param planPrice - 요금제 월 가격
 * @returns 24개월 총 할인액
 *
 * @example
 * calculateTotalPlanDiscount(69000) // 17250 * 24 = 414000
 */
export function calculateTotalPlanDiscount(planPrice: number): number {
  const monthlyDiscount = calculatePlanMonthlyDiscount(planPrice)
  return monthlyDiscount * 24
}
