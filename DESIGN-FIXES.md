# KT Market Global 디자인 개선 프롬프트

> 이 문서는 디자인 리뷰 결과를 바탕으로, 각 개선점을 Claude에게 지시할 수 있도록 세세하게 작성된 프롬프트 목록입니다.
> 각 항목을 복사해서 Claude에게 붙여넣으면 해당 수정이 실행됩니다.

> **2026-04-24 Update:** FINDING-001, 003, 005, 011, 013 are addressed by the UX redesign (see `docs/superpowers/specs/2026-04-24-ux-redesign-design.md`). FINDING-002, 004, 006, 007, 008, 009, 010, 012, 014 remain open — handle in follow-up PRs when touching the affected files.

---

## FINDING-001: 히어로 섹션 정보 과부하 정리

**Impact: HIGH**

```
파일: src/features/phone/components/HeroSection.tsx

히어로 섹션의 정보량을 줄여서 핵심 메시지에 집중하도록 수정해줘.

현재 문제:
- 히어로 한 화면에 트러스트 배지 3개, 통계 카드 3개(No Korean card, Zero deposit, 88 handled), CTA 2개, 상담 카운터 카드, ARC 이미지, assurance 카드 3개가 전부 들어있음
- 사용자가 어디를 먼저 봐야 하는지 판단하기 어려움

수정 방향:
1. 히어로에는 다음만 남겨:
   - 트러스트 배지 3개 (badge_official, badge_postpaid, badge_specialist) - 이건 유지
   - H1 타이틀 + 서브타이틀 - 이건 유지
   - CTA 2개 (Shop Phones / Check Eligibility) - 이건 유지
   - ARC 이미지 (오른쪽 컬럼) - 이건 유지

2. 히어로에서 제거하고 ConversionHighlights 섹션으로 이동할 요소:
   - 통계 카드 3개 (stat1_label/value, stat2_label/value, stat3_label/value) → 현재 106~140번 줄의 rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.06)] 전체 div
   - 상담 카운터 카드 (consultation_label/value/desc) → 현재 168~178번 줄의 rounded-2xl border border-white/10 div
   - trust_line, desc 텍스트도 함께 제거

3. 오른쪽 컬럼에서 제거할 요소:
   - 왼쪽 상단에 숨겨진 패널 (panel_eyebrow, panel_title, panel_desc) → 185~191번 줄의 absolute -left-2 top-5 hidden md:block div
   - assurance 카드 3개 (assurance1~3) → 205~220번 줄의 mt-4 grid gap-3 div

4. ARC 이미지는 유지하되 감싸는 컨테이너를 더 심플하게:
   - 현재 rounded-[36px] border border-white/10 bg-[rgba(255,255,255,0.06)] 유지
   - 이미지 아래 assurance 카드만 제거

수정하지 말 것:
- 번역 키(t('...')는 삭제하되 messages 파일의 키 자체는 건드리지 마
- 그라데이션 배경, 그리드 패턴 오버레이, radial gradient는 유지
- 하단 "No Hidden Conditions" 배지 유지

결과: 히어로가 "헤드라인 + CTA + 이미지" 3요소로 깔끔하게 정리되어야 함
```

---

## FINDING-002: "Shop Phones With KT Plan Benefits" 제목 중복 제거

**Impact: HIGH**

