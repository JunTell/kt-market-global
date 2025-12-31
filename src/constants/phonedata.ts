// --- 상수 데이터 (다국어 지원) ---

// 번역 함수 타입
type TranslationFunction = (key: string) => string

// 다국어 요금제 메타데이터 생성 함수
export const getPlanMetadata = (t: TranslationFunction) => [
  { uuid: "plan_59", dbId: "ppllistobj_0934", data: "25GB", name: t('Phone.Plans.plan_59_name'), description: t('Phone.Plans.plan_59_desc'), calls: `200${t('Phone.Plans.minutes')}`, texts: `200${t('Phone.Plans.messages')}`, fixedPrice: 59000 },
  { uuid: "plan_69", dbId: "ppllistobj_0747", data: "110GB", name: t('Phone.Plans.plan_69_name'), description: t('Phone.Plans.plan_69_desc'), calls: t('Phone.Plans.unlimited'), texts: t('Phone.Plans.included'), fixedPrice: 69000 },
  { uuid: "plan_69_v", dbId: "ppllistobj_0808", data: "110GB", name: t('Phone.Plans.plan_69_v_name'), description: t('Phone.Plans.plan_69_v_desc'), calls: t('Phone.Plans.unlimited'), texts: t('Phone.Plans.unlimited'), fixedPrice: 69000 },
  { uuid: "plan_90", dbId: "ppllistobj_0811", data: t('Phone.Plans.unlimited'), name: t('Phone.Plans.plan_90_name'), description: t('Phone.Plans.plan_90_desc'), calls: t('Phone.Plans.unlimited'), texts: t('Phone.Plans.unlimited'), fixedPrice: 90000 },
  { uuid: "plan_90_v", dbId: "ppllistobj_0811", data: t('Phone.Plans.unlimited'), name: t('Phone.Plans.plan_90_v_name'), description: t('Phone.Plans.plan_90_v_desc'), calls: t('Phone.Plans.unlimited'), texts: t('Phone.Plans.unlimited'), fixedPrice: 90000 },
]

interface PlanDetails {
  name: string
  data: string
  calls: string
  texts: string
  price: number
}

// 다국어 요금제 상세 정보 생성 함수
export const getPlanDetails = (t: TranslationFunction): Record<string, PlanDetails> => ({
  plan_59: { name: t('Phone.Plans.plan_59_name'), data: "25GB + 5Mbps", calls: `200${t('Phone.Plans.minutes')}`, texts: `200${t('Phone.Plans.messages')}`, price: 59000 },
  plan_69: { name: t('Phone.Plans.plan_69_name'), data: "100GB + 5Mbps", calls: t('Phone.Plans.unlimited'), texts: t('Phone.Plans.unlimited'), price: 69000 },
  plan_69_v: { name: t('Phone.Plans.plan_69_v_name'), data: "110GB + 5Mbps", calls: t('Phone.Plans.unlimited'), texts: t('Phone.Plans.unlimited'), price: 69000 },
  plan_90: { name: t('Phone.Plans.plan_90_name'), data: t('Phone.Plans.unlimited'), calls: t('Phone.Plans.unlimited'), texts: t('Phone.Plans.unlimited'), price: 90000 },
  plan_90_v: { name: t('Phone.Plans.plan_90_v_name'), data: t('Phone.Plans.unlimited'), calls: t('Phone.Plans.unlimited'), texts: t('Phone.Plans.unlimited'), price: 90000 },
  ppllistobj_0808: { name: t('Phone.Plans.plan_69_v_name'), data: "110GB+5Mbps", calls: t('Phone.Plans.unlimited'), texts: t('Phone.Plans.unlimited'), price: 69000 },
})

