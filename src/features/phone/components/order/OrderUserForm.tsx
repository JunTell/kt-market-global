"use client"

import React, { useState, useRef, useCallback } from "react"

import Script from "next/script"
import Image from "next/image"

import { Input } from "@/shared/components/ui/Input"
import { Button } from "@/shared/components/ui/Button"
import { useTranslations } from "next-intl"

interface FormData {
    userName: string
    birthday: string
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
    birthday?: string
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

// Helpers
const formatBirthday = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "").slice(0, 8)
    if (numbers.length <= 4) return numbers
    if (numbers.length <= 6) return `${numbers.slice(0, 4)}-${numbers.slice(4)}`
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6)}`
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
    const [isEditing, setIsEditing] = useState(!props.isReadOnly)
    const [isLoading, setIsLoading] = useState(false)
    const [showTerms, setShowTerms] = useState(false)
    const [agreement, setAgreement] = useState(true)
    const [isTermExpanded, setIsTermExpanded] = useState(false)

    const [formData, setFormData] = useState<FormData>({
        userName: props.userName || "",
        birthday: formatBirthday(props.birthday || ""),
        userPhone: formatPhoneNumber(props.userPhone || ""),
        foreignerId: formatForeignerId(props.foreignerId || ""),
        zipCode: props.zipCode || "",
        address: props.address || "",
        detailAddress: props.detailAddress || "",
        country: props.country || "Republic of Korea",
    })

    const [touched, setTouched] = useState({
        userName: false,
        birthday: false,
        userPhone: false,
        foreignerId: false,
        address: false,
    })

    const subscriberRef = useRef<HTMLDivElement>(null)

    // Validation
    const isPhoneValid = formData.userPhone.replace(/-/g, "").length >= 10
    const isNameValid = formData.userName.trim().length > 0
    const isBirthdayValid = formData.birthday.length === 10 // YYYY-MM-DD format
    const isForeignerIdValid = formData.foreignerId.replace(/-/g, "").length === 13
    const isAddressValid = formData.zipCode.trim() !== "" && formData.address.trim() !== ""

    const isFormComplete = isNameValid && isBirthdayValid && isPhoneValid && isForeignerIdValid && isAddressValid

    const handleChange = (field: keyof FormData, value: string) => {
        if (field === "birthday") {
            setFormData(prev => ({ ...prev, [field]: formatBirthday(value) }))
            return
        }
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

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }))
    }

    const handleSaveInput = useCallback(() => {
        setTouched({
            userName: true,
            birthday: true,
            userPhone: true,
            foreignerId: true,
            address: true,
        })
        if (isFormComplete) {
            setIsEditing(false)
        } else {
            alert(t("form_incomplete_alert"))
        }
    }, [isFormComplete, t])

    const handleApplyClick = () => {
        if (!isFormComplete) {
            setTouched({
                userName: true,
                birthday: true,
                userPhone: true,
                foreignerId: true,
                address: true,
            })
            subscriberRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            setIsEditing(true)
            return
        }
        setShowTerms(true)
    }

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

    // Daum Postcode Logic - 영문 주소 추출
    const handleOpenPostcode = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof window !== "undefined" && (window as any).daum && (window as any).daum.Postcode) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            new (window as any).daum.Postcode({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                oncomplete: (data: any) => {
                    // 기본적으로 영문 주소를 가져오고, 없을 경우 국문 주소를 사용합니다.
                    const fullAddress = data.addressEnglish || data.address;

                    setFormData(prev => ({
                        ...prev,
                        zipCode: data.zonecode,
                        address: fullAddress,
                    }));
                }
            }).open();
        } else {
            alert(t("postcode_loading_alert"));
        }
    }

    return (
        <div className="w-full flex flex-col bg-white">
            {/* dynamic daum script */}
            <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="lazyOnload" />

            {/* Product Card Styled */}
            <div className="flex items-center gap-5 w-full px-5 py-5 box-border">
                <div className="relative w-[80px] h-[80px] flex items-center justify-center bg-white rounded-xl shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.05)] p-2 box-border">
                    {props.imageUrl ? (
                        <Image src={props.imageUrl} alt="Device" fill className="object-contain p-2" />
                    ) : (
                        <div className="w-full h-full bg-[#eee]" />
                    )}
                </div>
                <div className="flex flex-col justify-center gap-1">
                    <div className="text-[18px] font-bold text-[#1d1d1f]">{props.title}</div>
                    <div className="text-[14px] text-[#86868b] font-medium">{props.spec}</div>
                </div>
            </div>

            <div className="w-full h-[2px] bg-bg-grouped my-[30px]" />

            {/* Subscriber Info Header */}
            <div className="flex items-center gap-2.5 px-5 mb-5" ref={subscriberRef}>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <UserIcon />
                </div>
                <div className="text-[18px] font-bold text-grey-900">{t("subscriber_info_title")}</div>
            </div>

            <div className="flex flex-col gap-5 px-5">
                {isEditing ? (
                    <div className="animate-fadeIn w-full flex flex-col gap-5">
                        <Input
                            label={t("name_label")}
                            value={formData.userName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("userName", e.target.value)}
                            onBlur={() => handleBlur("userName")}
                            placeholder={t("name_placeholder")}
                            error={touched.userName && !isNameValid}
                            helperText={touched.userName && !isNameValid ? t("name_error") : undefined}
                        />

                        {/* Birthday Field */}
                        <Input
                            label={t("birthday_label")}
                            value={formData.birthday}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("birthday", e.target.value)}
                            onBlur={() => handleBlur("birthday")}
                            placeholder={t("birthday_placeholder")} // "YYYY-MM-DD" 혹은 "1990-01-01" 번역 권장
                            maxLength={10}
                            error={touched.birthday && !isBirthdayValid}
                            helperText={touched.birthday && !isBirthdayValid ? t("birthday_error") : undefined}
                        />

                        <Input
                            label={t("phone_label")}
                            value={formData.userPhone}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("userPhone", e.target.value)}
                            onBlur={() => handleBlur("userPhone")}
                            placeholder={t("phone_placeholder")}
                            maxLength={13}
                            error={touched.userPhone && !isPhoneValid}
                            helperText={touched.userPhone && !isPhoneValid ? t("phone_error") : undefined}
                        />

                        {/* Foreigner ID */}
                        <Input
                            label={t("foreigner_id_label")}
                            value={formData.foreignerId}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("foreignerId", e.target.value)}
                            onBlur={() => handleBlur("foreignerId")}
                            placeholder={t("foreigner_id_placeholder")}
                            maxLength={14}
                            error={touched.foreignerId && !isForeignerIdValid}
                            helperText={touched.foreignerId && !isForeignerIdValid ? t("foreigner_id_error") : undefined}
                        />

                        {/* Address */}
                        <div className="flex flex-col gap-2 w-full">
                            <label className="text-body2 font-bold text-grey-800 flex items-center justify-between">
                                {t("address_label")}
                            </label>
                            <div className="flex gap-2 w-full items-center">
                                <div className="flex-1 min-w-0">
                                    <Input
                                        value={formData.zipCode}
                                        placeholder={t("zipcode_placeholder")}
                                        readOnly
                                        error={touched.address && !isAddressValid}
                                        className="h-12 w-full"
                                    />
                                </div>
                                <Button
                                    onClick={handleOpenPostcode}
                                    className="h-12 px-6 w-auto whitespace-nowrap shrink-0 bg-grey-900 text-white hover:bg-grey-800 border-none rounded-lg"
                                >
                                    {t("find_zipcode_btn")}
                                </Button>
                            </div>

                            {/* 영문 검색 가능 안내 문구 추가 */}
                            <div className="text-[13px] text-primary bg-primary/5 px-3 py-2 rounded-lg my-1 flex items-start gap-1">
                                <span className="font-bold shrink-0">Tip:</span>
                                <span>You can search your address in English (e.g., &quot;Itaewon-ro&quot; or &quot;Gangnam-daero&quot;) in the popup window.</span>
                            </div>

                            <Input
                                value={formData.address}
                                placeholder={t("address_placeholder")}
                                readOnly
                                className="bg-bg-grouped"
                                error={touched.address && !isAddressValid}
                            />
                            <Input
                                value={formData.detailAddress}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("detailAddress", e.target.value)}
                                onBlur={() => handleBlur("address")}
                                placeholder={t("detail_address_placeholder")}
                                error={touched.address && !isAddressValid}
                                helperText={touched.address && !isAddressValid ? t("address_error") : undefined}
                            />
                        </div>

                        <Button
                            size="lg"
                            className={`w-full mt-2 transition-all rounded-lg ${isFormComplete ? "bg-grey-900 text-white" : "bg-border-default text-grey-400"
                                }`}
                            onClick={handleSaveInput}
                        >
                            {t("complete_input_btn")}
                        </Button>
                    </div>
                ) : (
                    <div className="animate-fadeIn flex flex-col gap-5 w-full">
                        <InfoRow label={t("name_label")} value={formData.userName} hasButton={!props.isReadOnly} buttonLabel={t("edit_button")} onEdit={() => setIsEditing(true)} />
                        <InfoRow label={t("birthday_label")} value={formData.birthday} />
                        <InfoRow label={t("phone_number")} value={formData.userPhone} />
                        <InfoRow label={t("foreigner_id_label")} value={formData.foreignerId} />

                        {/* 수정된 주소 UI 영역 */}
                        <div className="flex items-start gap-6 min-h-[24px]">
                            <span className="text-[15px] text-grey-500 w-[80px] font-medium shrink-0 pt-[2px]">
                                {t("address_label") || "Address"}
                            </span>
                            <div className="flex flex-col items-start gap-1 flex-1 text-left">
                                <span className="text-[16px] font-medium text-grey-900">
                                    [{formData.zipCode}]
                                </span>
                                <span className="text-[16px] font-medium text-grey-900 leading-[1.4] break-words">
                                    {formData.address}
                                </span>
                                {formData.detailAddress && (
                                    <span className="text-[16px] font-medium text-grey-900 leading-[1.4]">
                                        {formData.detailAddress}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full h-[2px] bg-bg-grouped my-[30px]" />

            {/* Activation Info Header */}
            <div className="flex items-center gap-2.5 px-5 mb-5">
                <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center shrink-0">
                    <PhoneIcon />
                </div>
                <div className="text-[18px] font-bold text-grey-900">{t("activation_info_title")}</div>
            </div>
            <div className="flex flex-col gap-5 px-5">
                <InfoRow label={t("join_type")} value={props.joinType} />
                <InfoRow label={t("discount_type")} value={props.discountType === "plan" ? t("discount_type_plan") : t("discount_type_device")} />
                <InfoRow label={t("contract")} value={props.contract} />
            </div>

            <div className="w-full h-[2px] bg-bg-grouped my-[30px]" />

            {/* Plan Info Header */}
            <div className="flex items-center gap-2.5 px-5 mb-5">
                <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center shrink-0">
                    <PlanIcon />
                </div>
                <div className="text-[18px] font-bold text-grey-900">{t("plan_info_title")}</div>
            </div>
            <div className="flex flex-col gap-5 px-5">
                <InfoRow label={t("plan_name")} value={props.planName} />
                <InfoRow label={t("monthly_amount")} value={props.planPrice} />
            </div>

            <div className="bg-bg-grouped rounded-2xl p-5 flex gap-3 mt-2.5 mx-5">
                <div className="w-5 h-5 rounded-full bg-grey-700 text-white text-[12px] font-bold flex items-center justify-center font-serif shrink-0 mt-0.5">i</div>
                <div className="text-[14px] text-grey-900 leading-[1.5]">
                    <div className="font-bold mb-1">{t("plan_maintenance_warning_title")}</div>
                    <div className="text-grey-700 text-[13px]">{t("plan_maintenance_warning_desc")}</div>
                </div>
            </div>

            {!props.isReadOnly && (
                <div className="pt-10 mt-auto px-5 pb-10">
                    <Button
                        size="lg"
                        className="w-full text-[17px] font-bold rounded-2xl"
                        onClick={handleApplyClick}
                    >
                        {t("submit_btn")}
                    </Button>
                </div>
            )}

            {/* Terms Modal Bottom Sheet */}
            {showTerms && (
                <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999] flex flex-col justify-end">
                    <div className="bg-white rounded-t-[24px] px-6 pt-[30px] pb-10 z-[2] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] relative max-h-[80vh] flex flex-col overflow-y-auto w-full max-w-[480px] mx-auto animate-slideUp">
                        <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setAgreement(!agreement)}>
                            <Checkbox checked={agreement} />
                            <span className="text-[16px] font-bold text-grey-900 flex-1">{t("terms_title")}</span>
                            <div className="p-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); setIsTermExpanded(!isTermExpanded) }}>
                                <ChevronDown style={{ transform: isTermExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                            </div>
                        </div>

                        {isTermExpanded && (
                            <div className="pb-5">
                                <div className="text-[13px] text-grey-600 leading-[1.5] mb-5">
                                    {t("terms_description_detail")}
                                </div>
                                <div className="border border-border-default rounded-lg overflow-hidden">
                                    <div className="flex border-b border-border-default">
                                        <div className="w-[100px] bg-bg-input p-3 text-[13px] font-semibold text-grey-800 flex items-center justify-center text-center border-r border-border-default box-border">{t("terms_purpose")}</div>
                                        <div className="flex-1 p-3 text-[13px] text-grey-800 leading-[1.5] bg-white box-border">{t("terms_purpose_value")}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-[100px] bg-bg-input p-3 text-[13px] font-semibold text-grey-800 flex items-center justify-center text-center border-r border-border-default box-border">{t("terms_items")}</div>
                                        <div className="flex-1 p-3 text-[13px] text-grey-800 leading-[1.5] bg-white box-border">{t("terms_items_value")}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-[30px]">
                            <Button
                                size="lg"
                                className={`w-full text-[17px] font-bold rounded-2xl ${agreement ? "" : "bg-blue-300"
                                    }`}
                                onClick={handleFinalConfirm}
                                disabled={isLoading || !agreement}
                            >
                                {isLoading ? t("processing_button") : t("agree_and_submit_btn")}
                            </Button>
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-[1]" onClick={() => !isLoading && setShowTerms(false)} />
                </div>
            )}
        </div>
    )
}

// --- Icons & UI building blocks ---
interface InfoRowProps {
    label: string
    value: string | undefined
    hasButton?: boolean
    onEdit?: () => void
    buttonLabel?: string
}

const InfoRow = ({ label, value, hasButton = false, onEdit, buttonLabel = "입력" }: InfoRowProps) => (
    <div className="flex items-center gap-6 justify-between min-h-[24px]">
        <span className="text-[15px] text-grey-500 w-[80px] font-medium shrink-0">{label}</span>
        <div className="flex items-center gap-2.5 flex-1 justify-between">
            <span className="text-[16px] font-medium text-grey-900 line-clamp-1">{value}</span>
            {hasButton && (
                <button className="px-3 py-1.5 text-[13px] text-grey-700 bg-bg-grouped rounded-md font-medium shrink-0" onClick={onEdit}>
                    {buttonLabel}
                </button>
            )}
        </div>
    </div>
)

const Checkbox = ({ checked }: { checked: boolean }) => (
    <div className={`w-6 h-6 rounded flex items-center justify-center mr-3 shrink-0 transition-all ${checked ? "bg-primary border-none" : "bg-white border border-strong"
        }`}>
        {checked && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        )}
    </div>
)

const ChevronDown = ({ style }: { style?: React.CSSProperties }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191F28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
)

const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)

const PhoneIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
)

const PlanIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
)