```
파일 2개 수정:
1. src/app/[locale]/(mobile)/page.tsx (71~82번 줄)
2. src/features/phone/components/ModelListClient.tsx (71~73번 줄)

현재 문제:
- page.tsx의 products-section에서 <h2>로 t('Phone.ModelList.section_title') 출력 (76번 줄)
- ModelListClient.tsx 내부에서도 <h2>로 sectionTitle || t('Phone.ModelList.section_title') 출력 (71번 줄)
- 결과: 같은 텍스트 "Shop Phones With KT Plan Benefits"가 연속 2번 표시됨

수정 방법:
1. page.tsx에서 sectionTitle="" (빈 문자열)로 이미 전달하고 있으니,
   ModelListClient.tsx 71~73번 줄에서 sectionTitle이 빈 문자열이면 h2를 렌더링하지 않도록 수정:

   변경 전:
   <h2 className="text-[26px] font-bold text-label-900 m-0 mb-4">
     {sectionTitle || t('Phone.ModelList.section_title')}
   </h2>

   변경 후:
   {sectionTitle && (
     <h2 className="text-[26px] font-bold text-label-900 m-0 mb-4">
       {sectionTitle}
     </h2>
   )}

2. page.tsx의 eyebrow + h2 + description (72~81번 줄)은 그대로 유지
   → 이 부분이 섹션의 공식 타이틀 역할을 함

결과: "Shop Phones With KT Plan Benefits"가 한 번만 표시됨
```

---

## FINDING-003: 한국어 헤드라인 줄바꿈 개선

**Impact: HIGH**

```
파일: src/app/globals.css

현재 문제:
- 모바일(375px)에서 한국어 "한국 거주 외국인을 위한" 텍스트가 "위" 한 글자만 다음 줄로 떨어짐
- 의미 단위 줄바꿈이 되지 않아 가독성 저하

수정 1 - globals.css에 한국어 줄바꿈 규칙 추가:
@layer base 또는 기존 html 설정 근처에 다음 추가:

[lang="ko"] h1,
[lang="ko"] h2,
[lang="ko"] h3 {
  word-break: keep-all;
  overflow-wrap: break-word;
  text-wrap: balance;
}

수정 2 - 영어/일본어/중국어에도 text-wrap: balance 적용:
h1, h2, h3 {
  text-wrap: balance;
}

수정 3 - HeroSection.tsx의 h1 태그(92~101번 줄)에 직접 스타일 추가:
h1 className에 추가: "break-keep" (Tailwind 4는 break-keep 지원)
또는 style에 추가: wordBreak: 'keep-all', textWrap: 'balance'

세 가지 중 globals.css에 넣는 수정 1이 가장 좋음 (전역 적용)
```

---

## FINDING-004: 푸터 터치 타겟 44px 확보

**Impact: HIGH**

```
파일: src/shared/components/layout/Footer.tsx

현재 문제:
- 상단 정책 링크들 (Privacy Policy, Usage History 등) 26~33번 줄: text-sm만 있고 패딩 없음 → 높이 약 20px
- 하단 Terms/Privacy 링크 156~161번 줄: text-[13px]에 패딩 없음 → 높이 약 17px
- 모바일에서 손가락으로 탭하기 어려움

수정 1 - 상단 정책 링크 (26~33번 줄):
변경 전:
<Link href="/company" className="hover:text-black hover:underline">

변경 후:
<Link href="/company" className="hover:text-black hover:underline py-3 px-1">

각 Link 태그 4개 모두에 py-3 px-1 추가
→ 이렇게 하면 터치 영역이 약 44px 확보됨

수정 2 - 하단 Terms/Privacy 링크 (155~162번 줄):
변경 전:
<div className="flex gap-6 text-[13px]">
  <Link href="/company" className="text-[#888] hover:text-white transition-colors">
  <Link href="/company" className="font-bold text-[#b0b0b0] hover:text-white transition-colors">

변경 후:
<div className="flex gap-4 text-[13px]">
  <Link href="/company" className="text-[#888] hover:text-white transition-colors py-3">
  <Link href="/company" className="font-bold text-[#b0b0b0] hover:text-white transition-colors py-3">

각 Link에 py-3 추가

수정 3 - 채널 버튼 (38~49번 줄):
현재 YouTube/Kakao 버튼은 px-4 py-2 → 높이 약 38px
py-2를 py-2.5로 변경하면 44px 확보
```

---

## FINDING-005: 헤딩 계층 구조 정리

