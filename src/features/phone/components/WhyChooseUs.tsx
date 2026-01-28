'use client';

import { useTranslations } from 'next-intl';
import { Store, Eye, Ban, CreditCard, MapPin, HelpCircle, FileQuestion, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhyChooseUs() {
  const t = useTranslations('WhyUs');

  const cards = [
    {
      key: 'card1',
      Icon: Store,
      color: 'text-[#0055D4]', // KT Blue
      bgColor: 'bg-[#F2F7FF]'
    },
    {
      key: 'card2',
      Icon: Eye,
      color: 'text-[#191F28]', // Dark Navy
      bgColor: 'bg-[#F4F6FA]'
    },
    {
      key: 'card3',
      Icon: Ban,
      color: 'text-[#FF3B30]', // Red
      bgColor: 'bg-[#FFF5F5]'
    },
    {
      key: 'card4',
      Icon: CreditCard,
      color: 'text-[#0055D4]',
      bgColor: 'bg-[#F2F7FF]'
    }
  ];

  return (
    <section className="py-12 md:py-20 px-5 md:px-12 bg-[#F9FAFB] overflow-hidden">
      <div className="w-full max-w-layout-max mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#191F28] mb-10 md:mb-14">
          {t('title')}
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12"
        >
          {cards.map(({ key, Icon, color, bgColor }) => (
            <div
              key={key}
              className="bg-white rounded-2xl p-5 md:p-8 shadow-sm flex flex-col items-center text-center border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${bgColor} flex items-center justify-center mb-4 md:mb-6`}>
                <Icon className={`w-6 h-6 md:w-8 md:h-8 ${color}`} strokeWidth={2.5} />
              </div>

              <h3 className="text-sm md:text-lg font-bold text-[#191F28] mb-1.5 md:mb-2 whitespace-pre-wrap">
                {t(`Cards.${key}_title`)}
              </h3>

              <p className="text-[10px] md:text-sm font-medium text-gray-500">
                {t(`Cards.${key}_desc`)}
              </p>
            </div>
          ))}
        </motion.div>

        <p className="text-center text-[11px] md:text-sm text-gray-400 font-medium px-4 break-keep mb-20 md:mb-32">
          {t('subtitle')}
        </p>

        {/* Part B: Comparison Section */}
        <div className="relative">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#191F28] mb-10 md:mb-14"
            dangerouslySetInnerHTML={{ __html: t.raw('Comparison.title') }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-stretch max-w-4xl mx-auto mb-12">
            {/* Before Board */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100 relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50" />
                <h3 className="text-xl font-bold text-gray-400 mb-6 text-center">{t('Comparison.Before.title')}</h3>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: MapPin, text: 'item1' },
                    { icon: CreditCard, text: 'item2' },
                    { icon: HelpCircle, text: 'item3' },
                    { icon: FileQuestion, text: 'item4' }
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-2 aspect-[4/3]">
                      <item.icon className="w-6 h-6 text-gray-400" />
                      <span className="text-xs md:text-sm font-medium text-gray-500 break-keep">{t(`Comparison.Before.${item.text}`)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow for Desktop (Absolute positioned if needed, or handled by grid gap) */}
              <div className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 items-center justify-center text-red-500">
                <ArrowRight className="w-6 h-6" strokeWidth={3} />
              </div>
            </motion.div>

            {/* After Board */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#F2F7FF] rounded-3xl p-6 md:p-8 border border-blue-100 relative shadow-lg ring-1 ring-blue-500/10"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300" />
              <h3
                className="text-xl font-bold text-[#191F28] mb-6 text-center"
                dangerouslySetInnerHTML={{ __html: t.raw('Comparison.After.title') }}
              />

              <div className="space-y-4">
                {[
                  { title: 'item1_title', desc: 'item1_desc' },
                  { title: 'item2_title', desc: 'item2_desc' },
                  { title: 'item3_title', desc: 'item3_desc' }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#191F28] text-sm md:text-base">{t(`Comparison.After.${item.title}`)}</h4>
                      <p className="text-xs text-blue-500 font-medium">{t(`Comparison.After.${item.desc}`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <p className="text-center text-xs md:text-sm text-gray-500 font-medium italic">
            {t('Comparison.quote')}
          </p>
        </div>
      </div>
    </section>
  );
}