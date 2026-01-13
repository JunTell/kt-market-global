'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { motion, Variants } from 'framer-motion';

export default function ProcessGuide() {
  const t = useTranslations('Process');

  const steps = [
    { id: 1, title: t('step1_title'), desc: t('step1_desc') },
    { id: 2, title: t('step2_title'), desc: t('step2_desc') },
    { id: 3, title: t('step3_title'), desc: t('step3_desc') },
  ];

  const badges = ['badge1', 'badge2', 'badge3'];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // 자식 요소 간 0.15초 간격
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  const badgeContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const badgeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "backOut" as const, // 뱃지는 살짝 튕기는 느낌으로 등장
      },
    },
  };

  return (
    <section className="py-10 px-5 bg-bg-grouped overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xl font-bold text-label-900 mb-8 leading-tight text-center"
        dangerouslySetInnerHTML={{ __html: t.raw('title') }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="space-y-3 mb-12"
      >
        {steps.map((step) => (
          <motion.div
            key={step.id}
            variants={itemVariants}
            className="bg-base rounded-[32px] py-2 px-3 flex items-center gap-4 shadow-sm border border-border-default"
          >
            <div className="shrink-0 w-[60px] h-[60px] rounded-full bg-primary text-white flex flex-col items-center justify-center shadow-sm leading-none">
              <span className="text-[11px] font-medium opacity-90 mb-0.5">STEP</span>
              <span className="text-xl font-bold">{step.id}</span>
            </div>

            <div className="flex-1 py-1">
              <h3 className="font-bold text-sm text-label-900 mb-1 leading-none">
                {step.title}
              </h3>
              <p className="text-[11px] text-label-500 whitespace-pre-line leading-tight">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={badgeContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex justify-center gap-3"
      >
        {badges.map((badge, idx) => {
          let badgeStyle = "";
          if (idx === 0) badgeStyle = "bg-base border-[2.5px] border-primary text-grey-900";
          else if (idx === 1) badgeStyle = "bg-grey-400 text-white border-none";
          else if (idx === 2) badgeStyle = "bg-primary text-white border-none";

          return (
            <motion.div
              key={badge}
              variants={badgeVariants}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex flex-col items-center justify-center rounded-full shadow-md text-center p-2 shrink-0 cursor-pointer",
                badgeStyle
              )}
              style={{ width: '100px', height: '100px' }}
            >
              <span className={cn(
                "text-[13px] font-bold leading-snug break-keep whitespace-pre-line",
                idx === 0 ? "text-label-900" : "text-white"
              )}>
                {t(`${badge}`)}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}