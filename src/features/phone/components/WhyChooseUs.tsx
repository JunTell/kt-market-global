'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

export default function WhyChooseUs() {
  const t = useTranslations('WhyUs');
  const checks = ['check1', 'check2', 'check3', 'check4', 'check5'];

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
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="py-10 px-5 bg-bg-grouped overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xl font-bold text-grey-900 mb-6 whitespace-pre-line leading-tight text-center"
      >
        {t.raw('title')}
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="space-y-2.5 mb-8"
      >
        {checks.map((key) => (
          <motion.div
            key={key}
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 bg-base p-3.5 rounded-xl shadow-sm border border-grey-200 cursor-pointer"
          >
            <div className="relative shrink-0 flex items-center justify-center">
              <CheckCircle2
                className="text-grey-100 absolute"
                size={16}
                fill="currentColor"
              />
              <CheckCircle2 className="text-primary relative z-10" size={20} />
            </div>
            <span className="text-sm font-medium text-grey-800">{t(key)}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5, ease: "backOut" }}
        className="bg-grey-700/50 rounded-xl p-4 text-center text-grey-100 shadow-md"
      >
        <p className="text-sm font-bold whitespace-pre-line leading-relaxed">
          {t('footer')}
        </p>
      </motion.div>
    </section>
  );
}