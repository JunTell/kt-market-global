'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { formatPhoneNumber } from '@/shared/lib/format';

const CARRIERS = ['KT', 'SKT', 'LG', 'MVNO', 'NONE'];

// 주요 도시 목록 (필요 시 확장)
const REGIONS = [
  "서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시", "울산광역시", "세종특별자치시",
  "경기도", "강원도", "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주특별자치도"
];

export default function InquiryForm() {
  const t = useTranslations('Form');
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [carrier, setCarrier] = useState("");
  const [region, setRegion] = useState("");
  const [isManualRegion, setIsManualRegion] = useState(false);
  const [device, setDevice] = useState(() => {
    // 초기 로드 시 sessionStorage에서 기기 정보 가져오기
    try {
      const storedData = sessionStorage.getItem('eligibility_data');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        // 저장된 devicePlan이 'sim_only'가 아니라면 초기값으로 설정
        if (parsed.devicePlan && !parsed.devicePlan.includes('sim')) {
          return parsed.devicePlan;
        }
      }
    } catch (e) {
      console.error('Session parse error', e);
    }
    return "";
  });

  // 유효성 검사
  const isStepValid = () => {
    switch (step) {
      case 1: return name.length > 0;
      case 2: return phone.replace(/-/g, '').length >= 10; // 0101234567 (10자리) 이상
      case 3: return !!carrier;
      case 4: return !!region;
      case 5: return true; // 기기는 선택사항 (없으면 추천)
      default: return false;
    }
  };

  const handleNext = () => {
    if (!isStepValid()) return;

    if (step < 5) {
      setDirection(1);
      setStep(step + 1);
    } else {
      // ✅ 최종 제출 로직
      alert(t('Toast.success')); // 실제로는 Toast UI 사용 권장

      // 세션 클리어 및 홈으로 이동
      sessionStorage.removeItem('eligibility_data');
      router.push('/');
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    } else {
      router.back(); // 첫 단계에서 뒤로가기 시 이전 페이지로
    }
  };

  // 애니메이션 설정
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans max-w-lg mx-auto shadow-xl">
      {/* Header */}
      <header className="h-14 flex items-center px-4 sticky top-0 bg-white z-10">
        <button onClick={handlePrev} className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 text-center pr-8">
          {/* Progress Dots (Optional) */}
          <div className="flex justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-6 pt-6 pb-24 overflow-hidden flex flex-col">
        <div className="mb-8">
          <motion.div
            key={step} // step이 바뀔 때마다 텍스트 애니메이션
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 whitespace-pre-line leading-snug">
              {step === 1 && t('Name.label')}
              {step === 2 && t('Phone.label')}
              {step === 3 && t('Carrier.label')}
              {step === 4 && t('Region.label')}
              {step === 5 && t('Device.label')}
            </h1>
          </motion.div>
        </div>

        <div className="flex-1 relative">
          <AnimatePresence custom={direction} mode='wait'>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute w-full top-0 left-0"
            >
              {/* STEP 1: Name */}
              {step === 1 && (
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('Name.placeholder')}
                  className="w-full text-2xl border-b-2 border-gray-200 focus:border-primary py-2 outline-none placeholder:text-gray-300 bg-transparent transition-colors"
                />
              )}

              {/* STEP 2: Phone */}
              {step === 2 && (
                <input
                  autoFocus
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                  placeholder={t('Phone.placeholder')}
                  maxLength={13}
                  className="w-full text-2xl border-b-2 border-gray-200 focus:border-primary py-2 outline-none placeholder:text-gray-300 bg-transparent transition-colors"
                />
              )}

              {/* STEP 3: Carrier */}
              {step === 3 && (
                <div className="grid gap-3">
                  {CARRIERS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCarrier(c)}
                      className={`w-full py-4 px-6 text-left rounded-xl border-2 transition-all text-lg font-medium
                        ${carrier === c
                          ? 'border-primary bg-blue-50 text-primary'
                          : 'border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {t(`Carrier.options.${c}`)}
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 4: Region */}
              {step === 4 && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => { setIsManualRegion(!isManualRegion); setRegion(''); }}
                      className="text-sm text-gray-500 underline"
                    >
                      {isManualRegion ? t('Region.toggle_select') : t('Region.toggle_manual')}
                    </button>
                  </div>

                  {isManualRegion ? (
                    <input
                      autoFocus
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder={t('Region.placeholder_manual')}
                      className="w-full text-2xl border-b-2 border-gray-200 focus:border-primary py-2 outline-none placeholder:text-gray-300 bg-transparent"
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2">
                      {REGIONS.map((r) => (
                        <button
                          key={r}
                          onClick={() => setRegion(r)}
                          className={`py-3 px-2 text-sm rounded-lg border transition-all
                             ${region === r
                              ? 'border-primary bg-blue-50 text-primary font-bold'
                              : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: Device */}
              {step === 5 && (
                <div className="flex flex-col gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={device}
                    onChange={(e) => setDevice(e.target.value)}
                    placeholder={"iphone17"}
                    className="w-full text-2xl border-b-2 border-gray-200 focus:border-primary py-2 outline-none placeholder:text-gray-300 bg-transparent transition-colors"
                  />
                  <p className="text-sm text-gray-400 mt-2">{t('Device.hint')}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Bottom Button */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 max-w-lg mx-auto right-0">
        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className={`w-full py-4 rounded-xl text-lg font-bold transition-all transform active:scale-[0.98]
            ${isStepValid()
              ? 'bg-primary text-white shadow-lg shadow-blue-500/30'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          {step === 5 ? t('Buttons.submit') : t('Buttons.next')}
        </button>
      </div>
    </div>
  );
}