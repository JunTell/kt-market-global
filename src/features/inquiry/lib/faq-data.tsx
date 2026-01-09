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
    question: t('faq_gongsi_q'),
    answer: t('faq_gongsi_a')
  },
  {
    id: 'change',
    keywords: ['기기변경', '기변', '이동', '번호이동'],
    question: t('faq_change_q'),
    answer: t('faq_change_a')
  },
  {
    id: 'simfree',
    keywords: ['자급제', '통신사', '쿠팡'],
    question: t('faq_simfree_q'),
    answer: t('faq_simfree_a')
  },
  {
    id: 'fraud',
    keywords: ['속는', '사기', '반납', '호갱'],
    question: t('faq_fraud_q'),
    answer: t('faq_fraud_a')
  },
  {
    id: 'holy',
    keywords: ['성지', '대리점', '공식'],
    question: t('faq_holy_q'),
    answer: t('faq_holy_a')
  }
];
