# global.ktmarket.co.kr UX 개편 — Design Spec

- **Date:** 2026-04-24
- **Scope (1차):** 홈(/) 재구성 · 기기 상세(/phone) 재구성 · 신뢰 요소 전역 도입
- **Out of scope:** 주문/결과(`/phone/order`, `/phone/result`), 회사소개(`/company`), 문의(`/inquiry`), 정책(`/policy`), 어드민(`/admin/*`), 상품 리스트 카드 내부(`GongguDealCard`), Supabase 스키마
- **관련 문서:** `DESIGN-FIXES.md` (레포 루트) — 기존 디자인 리뷰 findings(FINDING-001~014). 이 스펙은 그중 FINDING-001·003·005·013·014를 흡수하고, 002·004·006~012는 구현 PR에서 기회가 있을 때 곁들여 처리한다.

---

## 1. 배경 & 목표

현재 사이트(Next.js + next-intl 4개 로케일 + Supabase)는 한국 내수용 `ktmarket.co.kr` 구조를 번역해 가져온 상태여서, 외국인 타겟에 맞는 신뢰 서사와 시각적 계층이 부족하다. 1순위 사용자 불안은 **"이게 진짜 KT 공식인가?"(사기/피싱 우려)** 로 확인됐으며, 이를 해소하는 데 디자인의 무게중심을 둔다.

Framer 참조(`/Users/mike/Documents/GitHub/KT-Market/framer/phone/*`)의 컴포넌트 구조(ProductImageCarousel, OrderSummaryCard, WhyCheapCard, ReviewCard, ConsultationBar, ProcessStepsCard 등)를 **구조 설계도로만** 차용하고, 시각 톤과 정보 밀도는 다국어·외국인 사용자에 맞춰 재해석한다.

### 성공 기준

1. 홈 첫 화면(above the fold)에서 "KT 공식 파트너" 신호가 3초 안에 인식된다.
2. 기기 상세에서 의사결정에 필요한 정보(가격 근거, 요금제, 타인 증거, 자주 묻는 질문)가 한 페이지에서 스크롤로 완결된다.
3. 4개 로케일(en/ja/zh/ko) 모두 360px 모바일에서 줄바꿈 깨짐 없이 렌더링.
4. 터치 타겟 ≥44px, heading 계층(H1→H2→H3) 규칙 준수.
5. `/phone/order`, 기존 Supabase·가격 계산 로직 회귀 0건.

---

## 2. 디자인 원칙

- **구조만 차용, 톤은 재해석.** Framer의 한글 밀도 UI를 그대로 포팅하지 않는다. 영어 헤드라인 기준 여백·정보 밀도로 재조정.
- **공식성 선점.** PartnerRibbon · TrustStatsStrip · PartnerLogoGrid 를 홈 첫 1/3 안에 배치.
- **투명성 > 과시.** WhyCheapCard 로 가격 근거를 드러내고, 과장된 마케팅 카드를 제거한다.
- **한 페이지 완결 기기 상세.** Step 분기를 없애고 Sticky CTA 로 전환을 받친다.
- **모바일 우선.** (mobile) 라우트 그룹 기준 375px에서 완성, 데스크탑(md+)은 max-w-940 가운데 정렬로 단순화.
- **DB 변경 없음.** 신뢰/리뷰/FAQ 콘텐츠는 전부 i18n JSON. 후속 스펙에서 DB 이관 가능.

---

## 3. 범위 외 명시

| 영역 | 후속 스펙 |
|---|---|
| `/phone/order` · `/phone/result` UX | 별도 스펙 |
| `/company` 디자인 통일 (FINDING-007) | 별도 스펙 |
| Supabase `reviews` 테이블 + 어드민 입력 폼 | 별도 스펙 |
| 실시간 누적 가입자 집계 | 별도 스펙 |
| 오프라인 매장 실존 증거 블록 | 별도 스펙 |
| Framer PhoneCatalogPage 수준의 카탈로그 필터 | 별도 스펙 |

---

## 4. 컴포넌트 경계

