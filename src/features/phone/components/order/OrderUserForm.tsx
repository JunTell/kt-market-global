"use client"

import React, { useState, useCallback } from "react"
import Script from "next/script"
import { Input } from "@/shared/components/ui/Input"
import { Button } from "@/shared/components/ui/Button"
import { useTranslations } from "next-intl"
import OrderProductSummary from "@/features/phone/components/order/OrderProductSummary"

interface FormData {
    userName: string
    userPhone: string
    foreignerId: string
    zipCode: string
    address: string
    detailAddress: string
    country: string
    planName?: string
}

interface OrderUserFormProps {
    imageUrl: string
    title: string
    spec: string
    price: string
    userName: string
    userPhone: string
    foreignerId: string
    zipCode: string
    address: string
    detailAddress: string
    country: string
    planName: string
    planData: string
    planPrice: string
    joinType: string
    contract: string
    discountType: string
    onConfirm?: (data: FormData) => void
    isReadOnly?: boolean
}

const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "")
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
}

const formatForeignerId = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "").slice(0, 13)
    if (numbers.length <= 6) return numbers
    return `${numbers.slice(0, 6)}-${numbers.slice(6)}`
}

export default function OrderUserForm(props: OrderUserFormProps) {
    const t = useTranslations("Phone.OrderForm")
    const [isLoading, setIsLoading] = useState(false)
    const [showTerms, setShowTerms] = useState(false)
    const [agreement, setAgreement] = useState(true)
    const [isTermExpanded, setIsTermExpanded] = useState(false)
    const [showOptional, setShowOptional] = useState(false)

    const [formData, setFormData] = useState<FormData>({
        userName: props.userName || "",
        userPhone: formatPhoneNumber(props.userPhone || ""),
        foreignerId: formatForeignerId(props.foreignerId || ""),
        zipCode: props.zipCode || "",
        address: props.address || "",
        detailAddress: props.detailAddress || "",
        country: props.country || "Republic of Korea",
    })

    const [touched, setTouched] = useState({
        userName: false,
        userPhone: false,
    })

    // Only name + phone are required
    const isPhoneValid = formData.userPhone.replace(/-/g, "").length >= 10
    const isNameValid = formData.userName.trim().length > 0
    const isFormComplete = isNameValid && isPhoneValid

    const handleChange = (field: keyof FormData, value: string) => {
        if (field === "userPhone") {
            setFormData(prev => ({ ...prev, [field]: formatPhoneNumber(value) }))
            return
        }
        if (field === "foreignerId") {
            setFormData(prev => ({ ...prev, [field]: formatForeignerId(value) }))
            return
        }
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleBlur = (field: "userName" | "userPhone") => {
        setTouched(prev => ({ ...prev, [field]: true }))
    }

    const handleApplyClick = useCallback(() => {
        setTouched({ userName: true, userPhone: true })
        if (!isFormComplete) return
        setShowTerms(true)
    }, [isFormComplete])

    const handleFinalConfirm = async () => {
        if (isLoading) return
        if (!agreement) {
            alert(t("terms_alert"))
            return
        }
        setIsLoading(true)
        try {
            if (props.onConfirm) {
                await props.onConfirm({ ...formData, planName: props.planName })
            }
        } catch (e) {
            console.error(e)
            setIsLoading(false)
        }
    }

    const handleOpenPostcode = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof window !== "undefined" && (window as any).daum && (window as any).daum.Postcode) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            new (window as any).daum.Postcode({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                oncomplete: (data: any) => {
                    const fullAddress = data.addressEnglish || data.address
                    setFormData(prev => ({
                        ...prev,
                        zipCode: data.zonecode,
                        address: fullAddress,
                    }))
                }
            }).open()
        } else {
            alert(t("postcode_loading_alert"))
        }
    }

    if (props.isReadOnly) {
        return <ReadOnlyView {...props} formData={formData} t={t} />
    }

    return (
        <div className="w-full flex flex-col bg-white pb-32">
            <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="lazyOnload" />

            <div className="mx-5 mt-1 rounded-[28px] border border-[#e7edf5] bg-[#fbfcfe] p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0055d4]">
                            {t("summary_eyebrow")}
                        </p>
                        <p className="mt-1 text-[15px] font-bold text-grey-900">{t("summary_title")}</p>
                    </div>
                    <div className="rounded-full bg-[#eef5ff] px-3 py-1 text-[12px] font-semibold text-[#0055d4]">
                        {t("summary_status")}
                    </div>
                </div>
                <OrderProductSummary
                    image={props.imageUrl}
                    title={props.title}
                    spec={props.spec}
                    price={props.price}
                />
                <div className="mt-4 grid grid-cols-3 gap-2">
                    <SummaryBadge title={t("summary_badge1_title")} value={props.joinType} />
                    <SummaryBadge title={t("summary_badge2_title")} value={props.planName} />
                    <SummaryBadge title={t("summary_badge3_title")} value={props.planPrice} />
                </div>
            </div>

            <div className="mx-5 mt-4 rounded-[24px] bg-[#f6f9fc] px-4 py-4">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[18px] shadow-sm">
                        ✓
                    </div>
                    <div>
                        <div className="text-[14px] font-bold text-grey-900">{t("reassurance_title")}</div>
                        <div className="mt-1 text-[13px] leading-[1.55] text-grey-600">
                            {t("reassurance_desc")}
                        </div>
                    </div>
                </div>
            </div>

            {/* Required Section */}
            <div className="px-5 mt-7">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-[16px] font-bold text-grey-900">{t("contact_info_title")}</span>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[11px] font-bold rounded-full">{t("required_badge")}</span>
                </div>

                <div className="flex flex-col gap-4">
                    <Input
                        label={t("name_label")}
                        value={formData.userName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("userName", e.target.value)}
                        onBlur={() => handleBlur("userName")}
                        placeholder={t("name_placeholder")}
                        error={touched.userName && !isNameValid}
                        helperText={touched.userName && !isNameValid ? t("name_error") : undefined}
                    />

                    <Input
                        label={t("phone_label")}
                        value={formData.userPhone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("userPhone", e.target.value)}
                        onBlur={() => handleBlur("userPhone")}
                        placeholder={t("phone_placeholder")}
                        maxLength={13}
                        inputMode="numeric"
                        error={touched.userPhone && !isPhoneValid}
                        helperText={touched.userPhone && !isPhoneValid ? t("phone_error") : undefined}
                    />
                </div>
            </div>

            {/* Divider */}
            <div className="mx-5 my-6 h-px bg-[#f0f0f0]" />

            {/* Optional Section Toggle */}
            <div className="px-5">
                <button
                    type="button"
                    className="w-full flex items-center justify-between py-1"
                    onClick={() => setShowOptional(v => !v)}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-[16px] font-bold text-grey-900">{t("optional_info_title")}</span>
                        <span className="px-2 py-0.5 bg-grey-100 text-grey-500 text-[11px] font-bold rounded-full">{t("optional_badge")}</span>
                    </div>
                    <div className={`transition-transform duration-200 ${showOptional ? "rotate-180" : ""}`}>
                        <ChevronDown />
                    </div>
                </button>

                {!showOptional && (
                    <p className="text-[13px] text-grey-500 mt-1.5">
                        {t("optional_info_desc")}
                    </p>
                )}

                {showOptional && (
                    <div className="mt-4 flex flex-col gap-4 animate-fadeIn">
                        <Input
                            label={`${t("foreigner_id_label")} ${t("optional_suffix")}`}
                            value={formData.foreignerId}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("foreignerId", e.target.value)}
                            placeholder={t("foreigner_id_placeholder")}
                            maxLength={14}
                            inputMode="numeric"
                            helperText={t("foreigner_id_hint")}
                        />

                        <div className="flex flex-col gap-2">
                            <label className="text-body2 font-bold text-grey-800">
                                {t("address_label")} <span className="text-grey-400 font-normal text-[13px]">{t("optional_suffix")}</span>
                            </label>
                            <div className="flex gap-2 items-stretch">
                                <Input
                                    value={formData.zipCode}
                                    placeholder={t("zipcode_placeholder")}
                                    readOnly
                                    className="flex-1 min-w-0"
                                />
                                <Button
                                    onClick={handleOpenPostcode}
                                    className="h-12 px-4 bg-grey-900 text-white hover:bg-grey-800 border-none rounded-lg shrink-0 text-[14px]"
                                >
                                    {t("find_zipcode_btn")}
                                </Button>
                            </div>
                            <div className="text-[12px] text-primary/80 bg-primary/5 px-3 py-2 rounded-lg flex items-start gap-1">
                                <span className="font-bold shrink-0">Tip:</span>
                                <span>You can search in English (e.g. &quot;Itaewon-ro&quot;)</span>
                            </div>
                            {formData.zipCode && (
                                <>
                                    <Input value={formData.address} readOnly className="bg-bg-grouped" />
                                    <Input
                                        value={formData.detailAddress}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("detailAddress", e.target.value)}
                                        placeholder={t("detail_address_placeholder")}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Reassurance Banner */}
            <div className="mx-5 mt-6 bg-[#f0f7ff] rounded-2xl px-4 py-4 flex gap-3 items-start">
                <span className="text-[20px] shrink-0">📞</span>
                <div>
                    <div className="text-[14px] font-bold text-[#1a56d6] mb-0.5">{t("agent_contact_title")}</div>
                    <div className="text-[13px] text-[#4a6fa5] leading-[1.5]">
                        {t("agent_contact_desc")}
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="mx-5 my-6 h-px bg-[#f0f0f0]" />

            {/* Activation Info */}
            <div className="px-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-full bg-[#8B5CF6] flex items-center justify-center shrink-0">
                        <PhoneIcon />
                    </div>
                    <span className="text-[15px] font-bold text-grey-900">{t("activation_info_title")}</span>
                </div>
                <div className="bg-[#f7f8fa] rounded-xl px-4 py-3 flex flex-col gap-3">
                    <InfoRow label={t("join_type")} value={props.joinType} />
                    <InfoRow label={t("discount_type")} value={props.discountType === "plan" ? t("discount_type_plan") : t("discount_type_device")} />
                    <InfoRow label={t("contract")} value={props.contract} />
                </div>
            </div>

            <div className="mx-5 my-6 h-px bg-[#f0f0f0]" />

            {/* Plan Info */}
            <div className="px-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-full bg-[#22C55E] flex items-center justify-center shrink-0">
                        <PlanIcon />
                    </div>
                    <span className="text-[15px] font-bold text-grey-900">{t("plan_info_title")}</span>
                </div>
                <div className="bg-[#f7f8fa] rounded-xl px-4 py-3 flex flex-col gap-3">
                    <InfoRow label={t("plan_name")} value={props.planName} />
                    <InfoRow label={t("monthly_amount")} value={props.planPrice} />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mt-3 flex gap-2.5 items-start">
                    <span className="text-[16px] shrink-0">⚠️</span>
                    <div>
                        <div className="text-[13px] font-bold text-amber-800">{t("plan_maintenance_warning_title")}</div>
                        <div className="text-[12px] text-amber-700 mt-0.5 leading-[1.4]">{t("plan_maintenance_warning_desc")}</div>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#f0f0f0] px-5 py-4 max-w-[480px] mx-auto">
                <Button
                    size="lg"
                    className={`w-full text-[17px] font-bold rounded-2xl transition-all ${
                        isFormComplete
                            ? "bg-primary text-white shadow-md shadow-primary/30"
                            : "bg-grey-200 text-grey-400"
                    }`}
                    onClick={handleApplyClick}
                >
                    {t("submit_btn")} →
                </Button>
            </div>

            {/* Terms Modal */}
            {showTerms && (
                <div className="fixed inset-0 z-[9999] flex flex-col justify-end">
                    <div className="bg-white rounded-t-[24px] px-6 pt-8 pb-10 z-[2] shadow-[0_-4px_30px_rgba(0,0,0,0.12)] relative max-h-[85vh] flex flex-col w-full max-w-[480px] mx-auto animate-slideUp overflow-y-auto">
                        <div className="w-10 h-1 bg-grey-200 rounded-full mx-auto mb-6" />

                        <div
                            className="flex items-center gap-3 cursor-pointer mb-4"
                            onClick={() => setAgreement(!agreement)}
                        >
                            <Checkbox checked={agreement} />
                            <span className="text-[15px] font-bold text-grey-900 flex-1">{t("terms_title")}</span>
                            <button
                                className="p-1 shrink-0"
                                onClick={(e) => { e.stopPropagation(); setIsTermExpanded(!isTermExpanded) }}
                            >
                                <ChevronDown style={{ transform: isTermExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                            </button>
                        </div>

                        {isTermExpanded && (
                            <div className="mb-5">
                                <p className="text-[13px] text-grey-600 leading-[1.6] mb-4">
                                    {t("terms_description_detail")}
                                </p>
                                <div className="border border-border-default rounded-xl overflow-hidden text-[13px]">
                                    <div className="flex border-b border-border-default">
                                        <div className="w-[90px] bg-bg-input p-3 text-grey-700 font-semibold flex items-center justify-center text-center border-r border-border-default shrink-0">{t("terms_purpose")}</div>
                                        <div className="flex-1 p-3 text-grey-800 leading-[1.5]">{t("terms_purpose_value")}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-[90px] bg-bg-input p-3 text-grey-700 font-semibold flex items-center justify-center text-center border-r border-border-default shrink-0">{t("terms_items")}</div>
                                        <div className="flex-1 p-3 text-grey-800 leading-[1.5]">{t("terms_items_value")}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button
                            size="lg"
                            className={`w-full text-[17px] font-bold rounded-2xl mt-4 ${agreement ? "" : "bg-blue-300"}`}
                            onClick={handleFinalConfirm}
                            disabled={isLoading || !agreement}
                        >
                            {isLoading ? t("processing_button") : t("agree_and_submit_btn")}
                        </Button>
                    </div>
                    <div
                        className="absolute inset-0 bg-black/40 z-[1]"
                        onClick={() => !isLoading && setShowTerms(false)}
                    />
                </div>
            )}
        </div>
    )
}

// Read-only view for result page
function ReadOnlyView({ formData, t, ...props }: { formData: FormData; t: ReturnType<typeof useTranslations<"Phone.OrderForm">> } & OrderUserFormProps) {
    return (
        <div className="w-full flex flex-col bg-white">
            <div className="mx-5 mt-1 rounded-[28px] border border-[#e7edf5] bg-[#fbfcfe] p-4 shadow-sm">
                <OrderProductSummary
                    image={props.imageUrl}
                    title={props.title}
                    spec={props.spec}
                    price={props.price}
                />
            </div>

            <div className="px-5 mt-7 flex flex-col gap-5">
                <InfoRow label={t("name_label")} value={formData.userName} />
                <InfoRow label={t("phone_number")} value={formData.userPhone} />
                {formData.foreignerId && <InfoRow label={t("foreigner_id_label")} value={formData.foreignerId} />}
                {formData.address && (
                    <div className="flex items-start gap-6">
                        <span className="text-[14px] text-grey-500 w-[70px] font-medium shrink-0 pt-[2px]">{t("address_label")}</span>
                        <div className="flex flex-col gap-0.5 flex-1">
                            {formData.zipCode && <span className="text-[15px] font-medium text-grey-900">[{formData.zipCode}]</span>}
                            <span className="text-[15px] font-medium text-grey-900 leading-[1.4]">{formData.address}</span>
                            {formData.detailAddress && <span className="text-[15px] font-medium text-grey-900">{formData.detailAddress}</span>}
                        </div>
                    </div>
                )}
            </div>

            <div className="mx-5 my-6 h-px bg-[#f0f0f0]" />

            <div className="px-5 flex flex-col gap-3">
                <InfoRow label={t("join_type")} value={props.joinType} />
                <InfoRow label={t("discount_type")} value={props.discountType === "plan" ? t("discount_type_plan") : t("discount_type_device")} />
                <InfoRow label={t("contract")} value={props.contract} />
                <InfoRow label={t("plan_name")} value={props.planName} />
                <InfoRow label={t("monthly_amount")} value={props.planPrice} />
            </div>
        </div>
    )
}

// --- UI building blocks ---
const InfoRow = ({ label, value }: { label: string; value: string | undefined }) => (
    <div className="flex items-center gap-4 justify-between min-h-[22px]">
        <span className="text-[14px] text-grey-500 w-[70px] font-medium shrink-0">{label}</span>
        <span className="text-[15px] font-medium text-grey-900 flex-1 text-right">{value}</span>
    </div>
)

const SummaryBadge = ({ title, value }: { title: string; value: string }) => (
    <div className="rounded-2xl bg-white px-3 py-3 shadow-sm ring-1 ring-[#e8edf3]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-grey-400">{title}</div>
        <div className="mt-1 text-[13px] font-bold leading-[1.35] text-grey-900">{value}</div>
    </div>
)

const Checkbox = ({ checked }: { checked: boolean }) => (
    <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-all ${checked ? "bg-primary border-none" : "bg-white border-2 border-grey-300"}`}>
        {checked && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        )}
    </div>
)

const ChevronDown = ({ style }: { style?: React.CSSProperties }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
)

const PhoneIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
)

const PlanIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
)
