import { useTranslations } from "next-intl"

export default function CompanyPage() {
    const t = useTranslations('Company')

    return (
        <div className="min-h-screen w-full bg-[#f7f9fc] pb-20">
            <div
                className="relative overflow-hidden px-5 py-16 text-white md:px-12 md:py-20"
                style={{ background: 'linear-gradient(90deg, #111C2E 0%, #0A2850 100%)' }}
            >
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                        pointerEvents: 'none'
                    }}
                />
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: 'radial-gradient(ellipse at top center, rgba(0, 85, 212, 0.2) 0%, transparent 50%)',
                        pointerEvents: 'none'
                    }}
                />

                <div className="relative mx-auto max-w-layout-max text-center">
                    <h1 className="mb-4 text-3xl font-bold md:text-5xl">{t('title')}</h1>
                    <p className="mx-auto max-w-2xl text-sm leading-7 text-white/75 md:text-lg">
                        {t('description')}
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-layout-max px-5 py-14 md:px-12 md:py-20">

                {/* Introduction */}
                <section className="mb-12 rounded-[32px] border border-grey-200 bg-white p-6 shadow-card md:p-8">
                    <p className="text-body1 mb-6 leading-8 text-gray-800 md:text-lg">
                        {t('intro_1')}
                    </p>
                    <p className="text-body1 mb-6 leading-8 text-gray-800 md:text-lg">
                        {t('intro_2')}
                    </p>
                    <p className="text-body1 leading-8 text-gray-800 md:text-lg">
                        {t('intro_3')}
                    </p>
                </section>

                {/* Core Values */}
                <section className="mb-12 rounded-[32px] border border-grey-200 bg-white p-6 shadow-card md:p-8">
                    <h2 className="mb-6 text-h2 text-[#1d1d1f]">{t('values_title')}</h2>
                    <p className="text-body1 mb-4 leading-7 text-gray-700">
                        {t('value_1')}
                    </p>
                    <p className="text-body1 text-gray-700 leading-7">
                        {t('value_2')}
                    </p>
                    <p className="text-body1 mt-6 font-semibold text-[#0071e3]">
                        {t('value_3')}
                    </p>
                </section>

                {/* Company Details */}
                <section className="mb-12 rounded-[32px] border border-grey-200 bg-white p-6 shadow-card md:p-8">
                    <h2 className="mb-6 text-h2 text-[#1d1d1f]">{t('info_title')}</h2>
                    <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                        <div>
                            <span className="block text-gray-500 mb-1">{t('label_company')}</span>
                            <span className="font-semibold text-gray-900">{t('value_company')}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 mb-1">{t('label_established')}</span>
                            <span className="font-semibold text-gray-900">{t('value_established')}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 mb-1">{t('label_ceo')}</span>
                            <span className="font-semibold text-gray-900">{t('value_ceo')}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 mb-1">{t('label_subscribers')}</span>
                            <span className="font-semibold text-gray-900">{t('value_subscribers')}</span>
                        </div>
                        <div className="md:col-span-2">
                            <span className="block text-gray-500 mb-1">{t('label_address')}</span>
                            <span className="font-semibold text-gray-900">{t('value_address')}</span>
                        </div>
                        <div className="md:col-span-2">
                            <span className="block text-gray-500 mb-1">{t('label_business')}</span>
                            <span className="font-semibold text-gray-900">{t('value_business')}</span>
                        </div>
                    </div>
                </section>

                {/* Business Areas */}
                <section className="mb-12">
                    <h2 className="mb-6 text-h2 text-[#1d1d1f]">{t('area_title')}</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="rounded-[24px] border border-grey-200 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(17,28,46,0.12)]">
                            <h3 className="text-lg font-bold mb-3 text-[#1d1d1f]">{t('area_offline_title')}</h3>
                            <p className="text-body2 text-gray-600 leading-6 whitespace-pre-line">
                                {t('area_offline_desc')}
                            </p>
                        </div>
                        <div className="rounded-[24px] border border-grey-200 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(17,28,46,0.12)]">
                            <h3 className="text-lg font-bold mb-3 text-[#1d1d1f]">{t('area_online_title')}</h3>
                            <div className="text-body2 text-gray-600 leading-6">
                                <p className="mb-1">{t('area_online_desc')}</p>
                                <div className="flex gap-2 text-blue-600">
                                    <a href="https://global.ktmarket.co.kr" target="_blank" className="hover:underline">global.ktmarket.co.kr</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="text-center text-xs text-gray-400 mt-20">
                    <p>{t('dates_text')}</p>
                </div>

            </div>
        </div>
    )
}
