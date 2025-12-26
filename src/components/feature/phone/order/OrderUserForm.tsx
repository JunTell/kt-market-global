"use client"

import React, { useState, useEffect, useRef } from "react"

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
  onConfirm: (data: any) => void
  isReadOnly?: boolean
}

const PLAN_69_VARIANTS = {
  video: { name: "기존 데이터ON 비디오", description: "데이터 100GB + 다쓰면 최대 5Mbps" },
  simple: { name: "5G 심플 110GB", description: "데이터 110GB + 다쓰면 5Mbps" },
}

export default function OrderUserForm(props: OrderUserFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreement, setAgreement] = useState(false)
  const [isTermExpanded, setIsTermExpanded] = useState(false)
  
  const subscriberRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    userName: props.userName,
    userDob: props.userDob,
    userPhone: props.userPhone,
    country: props.country || "Republic of Korea",
    requirements: props.requirements || "",
  })

  const [displayPlan, setDisplayPlan] = useState({ name: props.planName, data: props.planData })
  const [touched, setTouched] = useState({ userName: false, userDob: false, userPhone: false })

  useEffect(() => {
    setFormData({
      userName: props.userName,
      userDob: props.userDob,
      userPhone: props.userPhone,
      country: props.country || "Republic of Korea",
      requirements: props.requirements || "",
    })
  }, [props.userName, props.userDob, props.userPhone, props.country, props.requirements])

  useEffect(() => {
    let name = props.planName
    let data = props.planData
    if (typeof window !== "undefined") {
      try {
        const sessionData = sessionStorage.getItem("asamoDeal")
        if (sessionData) {
          const parsed = JSON.parse(sessionData)
          const pId = parsed.selectedPlanId
          if (pId === "plan_69_v") {
            name = PLAN_69_VARIANTS.simple.name
            data = PLAN_69_VARIANTS.simple.description
          } else if (pId === "plan_69") {
            name = PLAN_69_VARIANTS.video.name
            data = PLAN_69_VARIANTS.video.description
          }
        }
      } catch (e) { console.error(e) }
    }
    setDisplayPlan({ name, data })
  }, [props.planName, props.planData])

  const isDobValid = formData.userDob?.length === 6
  const isPhoneValid = formData.userPhone?.length === 11
  const isNameValid = formData.userName && formData.userName.trim() !== ""
  const isUserInfoComplete = isNameValid && isDobValid && isPhoneValid
  const infoButtonLabel = isUserInfoComplete ? "수정" : "입력"

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
      alert("필수 약관에 동의해주세요.")
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

  const discountText = props.discountType === "plan" ? "선택약정 (요금할인)" : "공시지원금 (기기할인)"

  // --- 렌더링: 편집 모드 ---
  if (isEditing) {
    return (
      <div style={{ ...containerStyle, ...animationStyle, minHeight: '100vh', zIndex: 50, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, maxWidth: '430px', margin: '0 auto' }}>
        <div style={editHeaderStyle}>
          <div style={backIconStyle} onClick={() => setIsEditing(false)}><ChevronLeft /></div>
          <div style={headerTitleStyle}>가입자 정보 입력</div>
        </div>
        <div style={formContainerStyle}>
          <InputGroup label="이름" value={formData.userName} onChange={(e:any) => handleChange("userName", e.target.value)} />
          <InputGroup 
            label="생년월일 (6자리)" placeholder="예: 900101" value={formData.userDob} maxLength={6}
            onChange={(e:any) => handleChange("userDob", e.target.value)}
            error={touched.userDob && !isDobValid ? "생년월일 6자리를 입력해주세요" : undefined}
            onBlur={() => setTouched(prev => ({...prev, userDob: true}))}
          />
          <InputGroup 
            label="휴대폰 번호 (숫자만)" placeholder="01012345678" value={formData.userPhone} maxLength={11}
            onChange={(e:any) => handleChange("userPhone", e.target.value)}
            error={touched.userPhone && !isPhoneValid ? "휴대폰 번호 11자리를 입력해주세요" : undefined}
            onBlur={() => setTouched(prev => ({...prev, userPhone: true}))}
          />
          
          {/* ✅ [추가] 국적 선택 셀렉트 박스 */}
          <div style={{ marginBottom: "24px" }}>
            <div style={inputLabelStyle}>국적 (Country)</div>
            <select
                style={inputStyle}
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
            >
                <option value="Republic of Korea">Republic of Korea</option>
                <option value="USA">USA</option>
                <option value="China">China</option>
                <option value="Japan">Japan</option>
                <option value="Vietnam">Vietnam</option>
                <option value="Thailand">Thailand</option>
                <option value="Other">Other</option>
            </select>
          </div>

          <InputGroup label="요청사항 (선택)" placeholder="예: 기존 유심 그대로 사용하고 싶어요" value={formData.requirements} onChange={(e:any) => handleChange("requirements", e.target.value)} />
        </div>
        <div style={bottomContainerStyle}>
          <button style={confirmButtonStyle} onClick={() => setIsEditing(false)}>저장</button>
        </div>
      </div>
    )
  }

  // --- 렌더링: 기본 뷰 ---
  return (
    <div style={{ ...containerStyle, paddingBottom: "100px" }}>
      <div style={headerStyle} ref={subscriberRef}>
        <div style={iconCircleStyle}><UserIcon /></div>
        <div style={headerTitleStyle}>가입자 정보</div>
      </div>
      <div style={listStyle}>
        <InfoRow label="이름" value={formData.userName} hasButton={!props.isReadOnly} buttonLabel={infoButtonLabel} onEdit={() => setIsEditing(true)} />
        <InfoRow label="생년월일" value={isDobValid ? formData.userDob : null} />
        <InfoRow label="휴대폰 번호" value={isPhoneValid ? formData.userPhone : null} />
        
        {/* ✅ [변경] 아사모 ID -> 국적 표시 */}
        <InfoRow label="국적" value={formData.country} />
        
        {formData.requirements && <InfoRow label="요청사항" value={formData.requirements} />}
      </div>
      
      <div style={dividerStyle} />
      
      <div style={headerStyle}>
        <div style={{ ...iconCircleStyle, backgroundColor: "#8B5CF6" }}><PhoneIcon /></div>
        <div style={headerTitleStyle}>개통 정보</div>
      </div>
      <div style={listStyle}>
        <InfoRow label="할인 유형" value={discountText} />
        <InfoRow label="약정" value={props.contract} />
        <InfoRow label="가입유형" value={props.joinType} />
      </div>
      
      <div style={dividerStyle} />
      
      <div style={headerStyle}>
        <div style={{ ...iconCircleStyle, backgroundColor: "#22C55E" }}><PlanIcon /></div>
        <div style={headerTitleStyle}>요금제 정보</div>
      </div>
      <div style={listStyle}>
        <InfoRow label="이름" value={displayPlan.name} />
        <InfoRow label="데이터" value={displayPlan.data} />
        <InfoRow label="월 금액" value={props.planPrice} />
      </div>
      <div style={warningBoxStyle}>
        <div style={warningIconStyle}>i</div>
        <div style={warningTextStyle}>
          <div style={{ fontWeight: 700, marginBottom: "4px" }}>최소 6개월간 요금제를 유지해주세요.</div>
          <div style={{ color: "#6B7280", fontSize: "13px" }}>6개월 뒤에는 LTE/5G 47,000원 이상 요금제로 변경할 수 있어요.</div>
        </div>
      </div>
      
      <div style={bottomContainerStyle}>
        <button
          style={confirmButtonStyle}
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
          확인했어요
        </button>
      </div>

      {/* 약관 모달 (기존 동일) */}
      {showTerms && (
        <div style={overlayStyle}>
          <div style={modalSheetStyle}>
            <div style={termHeaderContainerStyle} onClick={() => setAgreement(!agreement)}>
              <Checkbox checked={agreement} />
              <span style={termHeaderTitleStyle}>개인정보 수집 및 이용 동의 (필수)</span>
              <div style={termExpandIconStyle} onClick={(e) => { e.stopPropagation(); setIsTermExpanded(!isTermExpanded) }}>
                <ChevronDown style={{ transform: isTermExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
              </div>
            </div>
            {isTermExpanded && (
              <div style={termDetailContainerStyle}>
                <div style={termDescriptionStyle}>
                  1. [필수] 개인정보 수집 이용 동의<br />
                  고객님이 입력한 개인정보는 KT마켓이 수집, 이용 및 처리 위탁 시 본인의 동의를 얻어야 하는 정보입니다.<br />
                </div>
                <div style={termTableStyle}>
                  <div style={termTableRowStyle}>
                    <div style={termTableHeaderStyle}>수집목적</div>
                    <div style={termTableCellStyle}>상품 신청 및 상담, 개통, 배송</div>
                  </div>
                  <div style={{ ...termTableRowStyle, borderBottom: "none" }}>
                    <div style={termTableHeaderStyle}>보유기간</div>
                    <div style={termTableCellStyle}><span style={{ color: "#EF4444", fontWeight: 600 }}>6개월 보관 후 파기</span></div>
                  </div>
                </div>
              </div>
            )}
            <div style={{ marginTop: "30px" }}>
              <button
                style={{ ...confirmButtonStyle, backgroundColor: agreement ? "#4285F4" : "#A0C3FF", cursor: agreement ? "pointer" : "default" }}
                onClick={handleFinalConfirm}
                disabled={isLoading}
              >
                {isLoading ? "처리 중..." : "다음"}
              </button>
            </div>
          </div>
          <div style={overlayBackgroundStyle} onClick={() => !isLoading && setShowTerms(false)} />
        </div>
      )}
    </div>
  )
}

// --- Icons & Sub Components ---
const ChevronLeft = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
const ChevronDown = ({ style }: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><polyline points="6 9 12 15 18 9"></polyline></svg>
const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
const PhoneIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
const PlanIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>

const Checkbox = ({ checked }: { checked: boolean }) => (
  <div style={{ width: "24px", height: "24px", borderRadius: "4px", border: checked ? "none" : "1px solid #D1D5DB", backgroundColor: checked ? "#4285F4" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "12px", flexShrink: 0, transition: "0.2s" }}>
    {checked && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
  </div>
)

const InfoRow = ({ label, value, hasButton = false, onEdit, buttonLabel = "수정" }: any) => (
  <div style={rowStyle}>
    <span style={labelStyle}>{label}</span>
    <div style={valueContainerStyle}>
      <span style={valueStyle}>{value}</span>
      {hasButton && <button style={editButtonStyle} onClick={onEdit}>{buttonLabel}</button>}
    </div>
  </div>
)

const InputGroup = ({ label, value, onChange, onBlur, placeholder, maxLength, error }: any) => (
  <div style={{ marginBottom: "24px" }}>
    <div style={inputLabelStyle}>{label}</div>
    <input style={{ ...inputStyle, border: error ? "1px solid #EF4444" : "1px solid #E5E7EB" }} value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder} maxLength={maxLength} />
    {error && <div style={{ color: "#EF4444", fontSize: "13px", marginTop: "6px" }}>{error}</div>}
  </div>
)

// --- Styles ---
// CSS Animation 설정
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

const animationStyle: React.CSSProperties = { animation: "fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards" }
const containerStyle: React.CSSProperties = { width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#FFFFFF", paddingTop: "20px", paddingLeft: "20px", paddingRight: "20px", minHeight: "400px", position: "relative", boxSizing: "border-box" }
const headerStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }
const editHeaderStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "4px", marginBottom: "30px" }
const backIconStyle: React.CSSProperties = { cursor: "pointer", padding: "8px", marginLeft: "-8px" }
const iconCircleStyle: React.CSSProperties = { width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center" }
const headerTitleStyle: React.CSSProperties = { fontSize: "18px", fontWeight: 700, color: "#1d1d1f" }
const listStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "16px", marginBottom: "10px", paddingLeft: "4px" }
const rowStyle: React.CSSProperties = { display: "flex", alignItems: "flex-start", justifyContent: "space-between" }
const labelStyle: React.CSSProperties = { fontSize: "15px", color: "#86868b", width: "100px", fontWeight: 500, lineHeight: "1.4" }
const valueContainerStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "10px", flex: 1 }
const valueStyle: React.CSSProperties = { fontSize: "15px", fontWeight: 600, color: "#1d1d1f", lineHeight: "1.4" }
const editButtonStyle: React.CSSProperties = { padding: "6px 12px", fontSize: "13px", color: "#4B5563", backgroundColor: "#F3F4F6", border: "none", borderRadius: "6px", cursor: "pointer", marginLeft: "auto" }
const dividerStyle: React.CSSProperties = { width: "100%", height: "1px", backgroundColor: "#E5E7EB", margin: "30px 0" }
const warningBoxStyle: React.CSSProperties = { backgroundColor: "#F3F4F6", borderRadius: "16px", padding: "20px", display: "flex", gap: "12px", marginTop: "20px" }
const warningIconStyle: React.CSSProperties = { width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#4B5563", color: "white", fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "serif", flexShrink: 0, marginTop: "2px" }
const warningTextStyle: React.CSSProperties = { fontSize: "14px", color: "#1d1d1f", lineHeight: "1.5" }
const formContainerStyle: React.CSSProperties = { display: "flex", flexDirection: "column" }
const inputLabelStyle: React.CSSProperties = { fontSize: "13px", color: "#86868b", marginBottom: "8px", fontWeight: 500 }
const inputStyle: React.CSSProperties = { width: "100%", padding: "16px", fontSize: "16px", borderRadius: "12px", border: "1px solid #E5E7EB", backgroundColor: "#FFFFFF", color: "#1d1d1f", outline: "none", boxSizing: "border-box" }
const bottomContainerStyle: React.CSSProperties = { paddingTop: "40px", marginTop: "auto" }
const confirmButtonStyle: React.CSSProperties = { width: "100%", padding: "18px", backgroundColor: "#4285F4", color: "white", fontSize: "17px", fontWeight: 700, border: "none", borderRadius: "14px", cursor: "pointer", boxShadow: "0 4px 10px rgba(66, 133, 244, 0.2)", transition: "background 0.2s" }
const overlayStyle: React.CSSProperties = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end" }
const overlayBackgroundStyle: React.CSSProperties = { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1 }
const modalSheetStyle: React.CSSProperties = { backgroundColor: "#fff", borderTopLeftRadius: "24px", borderTopRightRadius: "24px", padding: "30px 24px 40px 24px", zIndex: 2, boxShadow: "0 -4px 20px rgba(0,0,0,0.1)", position: "relative", maxHeight: "80vh", display: "flex", flexDirection: "column", overflowY: "auto" }
const termHeaderContainerStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", cursor: "pointer" }
const termHeaderTitleStyle: React.CSSProperties = { fontSize: "16px", fontWeight: 700, color: "#1d1d1f", flex: 1 }
const termExpandIconStyle: React.CSSProperties = { padding: "8px", cursor: "pointer" }
const termDetailContainerStyle: React.CSSProperties = { padding: "0 0 20px 0" }
const termDescriptionStyle: React.CSSProperties = { fontSize: "13px", color: "#6B7280", lineHeight: "1.5", marginBottom: "20px" }
const termTableStyle: React.CSSProperties = { border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden" }
const termTableRowStyle: React.CSSProperties = { display: "flex", borderBottom: "1px solid #E5E7EB" }
const termTableHeaderStyle: React.CSSProperties = { width: "100px", backgroundColor: "#F9FAFB", padding: "12px", fontSize: "13px", fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", borderRight: "1px solid #E5E7EB", boxSizing: "border-box" }
const termTableCellStyle: React.CSSProperties = { flex: 1, padding: "12px", fontSize: "13px", color: "#374151", lineHeight: "1.5", backgroundColor: "#FFFFFF", boxSizing: "border-box" }