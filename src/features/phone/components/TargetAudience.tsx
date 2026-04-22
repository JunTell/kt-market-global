'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

export default function TargetAudience() {
  const t = useTranslations('Target');
  const checks = ['check1', 'check2', 'check3', 'check4'];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const
      }
    },
  };

  return (
    <section className="overflow-hidden bg-[#111827] px-5 py-14 text-grey-100 md:px-12 md:py-20">
      <div className="w-full max-w-layout-max mx-auto">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#93c5fd]">
          {t('eyebrow')}
        </p>
        <motion.h2
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-3 text-xl font-bold leading-tight md:mb-4 md:text-3xl"
        >
          {t.raw('title')}
        </motion.h2>
        <p className="mb-8 max-w-2xl text-sm leading-6 text-white/70 md:mb-10 md:text-base">
          {t('lead')}
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10 mx-auto"
        >
          {checks.map((key) => (
            <motion.div
              key={key}
              variants={itemVariants}
              whileTap={{ scale: 0.97 }}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.08)] px-4 py-4 md:gap-4 md:px-5"
            >
              <CheckCircle2 className="text-secondary shrink-0" size={18} />
              <span className="text-sm md:text-base font-medium leading-snug">{t(key)}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="bg-[#747474] rounded-xl px-4 md:px-6 py-3 md:py-4 text-center shadow-lg shadow-[#747474]/30 mx-auto"
        >
          <p className="text-sm md:text-base font-bold leading-relaxed">
            {t('footer')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