### 4.1 새로 만들 공용 컴포넌트 (`src/shared/components/ui/`)

| 컴포넌트 | 단일 책임 | 사용처 |
|---|---|---|
| `PartnerRibbon` | 헤더 바로 아래 24px 높이 공식성 배너 | mobile layout (전역) |
| `ReviewCardList` | 외국인 리뷰 가로 스와이프 컨테이너. `filterModel?` 프롭으로 기기 상세에서 같은 모델만 필터 | 홈, 기기 상세 |
| `ReviewCard` | 리뷰 1장 (사진·국적·평점·본문·모델) | ReviewCardList 내부 |
| `WhyCheapCard` | "왜 저렴한가" 접힘/펼침 카드 (3개 항목 breakdown) | 기기 상세 |
| `FAQAccordion` | i18n 기반 Q/A 아코디언, URL hash 앵커 지원 | 홈, 기기 상세 |
| `ConsultationBar` | 모바일 하단 고정 상담 바 (Kakao/WhatsApp/Call) | mobile layout (전역, pathname 기반 숨김) |
| `PartnerLogoGrid` | KT·Samsung·Apple·KakaoPay·TTA 로고 그리드 | 홈 |
| `TrustStatsStrip` | "88,000+ helped / 4 langs / 0 KRW deposit" 스트립 | 홈 |

### 4.2 재구성할 기존 컴포넌트 (`src/features/phone/components/`)

| 파일 | 변경 |
|---|---|
| `HeroSection.tsx` | 내부 **stat 카드 3개**(`No Korean` / `Zero deposit` / `88 handled`) 제거, ARC 이미지 제거, 우측 panel 제거 → 헤드라인 + **트러스트 배지 3개**(`badge_official` / `badge_postpaid` / `badge_specialist`, 유지) + CTA 2개 + 폰 이미지 (또는 ARC 유지 대체) |
| `ConversionHighlights.tsx` | 좌측 통계 3개 제거, 하이라이트 4→3 축약, 우측 3-step 유지 |
| `PhoneDetailClient.tsx` | step 1/2 분리 제거 → 단일 스크롤. "Purchase Ready" 박스 + highlight 3개 삭제. Modal 기반 옵션을 인라인 pills로. `WhyCheapCard` · `ReviewCardList` · `FAQAccordion` 추가. Sticky CTA 유지 |
| `ModelListClient.tsx` | 헤더/필터 유지, 카드 내부는 건드리지 않음 |

### 4.3 의존 관계

```
Layout (mobile)
├── PartnerRibbon        ─ i18n(Home.Trust.ribbon)
├── Header
├── <page content>
├── ConsultationBar      ─ i18n(Consultation), pathname 기반 숨김
└── Footer

Home (/)
├── HeroSection (리팩)
├── TrustStatsStrip
├── ReviewCardList       ─ ReviewCard[]
├── ModelListContainer   (유지)
├── ConversionHighlights (축약)
├── FAQAccordion
└── PartnerLogoGrid

PhoneDetail (/phone)
├── ProductImageCarousel (신규, Framer 참고)
├── Title + Price block
├── OptionPills (인라인, 모달 제거)
├── WhyCheapCard
├── JoinTypeSelector     (유지)
├── PlanSelector         (유지)
├── ReviewCardList (filterModel)
├── FAQAccordion (phone-specific)
└── StickyBar            (유지)
```

---

## 5. 데이터 & i18n 설계

### 5.1 i18n 추가 블록 (`src/messages/{en,ja,zh,ko}.json`)

