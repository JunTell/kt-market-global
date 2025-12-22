export type VisaCategory = 'student' | 'work' | 'resident' | 'official' | 'other';

export type VisaInfo = {
  code: string;
  name: string;
  labels: {
    ko: string;
    en: string;
    zh: string;
    ja: string;
  };
  category: VisaCategory;
  postpaidLimit: number;
  installmentLimit: number;
};

export const VISA_CATEGORIES = [
  { id: 'all', labelKey: 'all' },
  { id: 'student', labelKey: 'student' },
  { id: 'work', labelKey: 'work' },
  { id: 'resident', labelKey: 'resident' },
  { id: 'official', labelKey: 'official' },
  { id: 'other', labelKey: 'other' },
] as const;

// ✅ 2. 체류 기간 옵션 데이터 추가
export const DURATION_OPTIONS = [
  { key: 'short', value: 'short' },
  { key: 'medium', value: 'medium' },
  { key: 'long', value: 'long' },
] as const;

// ✅ 3. 기기 선택 옵션 데이터 추가 (ID값 정의)
export const DEVICE_OPTIONS = [
  { key: 'Opt1', value: 'device_new' },
  { key: 'Opt2', value: 'device_budget' },
  { key: 'Opt3', value: 'sim_only' },
] as const;

export const VISA_FULL_LIST: VisaInfo[] = [
  // --- 1. 유학/연수 (Student) ---
  { 
    code: 'D-2', name: '유학', category: 'student', postpaidLimit: 1, installmentLimit: 1,
    labels: { ko: '유학', en: 'Student', zh: '留学', ja: '留学' }
  },
  { 
    code: 'D-4', name: '일반연수', category: 'student', postpaidLimit: 1, installmentLimit: 0,
    labels: { ko: '일반연수', en: 'General Trainee', zh: '一般研修', ja: '一般研修' }
  },
  { 
    code: 'D-10', name: '구직', category: 'student', postpaidLimit: 1, installmentLimit: 0,
    labels: { ko: '구직', en: 'Job Seeker', zh: '求职', ja: '求職' }
  },
  { 
    code: 'D-3', name: '기술연수', category: 'student', postpaidLimit: 1, installmentLimit: 0,
    labels: { ko: '기술연수', en: 'Industrial Trainee', zh: '技术研修', ja: '技術研修' }
  },

  // --- 2. 취업 (Work) ---
  { 
    code: 'E-7', name: '특정활동', category: 'work', postpaidLimit: 1, installmentLimit: 1,
    labels: { ko: '특정활동', en: 'Spec. Activity', zh: '特定活动', ja: '特定活動' }
  },
  { 
    code: 'E-9', name: '비전문취업', category: 'work', postpaidLimit: 1, installmentLimit: 1,
    labels: { ko: '비전문취업', en: 'Non-pro Employment', zh: '非专门就业', ja: '非専門就業' }
  },
  { 
    code: 'H-2', name: '방문취업', category: 'work', postpaidLimit: 2, installmentLimit: 2,
    labels: { ko: '방문취업', en: 'Work and Visit', zh: '访问就业', ja: '訪問就業' }
  },
  { 
    code: 'E-1', name: '교수', category: 'work', postpaidLimit: 2, installmentLimit: 1,
    labels: { ko: '교수', en: 'Professor', zh: '教授', ja: '教授' }
  },
  { 
    code: 'E-2', name: '회화지도', category: 'work', postpaidLimit: 2, installmentLimit: 1,
    labels: { ko: '회화지도', en: 'Language Instructor', zh: '会话指导', ja: '会話指導' }
  },
  { 
    code: 'E-3', name: '연구', category: 'work', postpaidLimit: 2, installmentLimit: 1,
    labels: { ko: '연구', en: 'Research', zh: '研究', ja: '研究' }
  },
  { 
    code: 'E-4', name: '기술지도', category: 'work', postpaidLimit: 2, installmentLimit: 1,
    labels: { ko: '기술지도', en: 'Tech Guidance', zh: '技术指导', ja: '技術指導' }
  },
  { 
    code: 'E-5', name: '전문직업', category: 'work', postpaidLimit: 2, installmentLimit: 1,
    labels: { ko: '전문직업', en: 'Professional', zh: '专门职业', ja: '専門職業' }
  },
  { 
    code: 'E-6', name: '예술흥행', category: 'work', postpaidLimit: 1, installmentLimit: 0,
    labels: { ko: '예술흥행', en: 'Arts/Performance', zh: '艺术兴行', ja: '芸術興行' }
  },
  { 
    code: 'E-10', name: '선원취업', category: 'work', postpaidLimit: 1, installmentLimit: 0,
    labels: { ko: '선원취업', en: 'Maritime Crew', zh: '船员就业', ja: '船員就業' }
  },
  { 
    code: 'D-7', name: '주재', category: 'work', postpaidLimit: 2, installmentLimit: 1,
    labels: { ko: '주재', en: 'Intl Company', zh: '驻在', ja: '駐在' }
  },
  { 
    code: 'D-8', name: '기업투자', category: 'work', postpaidLimit: 1, installmentLimit: 1,
    labels: { ko: '기업투자', en: 'Corporate Invest', zh: '企业投资', ja: '企業投資' }
  },
  { 
    code: 'D-9', name: '무역경영', category: 'work', postpaidLimit: 2, installmentLimit: 1,
    labels: { ko: '무역경영', en: 'Trade/Mgmt', zh: '贸易经营', ja: '貿易経営' }
  },
  { 
    code: 'H-1', name: '관광취업', category: 'work', postpaidLimit: 1, installmentLimit: 0,
    labels: { ko: '관광취업', en: 'Working Holiday', zh: '观光就业', ja: '観光就業' }
  },

  // --- 3. 거주/이민 (Resident) ---
  { 
    code: 'F-5', name: '영주', category: 'resident', postpaidLimit: 3, installmentLimit: 6,
    labels: { ko: '영주', en: 'Permanent Resident', zh: '永久居留', ja: '永住' }
  },
  { 
    code: 'F-2', name: '거주', category: 'resident', postpaidLimit: 3, installmentLimit: 3,
    labels: { ko: '거주', en: 'Resident', zh: '居住', ja: '居住' }
  },
  { 
    code: 'F-6', name: '결혼이민', category: 'resident', postpaidLimit: 3, installmentLimit: 3,
    labels: { ko: '결혼이민', en: 'Marriage Migrant', zh: '结婚移民', ja: '結婚移民' }
  },
  { 
    code: 'F-4', name: '재외동포', category: 'resident', postpaidLimit: 3, installmentLimit: 3,
    labels: { ko: '재외동포', en: 'Overseas Korean', zh: '在外同胞', ja: '在外同胞' }
  },
  { 
    code: 'F-1', name: '방문동거', category: 'resident', postpaidLimit: 1, installmentLimit: 1,
    labels: { ko: '방문동거', en: 'Visit & Join', zh: '访问同居', ja: '訪問同居' }
  },
  { 
    code: 'F-3', name: '동반', category: 'resident', postpaidLimit: 1, installmentLimit: 0,
    labels: { ko: '동반', en: 'Dependent Family', zh: '同伴', ja: '同伴' }
  },

  // --- 4. 공무/외교 (Official) ---
  { 
    code: 'A-1', name: '외교', category: 'official', postpaidLimit: 2, installmentLimit: 1,
    labels: { ko: '외교', en: 'Diplomat', zh: '外交', ja: '外交' }
  },
  { 
    code: 'A-2', name: '공무', category: 'official', postpaidLimit: 2, installmentLimit: 1,
    labels: { ko: '공무', en: 'Official Duty', zh: '公务', ja: '公務' }
  },
  { 
    code: 'A-3', name: '협정', category: 'official', postpaidLimit: 2, installmentLimit: 2,
    labels: { ko: '협정', en: 'Agreement', zh: '协定', ja: '協定' }
  },

  // --- 5. 기타 (Other) ---
  { 
    code: 'D-5', name: '취재', category: 'other', postpaidLimit: 2, installmentLimit: 1,
    labels: { ko: '취재', en: 'Journalism', zh: '采访', ja: '取材' }
  },
  { 
    code: 'D-6', name: '종교', category: 'other', postpaidLimit: 1, installmentLimit: 1,
    labels: { ko: '종교', en: 'Religious', zh: '宗教', ja: '宗教' }
  },
  { 
    code: 'D-1', name: '문화예술', category: 'other', postpaidLimit: 1, installmentLimit: 0,
    labels: { ko: '문화예술', en: 'Culture/Art', zh: '文化艺术', ja: '文化芸術' }
  },
  { 
    code: 'G-1', name: '기타', category: 'other', postpaidLimit: 1, installmentLimit: 0,
    labels: { ko: '기타', en: 'Miscellaneous', zh: '其他', ja: 'その他' }
  },

  // --- 6. 가입 불가 그룹 ---
  { 
    code: 'B-1', name: '사증면제', category: 'other', postpaidLimit: 0, installmentLimit: 0,
    labels: { ko: '사증면제', en: 'Visa Exempt', zh: '免签', ja: '査証免除' }
  },
  { 
    code: 'B-2', name: '관광통과', category: 'other', postpaidLimit: 0, installmentLimit: 0,
    labels: { ko: '관광통과', en: 'Tourist/Transit', zh: '观光通过', ja: '観光通過' }
  },
  { 
    code: 'C-3', name: '단기방문', category: 'other', postpaidLimit: 0, installmentLimit: 0,
    labels: { ko: '단기방문', en: 'Short-term Visit', zh: '短期访问', ja: '短期訪問' }
  },
  { 
    code: 'C-4', name: '단기취업', category: 'other', postpaidLimit: 0, installmentLimit: 0,
    labels: { ko: '단기취업', en: 'Short-term Emp', zh: '短期就业', ja: '短期就業' }
  },
];