**Impact: HIGH**

```
파일 3개 수정:
1. src/features/phone/components/HeroSection.tsx
2. src/features/phone/components/ConversionHighlights.tsx
3. src/features/phone/components/ModelListClient.tsx

현재 문제:
- H1(48px) → H3(18px) 바로 점프 (H2 건너뜀) - HeroSection 189번 줄
- H2가 페이지 중간에서 30px, 26px 등 다양한 크기로 나옴
- H3이 16px~24px까지 제각각

수정 원칙: 페이지당 H1 1개, 그 아래 H2 → H3 순서 유지

수정 1 - HeroSection.tsx:
- 189번 줄: <h3> → 제거 (FINDING-001에서 이 패널 자체가 제거됨)
- 227번 줄의 "No Hidden Conditions"은 heading이 아니므로 유지

수정 2 - ConversionHighlights.tsx:
- 31번 줄: <h2> 유지 (섹션 메인 타이틀)
- 63번 줄: <h3> 유지 (하위 항목 타이틀)
- 81번 줄: <h3> → <h2>로 변경 (오른쪽 다크 섹션의 메인 타이틀도 같은 레벨)
  또는 디자인적으로 h3이 맞다면 유지하되 폰트 크기를 h2(22px)과 명확히 구분
- 92번 줄: <h4> 유지 (스텝 내부 타이틀)

수정 3 - ModelListClient.tsx:
- 71번 줄: <h2> → FINDING-002에서 조건부 렌더링으로 변경됨
- 85번 줄: <h3> 유지 ("Please select a model")

수정 4 - page.tsx:
- 76번 줄: <h2> 유지 (products section 타이틀)
- 98번 줄: <h2> 유지 (eligibility section 타이틀)

최종 계층:
H1: "Mobile Service for Foreigners in Korea" (히어로)
  H2: "What you can check before you apply" (ConversionHighlights 왼쪽)
  H2: "A simple path from check to application" (ConversionHighlights 오른쪽)
  H2: "Shop Phones With KT Plan Benefits" (상품 섹션)
    H3: "Please select a model" (필터 영역)
  H2: "KT Market Checklist" (자격 확인)
```

---

## FINDING-006: ConversionHighlights 정보 밀도 개선

**Impact: MEDIUM**

```
파일: src/features/phone/components/ConversionHighlights.tsx

현재 문제:
- 왼쪽 카드: 통계 3개 + 하이라이트 4개 = 7개 정보
- 오른쪽 카드: 스텝 3개
- 한 섹션에 총 10개 정보 블록이 들어있어 시선 분산

수정 방향:
1. 왼쪽 카드의 통계 3개(38~48번 줄)와 하이라이트 4개(51~72번 줄) 중 택1:
   - FINDING-001에서 히어로에서 내려온 통계 카드가 있다면 여기에 통합
   - 하이라이트 4개는 유지하되, 아이콘+제목만 표시하고 설명(desc)은 제거하여 밀도 낮추기

2. 구체적 수정 - 하이라이트 카드 설명 숨기기:
   66~68번 줄 변경:
   변경 전:
   <p className="text-xs leading-5 text-[#6b7280] md:text-sm">
     {t(`${key}.desc`)}
   </p>

   변경 후:
   <p className="text-xs leading-5 text-[#6b7280] md:text-sm hidden md:block">
     {t(`${key}.desc`)}
   </p>

   → 모바일에서는 아이콘+제목만 보이고, 데스크탑에서만 설명이 보임

3. 통계 카드 3개(38~48번 줄)도 동일하게:
   모바일에서는 숫자만 크게 보이도록 label을 축소
   41번 줄: text-[11px] → text-[10px]
   44번 줄: text-lg → text-xl (숫자를 더 강조)

결과: 모바일에서 정보 밀도가 40% 줄어들어 스캔이 편해짐
```

---

## FINDING-007: Company 페이지 디자인 통일

