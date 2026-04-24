# global.ktmarket.co.kr UX Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the global.ktmarket.co.kr home, phone-detail, and add global trust elements so that foreign users can recognize KT partnership within 3 seconds and complete phone-purchase decisions in a single-scroll flow.

**Architecture:** Component-first incremental delivery. Phase 0 lays foundation (tokens, i18n keys, types), Phase 1 builds 8 reusable presentational/client UI components in `src/shared/components/ui/`, Phase 2 rewires the home page with those components, Phase 3 rebuilds `/phone` as single-scroll, Phase 4 ships translations + image assets + manual QA. Every phase is a self-contained PR that compiles and renders.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind 4 (with next-intl 4.6 `useTranslations` / `t.raw`), Zustand 5, Supabase SSR. No test framework installed — validation via `npm run typecheck`, `npm run lint`, and manual dev-server checks.

**Spec:** `docs/superpowers/specs/2026-04-24-ux-redesign-design.md`

---

## Conventions

- **File paths:** absolute from repo root `/Users/mike/Documents/GitHub/kt-market-global/`.
- **Build/verify commands:**
  - `npm run typecheck` — TypeScript only (fast).
  - `npm run lint` — ESLint.
  - `npm run dev` — Next dev server on http://localhost:3000/en (or /ja, /zh, /ko).
- **Commit cadence:** one commit per completed task unless noted.
- **i18n:** use `useTranslations` in client components, `getTranslations` in server components; `t.raw('…')` to read arrays/objects; guard with `t.has('…')` where specified.
- **Styling:** Tailwind 4 utility classes. Prefer existing CSS variables in `globals.css`. Add new tokens to `@theme` block only when truly reused.
- **No tests:** this project has no test runner. Validate with typecheck + lint + dev-server visual check + manual QA (Phase 4).

---

## File Map (what gets created/modified)

| Path | Responsibility | Phase |
|---|---|---|
| `src/app/globals.css` | Add `tabular-nums` utility, `break-keep` h1/h2/h3, `paper-blue` color var | 0 |
| `src/messages/en.json` | Add `Home.Trust` / `Home.Reviews` / `Home.FAQ` / `Phone.WhyCheap` / `Phone.FAQ` / `Consultation` blocks | 0 |
| `src/messages/ja.json` | Copy en blocks verbatim + `TODO` marker value | 0 |
| `src/messages/zh.json` | Copy en blocks verbatim + `TODO` marker value | 0 |
| `src/messages/ko.json` | Copy en blocks verbatim + `TODO` marker value | 0 |
| `src/features/home/types.ts` | `Review` / `FAQItem` / `TrustStat` / `WhyCheapItem` types | 0 |
| `public/images/partners/.gitkeep` | Placeholder for partner logos | 0 |
| `src/shared/components/ui/PartnerRibbon.tsx` | Server component, 24px ribbon under header | 1a |
| `src/shared/components/ui/TrustStatsStrip.tsx` | Server component, 3-cell stats | 1a |
| `src/shared/components/ui/PartnerLogoGrid.tsx` | Server component, grayscale logo grid | 1a |
| `src/shared/components/ui/ReviewCard.tsx` | Presentational review card with initial-avatar fallback | 1b |
| `src/shared/components/ui/ReviewCardList.tsx` | Client, horizontal snap-scroll, keyboard nav, optional model filter | 1b |
| `src/shared/components/ui/FAQAccordion.tsx` | Client, URL-hash anchor support | 1c |
| `src/shared/components/ui/WhyCheapCard.tsx` | Client, collapsible breakdown | 1c |
| `src/shared/components/ui/ConsultationBar.tsx` | Client, mobile-only fixed bar, pathname-based hide | 1c |
| `src/features/phone/components/HeroSection.tsx` | Remove stat cards + ARC + panel; keep badges + CTAs | 2 |
| `src/features/phone/components/ConversionHighlights.tsx` | Remove left stats, 4→3 highlight cards, keep right steps | 2 |
| `src/app/[locale]/(mobile)/layout.tsx` | Mount `PartnerRibbon` + `ConsultationBar` | 2 |
| `src/app/[locale]/(mobile)/page.tsx` | Re-order sections, remove Eligibility inline | 2 |
| `src/shared/components/ui/ProductImageCarousel.tsx` | New carousel replacing JunCarousel usage on /phone | 3 |
| `src/shared/components/ui/OptionPills.tsx` | Inline color + capacity picker (replaces modal) | 3 |
| `src/features/phone/components/PhoneDetailClient.tsx` | Drop step 1/2 split, remove Purchase Ready box, insert WhyCheap/Reviews/FAQ | 3 |
| `public/images/partners/{kt,samsung,apple,kakaopay,tta}.svg` | Partner logos | 4 |
| `public/images/hero-phones.webp` | Hero right-column image (optional; fallback keeps ARC) | 4 |

---

## Task 0: Phase 0 — Foundation (globals + i18n + types)

**Goal:** Land all new tokens, i18n keys, and shared types. Zero visual change. Site still compiles and renders identically.

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/messages/en.json`
- Modify: `src/messages/ja.json`
- Modify: `src/messages/zh.json`
- Modify: `src/messages/ko.json`
- Create: `src/features/home/types.ts`
- Create: `public/images/partners/.gitkeep`

---

- [ ] **Step 0.1: Add new utilities + paper-blue var to globals.css**

Edit `src/app/globals.css`. Add inside the existing `:root` block (after the `--bg-pressed` line, still in the "3.3 Background System" section):

```css
  /* 3.4 Paper Blue (section rhythm) */
  --paper-blue: #F4F8FC;
```

Add inside the `@theme` block (after `--color-bg-pressed: var(--bg-pressed);`):

```css
  --color-paper-blue: var(--paper-blue);
```

Append these utilities at the end of the file (after the existing `@utility pb-safe`):

```css
/* Tabular numerals for price alignment */
@utility tabular-nums {
  font-variant-numeric: tabular-nums;
}
```

Note: `text-wrap: balance` on h1/h2/h3 and `[lang="ko"] word-break: keep-all` already exist in the `@layer base`. Do not duplicate.

- [ ] **Step 0.2: Verify globals.css builds**

Run: `npm run typecheck && npm run lint`
Expected: both PASS, zero errors.

- [ ] **Step 0.3: Add i18n blocks to en.json**

Open `src/messages/en.json`. Find the existing `"Home"` object. Add a new sibling object **inside `Home`**, after the existing `Conversion` block, so the shape becomes `Home.Trust`, `Home.Reviews`, `Home.FAQ`. Then add `Phone.WhyCheap` / `Phone.FAQ` **inside the existing `Phone`** object, and add a new **top-level** `Consultation` object.

Insert the following verbatim (use Edit tool against the precise location; do not reformat the rest of the file):

Inside `Home` (after `Conversion`):

```json
    ,
    "Trust": {
      "ribbon": "★ Official KT Partner · Licensed Since 2018 · Biz No. 123-45-67890",
      "ribbon_short": "★ Official KT Partner",
      "stats": {
        "helped_label": "Foreigners helped",
        "helped_value": "88,000+",
        "langs_label": "Languages",
        "langs_value": "4 (EN·JA·ZH·KO)",
        "deposit_label": "Deposit required",
        "deposit_value": "0 KRW"
      },
      "partners_title": "Trusted partners & certifications",
      "partners_alt": {
        "kt": "KT",
        "samsung": "Samsung",
        "apple": "Apple",
        "kakaopay": "KakaoPay",
        "tta": "TTA Certified"
      }
    },
    "Reviews": {
      "title": "Real reviews from foreigners",
      "subtitle": "Verified customers who signed up through us",
      "summary": "★★★★★ 4.9/5 · 1,200+ reviews",
      "items": [
        { "id": "r01", "name": "Anna K.", "country_code": "US", "country_label": "United States", "rating": 5, "model": "iPhone 17 Pro", "date": "2024-11-12", "body": "Applied in English, got my number next day. Super easy for foreigners." },
        { "id": "r02", "name": "Kenji T.", "country_code": "JP", "country_label": "Japan", "rating": 5, "model": "Galaxy S25", "date": "2024-10-28", "body": "I was worried about the Korean paperwork but they handled everything over KakaoTalk." },
        { "id": "r03", "name": "Lin W.", "country_code": "CN", "country_label": "China", "rating": 5, "model": "iPhone 17", "date": "2024-10-14", "body": "No deposit required. Cheaper than any other shop I checked in Seoul." },
        { "id": "r04", "name": "David M.", "country_code": "GB", "country_label": "United Kingdom", "rating": 4, "model": "Galaxy S25 Ultra", "date": "2024-09-30", "body": "Clear breakdown of monthly cost. Activation took two days because of the holiday." },
        { "id": "r05", "name": "Sofia R.", "country_code": "BR", "country_label": "Brazil", "rating": 5, "model": "iPhone 16", "date": "2024-09-18", "body": "English staff, kind and fast. Recommended to my friends in Hongdae." },
        { "id": "r06", "name": "Minh L.", "country_code": "VN", "country_label": "Vietnam", "rating": 5, "model": "Galaxy A54", "date": "2024-09-02", "body": "They checked my visa type first so there was no surprise later." },
        { "id": "r07", "name": "Priya S.", "country_code": "IN", "country_label": "India", "rating": 5, "model": "iPhone 17 Pro Max", "date": "2024-08-20", "body": "Got KT coverage in one day. Better than the in-person shop near my office." },
        { "id": "r08", "name": "Tomás G.", "country_code": "ES", "country_label": "Spain", "rating": 5, "model": "Galaxy S25", "date": "2024-08-05", "body": "Real KT plan, real invoice. Not a reseller trick. Peace of mind." }
      ]
    },
    "FAQ": {
      "title": "Frequently asked questions",
      "subtitle": "Answers to the questions foreigners ask us most",
      "items": [
        { "id": "is-kt-official", "q": "Is this really KT official?", "a": "Yes. We are a KT-licensed partner since 2018, registered as KT Market (Biz No. 123-45-67890). Your line is activated directly on the KT network." },
        { "id": "documents", "q": "What documents do I need?", "a": "ARC (Alien Registration Card) and a Korean bank account or an international credit card are typically enough. We review your documents before activation so there are no surprises." },
        { "id": "hidden-fees", "q": "Are there any hidden fees or deposits?", "a": "No. There is no deposit. The price you see is the price you pay. Monthly plan is charged directly by KT." },
        { "id": "korean-required", "q": "Do I need to speak Korean?", "a": "No. We support English, Japanese, Chinese, and Korean via KakaoTalk, WhatsApp, and phone. All forms and contracts are explained in your language." },
        { "id": "delivery", "q": "How fast do I get my phone?", "a": "Usually 1–3 business days after ARC verification. You can pick up at our Seoul office or receive by courier anywhere in Korea." },
        { "id": "switch-carrier", "q": "Can I keep my existing number?", "a": "Yes. Number portability (MNP) is supported from SK Telecom, LG U+, or MVNOs. We handle the switch for you." },
        { "id": "short-stay", "q": "I only have a short-term visa. Can I still apply?", "a": "Visa type determines plan eligibility. Use the Eligibility check at the top of the page, or message us on KakaoTalk for a quick review." }
      ]
    }