```
Home.Trust
  ribbon                 "★ Official KT Partner · Licensed Since 2018 · Biz No. 123-45-67890"
  stats.helped_label     "Foreigners helped"
  stats.helped_value     "88,000+"
  stats.langs_label      "Languages"
  stats.langs_value      "4 (EN·JA·ZH·KO)"
  stats.deposit_label    "Deposit required"
  stats.deposit_value    "0 KRW"
  partners_alt.*         "KT", "Samsung", "Apple", "KakaoPay", "TTA"

Home.Reviews
  title                  "Real reviews from foreigners"
  subtitle               "Verified customers who signed up through us"
  items[]                # 8~12개
    id, name, country_code, country_label, rating, model, date, body

Home.FAQ
  title                  "Frequently asked questions"
  items[]                # 6~8개
    q, a

Phone.WhyCheap
  title                  "Why is it this cheap?"
  subtitle               "Full breakdown — nothing hidden"
  items[3]               # label, value, note

Phone.FAQ
  title                  "Questions about this phone"
  items[]                # 3~4개
    q, a

Consultation
  kakao_url, whatsapp_url, call_tel, hours, cta_label
```

번역은 en 기준으로 먼저, 나머지 로케일은 1차 PR에서 en 복사 + `TODO` 태그, 4차 PR에서 마감.

### 5.2 타입 (`src/features/home/types.ts` 신규 또는 `src/shared/types` 로 통합)

```ts
export interface Review {
  id: string;
  name: string;
  countryCode: string;   // ISO 3166-1 alpha-2
  countryLabel: string;
  rating: 1 | 2 | 3 | 4 | 5;
  model: string;
  date: string;          // ISO
  body: string;
}

export interface FAQItem { q: string; a: string; }
export interface TrustStat { label: string; value: string; }
export interface WhyCheapItem { label: string; value: string; note: string; }
```

### 5.3 데이터 플로우

| 컴포넌트 | 소스 | 렌더 |
|---|---|---|
| `PartnerRibbon` | `t('Home.Trust.ribbon')` | Server |
| `TrustStatsStrip` | `t.raw('Home.Trust.stats')` | Server |
| `ReviewCardList` | `t.raw('Home.Reviews.items')` | Server → Client(swipe) |
| `FAQAccordion` | `t.raw('Home.FAQ.items')` | Client |
| `WhyCheapCard` | `t.raw('Phone.WhyCheap.items')` | Client |
| `ConsultationBar` | `t.raw('Consultation')` | Client |
| `PartnerLogoGrid` | 정적 `/images/partners/*` + `t('Home.Trust.partners_alt.*')` | Server |

### 5.4 이미지 자산

- `/public/images/partners/` — `kt.svg`, `samsung.svg`, `apple.svg`, `kakaopay.svg`, `tta.svg`
- `/public/images/reviews/{id}.webp` — 선택. 없을 시 이니셜 아바타 fallback
- `/public/images/hero-phones.webp` — Hero 우측 교체용. 확보 안 되면 현재 ARC 이미지 유지 (Phase 4 이미지 PR에서 결정)

### 5.5 DB 변경

**없음.** 모든 콘텐츠는 i18n JSON. 후속 스펙에서 `reviews` 테이블 도입 시 훅만 교체하면 되는 구조.

---

## 6. 레이아웃 상세

### 6.1 디자인 토큰

```
color
  navy-900    #111C2E     Hero gradient 시작
  navy-700    #0A2850     Hero gradient 끝 · 리본 배경
  kt-blue     #0055D4     primary CTA 액센트
  trust-ink   #7DD3FC     Hero 위 KT 텍스트
  accent-red  #FF5A3C     가격/핵심 CTA
  paper       #FFFFFF
  paper-blue  #F4F8FC     섹션 교대 배경
  text-900    #111827
  text-600    #4B5563
  text-400    #9CA3AF
radius
  card-sm 16  card 20  card-lg 28  pill 999
shadow
  card     0 10px 30px rgba(17,28,46,.06)
  card-hi  0 20px 50px rgba(17,28,46,.12)
font-size
  hero-title 32/40    section-title 22/28    body 14/22    label 11/14
spacing
  section-y-mobile 56    section-y-desktop 80    layout-max 940
```

기존 `tailwind.config.ts` / `globals.css` 와 충돌 없이 파생값만 추가한다.

### 6.2 Home (/)

