/**
 * 다국어 값을 한국어로 변환하는 유틸리티 함수
 * DB 저장 시 모든 값을 한국어로 통일하기 위해 사용
 */

type MappingKey = 'company' | 'funnel' | 'join_type' | 'contract' | 'discount_type' | 'country' | 'plan_name' | 'color'

const KOREAN_MAPPINGS: Record<MappingKey, Record<string, string>> = {
  company: {
    'KT': 'KT',
    'kt': 'KT'
  },

  funnel: {
    'ASAMO': '외국인',
    'asamo': '외국인'
  },

  join_type: {
    'Number Change': '기기변경',
    'Device Change': '기기변경',
    'MNP': '번호이동',
    '기기변경': '기기변경',
    '번호이동': '번호이동',
    // JA
    '機種変更': '기기변경',
    '番号ポータビリティ': '번호이동',
    // ZH
    '更换设备': '기기변경',
    '携号转网': '번호이동'
  },

  contract: {
    '24 Months': '24개월',
    '24개월': '24개월',
    '12 Months': '12개월',
    '12개월': '12개월',
    // JA
    '24ヶ月': '24개월',
    '12ヶ月': '12개월',
    // ZH
    '24个月': '24개월',
    '12个月': '12개월'
  },

  discount_type: {
    'device': '공시지원',
    'plan': '선택약정',
    '공시지원': '공시지원',
    '선택약정': '선택약정',
    // JA
    '端末割引': '공시지원',
    'プラン割引': '선택약정',
    '選択約定 (プラン割引)': '선택약정',
    '公示支援金 (端末割引)': '공시지원',
    // ZH
    '设备折扣': '공시지원',
    '套餐折扣': '선택약정',
    '选择合约 (套餐折扣)': '선택약정',
    '公示补贴 (设备折扣)': '공시지원'
  },

  country: {
    'Republic of Korea': '대한민국',
    'USA': '미국',
    'China': '중국',
    'Japan': '일본',
    'Vietnam': '베트남',
    'Thailand': '태국',
    'Other': '기타',
    '대한민국': '대한민국',
    '미국': '미국',
    '중국': '중국',
    '일본': '일본',
    '베트남': '베트남',
    '태국': '태국',
    '기타': '기타',
    // JA/ZH (Safeguard)
    '日本': '일본',
    '中国': '중국'
  },

  plan_name: {
    // 영어 -> 한국어 매핑
    '5G Welcome 5': '5G 웰컴 5',
    'Data ON Video': '데이터ON 비디오',
    '5G Simple 110GB': '5G 심플 110GB',
    'Choice Basic': '초이스 베이직',
    'Netflix Choice Basic': '넷플릭스 초이스 베이직',
    'Legacy Data ON Video': '데이터ON 비디오',
    // 한국어는 그대로
    '5G 웰컴 5': '5G 웰컴 5',
    '데이터ON 비디오': '데이터ON 비디오',
    '5G 심플 110GB': '5G 심플 110GB',
    '초이스 베이직': '초이스 베이직',
    '넷플릭스 초이스 베이직': '넷플릭스 초이스 베이직',
    // JA
    '5G ウェルカム 5': '5G 웰컴 5',
    'データON ビデオ': '데이터ON 비디오',
    '5G シンプル 110GB': '5G 심플 110GB',
    'ベーシック チョイス': '초이스 베이직',
    'YouTube チョイス ベーシック': '초이스 베이직', // Assuming mapping to Basic Choice equivalent or similar
    // ZH
    '5G 欢迎 5': '5G 웰컴 5',
    '数据ON 视频': '데이터ON 비디오',
    '5G 简单 110GB': '5G 심플 110GB',
    '基础选择': '초이스 베이직',
    'YouTube 选择 基础': '초이스 베이직'
  },

  color: {
    // English -> Korean
    'Lavender': '라벤더',
    'Sage': '세이지',
    'Mist Blue': '미스트 블루',
    'White': '화이트',
    'Black': '블랙',
    'Natural Titanium': '내추럴 티타늄',
    'Black Titanium': '블랙 티타늄',
    'White Titanium': '화이트 티타늄',
    'Blue Titanium': '블루 티타늄',
    'Desert Titanium': '데저트 티타늄',
    'Teal': '틸',
    'Pink': '핑크',
    'Ultramarine': '울트라마린',
    'Gold': '골드',
    'Silver': '실버',
    'Space Black': '스페이스 블랙',
    'Cosmic Orange': '코스믹 오렌지',
    'Sky Blue': '스카이 블루',
    'Light Gold': '라이트 골드',
    'Cloud White': '클라우드 화이트',
    'Ice Blue': '아이스 블루',
    'Mint': '민트',
    'Navy': '네이비',
    'Light Green': '라이트그린',
    'Deep Blue': '딥블루',

    // Korean
    '라벤더': '라벤더',
    '세이지': '세이지',
    '미스트 블루': '미스트 블루',
    '화이트': '화이트',
    '블랙': '블랙',
    '내추럴 티타늄': '내추럴 티타늄',
    '블랙 티타늄': '블랙 티타늄',
    '화이트 티타늄': '화이트 티타늄',
    '블루 티타늄': '블루 티타늄',
    '데저트 티타늄': '데저트 티타늄',
    '틸': '틸',
    '핑크': '핑크',
    '울트라마린': '울트라마린',
    '골드': '골드',
    '실버': '실버',
    '스페이스 블랙': '스페이스 블랙',
    '코스믹 오렌지': '코스믹 오렌지',
    '스카이 블루': '스카이 블루',
    '라이트 골드': '라이트 골드',
    '클라우드 화이트': '클라우드 화이트',
    '아이스 블루': '아이스 블루',
    '민트': '민트',
    '네이비': '네이비',
    '라이트그린': '라이트그린',
    '딥블루': '딥블루',

    // JA
    'ラベンダー': '라벤더',
    'セージ': '세이지',
    'ミストブルー': '미스트 블루',
    'ホワイト': '화이트',
    'ブラック': '블랙',
    'ナチュラルチタニウム': '내추럴 티타늄',
    'ブラックチタニウム': '블랙 티타늄',
    'ホワイトチタニウム': '화이트 티타늄',
    'ブルーチタニウム': '블루 티타늄',
    'デザートチタニウム': '데저트 티타늄',
    'ティール': '틸',
    'ピンク': '핑크',
    'ウルトラマリン': '울트라마린',
    'ゴールド': '골드',
    'シルバー': '실버',
    'スペースブラック': '스페이스 블랙',
    'コズミックオレンジ': '코스믹 오렌지',
    'スカイブルー': '스카이 블루',
    'ライトゴールド': '라이트 골드',
    'クラウドホワイト': '클라우드 화이트',
    'アイスブルー': '아이스 블루',
    'ミント': '민트',
    'ネイビー': '네이비',
    'ライトグリーン': '라이트그린',
    'ディープブルー': '딥블루',

    // ZH
    '薰衣草': '라벤더',
    '鼠尾草': '세이지',
    '雾蓝': '미스트 블루',
    '白色': '화이트',
    '黑色': '블랙',
    '自然钛金': '내추럴 티타늄',
    '黑色钛金': '블랙 티타늄',
    '白色钛金': '화이트 티타늄',
    '蓝色钛金': '블루 티타늄',
    '沙漠钛金': '데저트 티타늄',
    '青色': '틸',
    '粉色': '핑크',
    '群青': '울트라마린',
    '金色': '골드',
    '银色': '실버',
    '太空黑': '스페이스 블랙',
    '宇宙橙': '코스믹 오렌지',
    '天蓝': '스카이 블루',
    '浅金': '라이트 골드',
    '云白': '클라우드 화이트',
    '冰蓝': '아이스 블루',
    '薄荷': '민트',
    '海军蓝': '네이비',
    '浅绿': '라이트그린',
    '深蓝': '딥블루'
  }
}

/**
 * 주어진 키와 값을 한국어로 변환
 * @param key - 변환할 데이터의 종류 (company, funnel, join_type 등)
 * @param value - 변환할 값
 * @returns 한국어로 변환된 값, 매핑이 없으면 원본 값 반환
 */
export function toKorean(key: MappingKey, value: string): string {
  return KOREAN_MAPPINGS[key]?.[value] || value
}

/**
 * 여러 필드를 한 번에 한국어로 변환
 * @param data - 변환할 데이터 객체
 * @returns 한국어로 변환된 데이터 객체
 */
export function toKoreanBatch(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...data }

  const keyMapping: Record<string, MappingKey> = {
    company: 'company',
    funnel: 'funnel',
    join_type: 'join_type',
    joinType: 'join_type',
    register: 'join_type',
    contract: 'contract',
    discount_type: 'discount_type',
    discountType: 'discount_type',
    country: 'country',
    plan_name: 'plan_name',
    planName: 'plan_name',
    color: 'color'
  }

  for (const [dataKey, mappingKey] of Object.entries(keyMapping)) {
    if (result[dataKey] && typeof result[dataKey] === 'string') {
      result[dataKey] = toKorean(mappingKey, result[dataKey])
    }
  }

  return result
}