// 다국어 색상 맵 생성 함수
export const getColorMap = (t: TranslationFunction): Record<string, string> => ({
  lavender: t('Phone.Colors.lavender'), sage: t('Phone.Colors.sage'), blue: t('Phone.Colors.blue'), white: t('Phone.Colors.white'), black: t('Phone.Colors.black'),
  "natural_titanium": t('Phone.Colors.natural_titanium'), "black_titanium": t('Phone.Colors.black_titanium'), "white_titanium": t('Phone.Colors.white_titanium'), "blue_titanium": t('Phone.Colors.blue_titanium'), "desert_titanium": t('Phone.Colors.desert_titanium'),
  teal: t('Phone.Colors.teal'), pink: t('Phone.Colors.pink'), ultramarine: t('Phone.Colors.ultramarine'),
  gold: t('Phone.Colors.gold'), silver: t('Phone.Colors.silver'), "space_black": t('Phone.Colors.space_black'),
  "mist_blue": t('Phone.Colors.mist_blue'), "cosmic_orange": t('Phone.Colors.cosmic_orange'), "sky_blue": t('Phone.Colors.sky_blue'),
  "light_gold": t('Phone.Colors.light_gold'), "cloud_white": t('Phone.Colors.cloud_white'),
  ice_blue: t('Phone.Colors.ice_blue'), mint: t('Phone.Colors.mint'), navy: t('Phone.Colors.navy'), light_green: t('Phone.Colors.light_green'), deep_blue: t('Phone.Colors.deep_blue')
})

// 기존 호환성을 위한 기본 상수 (한국어)
export const PLAN_METADATA = [
  { uuid: "plan_59", dbId: "ppllistobj_0934", data: "25GB", name: "5G 웰컴 5", description: "25GB+다 쓰면 최대 5Mbps", calls: "200분", texts: "200건", fixedPrice: 59000 },
  { uuid: "plan_69", dbId: "ppllistobj_0747", data: "110GB", name: "데이터ON 비디오", description: "데이터 100GB + 5Mbps", calls: "무제한", texts: "기본제공", fixedPrice: 69000 },
  { uuid: "plan_69_v", dbId: "ppllistobj_0808", data: "110GB", name: "5G 심플 110GB", description: "데이터 110GB + 5Mbps", calls: "무제한", texts: "무제한", fixedPrice: 69000 },
  { uuid: "plan_90", dbId: "ppllistobj_0811", data: "무제한", name: "베이직 초이스", description: "완전 무제한", calls: "무제한", texts: "무제한", fixedPrice: 90000 },
  { uuid: "plan_90_v", dbId: "ppllistobj_0811", data: "무제한", name: "넷플릭스 초이스 베이직", description: "완전 무제한 ", calls: "무제한", texts: "무제한", fixedPrice: 90000 },
]

export const PLAN_DETAILS: Record<string, PlanDetails> = {
  plan_59: { name: "5G 웰컴 5", data: "25GB + 5Mbps", calls: "200분", texts: "200건", price: 59000 },
  plan_69: { name: "데이터ON 비디오", data: "100GB + 5Mbps", calls: "무제한", texts: "무제한", price: 69000 },
  plan_69_v: { name: "5G 심플 110GB", data: "110GB + 5Mbps", calls: "무제한", texts: "무제한", price: 69000 },
  plan_90: { name: "초이스 베이직", data: "완전무제한", calls: "무제한", texts: "무제한", price: 90000 },
  plan_90_v: { name: "넷플릭스 초이스 베이직", data: "완전무제한", calls: "무제한", texts: "무제한", price: 90000 },
  ppllistobj_0808: { name: "5G 심플 110GB", data: "110GB+5Mbps", calls: "무제한", texts: "무제한", price: 69000 },
}

export const COLOR_MAP: Record<string, string> = {
  lavender: "라벤더", sage: "세이지", blue: "미스트 블루", white: "화이트", black: "블랙",
  "natural_titanium": "내추럴 티타늄", "black_titanium": "블랙 티타늄", "white_titanium": "화이트 티타늄", "blue_titanium": "블루 티타늄", "desert_titanium": "데저트 티타늄",
  teal: "틸", pink: "핑크", ultramarine: "울트라마린",
  gold: "골드", silver: "실버", "space_black": "스페이스 블랙",
  "mist_blue": "미스트 블루", "cosmic_orange": "코스믹 오렌지", "sky_blue": "스카이 블루",
  "light_gold": "라이트 골드", "cloud_white": "클라우드 화이트",
  ice_blue: "아이스 블루", mint: "민트", navy: "네이비", light_green: "라이트그린", deep_blue: "딥블루"
}

export const MODEL_VARIANTS: Record<string, string[]> = {
  aip17: ["256", "512"],
  aip17p: ["256", "512", "1t"],
  aip17pm: ["256", "512", "1t", "2t"],
  aipa: ["256", "512", "1t"],
  aip16e: ["128", "256"],
  "sm-m366k": ["128"],
  "sm-s931nk": ["256", "512"]
}