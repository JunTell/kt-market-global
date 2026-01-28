'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

export default function ProcessFlow() {
  const t = useTranslations('ProcessFlow');

  const steps = [
    { id: 1, title: t('step1_title'), desc: t('step1_desc'), icon: '/images/process1.svg' },
    { id: 2, title: t('step2_title'), desc: t('step2_desc'), icon: '/images/process2.svg' },
    { id: 3, title: t('step3_title'), desc: t('step3_desc'), icon: '/images/process3.svg' },
    { id: 4, title: t('step4_title'), desc: t('step4_desc'), icon: '/images/process4.svg' },
    { id: 5, title: t('step5_title'), desc: t('step5_desc'), icon: '/images/process5.svg' },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-12 md:py-20 px-5 md:px-0 bg-white">
      <div className="w-full max-w-[940px] mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <h2
            className="text-2xl md:text-[32px] font-bold text-[#1d1d1f] leading-tight"
            dangerouslySetInnerHTML={{ __html: t.raw('title') }}
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col gap-3 md:gap-4 max-w-[600px] mx-auto"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={itemVariants}
              className="flex items-center bg-gray-50 rounded-2xl p-4 md:p-6 gap-4 md:gap-6"
            >
              {/* Number Badge */}
              <div className="shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#1d1d1f] font-bold text-sm md:text-base shadow-sm">
                {step.id}
              </div>

              {/* Icon */}
              <div className="shrink-0 relative w-10 h-10 md:w-12 md:h-12">
                <Image
                  src={step.icon}
                  alt={step.title}
                  fill
                  loading="lazy"
                  className="object-contain"
                />
              </div>

              {/* Text Content */}
              <div className="flex-1 text-left">
                <h3 className="text-base md:text-lg font-bold text-[#1d1d1f] mb-1">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 whitespace-pre-line leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Arrow (except last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block text-gray-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L12 20M12 20L18 14M12 20L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