순서:
1. **PartnerRibbon** — navy-700, 24px, 중앙정렬, 11px, 1줄. 375px에서는 "★ Official KT Partner" 만 (md: 이상은 full).
2. **HeroSection (리팩)** — 배경 그라데이션/그리드 overlay 유지. 좌측: 트러스트 배지 3개(`badge_official`/`badge_postpaid`/`badge_specialist`, 기존 요소 유지) → H1 → subtitle → CTA 2개 (주=Check Eligibility 빨강, 부=Shop Phones 보더). 내부 stat 카드 3개(`No Korean`/`Zero deposit`/`88 handled`)는 제거하고 그 내용은 `TrustStatsStrip`(섹션 3)으로 이동. 우측: hero-phones.webp 또는 현재 ARC 유지. 하단 "No Hidden Conditions" 배지 유지.
3. **TrustStatsStrip** — 배경 paper-blue, py-24. 3-cell flex, big number + uppercase label.
4. **ReviewCardList** — 배경 paper, py-56/80. 헤더(eyebrow "★★★★★ 4.9/5 · 1,200+ reviews" + h2 + subtitle) + 가로 overflow-x-auto snap-x, 카드 280px, gap 12.
5. **ModelListContainer** — 배경 paper-blue, 기존 컴포넌트 유지.
6. **ConversionHighlights (축약)** — 좌측 통계 제거, 하이라이트 4→3, 우측 3-step 유지.
7. **FAQAccordion** — 배경 paper, max-w 720, h2 + items.
8. **PartnerLogoGrid** — 배경 paper-blue, grid-cols-3 md:grid-cols-5, height 28px, grayscale.
9. **Footer** — 기존.
10. **ConsultationBar** — mobile-only, fixed bottom-0.

기존 `EligibilityCheckerWrapper` 섹션은 제거하고, 동일 기능을 FAQ + Hero CTA(`#eligibility` 앵커) 로 흡수 (FINDING-013 반영).

### 6.3 Phone Detail (/phone) — 단일 스크롤

```
ProductImageCarousel
Title + Capacity pill + 원가 line-through + 할인가 (accent-red)
"-560,000 KRW discount applied" (status-correct)
OptionPills (inline: colors 가로스크롤, capacity pill row)
WhyCheapCard (접힘 default)
JoinTypeSelector (유지)
PlanSelector (유지)
ReviewCardList (filterModel=현재 모델)
FAQAccordion (phone-specific items)
─ StickyBar (최종가 + Apply Now, 유지)
```

제거: step 1/2 분리, "Purchase Ready" 박스, highlight 3개, pricing_eyebrow 박스, Modal 기반 OptionSelector.

데스크탑(md+): 2-column 유지 (좌측 이미지 sticky, 우측 스크롤 가능한 옵션/요금제/리뷰/FAQ). Sticky CTA 는 모바일 전용.

### 6.4 접근성/성능

- 모든 터치 타겟 ≥44px (FAQ 버튼, ConsultationBar 버튼, PartnerRibbon 링크, OptionPills).
- `break-keep` + `text-wrap: balance` 를 h1/h2/h3에 전역 (globals.css).
- 이미지 `priority`는 Hero 폰 이미지만, 나머지 `loading="lazy"`.
- `font-variant-numeric: tabular-nums` 를 가격 표시 전역 유틸로 추가 (FINDING-014).
- heading 계층: 페이지당 H1 1개, H2 → H3 순서 (FINDING-005).
- 한국어 자동 줄바꿈 규칙 전역 적용 (FINDING-003).

---

## 7. 에러 처리 · 엣지 케이스

### 7.1 컴포넌트별 실패 모드