**Impact: MEDIUM**

```
파일: src/app/[locale]/(mobile)/company/page.tsx

현재 문제:
- 홈페이지: 다크 히어로, 그라데이션, glassmorphic 카드
- Company 페이지: 흰 배경에 텍스트만 나열, 같은 사이트인지 의문

수정 방향:
1. Company 페이지 상단에 홈페이지와 동일한 다크 히어로 스타일 적용:
   - 배경: linear-gradient(90deg, #111C2E 0%, #0A2850 100%)
   - 동일한 그리드 패턴 오버레이
   - H1 "KT Official Partner Platform, Global KT Market" → 흰색 텍스트
   - 서브타이틀도 흰색/반투명

2. "Company Information" 카드:
   - 현재: 단순 회색 배경 카드
   - 변경: rounded-[32px] border border-grey-200 bg-white p-6 shadow-card (홈페이지 카드 스타일과 통일)

3. "Business Areas" 카드도 동일 스타일:
   - rounded-[24px] border 적용
   - 호버 시 약간의 elevation 효과

4. 전체 레이아웃:
   - max-w-layout-max mx-auto 적용 (홈페이지와 동일한 최대 너비)
   - 섹션 간 간격: py-14 md:py-20 (globals.css의 --spacing-section-gap 활용)

5. 타이포그래피:
   - 본문 텍스트에 text-body1 또는 text-body2 유틸리티 클래스 사용
   - "Our Values" 등 서브헤딩에 text-h2 클래스 적용
```

---

## FINDING-008: CTA 버튼 우선순위 재정렬

**Impact: MEDIUM**

```
파일: src/features/phone/components/HeroSection.tsx (142~167번 줄)

현재 문제:
- "Shop Phones and Plans" (빨강 그라데이션)이 시각적으로 가장 강하지만
- 실제 사용자 여정은 "자격 확인" → "폰 선택" 순서임
- 첫 방문 외국인은 먼저 자신이 가입 가능한지 확인해야 함

수정 방향 (2가지 옵션 중 선택):

옵션 A - 순서 교체:
142번 줄부터의 flex 컨테이너 안에서:
1. "Check Eligibility Now" 링크를 첫 번째로 올리고 빨강 그라데이션 스타일 적용
2. "Shop Phones and Plans" 링크를 두 번째로 내리고 bordered 스타일 적용

옵션 B - 레이블 개선 (순서 유지):
1. CTA 텍스트를 사용자 여정에 맞게 변경:
   - 메인 CTA: "Check If You Can Apply" (자격 확인이 우선)
   - 서브 CTA: "Browse Phones & Plans"
2. 번역 키 수정 필요: cta_subscription, cta_check

추천: 옵션 A
변경할 코드:
- 159~166번 줄의 <a href="#eligibility-section"> 블록을 143~157번 줄의 <a href="#products-section"> 블록 앞으로 이동
- 이동된 eligibility 링크에 그라데이션 스타일 적용
- 이동된 products 링크에 bordered 스타일 적용
- 스타일(className과 style)을 서로 교체
```

---

## FINDING-009: 로고 이미지 경고 수정

**Impact: MEDIUM**

```
파일: src/shared/components/layout/Header.tsx (23번 줄 근처)

현재 콘솔 경고:
"Image with src '/images/logo.svg' has either width or height modified, but not the other"

현재 코드:
<Image
  src="/images/logo.svg"
  alt="KT Market Global"
  width={80}
  height={60}
/>

수정:
<Image
  src="/images/logo.svg"
  alt="KT Market Global"
  width={80}
  height={60}
  className="h-auto"
  style={{ width: 'auto' }}
/>

또는 CSS에서 크기를 제어한다면:
<Image
  src="/images/logo.svg"
  alt="KT Market Global"
  width={80}
  height={60}
  className="h-[30px] w-auto"
/>

Footer.tsx 64~67번 줄의 로고도 동일하게 수정:
<Image
  src="/images/logo.svg"
  alt="KT Market Global"
  width={100}
  height={30}
  className="h-6 w-auto"
  style={{ height: 'auto' }}
/>
→ 이미 className에 h-6 w-auto가 있으므로 style에 height를 명시적으로 추가
```

