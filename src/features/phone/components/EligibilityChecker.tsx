'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, X, Search, ChevronRight, RotateCcw, Smartphone, Cpu,
  CreditCard, Calendar, UserCheck, CheckCircle2
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {
  VISA_FULL_LIST,
  getFullVisaResult,
  VISA_CATEGORIES,
  DURATION_OPTIONS,
  DEVICE_OPTIONS
} from '@/features/phone/lib/visa-data';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// --- 애니메이션 변수 ---
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30, // 움직임 거리 축소
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1.0] as const,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 30 : -30,
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1.0] as const,
    },
  }),
};

const SlideView = ({ children, direction }: { children: React.ReactNode, direction: number }) => (
  <motion.div
    custom={direction}
    variants={slideVariants}
    initial="enter"
    animate="center"
    exit="exit"
    className="w-full h-full flex flex-col"
  >
    {children}
  </motion.div>
);

const TapMotion = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <motion.button
    whileTap={{ scale: 0.97 }}
    className={cn("cursor-pointer select-none", className)}
    onClick={onClick}
  >
    {children}
  </motion.button>
);

type Step = 'arc' | 'visa' | 'duration' | 'device' | 'result' | 'fail' | 'phoneSelection';

export default function EligibilityChecker() {
  const t = useTranslations('Checker');
  const locale = useLocale();
  const currentLocale = (['ko', 'en', 'zh', 'ja'].includes(locale) ? locale : 'ko') as 'ko' | 'en' | 'zh' | 'ja';
  const router = useRouter();

  const [step, setStep] = useState<Step>('arc');
  const [direction, setDirection] = useState(1);
  const [mounted, setMounted] = useState(false);

  const [selection, setSelection] = useState({
    hasARC: false,
    visaCode: '',
    duration: '',
    devicePlan: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredVisas = VISA_FULL_LIST.filter((visa) => {
    const visaName = visa.labels[currentLocale] || visa.name;
    const matchesSearch =
      visa.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visaName.includes(searchTerm);
    const matchesCategory = activeCategory === 'all' || visa.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // --- 핸들러 ---
  const handleARC = (hasIt: boolean) => {
    if (!hasIt) {
      setStep('fail');
    } else {
      setDirection(1);
      setStep('visa');
    }
  };

  const handleVisaSelect = (code: string) => {
    setSelection({ ...selection, visaCode: code });
    setDirection(1);
    setStep('duration');
  };

  const handleDuration = (durationValue: string) => {
    setSelection({ ...selection, duration: durationValue });
    setDirection(1);
    setStep('device');
  };

  const handleDevice = (devicePlanValue: string) => {
    const finalSelection = {
      ...selection,
      devicePlan: devicePlanValue
    };
    setSelection(finalSelection);

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('eligibility_data', JSON.stringify(finalSelection));
    }

    setDirection(1);
    setStep('result');
  };

  const reset = () => {
    setDirection(-1);
    setStep('arc');

    setTimeout(() => {
      setSelection({ hasARC: false, visaCode: '', duration: '', devicePlan: '' });
      setSearchTerm('');
      setActiveCategory('all');
      setDirection(1);

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('eligibility_data');
      }
    }, 500);
  };

  const isSimOnly = selection.devicePlan === 'sim_only';

  const result = selection.visaCode
    ? getFullVisaResult(selection.visaCode, currentLocale, isSimOnly)
    : null;

  const stepsInfo = [
    { id: 'arc', label: t('Steps.arc'), icon: UserCheck },
    { id: 'visa', label: t('Steps.visa'), icon: CreditCard },
    { id: 'duration', label: t('Steps.duration'), icon: Calendar },
    { id: 'device', label: t('Steps.device'), icon: Smartphone },
  ];

  const currentStepIndex = stepsInfo.findIndex(s => s.id === step);

  const getDeviceIcon = (key: string) => {
    if (key === 'Opt3') return <Cpu size={20} className="text-primary" />;
    return <Smartphone size={20} className="text-primary" />;
  };

  // 휴대폰 기종 데이터 (5종) - GONGGU_MODELS
  const PHONE_MODELS = [
    {
      id: 'aip17-256',
      name: 'iPhone 17',
      capacity: '256GB',
      image: 'https://d2ilcqjaeymypa.cloudfront.net/phone/aip17/mist_blue/01.png'
    },
    {
      id: 'sm-m366k',
      name: 'Jump4',
      capacity: '128GB',
      image: 'https://d2ilcqjaeymypa.cloudfront.net/phone/sm-m366k/black/01.png'
    },
    {
      id: 'aip16e-128',
      name: 'iPhone 16e',
      capacity: '128GB',
      image: 'https://d2ilcqjaeymypa.cloudfront.net/phone/aip16e/white/01.png'
    },
    {
      id: 'sm-s931nk',
      name: 'Galaxy S25',
      capacity: '256GB',
      image: 'https://d2ilcqjaeymypa.cloudfront.net/phone/sm-s931nk/ice_blue/01.png'
    },
    {
      id: 'aip17p-256',
      name: 'iPhone 17 Pro',
      capacity: '256GB',
      image: 'https://d2ilcqjaeymypa.cloudfront.net/phone/aip17p/silver/01.png'
    }
  ];

  const handlePhoneSelect = (modelId: string) => {
    router.push(`/${locale}/phone?model=${modelId}`);
  };

  return (
    <div className="w-full max-w-[480px] mx-auto font-sans px-4 md:px-0">
      {/* 컨테이너: 높이 축소 (min-h-[460px]), Radius, Shadow 적용 */}
      <div
        className="bg-white rounded-lg shadow-2xl shadow-grey-400/20 border border-grey-200 overflow-hidden relative min-h-[460px] flex flex-col"
      >
        {/* Progress Bar: 높이 및 아이콘 크기 축소 */}
        {step !== 'fail' && step !== 'result' && (
          <div className="px-5 pt-5 pb-10 bg-white z-10">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-grey-200 rounded-full -z-10" />
              <motion.div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-primary rounded-full -z-10 origin-left"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStepIndex / (stepsInfo.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />

              {stepsInfo.map((s, index) => {
                const isCompleted = index < currentStepIndex;
                const isActive = index === currentStepIndex;
                const Icon = s.icon;

                return (
                  <div key={s.id} className="flex flex-col items-center gap-1 relative z-10">
                    <motion.div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center border transition-colors bg-white",
                        isCompleted || isActive ? "border-primary text-primary" : "border-border-strong text-grey-500",
                        isActive && "ring-2 ring-primary/20"
                      )}
                      initial={false}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isCompleted ? 'var(--primary-default)' : '#ffffff',
                        color: isCompleted ? '#ffffff' : (isActive ? 'var(--primary-default)' : 'var(--grey-500)')
                      }}
                    >
                      {isCompleted ? <Check size={12} strokeWidth={3} /> : <Icon size={12} />}
                    </motion.div>
                    <span className={cn(
                      "text-[10px] font-medium transition-colors whitespace-nowrap absolute -bottom-4",
                      isActive ? "text-primary" : "text-grey-500"
                    )}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Content Area: 패딩 축소 (p-5) */}
        <div className="flex-1 flex flex-col p-5 pt-3 relative">
          <AnimatePresence mode='wait' custom={direction}>

            {/* STEP 1: ARC */}
            {step === 'arc' && (
              <SlideView key="arc" direction={direction}>
                <div className="flex flex-col items-center justify-center h-full py-2">
                  <div className="w-14 h-14 bg-bg-input rounded-2xl flex items-center justify-center mb-4 text-primary">
                    <UserCheck size={28} />
                  </div>
                  <h2
                    className="text-xl font-bold text-grey-900 text-center mb-1.5 leading-snug"
                    dangerouslySetInnerHTML={{ __html: t.raw('ARC.title') }}
                  />
                  <p className="text-grey-700 text-xs mb-6 text-center">{t('ARC.desc')}</p>
                  <div className="w-full space-y-2.5 max-w-xs">
                    <TapMotion onClick={() => handleARC(true)} className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary-hover transition-all flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={16} /> {t('ARC.yes')}
                    </TapMotion>
                    <TapMotion onClick={() => handleARC(false)} className="w-full py-3 rounded-xl bg-background-alt text-label-700 font-bold text-sm hover:bg-line-200 transition-all">
                      {t('ARC.no')}
                    </TapMotion>
                  </div>
                </div>
              </SlideView>
            )}

            {/* STEP 2: VISA Selection */}
            {step === 'visa' && (
              <SlideView key="visa" direction={direction}>
                <div className="flex flex-col h-full">
                  <div className="text-center mb-4">
                    <h2 className="text-lg font-bold text-label-900 mb-0.5">{t('Visa.title')}</h2>
                    <p className="text-label-500 text-[11px]">{t('Visa.instruction')}</p>
                  </div>

                  <div className="relative mb-2.5">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-label-500" size={16} />
                    <input
                      type="text"
                      placeholder={t('Visa.placeholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-10 pl-9 bg-background-alt rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 border border-grey-400 focus:border-primary transition-all text-label-900 placeholder:text-label-500"
                    />
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-2 mb-1 scrollbar-hide -mx-2 px-2">
                    {VISA_CATEGORIES.map((cat) => (
                      <TapMotion
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                          "shrink-0 px-3 py-1.5 rounded-md border text-[11px] font-bold transition-all",
                          activeCategory === cat.id
                            ? "bg-primary/70 text-label-100 border-primary shadow-sm"
                            : "bg-background text-label-700 border-grey-200 hover:bg-background-alt"
                        )}
                      >
                        {t(`Visa.Categories.${cat.labelKey}`)}
                      </TapMotion>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto pr-1 flex-1 content-start -mx-1 px-1 py-1">
                    {filteredVisas.length > 0 ? (
                      filteredVisas.map((visa) => (
                        <TapMotion
                          key={visa.code}
                          onClick={() => handleVisaSelect(visa.code)}
                          className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-grey-200 hover:border-primary/50 hover:bg-tertiary/20 transition-all bg-background shadow-sm relative group"
                        >
                          <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-base font-black text-primary mb-0.5">{visa.code}</span>
                          <span className="text-[11px] text-label-700 font-medium text-center truncate w-full px-1">
                            {visa.labels[currentLocale] || visa.name}
                          </span>
                        </TapMotion>
                      ))
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center text-label-500 py-8">
                        <Search size={32} className="mb-2 opacity-50" />
                        <span className="text-xs font-medium">{t('Visa.no_result')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </SlideView>
            )}

            {/* STEP 3: DURATION */}
            {step === 'duration' && (
              <SlideView key="duration" direction={direction}>
                <div className="pt-4 text-center flex flex-col h-full">
                  <div className="w-14 h-14 bg-background-alt rounded-2xl flex items-center justify-center mb-4 mx-auto text-primary">
                    <Calendar size={28} />
                  </div>
                  <h2 className="text-xl font-bold mb-1.5 text-label-900">{t('Duration.title')}</h2>
                  <div className="grid gap-2.5 max-w-xs mx-auto w-full flex-1 content-center">
                    {DURATION_OPTIONS.map((opt) => (
                      <TapMotion
                        key={opt.key}
                        onClick={() => handleDuration(opt.value)}
                        className="w-full p-3.5 bg-background border border-grey-400 rounded-lg flex items-center justify-between hover:border-primary hover:bg-tertiary/20 hover:shadow-sm transition-all group"
                      >
                        <span className="font-bold text-sm text-label-800 group-hover:text-primary transition-colors">
                          {t(`Duration.options.${opt.key}`)}
                        </span>
                        <CheckCircle2 size={18} className="text-line-400 group-hover:text-primary transition-colors" />
                      </TapMotion>
                    ))}
                  </div>
                </div>
              </SlideView>
            )}

            {/* STEP 4: DEVICE */}
            {step === 'device' && (
              <SlideView key="device" direction={direction}>
                <div className="pt-2 text-center h-full flex flex-col">
                  <h2 className="text-xl font-bold mb-1.5 text-label-900">{t('Device.title')}</h2>
                  <p className="text-label-500 mb-5 text-xs">{t('Device.desc')}</p>

                  <div className="grid gap-2.5 flex-1 content-start">
                    {DEVICE_OPTIONS.map((opt) => {
                      const isSelected = selection.devicePlan === opt.value;
                      return (
                        <TapMotion
                          key={opt.key}
                          onClick={() => handleDevice(opt.value)}
                          className={cn(
                            "w-full p-3.5 rounded-lg border transition-all flex items-center gap-3 text-left relative overflow-hidden group bg-background",
                            isSelected
                              ? "border-primary bg-tertiary/30 shadow-sm"
                              : "border-grey-400 hover:border-primary/50 hover:bg-tertiary/10 hover:shadow-sm"
                          )}
                        >
                          {isSelected && (
                            <motion.div
                              layoutId="device-check"
                              className="absolute top-2.5 right-2.5 text-primary"
                            >
                              <CheckCircle2 size={18} fill="currentColor" className="text-label-100" />
                            </motion.div>
                          )}
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors shrink-0",
                            isSelected ? "bg-primary/10 text-primary" : "bg-background-alt text-label-500 group-hover:bg-primary/10 group-hover:text-primary"
                          )}>
                            {getDeviceIcon(opt.key)}
                          </div>
                          <div className="flex-1 pr-6">
                            <div className={cn("font-bold text-sm mb-0.5 transition-colors", isSelected ? "text-primary" : "text-label-900")}>
                              {t(`Device.${opt.key}.title`)}
                            </div>
                            <div className="text-[11px] text-label-500 leading-tight">
                              {t(`Device.${opt.key}.desc`)}
                            </div>
                          </div>
                        </TapMotion>
                      );
                    })}
                  </div>
                </div>
              </SlideView>
            )}

            {/* FAIL */}
            {step === 'fail' && (
              <SlideView key="fail" direction={direction}>
                <div className="flex flex-col items-center justify-center h-full py-4 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-status-error/10 text-status-error rounded-full flex items-center justify-center mb-4 shadow-sm"
                  >
                    <X size={32} strokeWidth={3} />
                  </motion.div>
                  <h3 className="text-lg font-bold mb-2 text-label-900">{t('Fail.title')}</h3>
                  <p
                    className="text-label-500 mb-8 text-xs leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: t.raw('Fail.desc') }}
                  />
                  <TapMotion onClick={reset} className="px-6 py-3 bg-label-900 text-label-100 rounded-xl hover:bg-black transition-all shadow-md font-bold text-sm flex items-center gap-1.5">
                    <RotateCcw size={16} /> {t('Fail.retry')}
                  </TapMotion>
                </div>
              </SlideView>
            )}

            {/* STEP 6: RESULT */}
            {step === 'result' && result && (
              <SlideView key="result" direction={direction}>
                <div className="text-center pt-3 flex flex-col h-full">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 mx-auto shadow-sm",
                      result.possible
                        ? "bg-status-correct/10 text-status-correct"
                        : "bg-status-error/10 text-status-error"
                    )}
                  >
                    {result.possible ? <CheckCircle2 size={14} /> : <X size={14} />}
                    {result.possible ? t('Result.possible') : t('Result.impossible')}
                  </motion.div>

                  <h2 className="text-xl font-extrabold mb-1 text-label-900">
                    <span className="text-primary">[{selection.visaCode}]</span> {t('Result.title_suffix')}
                  </h2>
                  <p className="text-xs text-label-500 mb-5">
                    {t('Result.plan_label')}: <span className="font-bold text-label-900 ml-1">{isSimOnly ? t('Result.plan_sim') : t('Result.plan_device')}</span>
                  </p>

                  <div className="bg-background-alt p-4 rounded-xl text-left mb-5 space-y-3 border border-grey-400 shadow-inner flex-1 overflow-y-auto">
                    <div className="flex justify-between items-center pb-2.5 border-b border-grey-400/30">
                      <span className="text-label-700 font-medium text-sm">{t('Result.installment_label')}</span>
                      <div className={cn("flex items-center gap-1.5 font-bold text-base", result.installment ? "text-primary" : "text-status-error")}>
                        {result.installment ? <CheckCircle2 size={18} /> : <X size={18} />}
                        {result.installment ? t('Result.installment_ok') : t('Result.installment_no')}
                      </div>
                    </div>

                    <p className="text-xs text-label-800 leading-relaxed whitespace-pre-wrap pt-0.5">
                      {result.message}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <TapMotion
                      onClick={() => {
                        setDirection(1);
                        setStep('phoneSelection');
                      }}
                      className="w-full py-3.5 bg-primary text-label-100 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-secondary transition-all shadow-md hover:shadow-lg"
                    >
                      <Smartphone size={18} /> {t('ChatBot.select_phone')} <ChevronRight size={16} />
                    </TapMotion>
                    <TapMotion
                      onClick={() => router.push('/inquiry')}
                      className="w-full py-3 bg-[#FEE500] text-[#191919] rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#FDD835] transition-all"
                    >
                      <span className="text-lg">📝</span> {t('Result.cta_kakao')}
                    </TapMotion>
                    <button
                      type="button"
                      onClick={reset}
                      className="text-[11px] text-label-500 flex items-center justify-center gap-1 mx-auto hover:text-label-700 transition-colors py-1.5 cursor-pointer"
                    >
                      <RotateCcw size={10} /> {t('Result.reset')}
                    </button>
                  </div>
                </div>
              </SlideView>
            )}

            {/* STEP 7: PHONE SELECTION */}
            {step === 'phoneSelection' && (
              <SlideView key="phoneSelection" direction={direction}>
                <div className="flex flex-col h-full">
                  <div className="text-center mb-5">
                    <h2 className="text-xl font-bold text-label-900 mb-1.5">{t('PhoneList.title')}</h2>
                    <p className="text-label-500 text-xs">{t('PhoneList.desc')}</p>
                  </div>

                  <div className="grid gap-3 flex-1 content-start overflow-y-auto pr-1 -mx-1 px-1">
                    {PHONE_MODELS.map((phone) => (
                      <TapMotion
                        key={phone.id}
                        onClick={() => handlePhoneSelect(phone.id)}
                        className="w-full p-4 rounded-lg border border-grey-200 hover:border-primary hover:bg-tertiary/20 transition-all bg-background shadow-sm flex items-center gap-4 group"
                      >
                        <div className="w-20 h-20 rounded-lg bg-background-alt flex items-center justify-center overflow-hidden shrink-0 group-hover:bg-primary/5 transition-colors relative">
                          <Image
                            src={phone.image}
                            alt={phone.name}
                            fill
                            className="object-contain"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-bold text-base text-label-900 mb-1 group-hover:text-primary transition-colors">
                            {phone.name}
                          </div>
                          <div className="text-xs text-label-500">
                            {phone.capacity}
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-label-400 group-hover:text-primary transition-colors" />
                      </TapMotion>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDirection(-1);
                      setStep('result');
                    }}
                    className="text-xs text-label-500 flex items-center justify-center gap-1 mx-auto hover:text-label-700 transition-colors py-3 cursor-pointer mt-4"
                  >
                    <ChevronRight size={12} className="rotate-180" /> 이전으로
                  </button>
                </div>
              </SlideView>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}