| 컴포넌트 | 실패 | 처리 |
|---|---|---|
| `PartnerRibbon` | i18n 키 누락 | `t.has` 체크, null 반환 |
| `TrustStatsStrip` | stats 일부 누락 | 셀 단위 skip, 0개면 섹션 전체 skip |
| `ReviewCardList` | items 비어있음 | 섹션 전체 skip |
| `ReviewCardList` | items.length < 3 | 스와이프 대신 flex grid |
| `ReviewCard` | 이미지 404 | 이니셜 아바타 (bg 5가지 palette 로테이션) |
| `FAQAccordion` | items 비어있음 | 섹션 전체 skip |
| `WhyCheapCard` | items 비어있음 | 섹션 전체 skip |
| `PartnerLogoGrid` | 로고 404 | 텍스트 브랜드명 fallback |
| `ConsultationBar` | 특정 URL 누락 | 해당 버튼만 숨김. 3개 모두 누락이면 바 숨김 |
| `ProductImageCarousel` | imageUrls 비어있음 | 중립 placeholder, 컨트롤 숨김 |
| `PhoneDetailClient` | device 404 | 현재 동작 유지 + 홈 링크 추가 |
| `PhoneDetailClient` | 모든 변형 품절 | OptionPills에 "All variants sold out" 배너, StickyBar 비활성 |

### 7.2 엣지 케이스

1. **ConsultationBar ↔ StickyBar 충돌** — `ConsultationBar`에서 `usePathname()`으로 `/phone` 계열 경로에선 `return null`.
2. **PartnerRibbon 로케일별 길이** — 375px에서 1줄 보장. 짧은 문구 버전 제공, md+에서 full.
3. **ReviewCardList 접근성** — `tabIndex={0}` + 좌우 화살표 키 handler.
4. **FAQAccordion 앵커** — URL hash(`#faq-is-this-kt-official`)로 특정 Q 자동 펼침.
5. **TrustStatsStrip 숫자 갱신** — "as of YYYY-Q" 작은 주석으로 갱신 시점 명시.
6. **모바일 Safari 100vh 이슈** — `min-h-[300px]` 유지, `100vh` 사용 금지.
7. **다국어 리뷰 본문** — `break-keep` + `line-clamp-3`. "더보기"는 후속.
8. **Hero 이미지 교체 지연** — `hero-phones.webp` 확보 전까지 현재 ARC 이미지 유지.
9. **리뷰 사진 없음** — 이니셜 아바타 표준화.
10. **FAQ 긴 답변** — `max-h` 없이 자연 높이, prose 스타일.

---

## 8. 테스트 전략

### 8.1 유닛 테스트

이번 스펙은 presentational 중심이라 유닛 가치 낮음. 다음만 유지:
- `PhoneDetailClient` store sync (회귀 방지)
- `calculateFinalDevicePrice` (기존)

### 8.2 수동 QA 체크리스트

1. 홈 — 4개 로케일 모두 360px에서 줄바꿈 깨짐 없음
2. 홈 — 스크롤 80% 이후 ConsultationBar 정상 동작
3. 기기 상세 — 색상/용량 변경 시 URL·이미지 동기화 회귀 없음
4. 기기 상세 — 모든 변형 품절일 때 CTA 비활성
5. 기기 상세 — StickyBar 위 ConsultationBar 겹치지 않음
6. ReviewCardList — "View all" 없이 스와이프로 전부 도달 가능
7. FAQAccordion — URL hash로 특정 아이템 펼쳐짐
8. PartnerLogoGrid — 로고 alt 4개 로케일 확인
9. 이미지 404 fallback — 네트워크 throttle + 경로 임시 조작
10. Lighthouse 홈 모바일 — Performance ≥90, Accessibility ≥95

### 8.3 Visual QA

- 섹션 배경 교대 리듬(paper ↔ paper-blue) 확인
- Hero → TrustStats → Reviews 간 spacing 일관
- 모든 H1/H2/H3 크기·계층 FINDING-005 규칙 준수

### 8.4 회귀 방지 범위 — 이 스펙이 건드리지 않음

- `/phone/order`, `/phone/result`, `/company`, `/inquiry`, `/policy`, `/admin/*`
- `GongguDealCard` 내부
- Supabase 스키마 / Server Actions / 가격 계산
- i18n 라우팅 설정

---

## 9. 구현 로드맵 (PR 순서)

