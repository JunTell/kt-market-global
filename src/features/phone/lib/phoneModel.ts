/**
 * 핸드폰 모델 관련 유틸리티 함수들
 */

import { MODEL_VARIANTS } from "./phonedata"

/**
 * 파싱된 모델 정보 인터페이스
 */
export interface ParsedPhoneModel {
  /** 모델 prefix (예: "aip17", "sm-s931nk") */
  prefix: string
  /** 용량 (예: "256", "512") */
  capacity: string
  /** 색상 (예: "lavender", "black") */
  color: string
  /** capacity가 URL에서 추출된 인덱스 */
  capacityIndex: number
}

/**
 * URL 모델 문자열을 파싱하여 구성 요소로 분리
 *
 * @param modelString - URL에서 가져온 모델 문자열 (예: "aip17-256-lavender", "sm-s931nk-512-black")
 * @returns 파싱된 모델 정보
 *
 * @example
 * parsePhoneModel("aip17-256-lavender")
 * // { prefix: "aip17", capacity: "256", color: "lavender", capacityIndex: 1 }
 *
 * parsePhoneModel("sm-s931nk-512-black")
 * // { prefix: "sm-s931nk", capacity: "512", color: "black", capacityIndex: 2 }
 */
export function parsePhoneModel(modelString: string): ParsedPhoneModel {
  const parts = modelString.split("-")
  let prefix = parts[0]
  let capacityIndex = 1

  // 삼성 모델은 prefix가 "sm-모델명" 형태
  if (prefix === "sm") {
    prefix = `${parts[0]}-${parts[1]}`
    capacityIndex = 2
  }

  // 기본 용량 값 가져오기
  const defaultCapacity = MODEL_VARIANTS[prefix]?.[0] || "256"
  const capacity = parts[capacityIndex] || defaultCapacity
  const color = parts.slice(capacityIndex + 1).join("-") || ""

  return {
    prefix,
    capacity,
    color,
    capacityIndex
  }
}

/**
 * DB 쿼리용 모델 키 생성 (특정 모델의 예외 처리 포함)
 *
 * @param prefix - 모델 prefix
 * @param capacity - 용량
 * @returns DB에서 사용할 모델 키
 *
 * @example
 * getDBModelKey("aip17", "256") // "aip17-256"
 * getDBModelKey("sm-m366k", "256") // "sm-m366k" (capacity 무시)
 * getDBModelKey("sm-s931nk", "512") // "sm-s931nk512"
 * getDBModelKey("sm-s931nk", "256") // "sm-s931nk"
 */
export function getDBModelKey(prefix: string, capacity: string): string {
  // 삼성 갤럭시 M 시리즈 - capacity를 무시하고 prefix만 사용
  if (prefix === "sm-m366k") {
    return "sm-m366k"
  }

  // 삼성 갤럭시 S24 시리즈 - 512GB는 특별한 키 사용
  if (prefix === "sm-s931nk") {
    return capacity === "512" ? "sm-s931nk512" : "sm-s931nk"
  }

  // 일반적인 경우: prefix-capacity
  return `${prefix}-${capacity}`
}

/**
 * 모델 구성 요소로 전체 모델 문자열 빌드
 *
 * @param prefix - 모델 prefix
 * @param capacity - 용량
 * @param color - 색상
 * @returns 전체 모델 문자열 (예: "aip17-256-lavender")
 *
 * @example
 * buildPhoneModelString("aip17", "256", "lavender") // "aip17-256-lavender"
 * buildPhoneModelString("sm-s931nk", "512", "black") // "sm-s931nk-512-black"
 */
export function buildPhoneModelString(prefix: string, capacity: string, color: string): string {
  if (!color) {
    return `${prefix}-${capacity}`
  }
  return `${prefix}-${capacity}-${color}`
}

/**
 * URL에서 사용할 모델 쿼리 파라미터 생성
 *
 * @param prefix - 모델 prefix
 * @param capacity - 용량
 * @param color - 색상 (선택사항)
 * @returns URL 쿼리 문자열 (예: "?model=aip17-256-lavender")
 *
 * @example
 * buildModelQueryParam("aip17", "256", "lavender") // "?model=aip17-256-lavender"
 * buildModelQueryParam("aip17", "256") // "?model=aip17-256"
 */
export function buildModelQueryParam(prefix: string, capacity: string, color?: string): string {
  const modelString = color
    ? buildPhoneModelString(prefix, capacity, color)
    : `${prefix}-${capacity}`
  return `?model=${modelString}`
}

/**
 * 모델이 특별 할인 대상인지 확인
 * (iPhone 17 시리즈)
 *
 * @param prefix - 모델 prefix
 * @returns 특별 할인 대상 여부
 *
 * @example
 * isSpecialDiscountModel("aip17") // true
 * isSpecialDiscountModel("aipa") // true
 * isSpecialDiscountModel("sm-s931nk") // false
 */
export function isSpecialDiscountModel(prefix: string): boolean {
  return prefix.startsWith("aip17") || prefix.startsWith("aipa")
}
