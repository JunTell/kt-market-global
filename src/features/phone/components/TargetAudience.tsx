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
    <section className="py-10 px-5 bg-[#1F1F1F] text-grey-100 overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, x: -15 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="text-xl font-bold mb-6 leading-tight"
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
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 bg-white/10 px-3.5 py-3 rounded-xl border border-white/5 cursor-pointer"
          >
            <CheckCircle2 className="text-secondary shrink-0" size={18} />
            <span className="text-sm font-medium leading-snug">{t(key)}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="bg-[#747474] rounded-xl px-4 py-3 text-center shadow-lg shadow-[#747474]/30"
      >
        <p className="text-sm font-bold leading-relaxed">
          {t('footer')}
        </p>
      </motion.div>
    </section>
  );
}