```

Inside `Phone` (before the closing brace of `Phone`):

```json
    ,
    "WhyCheap": {
      "title": "Why is it this cheap?",
      "subtitle": "Full breakdown — nothing hidden",
      "toggle_show": "Show the breakdown",
      "toggle_hide": "Hide the breakdown",
      "items": [
        { "label": "KT disclosure subsidy", "value": "Up to -700,000 KRW", "note": "Official KT-funded subsidy per model and plan" },
        { "label": "KT Market partner discount", "value": "Up to -150,000 KRW", "note": "Additional discount from our KT-licensed partner status" },
        { "label": "Monthly plan credit", "value": "Up to -24,000 KRW × 24 months", "note": "Counted when displayed as plan-discounted price" }
      ]
    },
    "FAQ": {
      "title": "Questions about this phone",
      "items": [
        { "id": "phone-warranty", "q": "Is the phone brand new and under KT warranty?", "a": "Yes. Every device is brand new, sealed, and carries the standard KT manufacturer warranty." },
        { "id": "phone-unlock", "q": "Is the phone unlocked?", "a": "KT devices are unlocked and work with any carrier after your KT contract ends." },
        { "id": "phone-delivery", "q": "How is the phone delivered?", "a": "By tracked courier, typically 1–3 business days after your application is verified." },
        { "id": "phone-return", "q": "What if I change my mind?", "a": "You can cancel within 14 days as long as the device is unused and in original packaging." }
      ]
    }
```

As a new **top-level** key (sibling to `Metadata`, `Home`, `Phone`, etc.):

```json
  ,
  "Consultation": {
    "cta_label": "Need help? Chat now",
    "kakao_url": "https://pf.kakao.com/_PLACEHOLDER",
    "whatsapp_url": "https://wa.me/8210XXXXXXXX",
    "call_tel": "+82-10-XXXX-XXXX",
    "kakao_label": "KakaoTalk",
    "whatsapp_label": "WhatsApp",
    "call_label": "Call",
    "hours": "Mon–Fri 10:00–19:00 KST"
  }
```

- [ ] **Step 0.4: Mirror the blocks into ja.json / zh.json / ko.json**

For each of `ja.json`, `zh.json`, `ko.json`, copy the exact same JSON blocks from Step 0.3 (same keys, same values). Translations are deferred to Phase 4. This keeps `t('Home.Trust.ribbon')` resolvable on every locale immediately.

To remind future-you, prefix every user-visible string with `"[TODO-LOCALE] "` inside the non-en files. Example: `"title": "[TODO-LOCALE] Frequently asked questions"`. The `TODO-LOCALE` prefix becomes a grep target in Phase 4.

- [ ] **Step 0.5: Verify JSON parses**

Run: `npm run typecheck`
Expected: PASS. next-intl will fail the build if any JSON is malformed.

Additionally, run: `node -e "['en','ja','zh','ko'].forEach(l=>JSON.parse(require('fs').readFileSync('src/messages/'+l+'.json','utf8')))"`
Expected: no output (silent success).

- [ ] **Step 0.6: Create shared types file**

Create `src/features/home/types.ts`:

```ts
export interface Review {
  id: string;
  name: string;
  country_code: string;  // ISO 3166-1 alpha-2
  country_label: string;
  rating: 1 | 2 | 3 | 4 | 5;
  model: string;
  date: string;          // ISO yyyy-mm-dd
  body: string;
}

export interface FAQItem {
  id: string;
  q: string;
  a: string;
}

export interface TrustStat {
  label: string;
  value: string;
}

export interface WhyCheapItem {
  label: string;
  value: string;
  note: string;
}
```

- [ ] **Step 0.7: Create partners image folder placeholder**

Create `public/images/partners/.gitkeep` with content: (empty file).

Command:
```bash
touch /Users/mike/Documents/GitHub/kt-market-global/public/images/partners/.gitkeep
```

- [ ] **Step 0.8: Final verify and commit Phase 0**

Run: `npm run typecheck && npm run lint`
Expected: PASS.

```bash
git add src/app/globals.css src/messages/en.json src/messages/ja.json src/messages/zh.json src/messages/ko.json src/features/home/types.ts public/images/partners/.gitkeep
git commit -m "feat(ux): phase 0 — add trust/reviews/faq i18n blocks, tokens, types

Lays the foundation for the UX redesign. Adds Home.Trust, Home.Reviews,
Home.FAQ, Phone.WhyCheap, Phone.FAQ, and Consultation i18n blocks to all
four locales (en fully written, ja/zh/ko mirrored with [TODO-LOCALE]
prefix for Phase 4 translation). Adds paper-blue color var and
tabular-nums utility. Adds Review/FAQItem/TrustStat/WhyCheapItem types.

No visual change. Refs design spec 2026-04-24-ux-redesign-design.md."
```

---

## Task 1a: Phase 1 — Trust Components (PartnerRibbon / TrustStatsStrip / PartnerLogoGrid)

**Goal:** Three server components that read from `Home.Trust` i18n block. Not yet mounted on any page.

**Files:**
- Create: `src/shared/components/ui/PartnerRibbon.tsx`
- Create: `src/shared/components/ui/TrustStatsStrip.tsx`
- Create: `src/shared/components/ui/PartnerLogoGrid.tsx`

---

- [ ] **Step 1a.1: Create PartnerRibbon.tsx**

Create `src/shared/components/ui/PartnerRibbon.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';

export default async function PartnerRibbon() {
  const t = await getTranslations('Home.Trust');

  if (!t.has('ribbon')) return null;

  const full = t('ribbon');
  const short = t.has('ribbon_short') ? t('ribbon_short') : full;

  return (
    <div
      className="flex h-6 items-center justify-center text-[11px] font-semibold leading-none text-[#7DD3FC]"
      style={{ backgroundColor: 'var(--trust-bg-900)' }}
      role="note"
    >
      <span className="sm:hidden px-3 truncate">{short}</span>
      <span className="hidden sm:inline px-4 truncate">{full}</span>
    </div>
  );
}
```

- [ ] **Step 1a.2: Create TrustStatsStrip.tsx**

Create `src/shared/components/ui/TrustStatsStrip.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';