### Phase 0 — 기반 (PR #0)
- `globals.css`: `break-keep`, `tabular-nums` 유틸, `paper-blue` 토큰 정렬
- `messages/{en,ja,zh,ko}.json`: 신규 블록 (영문 기준, 타 로케일은 en 복사 + `TODO`)
- `public/images/partners/` 폴더 생성
- `src/features/home/types.ts` 신규
- 회귀 0건, 빌드 그린

### Phase 1 — 공용 컴포넌트 (PR #1~#3, 병렬 가능)
- **PR #1 Trust 계열** — `PartnerRibbon` · `TrustStatsStrip` · `PartnerLogoGrid`
- **PR #2 Review 계열** — `ReviewCard` · `ReviewCardList`
- **PR #3 Content + 상담** — `FAQAccordion` · `WhyCheapCard` · `ConsultationBar`

### Phase 2 — 홈 재조립 (PR #4)
- `HeroSection` 리팩, `ConversionHighlights` 축약
- `app/[locale]/(mobile)/page.tsx` 섹션 순서 교체
- `(mobile)/layout.tsx` 에 `PartnerRibbon` + `ConsultationBar` 등록
- `EligibilityCheckerWrapper` 섹션 제거, Hero CTA/FAQ 로 흡수

### Phase 3 — 기기 상세 재구성 (PR #5)
- `PhoneDetailClient` 단일 스크롤 전환 (step 제거, "Purchase Ready" 박스 제거)
- 옵션 모달 → 인라인 `OptionPills`
- `ProductImageCarousel` 신규 (Framer 구조 참고)
- `WhyCheapCard` · `ReviewCardList(filterModel)` · `FAQAccordion(phone-specific)` 삽입

### Phase 4 — 다국어 마감 + QA (PR #6)
- `ja.json` / `zh.json` / `ko.json` 번역 마감
- `public/images/partners/*.svg` 5개 + `hero-phones.webp`(확보되면) 배치
- 수동 QA 체크리스트 수행, 픽스 커밋
- Lighthouse / touch target / heading 계층 검증

### 의존성 표

| PR | 규모 | 의존 |
|---|---|---|
| #0 | S | — |
| #1 | S | #0 |
| #2 | M | #0 |
| #3 | M | #0 |
| #4 | M | #1, #2, #3 |
| #5 | L | #1, #2, #3 |
| #6 | S–M | #4, #5 |

#1~#3 병렬 가능. #4/#5 직렬 권장(리뷰 부담 분산).

---

## 10. 결정 로그

| 결정 | 선택 | 이유 |
|---|---|---|
| 범위 | 홈 + 기기 상세 + 신뢰 요소 전역 | 전환율 임팩트 ↑, 스펙 분할 시 리뷰 품질 ↑ |
| 1순위 사용자 불안 | KT 공식성 (사기 우려) | 타겟이 "내가 속는 거 아닌가" 가 가장 크다고 판단 |
| 디자인 톤 | 구조 차용 + 글로벌 프리미엄 재해석 | 다국어 여백, 외국인 타겟 맞춤, 내수와 브랜드 연속성 |
| 홈 레이아웃 | 공식성 선점(A) | 리본·Trust·리뷰가 상단 → 상품 → FAQ → 파트너 로고 |
| 기기 상세 | 단일 스크롤 + Sticky CTA | Step 분기 제거, 의사결정 1회 완결 |
| 리뷰 데이터 소스 | i18n 정적 JSON | DB 스키마 변경 회피, 후속 DB 이관 훅 교체만 |
| KT 리본 문구 | 로고 + 사업자번호 + Licensed Since | 공식성 시그널 최강 |
| 카운터 숫자 | 정적 반올림값 | 실데이터 0건 리스크 회피 |
| 오프라인 매장 | 이번 스펙 제외 | 자산 미확보, 후속 Company 스펙 |
| QA 범위 | 모바일 우선 | (mobile) 라우트 그룹 이미 분리, 데스크탑 단순화 가능 |
| 구현 순서 | 컴포넌트 단위 점진 | 공용 컴포넌트 재사용, PR 소형화, 롤백 단위 안전 |