---

## FINDING-010: 폰트 로딩 최적화

**Impact: MEDIUM**

```
파일: src/app/[locale]/layout.tsx

현재 상태:
- Pretendard (로컬 폰트) + Inter (Google 폰트) 사용
- 폰트 스택: var(--font-inter), Pretendard, var(--font-pretendard), -apple-system, system-ui...

확인 필요:
1. layout.tsx에서 Pretendard 로컬 폰트 선언에 display 옵션이 있는지 확인
   없으면 추가:
   const pretendard = localFont({
     src: '../fonts/PretendardVariable.woff2',
     weight: "45 920",
     variable: '--font-pretendard',
     display: 'swap',        // ← 추가
     preload: true,           // ← 추가
   })

2. Inter 폰트도 확인:
   const inter = Inter({
     subsets: ['latin'],
     weight: ['400', '500', '600', '700'],
     variable: '--font-inter',
     display: 'swap',         // ← 이미 있을 수 있음, 없으면 추가
   })

3. 한국어 페이지에서는 Pretendard가 메인 폰트이므로,
   globals.css의 --font-sans 순서를 로케일에 따라 변경하는 것도 고려:
   - 영어: Inter → Pretendard 순서 (현재)
   - 한국어: Pretendard → Inter 순서

   이건 tailwind.config.ts의 lang-ko variant로 처리 가능:
   [lang="ko"] body {
     font-family: 'Pretendard', var(--font-pretendard), var(--font-inter), sans-serif;
   }
```

---

## FINDING-011: AI Slop 패턴 개선

**Impact: POLISH**

```
파일: src/features/phone/components/ConversionHighlights.tsx

현재 AI 슬롭 패턴:
1. 아이콘 + 컬러 원형 배경 (60번 줄: h-11 w-11 rounded-2xl bg-[#edf4ff])
2. 3열 통계 그리드 (38~48번 줄: grid-cols-3)
3. 4개 하이라이트 카드가 대칭 2x2 그리드 (51번 줄: grid-cols-2)

수정 방향 - 비대칭 레이아웃으로 전환:

수정 1 - 아이콘 스타일 변경:
60번 줄 변경:
변경 전:
<div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#0055d4]">

변경 후:
<div className="mb-3 flex items-center text-[#0055d4]">

→ 배경 원형 제거, 아이콘만 표시 (더 미니멀하고 덜 AI스러움)

수정 2 - 하이라이트 카드 레이아웃:
51번 줄 변경:
변경 전:
<div className="grid gap-3 md:grid-cols-2">

변경 후:
<div className="space-y-3">

→ 2열 그리드 대신 수직 스택으로 변경
→ 또는 첫 번째 카드만 전체 너비, 나머지 2열로:
<div className="grid gap-3 md:grid-cols-2">
  <div className="md:col-span-2"> ← 첫 번째 카드에 추가

수정 3 - 오른쪽 다크 섹션 스텝 번호:
89번 줄 변경:
변경 전:
<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-[#111827]">
  {index + 1}
</div>

변경 후:
<span className="text-xs font-bold text-white/40 tracking-wider">
  STEP {index + 1}
</span>

→ 원형 번호 배지 대신 텍스트 라벨로 변경 (덜 AI스러움)
```

---

## FINDING-012: 상품 카드 클릭 피드백 개선

**Impact: POLISH**