// 🛠️ 다국어 지원 결과 반환 함수 (기기 선택 로직 포함)
export function getFullVisaResult(
  code: string, 
  locale: 'ko' | 'en' | 'zh' | 'ja' = 'ko',
  isSimOnly: boolean = false // 🆕 유심 단독 개통 여부 추가
) {
  const visa = VISA_FULL_LIST.find(v => v.code === code);
  
  // 1. 비자 정보 없음
  if (!visa) {
    const msg = {
      ko: '비자 정보를 찾을 수 없습니다.',
      en: 'Visa information not found.',
      zh: '找不到签证信息。',
      ja: 'ビザ情報が見つかりません。'
    };
    return { possible: false, message: msg[locale] };
  }

  const visaName = visa.labels[locale];

  // 2. 가입 자체가 불가한 비자 (C-3 등)
  if (visa.postpaidLimit === 0) {
    const msg = {
      ko: `${code}(${visaName}) 비자는 후불 개통이 불가능합니다.`,
      en: `${code}(${visaName}) visa is not eligible for postpaid plans.`,
      zh: `${code}(${visaName}) 签证无法办理后付套餐。`,
      ja: `${code}(${visaName}) ビザでは後払いプランの契約ができません。`
    };
    return { 
      possible: false, 
      postpaid: false, 
      installment: false,
      message: msg[locale] 
    };
  }

  // 3. 🆕 유심 단독 개통 선택 시 (할부 한도 무시)
  if (isSimOnly) {
    const msg = {
      ko: `✅ 개통 가능합니다! (유심 단독)\n${code} 비자는 할부 한도와 관계없이 요금제 가입이 가능합니다.`,
      en: `✅ Available! (SIM Only)\n${code} visa allows postpaid plans regardless of installment limits.`,
      zh: `✅ 可以开通！（仅SIM卡）\n${code} 签证无论分期额度如何，均可加入套餐。`,
      ja: `✅ 契約可能です！（SIMのみ）\n${code} ビザは分割限度に関係なくプラン契約が可能です。`
    };
    // 유심 개통은 가능하므로 installment 여부와 상관없이 긍정 메시지
    return {
      possible: true,
      postpaid: true,
      installment: visa.installmentLimit > 0, // 정보 제공용 (실제로는 유심이라 안 쓰임)
      message: msg[locale]
    };
  }

  // 4. 기기 구매 선택 시: 할부 불가 체크 (일시불만 가능)
  if (visa.installmentLimit === 0) {
    const msg = {
      ko: `✅ 개통 가능 (일시불 결제 필요)\n${code} 비자는 기기 할부가 불가능합니다.`,
      en: `✅ Available (Full payment required)\nInstallment plans are not allowed for ${code} visa.`,
      zh: `✅ 可以开通（需一次性付清）\n${code} 签证无法分期付款。`,
      ja: `✅ 契約可能（一括払い必須）\n${code} ビザは端末の分割払いができません。`
    };
    return { 
      possible: true, 
      postpaid: true, 
      installment: false,
      message: msg[locale] 
    };
  }

  // 5. 모두 가능 (기기 구매 + 할부 가능)
  const msg = {
    ko: `✅ 후불 개통 + 기기 할부 모두 가능!\n(할부 한도: ${visa.installmentLimit}회선)`,
    en: `✅ Postpaid Plan + Device Installment Available!\n(Installment Limit: ${visa.installmentLimit} lines)`,
    zh: `✅ 后付套餐 + 设备分期均可办理！\n（分期额度：${visa.installmentLimit}回线）`,
    ja: `✅ 後払いプラン + 端末分割払いの両方が可能です！\n（分割限度：${visa.installmentLimit}回線）`
  };

  return { 
    possible: true, 
    postpaid: true, 
    installment: true,
    message: msg[locale] 
  };
}