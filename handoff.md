# destec.co.il — Developer Handoff

_Last updated: June 2026_

The public marketing/catalog website for **DES — שירותי ציוד רפואי ודנטלי** (Dental Equipment Services), an Israeli importer/distributor of dental & medical equipment.

---

## 1. Stack & where it lives

| | |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 3.4 (`tailwind.config.ts`) + lots of inline styles |
| Animation | `framer-motion` (v12) |
| Backend | **Supabase** (Postgres) — anon/publishable key only |
| Hosting | **Vercel** — auto-deploys on push to `main` (region `cdg1`) |
| Repo | `github.com/igalshpo12/destec-site` |
| Local path | `/Users/igalsh/Projects/destec-site` (active copy; a mirror exists on `/Volumes/Crucial X9/Projects/destec-site`) |
| Language/dir | Hebrew, RTL (`<html dir="rtl" lang="he">`) |

**Brand colors:** navy `#1a2b4a`, deep `#0d1929`, electric blue `#1e90ff`, light bg `#f7f8fa`/`#fbfcfe`, grey text `#6b7280`. Headlines are heavy/black weight (Heebo / Noto Sans Hebrew).

---

## 2. Run / build / deploy

```bash
npm install
npm run dev          # dev server (localhost:3000)
npm run build        # production build
npm run start        # serve the production build
npm run lint         # eslint "src/**/*.{ts,tsx}"  (NOTE: `next lint` was removed in Next 16)
```