```
파일: src/shared/components/ui/GongguDealCard.tsx

현재 상태:
- 카드에 hover 시 그라데이션 보더 효과 있음 (group-hover:opacity-100)
- 하지만 모바일에서는 hover가 없으므로 클릭 가능 여부 불명확

수정 1 - 카드에 시각적 어포던스 추가:
카드 하단에 "자세히 보기 →" 또는 화살표 아이콘 추가

GongguDealCard return문 내부, 가격 표시 아래에 추가:
<div className="mt-3 pt-3 border-t border-grey-100 flex items-center justify-between">
  <span className="text-xs text-primary font-medium">
    {t('Phone.ModelList.view_detail') || '자세히 보기'}
  </span>
  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
</div>

수정 2 - 카드 wrapper에 active 상태 추가:
현재 group className이 있는 최상위 div에 추가:
active:scale-[0.98] transition-transform

수정 3 - cursor 명시:
카드 wrapper에 cursor-pointer 추가 (이미 있을 수 있으니 확인)
```

---

## FINDING-013: Eligibility Checker 섹션 시인성 강화

**Impact: POLISH**

```
파일: src/app/[locale]/(mobile)/page.tsx (89~107번 줄)

현재 상태:
- bg-base (기본 배경)에 border-y border-grey-200로 위아래 선만 있음
- 페이지 스크롤 중 이 중요한 기능 섹션이 다른 섹션과 시각적으로 구분이 약함

수정 방향:
91번 줄 변경:
변경 전:
className="border-y border-grey-200 bg-base px-4 py-14 md:px-12 md:py-20"

변경 후:
className="bg-[#f4f8fc] px-4 py-14 md:px-12 md:py-20"

→ ConversionHighlights와 동일한 연한 파란 배경 사용
→ 또는 히어로와 유사한 다크 스타일:
className="bg-[#0f172a] px-4 py-14 md:px-12 md:py-20 text-white"

다크 스타일 선택 시 내부 텍스트 색상도 변경 필요:
- 96번 줄: text-primary → text-[#7dd3fc] (다크 배경 위 밝은 블루)
- 98번 줄: text-grey-900 → text-white
- 101번 줄: text-grey-700 → text-white/70

추천: 연한 파란 배경 (bg-[#f4f8fc]) - 기존 디자인 시스템과 통일
```

---

## FINDING-014: 가격 표시 tabular-nums 적용

**Impact: POLISH**

```
파일: src/app/globals.css

숫자가 포함된 가격 텍스트에 tabular-nums를 적용하면
가격 비교 시 숫자가 깔끔하게 정렬됨

수정 - globals.css에 추가:

/* 가격/숫자 정렬을 위한 tabular-nums */
@utility tabular-nums {
  font-variant-numeric: tabular-nums;
}

그리고 GongguDealCard.tsx에서 가격 표시 부분에 적용:
파일: src/shared/components/ui/GongguDealCard.tsx

가격이 표시되는 모든 텍스트 요소의 className에 "tabular-nums" 추가

예시 - 판매가 표시 부분:
변경 전: className="text-[20px] font-bold"
변경 후: className="text-[20px] font-bold tabular-nums"

할인액, 원래 가격 등 모든 숫자 표시에 동일하게 적용
```

---

## 적용 순서 추천

1. **Quick Wins 먼저** (5~10분):
   - FINDING-002 (중복 제목 제거)
   - FINDING-003 (한국어 줄바꿈)
   - FINDING-009 (로고 경고)
   - FINDING-014 (tabular-nums)

2. **HIGH Impact** (30분~1시간):
   - FINDING-001 (히어로 정보 정리)
   - FINDING-004 (터치 타겟)
   - FINDING-005 (헤딩 계층)

3. **MEDIUM Impact** (1~2시간):
   - FINDING-008 (CTA 우선순위)
   - FINDING-006 (ConversionHighlights 밀도)
   - FINDING-007 (Company 페이지)
   - FINDING-010 (폰트 로딩)

4. **Polish** (선택):
   - FINDING-011 (AI 슬롭)
   - FINDING-012 (카드 피드백)
   - FINDING-013 (Eligibility 시인성)
