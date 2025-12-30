// --- 상수 데이터 ---
export const PLAN_METADATA = [
  { uuid: "plan_59", dbId: "ppllistobj_0934", data: "25GB", name: "5G 웰컴 5", description: "25GB+다 쓰면 최대 5Mbps", calls: "200분", texts: "200건", fixedPrice: 59000 },
  { uuid: "plan_69", dbId: "ppllistobj_0747", data: "110GB", name: "데이터ON 비디오", description: "데이터 100GB + 5Mbps", calls: "무제한", texts: "기본제공", fixedPrice: 69000 },
  { uuid: "plan_69_v", dbId: "ppllistobj_0808", data: "110GB", name: "5G 심플 110GB", description: "데이터 110GB + 5Mbps", calls: "무제한", texts: "무제한", fixedPrice: 69000 },
  { uuid: "plan_90", dbId: "ppllistobj_0811", data: "무제한", name: "베이직 초이스", description: "완전 무제한", calls: "무제한", texts: "무제한", fixedPrice: 90000 },
  { uuid: "plan_90_v", dbId: "ppllistobj_0811", data: "무제한", name: "넷플릭스 초이스 베이직", description: "완전 무제한 ", calls: "무제한", texts: "무제한", fixedPrice: 90000 },
]

export const PLAN_DETAILS: Record<string, any> = {
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