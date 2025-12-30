export type FAQItem = {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
};

// 번역 함수 타입
type TranslationFunction = (key: string) => string

// 다국어 FAQ 리스트 생성 함수
export const getFAQList = (t: TranslationFunction): FAQItem[] => [
  {
    id: 'gongsi',
    keywords: ['공시', '지원금', '선택약정', '선약'],
    question: t('ChatBot.faq_gongsi_q'),
    answer: t('ChatBot.faq_gongsi_a')
  },
  {
    id: 'change',
    keywords: ['기기변경', '기변', '이동', '번호이동'],
    question: t('ChatBot.faq_change_q'),
    answer: t('ChatBot.faq_change_a')
  },
  {
    id: 'simfree',
    keywords: ['자급제', '통신사', '쿠팡'],
    question: t('ChatBot.faq_simfree_q'),
    answer: t('ChatBot.faq_simfree_a')
  },
  {
    id: 'fraud',
    keywords: ['속는', '사기', '반납', '호갱'],
    question: t('ChatBot.faq_fraud_q'),
    answer: t('ChatBot.faq_fraud_a')
  },
  {
    id: 'holy',
    keywords: ['성지', '대리점', '공식'],
    question: t('ChatBot.faq_holy_q'),
    answer: t('ChatBot.faq_holy_a')
  }
];

// 기존 호환성을 위한 기본 상수 (한국어)
export const FAQ_LIST: FAQItem[] = [
  {
    id: 'gongsi',
    keywords: ['공시', '지원금', '선택약정', '선약'],
    question: '공시지원금 vs 선택약정 차이',
    answer: "💡 [공시지원금 vs 선택약정]\n\n• 공시지원금: 기기값을 한 번에 할인받는 방식입니다. 높은 요금제를 6개월 유지해야 하며, 기기값이 비쌀 때 유리합니다.\n\n• 선택약정: 매달 요금의 25%를 할인받는 방식입니다. 최신 아이폰처럼 공시지원금이 적을 때는 선택약정이 훨씬 유리합니다."
  },
  {
    id: 'change',
    keywords: ['기기변경', '기변', '이동', '번호이동'],
    question: 'KT 기기변경이 유리한 경우',
    answer: "💡 [KT 기기변경 추천 대상]\n\n1. 가족 결합: 가족끼리 묶여서 통신비를 많이 할인받고 계신다면 기기변경이 낫습니다.\n2. 장기 고객: 멤버십 포인트나 장기 혜택이 중요하신 분.\n3. 인터넷/TV 결합: 집 인터넷이 KT라면 굳이 옮기지 마세요!"
  },
  {
    id: 'simfree',
    keywords: ['자급제', '통신사', '쿠팡'],
    question: '자급제보다 통신사가 싼 경우',
    answer: "💡 [통신사 구매가 더 싼 경우]\n\n• 불법 보조금(성지): 판매점에서 리베이트를 많이 줄 때 (30~50만원 추가 할인).\n• 제휴카드: 전월 실적을 채워서 매달 할인을 받을 때.\n• 결합 할인: 가족 결합으로 요금을 반값에 쓰고 있을 때."
  },
  {
    id: 'fraud',
    keywords: ['속는', '사기', '반납', '호갱'],
    question: '휴대폰 구매 시 속는 포인트',
    answer: "🚨 [호갱 주의보! 이것만 조심하세요]\n\n1. 반납 조건(슈퍼체인지): 2년 뒤 기기를 반납해야 남은 할부금을 까주는 건데, 마치 할인을 해주는 척 속입니다.\n2. 48개월 할부: 월 납입금이 싸 보이지만, 실제로는 이자를 4년 동안 내야 합니다.\n3. 제휴카드 눈속임: 카드를 써야 할인되는 건데, 기기값 자체가 싼 것처럼 말합니다."
  },
  {
    id: 'holy',
    keywords: ['성지', '대리점', '공식'],
    question: '공식 대리점과 성지의 차이',
    answer: "🏢 [대리점 vs 성지]\n\n• 공식 대리점: 정가 판매, 신뢰도 높음, 사은품(케이스 등) 증정.\n• 성지: 판매 수당을 고객에게 현금(페이백)으로 돌려줘서 기기값이 매우 쌈. 다만 발품을 팔아야 하고 현금 완납을 선호함."
  }
];