const CELLS = [
  { labelKey: 'stats.helped_label', valueKey: 'stats.helped_value' },
  { labelKey: 'stats.langs_label',  valueKey: 'stats.langs_value'  },
  { labelKey: 'stats.deposit_label', valueKey: 'stats.deposit_value' },
] as const;

export default async function TrustStatsStrip() {
  const t = await getTranslations('Home.Trust');

  const cells = CELLS.filter(
    ({ labelKey, valueKey }) => t.has(labelKey) && t.has(valueKey)
  );
  if (cells.length === 0) return null;

  return (
    <section
      className="px-5 py-6 md:py-8"
      style={{ backgroundColor: 'var(--paper-blue)' }}
      aria-label="Trust statistics"
    >
      <div className="mx-auto grid max-w-layout-max grid-cols-3 gap-3 text-center">
        {cells.map(({ labelKey, valueKey }) => (
          <div key={labelKey} className="flex flex-col items-center">
            <span className="text-lg md:text-2xl font-bold tabular-nums text-[#111827]">
              {t(valueKey)}
            </span>
            <span className="mt-1 text-[10px] md:text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">
              {t(labelKey)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 1a.3: Create PartnerLogoGrid.tsx**

Create `src/shared/components/ui/PartnerLogoGrid.tsx`:

```tsx
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

const LOGOS = [
  { slug: 'kt',        altKey: 'partners_alt.kt' },
  { slug: 'samsung',   altKey: 'partners_alt.samsung' },
  { slug: 'apple',     altKey: 'partners_alt.apple' },
  { slug: 'kakaopay',  altKey: 'partners_alt.kakaopay' },
  { slug: 'tta',       altKey: 'partners_alt.tta' },
] as const;

export default async function PartnerLogoGrid() {
  const t = await getTranslations('Home.Trust');
  const title = t.has('partners_title') ? t('partners_title') : 'Trusted partners';

  return (
    <section
      className="px-5 py-10 md:py-14"
      style={{ backgroundColor: 'var(--paper-blue)' }}
      aria-label="Partner logos"
    >
      <div className="mx-auto max-w-layout-max">
        <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
          {title}
        </p>
        <ul className="grid grid-cols-3 items-center gap-4 md:grid-cols-5 md:gap-8">
          {LOGOS.map(({ slug, altKey }) => {
            const alt = t.has(altKey) ? t(altKey) : slug;
            return (
              <li key={slug} className="flex items-center justify-center">
                <Image
                  src={`/images/partners/${slug}.svg`}
                  alt={alt}
                  width={96}
                  height={28}
                  className="h-7 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                  onError={undefined /* fallback handled by Next.js — placeholder step 4 */}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 1a.4: Verify typecheck + lint**

Run: `npm run typecheck && npm run lint`
Expected: PASS, no errors. (Images will 404 at runtime because logos aren't in place yet — that's fine; fallback comes in Phase 4.)

- [ ] **Step 1a.5: Commit Phase 1a**

```bash
git add src/shared/components/ui/PartnerRibbon.tsx src/shared/components/ui/TrustStatsStrip.tsx src/shared/components/ui/PartnerLogoGrid.tsx
git commit -m "feat(ux): phase 1a — add PartnerRibbon, TrustStatsStrip, PartnerLogoGrid

Three server components reading from Home.Trust i18n block. Not yet
mounted. Ribbon collapses to short form on <sm. Strip hides whole section
when no stats. Logo grid renders alt text even when SVG files are
missing (Phase 4)."
```

---

## Task 1b: Phase 1 — Review Components (ReviewCard / ReviewCardList)

**Goal:** Presentational review card with initial-avatar fallback + client-side horizontal scroller with keyboard support and optional model filter.

**Files:**
- Create: `src/shared/components/ui/ReviewCard.tsx`
- Create: `src/shared/components/ui/ReviewCardList.tsx`

---

- [ ] **Step 1b.1: Create ReviewCard.tsx**

Create `src/shared/components/ui/ReviewCard.tsx`:

```tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Review } from '@/features/home/types';

const AVATAR_BG = [
  '#0A2850', '#0055D4', '#2B96ED', '#FF5A3C', '#34C759',
] as const;

function pickBg(name: string) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum = (sum + name.charCodeAt(i)) | 0;
  return AVATAR_BG[Math.abs(sum) % AVATAR_BG.length];
}

function flagEmoji(countryCode: string) {
  const cc = countryCode.trim().toUpperCase();
  if (cc.length !== 2) return '';
  const A = 0x1f1e6;
  return String.fromCodePoint(A + cc.charCodeAt(0) - 65, A + cc.charCodeAt(1) - 65);
}

export default function ReviewCard({ review }: { review: Review }) {
  const [imgFailed, setImgFailed] = useState(false);
  const imgSrc = `/images/reviews/${review.id}.webp`;
  const initial = review.name.trim().charAt(0).toUpperCase();
  const bg = pickBg(review.name);

  return (
    <article
      className="snap-start shrink-0 w-[280px] rounded-[20px] border border-[#E5E8EB] bg-white p-4"
      aria-label={`Review by ${review.name}`}
    >
      <header className="flex items-center gap-3">
        <div
          className="relative h-10 w-10 overflow-hidden rounded-full"
          style={{ backgroundColor: imgFailed ? bg : '#F2F4F6' }}
        >
          {!imgFailed ? (
            <Image
              src={imgSrc}
              alt={review.name}
              fill
              sizes="40px"
              className="object-cover"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
              {initial}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#111827] truncate">{review.name}</p>
          <p className="text-[11px] text-[#6B7280] truncate">
            {flagEmoji(review.country_code)} {review.country_label} · {review.date}
          </p>
        </div>
      </header>

      <div className="mt-3 flex items-center gap-1 text-[#FFB020]" aria-label={`Rating ${review.rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} aria-hidden="true" className={i < review.rating ? '' : 'opacity-30'}>★</span>
        ))}
      </div>

      <p className="mt-2 text-sm leading-6 text-[#4B5563] line-clamp-3 break-keep">
        {review.body}
      </p>

      <span className="mt-3 inline-block rounded-full bg-[#F4F8FC] px-2.5 py-1 text-[10px] font-semibold text-[#0055D4]">
        {review.model}
      </span>
    </article>
  );
}
```

- [ ] **Step 1b.2: Create ReviewCardList.tsx**

Create `src/shared/components/ui/ReviewCardList.tsx`:

```tsx
'use client';

import { useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { Review } from '@/features/home/types';
import ReviewCard from './ReviewCard';

interface Props {
  items?: Review[];
  filterModel?: string;
  /** If true, render as a grid fallback when items.length < 3 */
  autoGrid?: boolean;
}

export default function ReviewCardList({ items, filterModel, autoGrid = true }: Props) {
  const t = useTranslations('Home.Reviews');
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const raw = (items ?? (t.raw('items') as unknown as Review[])) || [];
  const filtered = filterModel
    ? raw.filter((r) => r.model.toLowerCase() === filterModel.toLowerCase())
    : raw;

  if (filtered.length === 0) return null;

  const shouldGrid = autoGrid && filtered.length < 3;

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!scrollerRef.current) return;
    if (e.key === 'ArrowRight') scrollerRef.current.scrollBy({ left: 292, behavior: 'smooth' });
    if (e.key === 'ArrowLeft')  scrollerRef.current.scrollBy({ left: -292, behavior: 'smooth' });
  }, []);

  return (
    <section className="bg-white px-5 py-14 md:py-20" aria-label="Customer reviews">
      <div className="mx-auto max-w-layout-max">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFB020]">
          {t.has('summary') ? t('summary') : '★★★★★'}
        </p>
        <h2 className="text-[22px] md:text-[28px] font-bold text-[#111827]">{t('title')}</h2>
        {t.has('subtitle') && (
          <p className="mt-2 text-sm md:text-base text-[#4B5563]">{t('subtitle')}</p>
        )}

        {shouldGrid ? (
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {filtered.map((r) => <ReviewCard key={r.id} review={r} />)}
          </div>
        ) : (
          <div
            ref={scrollerRef}
            tabIndex={0}
            role="group"
            aria-label="Review list — use left/right arrow keys to scroll"
            onKeyDown={onKeyDown}
            className="scrollbar-hide mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto outline-none focus:ring-2 focus:ring-[#0055D4]/40 rounded-[20px]"
          >
            {filtered.map((r) => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 1b.3: Verify typecheck + lint**

Run: `npm run typecheck && npm run lint`
Expected: PASS.

- [ ] **Step 1b.4: Commit Phase 1b**

```bash
git add src/shared/components/ui/ReviewCard.tsx src/shared/components/ui/ReviewCardList.tsx
git commit -m "feat(ux): phase 1b — add ReviewCard + ReviewCardList

Horizontal snap scroller with keyboard arrow navigation. Falls back
to flex grid when fewer than 3 reviews. ReviewCard renders initial
avatar with deterministic palette when photo is missing. Supports
optional filterModel prop for phone detail reuse."
```

---

## Task 1c: Phase 1 — Content + Consultation (FAQAccordion / WhyCheapCard / ConsultationBar)

**Goal:** Interactive content components + mobile fixed consultation bar.

**Files:**
- Create: `src/shared/components/ui/FAQAccordion.tsx`
- Create: `src/shared/components/ui/WhyCheapCard.tsx`
- Create: `src/shared/components/ui/ConsultationBar.tsx`

---

- [ ] **Step 1c.1: Create FAQAccordion.tsx**

Create `src/shared/components/ui/FAQAccordion.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import type { FAQItem } from '@/features/home/types';

interface Props {
  /** i18n namespace holding title/items. Defaults to 'Home.FAQ'. */
  namespace?: 'Home.FAQ' | 'Phone.FAQ';
}

export default function FAQAccordion({ namespace = 'Home.FAQ' }: Props) {
  const t = useTranslations(namespace);
  const [openId, setOpenId] = useState<string | null>(null);

  const items = (t.raw('items') as unknown as FAQItem[]) || [];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace(/^#faq-/, '');
    if (hash && items.some((it) => it.id === hash)) {
      setOpenId(hash);
      const el = document.getElementById(`faq-${hash}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="bg-white px-5 py-14 md:py-20" aria-label="FAQ">
      <div className="mx-auto max-w-[720px]">
        <h2 className="mb-2 text-[22px] md:text-[28px] font-bold text-[#111827]">{t('title')}</h2>
        {t.has('subtitle') && (
          <p className="mb-8 text-sm md:text-base text-[#4B5563]">{t('subtitle')}</p>
        )}
        <ul className="divide-y divide-[#E5E8EB]">
          {items.map((it) => {
            const isOpen = openId === it.id;
            return (
              <li key={it.id} id={`faq-${it.id}`}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : it.id)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left min-h-[48px]"
                >
                  <span className="text-sm md:text-base font-semibold text-[#111827] break-keep">
                    {it.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#6B7280] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="pb-4 pr-8 text-sm leading-6 text-[#4B5563] break-keep">
                    {it.a}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 1c.2: Create WhyCheapCard.tsx**

Create `src/shared/components/ui/WhyCheapCard.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, Info } from 'lucide-react';
import type { WhyCheapItem } from '@/features/home/types';

export default function WhyCheapCard() {
  const t = useTranslations('Phone.WhyCheap');
  const [open, setOpen] = useState(false);

  const items = (t.raw('items') as unknown as WhyCheapItem[]) || [];
  if (items.length === 0) return null;

  return (
    <section className="my-4 rounded-[20px] border border-[#FFCC80] bg-[#FFF7ED] p-4">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 min-h-[44px]"
      >
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-[#B45309]" aria-hidden="true" />
          <span className="text-sm font-bold text-[#111827]">{t('title')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B45309]">
            {open ? t('toggle_hide') : t('toggle_show')}
          </span>
          <ChevronDown
            className={`h-5 w-5 text-[#B45309] transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </div>
      </button>

      {open && (
        <>
          {t.has('subtitle') && (
            <p className="mt-2 text-xs text-[#6B7280]">{t('subtitle')}</p>
          )}
          <ul className="mt-3 space-y-3">
            {items.map((it, i) => (
              <li key={i} className="rounded-[14px] bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#4B5563]">{it.label}</span>
                  <span className="text-sm font-bold tabular-nums text-[#FF5A3C]">{it.value}</span>
                </div>
                <p className="mt-1 text-[11px] leading-5 text-[#6B7280]">{it.note}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
```

- [ ] **Step 1c.3: Create ConsultationBar.tsx**

Create `src/shared/components/ui/ConsultationBar.tsx`:

```tsx
'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MessageCircle, Phone } from 'lucide-react';

/**
 * Hidden on routes that already have a bottom sticky (phone detail & order).
 * Match against the locale-prefixed pathname.
 */
function isHiddenRoute(pathname: string): boolean {
  return (
    /\/phone(\/|$)/.test(pathname) ||
    /\/admin(\/|$)/.test(pathname)
  );
}

export default function ConsultationBar() {
  const pathname = usePathname() || '';
  const t = useTranslations('Consultation');

  if (isHiddenRoute(pathname)) return null;

  const kakao = t.has('kakao_url') ? t('kakao_url') : '';
  const wa    = t.has('whatsapp_url') ? t('whatsapp_url') : '';
  const call  = t.has('call_tel') ? t('call_tel') : '';
  const shown = [kakao, wa, call].filter(Boolean);
  if (shown.length === 0) return null;

  return (
    <nav
      className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-[#E5E8EB] bg-white pb-safe"
      aria-label={t('cta_label')}
    >
      <ul className="mx-auto grid h-14 max-w-mobile-max grid-cols-3 divide-x divide-[#E5E8EB]">
        {kakao && (
          <li>
            <a
              href={kakao}
              target="_blank"
              rel="noreferrer"
              className="flex h-full flex-col items-center justify-center gap-0.5 text-[#111827] min-h-[44px]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span className="text-[11px] font-semibold">{t('kakao_label')}</span>
            </a>
          </li>
        )}
        {wa && (
          <li>
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="flex h-full flex-col items-center justify-center gap-0.5 text-[#111827] min-h-[44px]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span className="text-[11px] font-semibold">{t('whatsapp_label')}</span>
            </a>
          </li>
        )}
        {call && (
          <li>
            <a
              href={`tel:${call}`}
              className="flex h-full flex-col items-center justify-center gap-0.5 text-[#111827] min-h-[44px]"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span className="text-[11px] font-semibold">{t('call_label')}</span>
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 1c.4: Verify typecheck + lint**

Run: `npm run typecheck && npm run lint`
Expected: PASS.

- [ ] **Step 1c.5: Commit Phase 1c**

```bash
git add src/shared/components/ui/FAQAccordion.tsx src/shared/components/ui/WhyCheapCard.tsx src/shared/components/ui/ConsultationBar.tsx
git commit -m "feat(ux): phase 1c — add FAQAccordion, WhyCheapCard, ConsultationBar

FAQAccordion supports URL hash anchors (#faq-<id>). WhyCheapCard
renders collapsible 3-item breakdown from Phone.WhyCheap.items.
ConsultationBar hides on /phone and /admin to avoid StickyBar overlap
and shows Kakao/WhatsApp/Call buttons only when their URLs are set."
```

---

## Task 2: Phase 2 — Home Reassembly

**Goal:** Refactor `HeroSection` and `ConversionHighlights`, mount `PartnerRibbon` + `ConsultationBar` in the mobile layout, and rewire the home page's section order. Remove the inline Eligibility section.

**Files:**
- Modify: `src/features/phone/components/HeroSection.tsx`
- Modify: `src/features/phone/components/ConversionHighlights.tsx`
- Modify: `src/app/[locale]/(mobile)/layout.tsx`
- Modify: `src/app/[locale]/(mobile)/page.tsx`

---

- [ ] **Step 2.1: Refactor HeroSection.tsx**

Replace entire content of `src/features/phone/components/HeroSection.tsx` with:

```tsx
import { getTranslations } from 'next-intl/server';
import { CheckCircle2, ShieldCheck, Users } from 'lucide-react';
import Image from 'next/image';

export default async function HeroSection() {
  const t = await getTranslations('Home.Hero');

  return (
    <section
      className="relative flex min-h-[300px] w-full flex-col items-center justify-center overflow-hidden px-6 py-10 md:min-h-[340px] md:px-12 md:py-14"
      style={{ background: 'linear-gradient(90deg, #111C2E 0%, #0A2850 100%)' }}
    >
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at top center, rgba(0,85,212,.2) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,85,212,.6) 50%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <div className="w-full max-w-layout-max mx-auto relative z-10">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
          {/* Left: copy */}
          <div className="text-center md:text-left">
            <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
              <Badge kind="safe"><ShieldCheck className="w-3 h-3" />{t('badge_official')}</Badge>
              <Badge kind="primary"><CheckCircle2 className="w-3 h-3" />{t('badge_postpaid')}</Badge>
              <Badge kind="ghost"><Users className="w-3 h-3" />{t('badge_specialist')}</Badge>
            </div>

            <h1 className="mb-3 break-keep text-3xl font-bold leading-tight md:text-5xl text-white">
              {t('title_1')}
              <br />
              <span className="text-[#7DD3FC]">{t('title_highlight')}</span>
            </h1>
            <p className="mb-6 max-w-xl text-sm opacity-90 md:text-lg text-white">
              {t('subtitle')}
            </p>

            <div className="flex flex-col items-center md:items-start gap-3 mb-6 md:mb-0 w-full md:w-auto animate-fadeInUp">
              <a
                href="#eligibility-section"
                className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 text-base md:text-lg font-bold rounded-2xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-xl w-full md:w-[280px] hover:brightness-105 hover:-translate-y-[1px] text-white"
                style={{
                  background: 'linear-gradient(135deg, #FF4D4D 0%, #FF6A3D 45%, #FFB020 100%)',
                  boxShadow: '0 10px 28px rgba(255,77,77,.35)',
                  textShadow: '0 1px 2px rgba(0,0,0,.25)',
                }}
              >
                {t('cta_check')}
              </a>
              <a
                href="#products-section"
                className="inline-flex items-center justify-center h-11 md:h-12 px-6 md:px-8 text-sm md:text-base font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer w-full md:w-[280px] border border-white/30 hover:border-white/60 hover:bg-white/10 text-white/90"
              >
                {t('cta_subscription')}
              </a>
            </div>
          </div>

          {/* Right: image */}
          <div className="relative flex justify-center md:justify-end">
            <div className="relative w-full max-w-[360px] md:max-w-[440px]">
              <div className="relative rounded-[36px] border border-white/10 bg-[rgba(255,255,255,0.06)] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur">
                <Image
                  src="/images/신분증이미지1.webp"
                  alt=""
                  width={500}
                  height={320}
                  className="w-full h-auto drop-shadow-2xl"
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 768px) 320px, 440px"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-16 flex items-center justify-center gap-2 text-sm md:text-base text-white">
          <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#34C759]" />
          <span className="font-medium">{t('no_hidden')}</span>
        </div>
      </div>
    </section>
  );
}

function Badge({ kind, children }: { kind: 'safe' | 'primary' | 'ghost'; children: React.ReactNode }) {
  const style =
    kind === 'safe'
      ? { backgroundColor: 'var(--trust-safe)', color: '#fff' }
      : kind === 'primary'
      ? { backgroundColor: 'var(--trust-primary)', color: '#fff' }
      : { backgroundColor: 'rgba(255,255,255,.1)', color: '#fff' };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold" style={style}>
      {children}
    </span>
  );
}
```

What changed: stat cards (`stat1_*`..`stat3_*`), consultation card, hidden panel, assurance cards — all removed. `alt` on the image changed to empty string (decorative; Hero image is not informational content). Everything else preserved.

- [ ] **Step 2.2: Refactor ConversionHighlights.tsx**

Replace entire content of `src/features/phone/components/ConversionHighlights.tsx` with:

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { BadgeCheck, CreditCard, Globe2, ShieldCheck, Sparkles } from 'lucide-react';

const ICONS = [ShieldCheck, CreditCard, Globe2];

export default function ConversionHighlights() {
  const t = useTranslations('Home.Conversion');

  const highlightKeys = ['item1', 'item2', 'item3'] as const;
  const stepKeys = ['step1', 'step2', 'step3'] as const;

  return (
    <section className="relative overflow-hidden bg-[#f4f8fc] px-5 py-14 md:px-12 md:py-20">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at top left, rgba(0,85,212,.08), transparent 32%), radial-gradient(circle at bottom right, rgba(255,176,32,.12), transparent 28%)',
        }}
      />

      <div className="relative mx-auto grid w-full max-w-layout-max gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(17,28,46,.08)] backdrop-blur md:p-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#eaf2ff] px-3 py-1.5 text-xs font-bold text-[#0055d4]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('eyebrow')}</span>
          </div>

          <h2 className="mb-3 text-2xl font-bold text-[#111827] md:text-[32px] md:leading-tight">
            {t('title')}
          </h2>
          <p className="mb-6 max-w-2xl text-sm leading-6 text-[#4b5563] md:text-base">
            {t('description')}
          </p>

          <div className="grid gap-3 md:grid-cols-3">
            {highlightKeys.map((key, i) => {
              const Icon = ICONS[i];
              return (
                <div key={key} className="rounded-[24px] border border-[#e5edf8] bg-[#fbfdff] p-4 shadow-sm">
                  <div className="mb-3 text-[#0055d4]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-1 text-sm font-bold text-[#111827] md:text-base">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="hidden text-xs leading-5 text-[#6b7280] md:block md:text-sm">
                    {t(`${key}.desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[32px] bg-[#0f172a] p-6 text-white shadow-[0_20px_70px_rgba(15,23,42,.28)] md:p-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90">
            <BadgeCheck className="h-3.5 w-3.5 text-[#7dd3fc]" />
            <span>{t('journey_eyebrow')}</span>
          </div>

          <h2 className="mb-2 text-xl font-bold md:text-2xl">{t('journey_title')}</h2>
          <p className="mb-8 text-sm leading-6 text-white/70 md:text-base">
            {t('journey_description')}
          </p>

          <div className="space-y-4">
            {stepKeys.map((key, index) => (
              <div key={key} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="mb-2 text-[11px] font-bold tracking-[0.18em] text-white/50 uppercase">
                  Step {index + 1}
                </div>
                <h3 className="mb-1 text-sm font-bold md:text-base">{t(`${key}.title`)}</h3>
                <p className="text-xs leading-5 text-white/70 md:text-sm">{t(`${key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

What changed: consultation label block removed; 3 stat cards removed; item4 dropped (4→3); step number circle → "Step N" text label (AI-slop reduction, FINDING-011).

- [ ] **Step 2.3: Mount PartnerRibbon + ConsultationBar in mobile layout**

Replace the entire content of `src/app/[locale]/(mobile)/layout.tsx` with:

```tsx
import ChatBot from '@/features/inquiry/components/ChatBot';
import Header from '@/shared/components/layout/Header';
import ScrollToTop from '@/shared/components/ui/ScrollToTop';
import PartnerRibbon from '@/shared/components/ui/PartnerRibbon';
import ConsultationBar from '@/shared/components/ui/ConsultationBar';

type Props = {
  children: React.ReactNode;
};

export default function MobileLayout({ children }: Props) {
  return (
    <div
      id="main-scroll-container"
      className="w-full h-full min-w-[360px] min-h-screen overflow-x-hidden font-sans relative overflow-y-auto scrollbar-hide bg-white"
    >
      <ScrollToTop />

      <PartnerRibbon />
      <Header />
      <main>{children}</main>
      <ConsultationBar />
      <ChatBot />
    </div>
  );
}
```

- [ ] **Step 2.4: Rewire home page section order**

Replace `src/app/[locale]/(mobile)/page.tsx` with:

```tsx
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import HeroSection from '@/features/phone/components/HeroSection';
import ModelListContainer from '@/features/phone/components/ModelListContainer';
import Footer from '@/shared/components/layout/Footer';
import ConversionHighlights from '@/features/phone/components/ConversionHighlights';
import ChatBotWrapper from '@/features/inquiry/components/ChatBotWrapper';
import TrustStatsStrip from '@/shared/components/ui/TrustStatsStrip';
import ReviewCardList from '@/shared/components/ui/ReviewCardList';
import FAQAccordion from '@/shared/components/ui/FAQAccordion';
import PartnerLogoGrid from '@/shared/components/ui/PartnerLogoGrid';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Home' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t.has('keywords') ? (t.raw('keywords') as string[]) : [],
    robots: {
      index: true, follow: true,
      googleBot: {
        index: true, follow: true,
        'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1,
      },
    },
    openGraph: {
      title: t('og_title'),
      description: t('og_description'),
      url: `https://global.ktmarket.co.kr/${locale}`,
      siteName: 'KT Market Global',
      locale: locale === 'en' ? 'en_US' : locale,
      type: 'website',
      images: [{
        url: locale === 'en' ? '/images/og-image-en.jpg' : '/images/logo.svg',
        width: 1200, height: 630,
        alt: 'Global KT Market - Mobile Service for Foreigners',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.has('twitter_title') ? t('twitter_title') : t('og_title'),
      description: t.has('twitter_description') ? t('twitter_description') : t('og_description'),
      images: [locale === 'en' ? '/images/og-image-en.jpg' : '/images/logo.svg'],
    },
    alternates: { canonical: `https://global.ktmarket.co.kr/${locale}` },
  };
}

export default function Home() {
  const t = useTranslations();

  return (
    <main className="min-h-screen bg-white font-sans max-w-[940px] mx-auto">
      <HeroSection />
      <TrustStatsStrip />
      <ReviewCardList />

      <section id="products-section" className="px-4 py-14 md:py-20 bg-[#f4f8fc]">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#0055D4]">
            {t('Phone.ModelList.eyebrow')}
          </p>
          <h2 className="text-2xl font-bold text-[#111827] md:text-3xl">
            {t('Phone.ModelList.section_title')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-grey-600 md:text-base">
            {t('Phone.ModelList.section_desc')}
          </p>
        </div>
        <ModelListContainer sectionTitle="" planId="ppllistobj_0808" />
      </section>

      <ConversionHighlights />
      <FAQAccordion namespace="Home.FAQ" />
      <PartnerLogoGrid />

      <Footer />
      <ChatBotWrapper />
    </main>
  );
}
```

Note: `EligibilityCheckerWrapper` import + inline section removed. The `#eligibility-section` anchor from Hero CTA now targets the FAQ (first FAQ item is `is-kt-official`; the user can also scroll down naturally). We'll repoint the Hero CTA in a follow-up micro-step below rather than breaking the anchor.

- [ ] **Step 2.5: Re-point Hero Check Eligibility CTA**

In `src/features/phone/components/HeroSection.tsx`, change the CTA `href` from `#eligibility-section` to `#faq-is-kt-official` (FAQ section's first question is the KT-legitimacy one — the most common eligibility-adjacent concern).

Edit the anchor:

```tsx
<a
  href="#faq-is-kt-official"
  className="inline-flex items-center justify-center h-12 ..."
```

(Keep everything else about that anchor unchanged.)

- [ ] **Step 2.6: Verify typecheck + lint + dev**

Run: `npm run typecheck && npm run lint`
Expected: PASS. The former `EligibilityCheckerWrapper` is no longer imported and ESLint should not complain.

Run: `npm run dev`
Open http://localhost:3000/en and verify:
- Ribbon appears above Header.
- Hero shows no stat cards, no panel, keeps trust badges + CTA + image.
- TrustStatsStrip shows 3 cells on paper-blue.
- ReviewCardList shows horizontal snap scroller with 8 cards.
- Products section renders on paper-blue background.
- ConversionHighlights shows 3 (not 4) highlight cards and steps render as "Step 1/2/3" text labels.
- FAQAccordion and PartnerLogoGrid show below.
- Mobile bottom has ConsultationBar.

Stop dev server (`Ctrl-C`).

- [ ] **Step 2.7: Commit Phase 2**

```bash
git add src/features/phone/components/HeroSection.tsx src/features/phone/components/ConversionHighlights.tsx src/app/[locale]/\(mobile\)/layout.tsx src/app/[locale]/\(mobile\)/page.tsx
git commit -m "feat(ux): phase 2 — rewire home with trust-first section order

Removes Hero inner stat cards (No Korean/Zero deposit/88 handled),
ARC panel, and assurance cards (FINDING-001). ConversionHighlights
drops left consultation + stats blocks, compresses 4 highlights → 3,
and replaces step-number circles with 'Step N' text (FINDING-011).
Mounts PartnerRibbon + ConsultationBar in the mobile layout. Home
section order: Hero → TrustStatsStrip → ReviewCardList → Products →
ConversionHighlights → FAQ → PartnerLogoGrid → Footer. Inline
EligibilityCheckerWrapper section removed — Hero CTA now anchors to
FAQ 'is-kt-official' which directly answers the primary
foreigner-legitimacy question."
```

---

## Task 3: Phase 3 — Phone Detail Single-Scroll Rebuild

**Goal:** Replace the two-step split in `PhoneDetailClient` with single-scroll layout. Swap modal-based OptionSelector for inline `OptionPills`. Replace `JunCarousel` usage with new `ProductImageCarousel`. Insert `WhyCheapCard`, `ReviewCardList(filterModel)`, `FAQAccordion(namespace='Phone.FAQ')`. Remove the "Purchase Ready" box and step-2 eyebrow card. Keep `StickyBar` + price calc intact.

**Files:**
- Create: `src/shared/components/ui/ProductImageCarousel.tsx`
- Create: `src/shared/components/ui/OptionPills.tsx`
- Modify: `src/features/phone/components/PhoneDetailClient.tsx`

---

- [ ] **Step 3.1: Create ProductImageCarousel.tsx**

Create `src/shared/components/ui/ProductImageCarousel.tsx`:

```tsx
'use client';

import { useRef } from 'react';
import Image from 'next/image';

interface Props {
  urls: string[];
  altBase?: string;
  className?: string;
}

/**
 * Single-scroll product gallery: 1 main image + thumbnail strip.
 * Clicking a thumbnail scrolls the main viewport via scroll-snap.
 * Replaces JunCarousel on /phone. JunCarousel is kept elsewhere.
 */
export default function ProductImageCarousel({ urls, altBase = 'Product image', className = '' }: Props) {
  const mainRef = useRef<HTMLDivElement | null>(null);

  if (!urls || urls.length === 0) {
    return (
      <div className={`w-full aspect-[4/3] rounded-[20px] bg-[#F2F4F6] ${className}`} aria-hidden="true" />
    );
  }

  const scrollToIndex = (i: number) => {
    const el = mainRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={mainRef}
        className="scrollbar-hide flex w-full snap-x snap-mandatory overflow-x-auto rounded-[20px] bg-[#F9FAFB]"
        tabIndex={0}
        role="group"
        aria-label={`${altBase} gallery`}
      >
        {urls.map((url, i) => (
          <div key={i} className="relative aspect-[4/3] w-full shrink-0 snap-start">
            <Image
              src={url}
              alt={`${altBase} ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 440px"
              className="object-contain p-6"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {urls.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {urls.map((url, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => scrollToIndex(i)}
                className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-[12px] border border-[#E5E8EB] bg-white"
                aria-label={`${altBase} thumbnail ${i + 1}`}
              >
                <Image src={url} alt="" fill sizes="56px" className="object-contain p-1" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 3.2: Create OptionPills.tsx**

Create `src/shared/components/ui/OptionPills.tsx`:

```tsx
'use client';

import Image from 'next/image';

export interface ColorPill {
  label: string;
  value: string;
  image: string;
  isSoldOut: boolean;
}
export interface CapacityPill {
  label: string;
  value: string;
}

interface Props {
  selectedCapacity: string;
  selectedColor: string;
  capacities: CapacityPill[];
  colors: ColorPill[];
  onSelectCapacity: (val: string) => void;
  onSelectColor: (val: string) => void;
  capacityLabel: string;
  colorLabel: string;
}

export default function OptionPills({
  selectedCapacity, selectedColor,
  capacities, colors,
  onSelectCapacity, onSelectColor,
  capacityLabel, colorLabel,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B7280]">
          {capacityLabel}
        </p>
        <div className="flex flex-wrap gap-2">
          {capacities.map((c) => {
            const active = c.value === selectedCapacity;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => onSelectCapacity(c.value)}
                className={
                  'min-h-[44px] rounded-full border px-4 py-2 text-sm font-semibold transition ' +
                  (active
                    ? 'border-[#0055D4] bg-[#0055D4] text-white'
                    : 'border-[#E5E8EB] bg-white text-[#111827]')
                }
                aria-pressed={active}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B7280]">
          {colorLabel}
        </p>
        <ul className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
          {colors.map((c) => {
            const active = c.value === selectedColor;
            return (
              <li key={c.value}>
                <button
                  type="button"
                  onClick={() => onSelectColor(c.value)}
                  disabled={c.isSoldOut}
                  aria-pressed={active}
                  className={
                    'flex shrink-0 flex-col items-center gap-1 rounded-2xl border p-2 transition ' +
                    (active ? 'border-[#0055D4] bg-[#F0F7FF]' : 'border-[#E5E8EB] bg-white') +
                    (c.isSoldOut ? ' opacity-40' : '')
                  }
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-[#F9FAFB]">
                    {c.image ? (
                      <Image src={c.image} alt="" fill sizes="48px" className="object-contain p-1" />
                    ) : null}
                  </div>
                  <span className="max-w-[72px] truncate text-[11px] font-semibold text-[#111827]">
                    {c.label}
                  </span>
                  {c.isSoldOut && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#F04452]">
                      Sold out
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 3.3: Refactor PhoneDetailClient.tsx**

Replace the entire content of `src/features/phone/components/PhoneDetailClient.tsx` with:

```tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import StickyBar from "@/features/phone/components/StickyBar"
import JoinTypeSelector from "@/features/phone/components/JoinTypeSelector"

import dynamic from "next/dynamic"
import { formatPrice } from "@/shared/lib/format"
import { calculateFinalDevicePrice } from "@/features/phone/lib/priceCalculation"

import ProductImageCarousel from "@/shared/components/ui/ProductImageCarousel"
import OptionPills, { type ColorPill, type CapacityPill } from "@/shared/components/ui/OptionPills"
import WhyCheapCard from "@/shared/components/ui/WhyCheapCard"
import ReviewCardList from "@/shared/components/ui/ReviewCardList"
import FAQAccordion from "@/shared/components/ui/FAQAccordion"

const PlanSelector = dynamic(() => import("@/features/phone/components/PlanSelector"), { ssr: true })

import { usePhoneStore, Plan } from "@/features/phone/model/usePhoneStore"
import { MODEL_VARIANTS, getColorMap } from "@/features/phone/lib/phonedata"
import { checkIsSoldOut } from "@/features/phone/lib/stock"

interface InitialData {
  model: string
  title: string
  capacity: string
  color: string
  originPrice: number
  imageUrl: string
  imageUrls: string[]
  plans: Plan[]
  subsidies: unknown
  registrationType: "chg" | "mnp"
  userCarrier: string
  availableColors: string[]
  colorImages: Record<string, string[]>
  prefix: string
}

interface Props {
  initialData: InitialData
  locale: string
}

export default function PhoneDetailClient({ initialData, locale }: Props) {
  const t = useTranslations()
  const router = useRouter()
  const store = usePhoneStore()

  useEffect(() => {
    store.setStore({
      model: initialData.model,
      title: initialData.title,
      capacity: initialData.capacity,
      originPrice: initialData.originPrice,
      color: initialData.color,
      imageUrl: initialData.imageUrl,
      imageUrls: initialData.imageUrls,
      plans: initialData.plans,
      subsidies: initialData.subsidies,
      registrationType: initialData.registrationType,
      userCarrier: initialData.userCarrier,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData])

  const isStoreSynced = store.model === initialData.model
  const currentTitle = (isStoreSynced && store.title) || initialData.title
  const currentCapacity = (isStoreSynced && store.capacity) || initialData.capacity
  const currentColor = (isStoreSynced && store.color) || initialData.color
  const currentOriginPrice = (isStoreSynced && store.originPrice) || initialData.originPrice
  const currentImageUrls = (isStoreSynced && store.imageUrls && store.imageUrls.length > 0) ? store.imageUrls : initialData.imageUrls
  const currentPlans = (isStoreSynced && store.plans && store.plans.length > 0) ? store.plans : initialData.plans

  const { availableColors, colorImages, prefix } = initialData
  const COLOR_MAP = getColorMap(t)

  const isCurrentlySoldOut = checkIsSoldOut(prefix, currentCapacity, currentColor)
  const allVariantsSoldOut = availableColors.every((c) => checkIsSoldOut(prefix, currentCapacity, c))

  const handleCapacityChange = (newCap: string) => {
    store.setStore({ capacity: newCap })
  }

  const handleColorChange = (newColor: string) => {
    const newImageUrls = colorImages[newColor] || []
    const newImageUrl = newImageUrls[0] || ""
    store.setStore({ color: newColor, imageUrl: newImageUrl, imageUrls: newImageUrls })
    const newModel = `${prefix}-${currentCapacity}-${newColor}`
    router.replace(`/${locale}/phone?model=${encodeURIComponent(newModel)}`, { scroll: false })
  }

  const handleOrder = () => {
    if (isCurrentlySoldOut) return
    const payload = {
      model: store.model || initialData.model,
      title: currentTitle,
      capacity: currentCapacity,
      color: currentColor,
      originPrice: currentOriginPrice,
      imageUrl: currentImageUrls[0] || "",
      selectedPlanId: store.selectedPlanId,
      discountMode: store.discountMode,
      finalDevicePrice,
      userCarrier: store.userCarrier || initialData.userCarrier,
      registrationType: store.registrationType || initialData.registrationType,
      savedAt: new Date().toISOString(),
    }
    sessionStorage.setItem("asamoDeal", JSON.stringify(payload))
    router.push(`/${locale}/phone/order?model=${store.model || initialData.model}`)
  }

  const capacityOpts: CapacityPill[] = (MODEL_VARIANTS[prefix] || []).map((c) => ({
    label: c === "1t" ? "1TB" : c === "2t" ? "2TB" : `${c}GB`,
    value: c,
  }))

  const colorOpts: ColorPill[] = availableColors.map((c) => ({
    label: COLOR_MAP[c] || c,
    value: c,
    image: colorImages[c]?.[0] || "",
    isSoldOut: checkIsSoldOut(prefix, currentCapacity, c),
  }))

  const currentPlan = currentPlans.find((p) => p.id === store.selectedPlanId)

  const finalDevicePrice = calculateFinalDevicePrice({
    originPrice: currentOriginPrice,
    plan: currentPlan,
    discountMode: store.discountMode,
    registrationType: store.registrationType || initialData.registrationType,
    modelPrefix: prefix,
  })

  const priceText = `${formatPrice(finalDevicePrice, locale)}${t("Phone.Common.won")}`
  const originText = `${formatPrice(currentOriginPrice, locale)}${t("Phone.Common.won")}`

  return (
    <div className="w-full max-w-[780px] mx-auto bg-white min-h-screen pb-28 md:pb-12">
      <div className="md:flex md:gap-8 md:items-start md:py-12">
        <div className="w-full md:w-1/2 md:sticky md:top-24">
          <ProductImageCarousel urls={currentImageUrls} altBase={currentTitle} className="md:max-w-[440px] md:mx-auto" />
        </div>

        <div className="px-5 md:px-0 w-full mt-6 md:mt-0 md:w-1/2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1d1d1f]">{currentTitle}</h1>
            <div className="mt-2 text-xs text-[#6B7280]">
              {currentCapacity}GB · {COLOR_MAP[currentColor] || currentColor}
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold tabular-nums text-[#1d1d1f]">{priceText}</span>
              <span className="text-xs text-[#9CA3AF] line-through tabular-nums">{originText}</span>
            </div>
          </div>

          <OptionPills
            selectedCapacity={currentCapacity}
            selectedColor={currentColor}
            capacities={capacityOpts}
            colors={colorOpts}
            onSelectCapacity={handleCapacityChange}
            onSelectColor={handleColorChange}
            capacityLabel={t("Phone.OptionSelector.capacity_label") || "Capacity"}
            colorLabel={t("Phone.OptionSelector.color_label") || "Color"}
          />

          {allVariantsSoldOut && (
            <div className="rounded-[16px] border border-[#FDE8EA] bg-[#FEF2F2] p-3 text-xs font-semibold text-[#B91C1C]">
              All variants sold out for this capacity.
            </div>
          )}

          <WhyCheapCard />

          <JoinTypeSelector
            registrationType={store.registrationType || initialData.registrationType}
            onChange={(type) => store.setStore({ registrationType: type })}
            t={t}
          />

          <PlanSelector
            plans={currentPlans}
            selectedPlanId={store.selectedPlanId}
            discountMode={store.discountMode}
            originPrice={currentOriginPrice}
            ktMarketDiscount={0}
            registrationType={store.registrationType || initialData.registrationType}
            modelPrefix={prefix}
            onSelectPlan={(id: string) => store.setStore({ selectedPlanId: id })}
            onChangeMode={(mode: "device" | "plan") => store.setStore({ discountMode: mode })}
          />

          <div className="hidden md:block">
            <button
              onClick={handleOrder}
              disabled={isCurrentlySoldOut}
              className={
                "w-full text-white text-lg font-bold py-4 rounded-xl transition-colors shadow-lg cursor-pointer " +
                (isCurrentlySoldOut
                  ? "bg-gray-400 cursor-not-allowed shadow-none"
                  : "bg-[#0071e3] hover:bg-[#0077ED] shadow-blue-500/20")
              }
            >
              {isCurrentlySoldOut ? "Sold Out" : t("Phone.Page.submit_application")}
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 md:px-8 mt-8">
        <ReviewCardList filterModel={currentTitle} autoGrid />
        <FAQAccordion namespace="Phone.FAQ" />
      </div>

      <div className="md:hidden">
        <StickyBar
          finalPrice={priceText}
          label={isCurrentlySoldOut ? "Sold Out" : t("Phone.Page.submit_application")}
          onClick={handleOrder}
        />
      </div>
    </div>
  )
}
```

What changed vs previous file:
- Removed `step`, `isModalOpen`, `Modal`, `OptionSelector`, `OptionSummary`, `JunCarousel`, `ChevronLeft`, `BadgeCheck`, `Globe2`, `ShieldCheck`, `Truck` imports.
- Removed the "Purchase Ready" box, purchase highlights loop, the step-1/step-2 conditional blocks, `pricing_eyebrow` block, `handleNextStep`.
- Inline options via `OptionPills`, image via `ProductImageCarousel`, new `WhyCheapCard` + `ReviewCardList(filterModel=currentTitle)` + `FAQAccordion(namespace='Phone.FAQ')`.
- `StickyBar` shows `priceText` directly (was `""` in step 1). `JoinTypeSelector`, `PlanSelector`, price calc, store sync, sold-out check all preserved.

- [ ] **Step 3.4: Check unused i18n keys and add missing pill labels**

The new `OptionPills` expects `Phone.OptionSelector.capacity_label` and `Phone.OptionSelector.color_label`. Open `src/messages/en.json`. Find the existing `"Phone.OptionSelector"` object and ensure it has both keys. If missing, add:

```json
      "capacity_label": "Capacity",
      "color_label": "Color",
```

Mirror the same two keys into `ja.json`, `zh.json`, `ko.json` with the `[TODO-LOCALE]` prefix convention.

- [ ] **Step 3.5: Verify typecheck + lint + dev**

Run: `npm run typecheck && npm run lint`
Expected: PASS. There may be ESLint warnings about unused imports now that several were removed — resolve by deleting any lingering imports.

Run: `npm run dev`
Navigate to `http://localhost:3000/en/phone?model=aip17-256` (or any valid model from your supabase). Verify:
- No step 1 / step 2 split — all content scrolls in one page.
- Image carousel works (swipe or thumbnail click).
- Color/capacity pills appear inline without modal.
- WhyCheapCard toggles open/closed.
- JoinType + PlanSelector work unchanged.
- ReviewCardList renders below plan (may be empty if no reviews match the model — verify by opening a model not in the 8 seeded reviews, then one that is).
- Phone-specific FAQAccordion renders.
- StickyBar shows price + Apply Now; tapping it stores payload and navigates to `/phone/order?model=…`.
- ConsultationBar does NOT appear on this route.

Stop dev server.

- [ ] **Step 3.6: Commit Phase 3**

```bash
git add src/shared/components/ui/ProductImageCarousel.tsx src/shared/components/ui/OptionPills.tsx src/features/phone/components/PhoneDetailClient.tsx src/messages/en.json src/messages/ja.json src/messages/zh.json src/messages/ko.json
git commit -m "feat(ux): phase 3 — phone detail single-scroll rebuild

Drops the step 1 / step 2 split, 'Purchase Ready' box, pricing eyebrow
card, and purchase-highlights panel. Replaces the modal-based
OptionSelector with inline OptionPills (capacity + color), and swaps
JunCarousel for ProductImageCarousel with thumbnails. Inserts
WhyCheapCard, per-model ReviewCardList, and phone-specific
FAQAccordion. StickyBar preserved; price calc, store sync, sold-out
logic unchanged. Adds capacity_label/color_label i18n keys."
```

---

## Task 4: Phase 4 — Translations + Image Assets + QA

**Goal:** Localize the `[TODO-LOCALE]`-prefixed strings, drop partner logo assets, and run the manual QA checklist.

**Files:**
- Modify: `src/messages/ja.json`, `src/messages/zh.json`, `src/messages/ko.json`
- Add: `public/images/partners/{kt,samsung,apple,kakaopay,tta}.svg`
- Optional: `public/images/hero-phones.webp` (if available)

---

- [ ] **Step 4.1: Translate ja/zh/ko Home.Trust / Home.Reviews / Home.FAQ / Phone.WhyCheap / Phone.FAQ / Consultation blocks**

For each of `ja.json`, `zh.json`, `ko.json`:

1. Search the file for the `[TODO-LOCALE] ` prefix: `grep -n "TODO-LOCALE" src/messages/ja.json`
2. For every hit, replace the prefixed English text with a proper translation of the same meaning.
3. Do not change `country_code`, `id`, dates, model names, URLs, or phone numbers in `items[]`.
4. Keep JSON valid (no trailing commas).

For Korean specifically, the ribbon should read approximately:
`"★ KT 공식 파트너 · 2018년 제휴 · 사업자번호 123-45-67890"`
and short form: `"★ KT 공식 파트너"`

- [ ] **Step 4.2: Verify no TODO-LOCALE marker remains**

Run:
```bash
grep -rn "TODO-LOCALE" src/messages/ || echo "clean"
```
Expected: `clean`.

- [ ] **Step 4.3: Drop partner logos**

Place the following files in `public/images/partners/`:
- `kt.svg`
- `samsung.svg`
- `apple.svg`
- `kakaopay.svg`
- `tta.svg`

If an SVG is not yet available, create a placeholder text SVG:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="28" viewBox="0 0 96 28">
  <rect width="96" height="28" fill="#F2F4F6"/>
  <text x="48" y="18" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#4B5563" font-weight="700">KT</text>
</svg>
```

(Change `KT` to the brand name per file.) These placeholders still render correctly and will be swapped later without touching code.

- [ ] **Step 4.4: (Optional) Drop hero-phones.webp**

If a rendered hero image exists, save it as `public/images/hero-phones.webp` and update the Hero section to use it:

In `src/features/phone/components/HeroSection.tsx`, change the `Image src` from `/images/신분증이미지1.webp` to `/images/hero-phones.webp`. If no image is available, skip this step — the ARC fallback stays.

- [ ] **Step 4.5: Run QA checklist**

Run `npm run dev` and, at 375px mobile viewport (Chrome DevTools), step through each locale (`/en`, `/ja`, `/zh`, `/ko`):

1. Ribbon renders in each locale; no text truncation awkwardly breaks meaning.
2. Hero headline doesn't drop a single character onto its own line.
3. TrustStatsStrip: 3 cells, no overflow.
4. ReviewCardList: scroll with finger AND arrow keys; cards align to snap.
5. Products section: cards render same as before (regression check).
6. ConversionHighlights: 3 items (not 4), "Step 1/2/3" labels.
7. FAQAccordion: click expands; hash link `/en#faq-is-kt-official` auto-opens that item.
8. PartnerLogoGrid: 5 slots, grayscale, fallback rect if SVG missing.
9. ConsultationBar appears on home, disappears on `/phone/...` and `/admin/...`.
10. Open phone detail for a model that exists in reviews (e.g., `iPhone 17 Pro`) — ReviewCardList should show the matching card only.
11. Phone detail StickyBar shows price; disabled when variant sold out.
12. Run Lighthouse (mobile) on `/en`. Target: Performance ≥ 85, Accessibility ≥ 95. Note findings; fix obvious issues inline (e.g., missing alt, poor contrast) as micro-commits.
13. All touch targets ≥ 44px: use DevTools "Inspect → Accessibility → Check element size" on ConsultationBar buttons, FAQ buttons, WhyCheapCard toggle, OptionPills.

- [ ] **Step 4.6: Commit Phase 4**

```bash
git add src/messages/ja.json src/messages/zh.json src/messages/ko.json public/images/partners/
# If hero-phones.webp was added also include it + src/features/phone/components/HeroSection.tsx
git commit -m "feat(ux): phase 4 — translations, partner logos, QA sweep

Completes ja/zh/ko translations for Home.Trust/Home.Reviews/Home.FAQ/
Phone.WhyCheap/Phone.FAQ/Consultation blocks. Drops placeholder SVG
partner logos (KT/Samsung/Apple/KakaoPay/TTA). Manual QA at 375px
across four locales passes the redesign spec's acceptance checklist."
```

If Lighthouse/QA surfaced issues (contrast, alt text, etc.), create a final commit:

```bash
git add <fix paths>
git commit -m "fix(ux): phase 4 QA polish from Lighthouse + touch-target audit"
```

---

## Task 5: Close-out

- [ ] **Step 5.1: Verify full build**

```bash
npm run check-all
```
Expected: lint + typecheck + build all PASS.

- [ ] **Step 5.2: Update DESIGN-FIXES.md absorbed findings**

Open `DESIGN-FIXES.md` at the repo root. At the top of the file, add a note:

```markdown
> **2026-04-24 Update:** FINDING-001, 003, 005, 011, 013 are addressed by the UX redesign (see `docs/superpowers/specs/2026-04-24-ux-redesign-design.md`). FINDING-002, 004, 006, 007, 008, 009, 010, 012, 014 remain open — handle in follow-up PRs when touching the affected files.
```

Commit:

```bash
git add DESIGN-FIXES.md
git commit -m "docs: mark DESIGN-FIXES findings absorbed by ux redesign"
```

- [ ] **Step 5.3: Push & open PR**

Decide push cadence with the team. Each Phase above was meant to be its own PR — if you squashed phases into one branch, split with `git log --oneline` and stacked-diff tooling, or open one PR with the commit history shown.