- **Env:** `.env.local` (gitignored) holds `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `CONTACT_EMAIL`, `RESEND_API_KEY`. The public Supabase URL + anon (publishable) key are also in `vercel.json` / `.env.example` — safe to expose.
- **Deploy:** just `git push origin main` → Vercel builds & deploys. No manual step.
- **Contact form** (`/api/contact`) emails via Resend if `RESEND_API_KEY` is set, else logs to console.

---

## 3. Routes

| Route | File | Notes |
|---|---|---|
| `/` | `src/app/page.tsx` | Homepage (composed of section components) |
| `/catalog` | `src/app/catalog/page.tsx` | Gated by `CATALOG_LIVE` — see §5 |
| `/catalog/[id]` | `src/app/catalog/[id]/page.tsx` | Product detail (dormant until catalog goes live) |
| `/contact` | `src/app/contact/page.tsx` | Contact form + map |
| `/accessibility` | `src/app/accessibility/page.tsx` | **Legally required** הצהרת נגישות — see §6 |
| `/api/contact` | `src/app/api/contact/route.ts` | Form handler (Resend) |
| `/robots.txt`, `/sitemap.xml`, `/opengraph-image` | `src/app/robots.ts`, `sitemap.ts`, `opengraph-image.tsx` | SEO |

Homepage section order (`src/app/page.tsx`): HeroSlider → VacusonShowcase → TrustBar → (ProductTabs only if `CATALOG_LIVE`) → CategoryShowcase → ProductShowcase3D → FeaturedSystems → TrainingSection → GeneralMedSection → WorkshopSection → AboutSection → ClientLogosStrip.

---

## 4. What was built (recent work)

- **Editorial hero** (`HeroSlider.tsx`): soft-blue "DES" ghost wordmark, a **card-shuffle photo deck** (`public/hero/*.jpg`, the 5 liked Higgsfield finals) that auto-advances + drags, floating ISO/+10-brands cards, stat row. "DES" uses the 21st.dev **`gradient-text`** component in brand blue.
- **`gradient-text` component** (`src/components/ui/gradient-text.tsx`): animated blob-gradient text. Color tokens `--color-1..5` (brand blues, **not** the neon defaults) in `globals.css`; morphing keyframes in `tailwind.config.ts` + `globals.css`. Uses existing `framer-motion` (not the `motion` package). The old animated `GradientText.tsx` was removed.
- **Vacuson 60 LP showcase** (`VacusonShowcase.tsx`): cinematic dark section, fixed bidi spec units, and a **drag-to-spin 360** (`Spin360` + `public/products/vacuson-360/`).
- **MK-Dent turbine 360** in the service section (`WorkshopSection.tsx` → `SpinTurbine360.tsx`, `public/products/turbine-360/`).
- **`Spin360.tsx`** (reusable, **canvas-based**, smooth) — prefer this for new 360s. (`SpinTurbine360.tsx` is the older stacked-`<img>` version; works but laggier.)
- **SEO:** `metadataBase`, dynamic OG image, robots, sitemap.
- **Catalog gating + "coming soon" state** + `/catalog/[id]` detail page (built, dormant).
- **Accessibility:** widget + statement page (see §6).
- Content cleanup: removed unverified "9,000+ מוצרים / זמינות מיידית" claims (kept the free-shipping policy), fixed a wrong `tel:` number, removed the inaccurate SupplierLogoStrip section, removed dead Spline code.

---

## 5. ⚠️ Catalog is NOT live — biggest open item

Two reasons it's gated:
1. `CATALOG_LIVE = false` in `src/lib/utils.ts` (hides ProductTabs, `/catalog` grid, `/catalog/[id]`).
2. **The live Supabase `equipment` / `equipment_prices` tables are EMPTY** — the anon key returns 0 rows (no RLS error, just empty).

To take the catalog live: **migrate the prepared data** (`data/matched.csv`, ~293 items) into Supabase via `scripts/migrate-catalog.mjs`, verify, then flip `CATALOG_LIVE = true`. The hardcoded showcases (Vacuson, ProductShowcase3D, FeaturedSystems) are not DB-driven and always show.

---

## 6. ⚠️ Accessibility — legally required, 2 items pending

Israel's **IS 5568** (≈ WCAG 2.1 **AA**) is mandatory for public-service sites; an accessibility statement with a contact channel is required; non-compliance allows statutory damages up to **₪50,000** without proof of harm.

Built: accessibility **widget** (`src/components/a11y/AccessibilityWidget.tsx` — ♿ bottom-right; font size, contrast/grayscale/sepia/invert, readable font, highlight links/headings, stop animations, big cursor, focus highlight, reset; persists to `localStorage`; restored pre-paint by an inline script in `layout.tsx`; color filters target the `#site` wrapper so the widget itself isn't filtered), the **statement page** `/accessibility`, a skip-to-content link, and enhanced focus.

**Still required:**
1. **Name a רכז נגישות (accessibility coordinator)** — the statement says `[שם רכז הנגישות — להשלמה]`. Fill in `src/app/accessibility/page.tsx`.
2. **Professional audit** — the widget is an aid, not compliance. A licensed **מורשה נגישות שירות** should verify/sign off underlying WCAG 2.1 AA conformance.

---

## 7. The 3D-product / 360 pipeline (Higgsfield)

Used for the turbine & Vacuson spinners and the hero deck images. Requires the **Higgsfield MCP** (user account, Plus plan, ~600 credits left). `ffmpeg` and `sharp` are available locally; **no ImageMagick**.

**Static 3D render:** `nano_banana_pro` (image), ~2 credits, pure-white bg → flood-fill cutout (sharp) → optimized webp/png.

**360 turntable:** real product photo → `media_upload`/`media_confirm` → `seedance_2_0` image-to-video "turntable" (~22 credits, 720p/5s, role `start_image`) → `ffmpeg` extract frames → per-frame sharp **flood-fill cutout** → `Spin360` viewer.

**Hard-won cutout gotchas (see also the `destec-site-repo` memory):**
- seedance **always re-renders/garbles real text** (it produced "Vaurson 66 LP", then invented "Nougar®"). You cannot keep a correct product label on a spin — remove/blur-blend that band in the source/frames and rely on the heading.
- Flood-fill leaves **floating floor-shadow blobs** (darker than threshold). Fix with a **connected-component pass keeping only the largest component** (attached pedal/cables survive via their connections).
- **Simple solid objects cut out perfectly** (turbine); **complex multi-part devices** (Vacuson: clear jars, thin tubes, pedal) stay slightly rough at high zoom. Set expectations or use a static photo.

**Source assets:** `asset-gen/` (~158 MB of generated PDFs/promo PNGs + the `final/` "house-style" creatives) is **gitignored** — not site source. Real product photos from the *current* live destec.co.il listings are served from `d3m9l0v76dty0.cloudfront.net/system/photos/<id>/...`.

---

## 8. Things to know / gotchas

- **Parallel work in the tree:** an analytics/consent initiative (`src/lib/analytics.ts`, `src/components/analytics/SiteAnalytics.tsx` + `ConsentBanner`, wired in `layout.tsx`) was developed alongside this and is committed. It renders a cookie/consent banner pinned at the bottom. See the `destec-marketing-tracking` memory **and `handoff-marketing.md`** (the full social/lead-tracking/outreach handoff: GA4, Meta Pixel/CAPI, n8n review automation, Google Business Profile, SMS plan).
- `eslint-config-next` is pinned to `14.2.35` while Next is `16` — a version mismatch worth bumping when convenient.
- `test-results/` and `asset-gen/` are gitignored.
- `tests/` has Playwright specs; `playwright.config.ts` exists (chromium installed for screenshotting during dev).

---

## 9. Open / next-up checklist

- [ ] **Migrate catalog data into Supabase** (`scripts/migrate-catalog.mjs`, `data/matched.csv`), verify, flip `CATALOG_LIVE = true`. *(biggest item)*
- [ ] **Accessibility:** fill coordinator name in `/accessibility`; commission a licensed accessibility audit.
- [ ] Decide on remaining content claims (free-shipping ₪500 policy wording; client-names strip).
- [ ] `TrainingSection.tsx` still has a **photo placeholder** ("תמונה: מיכאל שפוליאנסקי בהרצאה") — drop in the real photo.
- [ ] (Optional) trim Vacuson 360 frame weight (~1 MB near top of page); migrate `SpinTurbine360` to the canvas `Spin360`.
- [ ] Bump `eslint-config-next` to a Next-16-compatible version.

---

## 10. Recent commits (newest first)

```
9a6991a feat: Vacuson 60 LP drag-to-spin 360 (smooth canvas viewer)
81080b5 feat: accessibility — IS 5568 / WCAG 2.1 AA widget + statement page
0b97b9d feat: real 360° MK-Dent turbine in the service section
e828f07 feat: editorial hero revamp — shuffle deck, brand-blue DES, Vacuson showcase
7d598b7 feat: public-site review fixes — SEO, catalog gating, product detail page, content cleanup
```

---

## 11. Business contact (on-site)

Phone `03-5081868` · WhatsApp `054-8818681` (`wa.me/972548818681`) · `info@destec.co.il` · רחוב מסריק 23, בת ים · ISO 9001 · רישיון אמ"ר · ע"מ 310737085.
