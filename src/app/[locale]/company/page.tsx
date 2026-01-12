import { useTranslations } from "next-intl"

export default function CompanyPage() {
    const t = useTranslations('Company')

    return (
        <div className="w-full bg-white min-h-screen pb-20">
            {/* Header Section */}
            <div className="bg-[#1d1d1f] text-white py-20 px-5 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h1>
                <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    {t('description')}
                </p>
            </div>

            <div className="max-w-[800px] mx-auto px-6 py-12">

                {/* Introduction */}
                <section className="mb-12">
                    <p className="text-lg text-gray-800 leading-8 mb-6">
                        {t('intro_1')}
                    </p>
                    <p className="text-lg text-gray-800 leading-8 mb-6">
                        {t('intro_2')}
                    </p>
                    <p className="text-lg text-gray-800 leading-8 mb-6">
                        {t('intro_3')}
                    </p>
                </section>

                <hr className="border-gray-100 my-10" />

                {/* Core Values */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6">{t('values_title')}</h2>
                    <p className="text-gray-700 leading-7 mb-4">
                        {t('value_1')}
                    </p>
                    <p className="text-gray-700 leading-7">
                        {t('value_2')}
                    </p>
                    <p className="mt-6 font-semibold text-[#0071e3]">
                        {t('value_3')}
                    </p>
                </section>

                <hr className="border-gray-100 my-10" />

                {/* Company Details */}
                <section className="bg-gray-50 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6">{t('info_title')}</h2>
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

                <hr className="border-gray-100 my-10" />

                {/* Business Areas */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6">{t('area_title')}</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                            <h3 className="text-lg font-bold mb-3 text-[#1d1d1f]">{t('area_offline_title')}</h3>
                            <p className="text-gray-600 text-sm leading-6 whitespace-pre-line">
                                {t('area_offline_desc')}
                            </p>
                        </div>
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                            <h3 className="text-lg font-bold mb-3 text-[#1d1d1f]">{t('area_online_title')}</h3>
                            <div className="text-gray-600 text-sm leading-6">
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
