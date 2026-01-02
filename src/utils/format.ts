/**
 * 공통 포맷팅 유틸리티 함수들
 */

/**
 * 숫자를 로케일에 맞는 가격 형식으로 포맷팅
 * @param value - 포맷팅할 숫자
 * @param locale - 로케일 ('ko' 또는 'en')
 * @returns 포맷팅된 가격 문자열 (예: "1,234,567")
 */
export function formatPrice(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : 'en-US').format(value)
}

/**
 * 가격을 통화 기호와 함께 포맷팅
 * @param value - 포맷팅할 숫자
 * @param locale - 로케일 ('ko' 또는 'en')
 * @param currencySymbol - 통화 기호 (예: '원', 'won')
 * @returns 포맷팅된 가격 + 통화 문자열 (예: "1,234,567원")
 */
export function formatPriceWithCurrency(value: number, locale: string, currencySymbol: string): string {
  return `${formatPrice(value, locale)}${currencySymbol}`
}

/**
 * 핸드폰 번호를 하이픈 형식으로 포맷팅
 * @param value - 핸드폰 번호 (숫자만 또는 하이픈 포함)
 * @returns 포맷팅된 핸드폰 번호 (예: "010-1234-5678")
 */
export function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/[^\d]/g, '')
  if (numbers.length <= 3) return numbers
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
}

/**
 * 가격을 만원 단위로 포맷팅 (1만원 이상일 경우)
 * @param value - 포맷팅할 숫자
 * @param manSymbol - '만' 문자 (다국어 지원)
 * @param wonSymbol - '원' 문자 (다국어 지원)
 * @param locale - 로케일 ('ko' 또는 'en')
 * @returns 포맷팅된 가격 문자열 (예: "12만" 또는 "120K KRW")
 */
export function formatManWon(value: number, manSymbol: string, wonSymbol: string, locale: string): string {
  if (locale === 'ko' && value >= 10000) {
    // 한국어: 만 단위로 표시 (예: "87만")
    return `${Math.floor(value / 10000)}${manSymbol}`
  } else if (locale === 'en' && value >= 1000) {
    // 영어: 천 단위로 표시 (예: "871K KRW")
    return `${Math.floor(value / 1000)}K ${wonSymbol}`
  }
  return `${formatPrice(value, locale)}${wonSymbol}`
}

/**
 * 할인율 계산
 * @param originalPrice - 원래 가격
 * @param discountedPrice - 할인된 가격
 * @returns 할인율 (0-100 사이의 정수)
 */
export function calculateDiscountRate(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= 0) return 0
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}
