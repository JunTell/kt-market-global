"use client"

import React, { useState, useRef } from "react"
import { useTranslations } from "next-intl"
import Select from "@/shared/components/ui/Select"
import { COUNTRY_OPTIONS } from "@/shared/constants/options"

interface FormData {
  userName: string
  userDob: string
  userPhone: string
  country: string
  requirements: string
  planName?: string
}

interface OrderUserFormProps {
  userName: string
  userDob: string
  userPhone: string
  country: string
  requirements?: string
  planName: string
  planData: string
  planPrice: string
  joinType: string
  contract: string
  discountType: string
  onConfirm?: (data: FormData) => void
  isReadOnly?: boolean
}

const getPlan69Variants = (t: ReturnType<typeof useTranslations>) => ({
  video: { name: t('Phone.OrderForm.plan_69_video_name'), description: t('Phone.OrderForm.plan_69_video_description') },
  simple: { name: t('Phone.OrderForm.plan_69_simple_name'), description: t('Phone.OrderForm.plan_69_simple_description') },
})

export default function OrderUserForm(props: OrderUserFormProps) {
  const t = useTranslations()
  const [isEditing, setIsEditing] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreement, setAgreement] = useState(true)
  const [isTermExpanded, setIsTermExpanded] = useState(false)

  const subscriberRef = useRef<HTMLDivElement>(null)

  // Refs for auto-focus/tabbing
  const nameRef = useRef<HTMLInputElement>(null)
  const dobRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const countryRef = useRef<HTMLDivElement>(null)
  const reqRef = useRef<HTMLInputElement>(null)

  // Auto-focus Name when editing starts
  React.useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        nameRef.current?.focus()
      }, 100)
    }
  }, [isEditing])

  // Handle Enter key navigation
  const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement | null>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      nextRef.current?.focus()
    }
  }

  const [formData, setFormData] = useState({
    userName: props.userName,
    userDob: props.userDob,
    userPhone: props.userPhone,
    country: props.country || "Republic of Korea",
    requirements: props.requirements || "",
  })

  const [displayPlan, setDisplayPlan] = useState({ name: props.planName, data: props.planData })
  const [touched, setTouched] = useState({ userName: false, userDob: false, userPhone: false })

  // Track previous props for formData
  const [prevFormProps, setPrevFormProps] = useState({
    userName: props.userName,
    userDob: props.userDob,
    userPhone: props.userPhone,
    country: props.country,
    requirements: props.requirements,
  })

  if (
    props.userName !== prevFormProps.userName ||
    props.userDob !== prevFormProps.userDob ||
    props.userPhone !== prevFormProps.userPhone ||
    props.country !== prevFormProps.country ||
    props.requirements !== prevFormProps.requirements
  ) {
    setFormData({
      userName: props.userName,
      userDob: props.userDob,
      userPhone: props.userPhone,
      country: props.country || "Republic of Korea",
      requirements: props.requirements || "",
    })
    setPrevFormProps({
      userName: props.userName,
      userDob: props.userDob,
      userPhone: props.userPhone,
      country: props.country,
      requirements: props.requirements,
    })
  }

  // Track previous props for displayPlan
  const [prevPlanProps, setPrevPlanProps] = useState({
    planName: props.planName,
    planData: props.planData,
  })

  if (props.planName !== prevPlanProps.planName || props.planData !== prevPlanProps.planData) {
    // Result 페이지에서는 props로 전달된 값을 우선하되, 세션 체크 로직 유지
    let name = props.planName
    let data = props.planData
    if (typeof window !== "undefined") {
      try {
        const sessionData = sessionStorage.getItem("asamoDeal")
        if (sessionData) {
          const parsed = JSON.parse(sessionData)
          const pId = parsed.selectedPlanId
          const variants = getPlan69Variants(t)
          if (pId === "plan_69_v") {
            name = variants.simple.name
            data = variants.simple.description
          } else if (pId === "plan_69") {
            name = variants.video.name
            data = variants.video.description
          }
        }
      } catch (e) { console.error(e) }
    }
    setDisplayPlan({ name, data })
    setPrevPlanProps({
      planName: props.planName,
      planData: props.planData,
    })
  }

  // English Name Regex
  const isNameEnglish = /^[A-Za-z\s]*$/.test(formData.userName)

  const isDobValid = formData.userDob?.length === 6
  const isPhoneValid = formData.userPhone?.length >= 10
  const isNameValid = formData.userName && formData.userName.trim() !== "" && isNameEnglish
  const isUserInfoComplete = isNameValid && isDobValid && isPhoneValid
  const infoButtonLabel = isUserInfoComplete ? t('Phone.OrderForm.edit_button') : t('Phone.OrderForm.input_button')

  const handleChange = (field: string, value: string) => {
    if (field === "userDob" || field === "userPhone") {
      const numericValue = value.replace(/[^0-9]/g, "")
      setFormData(prev => ({ ...prev, [field]: numericValue }))
      return
    }
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFinalConfirm = async () => {
    if (isLoading) return
    if (!agreement) {
      alert(t('Phone.OrderForm.terms_alert'))
      return
    }
    setIsLoading(true)
    try {
      if (props.onConfirm) {
        await props.onConfirm({
          ...formData,
          planName: displayPlan.name,
        })
      }
    } catch (e) {
      console.error(e)
      setIsLoading(false)
    }
  }

  const discountText = props.discountType === "plan" ? t('Phone.OrderForm.discount_type_plan') : t('Phone.OrderForm.discount_type_device')

  if (isEditing) {
    return (
      <div className="w-full max-w-[480px] mx-auto min-h-screen z-[9999] fixed top-0 left-1/2 -translate-x-1/2 bottom-0 overflow-y-auto bg-white animate-fadeInUp">
        <div className="flex items-center gap-1 mb-7.5 px-5 pt-4">
          <div className="cursor-pointer p-2 -ml-2 text-grey-900" onClick={() => setIsEditing(false)}><ChevronLeft /></div>
          <div className="text-lg font-bold text-grey-900">{t('Phone.OrderForm.subscriber_info_input')}</div>
        </div>
        <div className="flex flex-col px-5">
          <InputGroup
            ref={nameRef}
            name="name"
            label={t('Phone.OrderForm.name_label')}
            value={formData.userName}
            onChange={(e) => handleChange("userName", e.target.value)}
            onBlur={() => setTouched(prev => ({ ...prev, userName: true }))}
            error={touched.userName && !isNameEnglish ? t('Phone.OrderForm.name_error') : undefined}
            onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, dobRef)}
            placeholder="English Name (ex: John Doe)"
          />
          <InputGroup
            ref={dobRef}
            label={t('Phone.OrderForm.dob_label')}
            placeholder={t('Phone.OrderForm.dob_placeholder')}
            value={formData.userDob}
            maxLength={6}
            onChange={(e) => handleChange("userDob", e.target.value)}
            error={touched.userDob && !isDobValid ? t('Phone.OrderForm.dob_error') : undefined}
            onBlur={() => setTouched(prev => ({ ...prev, userDob: true }))}
            onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, phoneRef)}
          />
          <InputGroup
            ref={phoneRef}
            label={t('Phone.OrderForm.phone_label')}
            placeholder={t('Phone.OrderForm.phone_placeholder')}
            value={formData.userPhone}
            maxLength={11}
            onChange={(e) => handleChange("userPhone", e.target.value)}
            error={touched.userPhone && !isPhoneValid ? t('Phone.OrderForm.phone_error') : undefined}
            onBlur={() => setTouched(prev => ({ ...prev, userPhone: true }))}
            onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, countryRef)}
          />
          <Select
            label={t('Phone.OrderForm.country_label')}
            options={COUNTRY_OPTIONS}
            value={formData.country}
            onChange={(val) => handleChange("country", val)}
            placeholder="Select Country"
            disabled={props.isReadOnly}
            ref={countryRef}
          />
          <InputGroup
            ref={reqRef}
            label={t('Phone.OrderForm.requirements_label')}
            placeholder={t('Phone.OrderForm.requirements_placeholder')}
            value={formData.requirements}
            onChange={(e) => handleChange("requirements", e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') (e.currentTarget as HTMLElement).blur() }}
          />
        </div>
        <div className="pt-10 mt-auto px-5 pb-10">
          <button className="w-full py-4.5 bg-primary text-white text-[17px] font-bold border-none rounded-[14px] cursor-pointer shadow-lg hover:bg-primary-hover transition-colors" onClick={() => setIsEditing(false)}>{t('Phone.OrderForm.save_button')}</button>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full flex flex-col bg-white pt-5 px-5 min-h-[400px] relative box-border ${props.isReadOnly ? 'pb-10' : 'pb-[100px]'}`}>
      <div className="flex items-center gap-2.5 mb-5" ref={subscriberRef}>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><UserIcon /></div>
        <div className="text-lg font-bold text-grey-900">{t('Phone.OrderForm.subscriber_info_title')}</div>
      </div>
      <div className="flex flex-col gap-4 mb-2.5 pl-1">
        <InfoRow label={t('Phone.OrderForm.name_label')} value={formData.userName} hasButton={!props.isReadOnly} buttonLabel={infoButtonLabel} onEdit={() => setIsEditing(true)} />
        <InfoRow label={t('Phone.OrderForm.date_of_birth')} value={props.isReadOnly ? formData.userDob : (isDobValid ? formData.userDob : null)} />
        <InfoRow label={t('Phone.OrderForm.phone_number')} value={props.isReadOnly ? formData.userPhone : (isPhoneValid ? formData.userPhone : null)} />
        <InfoRow label={t('Phone.OrderForm.country')} value={formData.country} />
        {formData.requirements && <InfoRow label={t('Phone.OrderForm.requirements')} value={formData.requirements} />}
      </div>

      <div className="w-full h-px bg-border-default my-7.5" />

      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center"><PhoneIcon /></div>
        <div className="text-lg font-bold text-grey-900">{t('Phone.OrderForm.activation_info_title')}</div>
      </div>
      <div className="flex flex-col gap-4 mb-2.5 pl-1">
        <InfoRow label={t('Phone.OrderForm.discount_type')} value={discountText} />
        <InfoRow label={t('Phone.OrderForm.contract')} value={props.contract} />
        <InfoRow label={t('Phone.OrderForm.join_type')} value={props.joinType} />
      </div>

      <div className="w-full h-px bg-border-default my-7.5" />

      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-full bg-status-success flex items-center justify-center"><PlanIcon /></div>
        <div className="text-lg font-bold text-grey-900">{t('Phone.OrderForm.plan_info_title')}</div>
      </div>
      <div className="flex flex-col gap-4 mb-2.5 pl-1">
        <InfoRow label={t('Phone.OrderForm.plan_name')} value={displayPlan.name} />
        <InfoRow label={t('Phone.OrderForm.plan_data')} value={displayPlan.data} />
        <InfoRow label={t('Phone.OrderForm.monthly_amount')} value={props.planPrice} />
      </div>
      <div className="bg-bg-grouped rounded-2xl p-5 flex gap-3 mt-5">
        <div className="w-5 h-5 rounded-full bg-grey-600 text-white text-xs font-bold flex items-center justify-center font-serif shrink-0 mt-0.5">i</div>
        <div className="text-sm text-grey-900 leading-relaxed">
          <div className="font-bold mb-1">
            {props.isReadOnly ? t('Phone.OrderForm.application_success_title') : t('Phone.OrderForm.plan_maintenance_warning_title')}
          </div>
          <div className="text-[#6B7280] text-[13px]">
            {props.isReadOnly ? t('Phone.OrderForm.application_success_desc') : t('Phone.OrderForm.plan_maintenance_warning_desc')}
          </div>
        </div>
      </div>

      {!props.isReadOnly && (
        <div className="pt-10 mt-auto">
          <button
            className="w-full py-4.5 bg-primary text-white text-[17px] font-bold border-none rounded-[14px] cursor-pointer shadow-lg hover:bg-primary-hover transition-colors"
            onClick={() => {
              if (!isUserInfoComplete) {
                setTouched({ userName: true, userDob: true, userPhone: true })
                subscriberRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                setIsEditing(true)
                return
              }
              setShowTerms(true)
            }}
          >
            {t('Phone.OrderForm.confirm_button')}
          </button>
        </div>
      )}

      {showTerms && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999] flex flex-col justify-end items-center">
          <div className="bg-white rounded-t-3xl px-6 pt-7.5 pb-10 z-2 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] relative max-h-[80vh] flex flex-col overflow-y-auto animate-slideUp w-full max-w-[480px]">
            <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setAgreement(!agreement)}>
              <Checkbox checked={agreement} />
              <span className="text-base font-bold text-grey-900 flex-1">{t('Phone.OrderForm.terms_title')}</span>
              <div className="p-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); setIsTermExpanded(!isTermExpanded) }}>
                <ChevronDown style={{ transform: isTermExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
              </div>
            </div>
            {isTermExpanded && (
              <div className="pb-5">
                <div className="text-[13px] text-grey-500 leading-relaxed mb-5" dangerouslySetInnerHTML={{ __html: t('Phone.OrderForm.terms_description') }} />
                <div className="border border-border-default rounded-lg overflow-hidden">
                  <div className="flex border-b border-[#E5E7EB]">
                    <div className="w-[100px] bg-[#F9FAFB] p-3 text-[13px] font-semibold text-[#374151] flex items-center justify-center text-center border-r border-[#E5E7EB] box-border">{t('Phone.OrderForm.terms_purpose')}</div>
                    <div className="flex-1 p-3 text-[13px] text-[#374151] leading-relaxed bg-white box-border">{t('Phone.OrderForm.terms_purpose_value')}</div>
                  </div>
                  <div className="flex">
                    <div className="w-[100px] bg-[#F9FAFB] p-3 text-[13px] font-semibold text-[#374151] flex items-center justify-center text-center border-r border-[#E5E7EB] box-border">{t('Phone.OrderForm.terms_retention')}</div>
                    <div className="flex-1 p-3 text-[13px] text-[#374151] leading-relaxed bg-white box-border"><span className="text-[#EF4444] font-semibold">{t('Phone.OrderForm.terms_retention_value')}</span></div>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-7.5">
              <button
                className={`w-full py-4.5 text-white text-[17px] font-bold border-none rounded-[14px] shadow-lg transition-colors ${agreement ? 'bg-primary cursor-pointer hover:bg-primary-hover' : 'bg-grey-300 cursor-default'}`}
                onClick={handleFinalConfirm}
                disabled={isLoading}
              >
                {isLoading ? t('Phone.OrderForm.processing_button') : t('Phone.OrderForm.next_button')}
              </button>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-1" onClick={() => !isLoading && setShowTerms(false)} />
        </div>
      )}
    </div>
  )
}

// --- Icons & Sub Components ---
const ChevronLeft = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
const ChevronDown = ({ style }: { style?: React.CSSProperties }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><polyline points="6 9 12 15 18 9"></polyline></svg>
const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
const PhoneIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
const PlanIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>

const Checkbox = ({ checked }: { checked: boolean }) => (
  <div className={`w-6 h-6 rounded flex items-center justify-center mr-3 shrink-0 transition-all ${checked ? 'bg-primary border-none' : 'bg-base border border-grey-300'}`}>
    {checked && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
  </div>
)

const InfoRow = ({ label, value, hasButton = false, onEdit, buttonLabel = "수정" }: {
  label: string
  value: string | null
  hasButton?: boolean
  onEdit?: () => void
  buttonLabel?: string
}) => (
  <div className="flex items-start justify-between">
    <span className="text-[15px] text-grey-500 w-[140px] font-medium leading-snug">{label}</span>
    <div className="flex items-center gap-2.5 flex-1">
      {value && <span className="text-[15px] font-semibold text-grey-900 leading-snug">{value}</span>}
      {hasButton && <button className="py-1.5 px-3 text-[13px] text-grey-600 bg-bg-grouped border-none rounded-md cursor-pointer ml-auto" onClick={onEdit}>{buttonLabel}</button>}
    </div>
  </div>
)

const InputGroup = React.forwardRef<HTMLInputElement, {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
  placeholder?: string
  maxLength?: number
  error?: string
  name?: string
  onKeyDown?: (e: React.KeyboardEvent) => void
}>(({ label, value, onChange, onBlur, placeholder, maxLength, error, name, onKeyDown }, ref) => (
  <div className="mb-6">
    <div className="text-[13px] text-grey-500 mb-2 font-medium">{label}</div>
    <input
      ref={ref}
      name={name}
      className={`w-full p-4 text-base rounded-lg bg-white text-grey-900 outline-none box-border ${error ? 'border border-status-error' : 'border border-grey-200'}`}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      maxLength={maxLength}
      autoComplete="off"
    />
    {error && <div className="text-status-error text-[13px] mt-1.5">{error}</div>}
  </div>
))
InputGroup.displayName = "InputGroup"

// Add animations to document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style")
  styleSheet.innerText = `
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  `
  if (!document.getElementById("custom-animations")) {
    styleSheet.id = "custom-animations"
    document.head.appendChild(styleSheet)
  }
}
