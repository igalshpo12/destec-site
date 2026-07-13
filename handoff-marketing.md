# DES / destec.co.il — Social & Lead-Tracking Initiative — HANDOFF

_Last updated: 2026-06-15. Started 2026-06-05._
_Companion to `handoff.md` (the website developer handoff). This doc covers marketing/social/tracking/outreach, which spans the site + n8n + Google + Meta + the CRM._

## 0. Goal
Connect DES (Dental Equipment Services, destec.co.il) to social media + set up audience targeting and reach/lead tracking. B2B, Israel, Hebrew/RTL. Three motions: sell equipment, repair+pickup, training. Audience: dental clinics, labs, procurement.

**Golden rule: nothing outbound fires (emails/SMS/ads) without the owner's explicit OK.** Build foundations, then fire deliberately.

---

## 1. Status at a glance

| Piece | Status | Note |
|---|---|---|
| Website tracking code (GA4 + Meta Pixel + CAPI + consent + UTM→lead) | ✅ Built in repo | Dormant until site is live |
| GA4 | ✅ ID obtained + wired | `G-C1JB32GLV9`; in `.env.local`; user adding to Vercel + redeploy |
| Meta Pixel + CAPI token | ⏳ PENDING | User grabbing from Events Manager; then wire `NEXT_PUBLIC_META_PIXEL_ID` + `META_CAPI_TOKEN` |
| **destec.co.il new site LIVE** | ⛔ NOT LIVE | Biggest gap — all website tracking only works once live |
| Review-request email automation (n8n) | ✅ Built, INACTIVE | Needs emails loaded; fire on OK |
| Google Business Profile | ✅ Owned, 4.4★ | Polish pending (desc/photos/hours/services) |
| Facebook page | ✅ Exists | facebook.com/destec.co.il |
| Instagram / WhatsApp Business | ⏳ Confirm/open | |
| SMS channel (the real reach: ~1,060 mobiles) | ⏳ Not built | Needs an SMS gateway choice |
| Lead dashboard / Custom Audiences / ads | ⚪ After tracking live | |

---

## 2. Website tracking foundation (repo: `~/Projects/destec-site`)
**Files added/changed:**
- `src/lib/analytics.ts` — GA4/Meta helpers, consent (cookie `des_consent`), UTM first/last-touch capture (cookie `des_attr`), `trackEvent`/`trackMeta`.
- `src/components/analytics/SiteAnalytics.tsx` — loads GA4 + Meta Pixel **only after cookie consent**; SPA pageviews; delegated click tracking for `tel:` / `wa.me` / `mailto:` → conversion events. Mounted in `src/app/layout.tsx`.
- `src/components/analytics/ConsentBanner.tsx` — Hebrew RTL consent banner.
- `src/components/ui/ContactForm.tsx` — sends attribution + a dedup `eventId`; fires `contact_form_submit` (GA4) + `Lead` (Meta) on success.
- `src/app/api/contact/route.ts` — accepts attribution, adds "מקור הליד" block to the lead email, sends **server-side Meta CAPI Lead** (hashed email/phone, `_fbp`/`_fbc`, dedup via shared `eventId`). HTML-escaped fields.
- `.env.example` — documents the new vars.

**Env vars:**
- `NEXT_PUBLIC_GA4_ID=G-C1JB32GLV9` ✅ (in local `.env.local`; add to Vercel Production+Preview, then redeploy)
- `NEXT_PUBLIC_META_PIXEL_ID=` ⏳ (public; the 15–16 digit Pixel ID)
- `META_PIXEL_ID=` ⏳ (optional, falls back to NEXT_PUBLIC)
- `META_CAPI_TOKEN=` ⏳ (SECRET — server-side only, never NEXT_PUBLIC; set in Vercel as sensitive)

All tags are consent-gated (blank IDs = nothing loads, no banner). Build passes. Vercel CLI not authed locally → set env vars via the Vercel dashboard, then redeploy.

---

## 3. Review-request automation (n8n: destec101.app.n8n.cloud, project `A8El6vZn6a1fBcNO`)
- **Workflow `gviWVZCorIT30ty7`** — "DES — Review Request (Email) [INACTIVE]". Manual trigger → Data Table get unsent → **cap 200/run** → Gmail send → mark sent. **INACTIVE / never fired.**
- **Data Table `DES Review Email List`** id `QaP2dWiBihqaTgNk` (cols: email, name, sent, sent_at). Source + built-in dedupe. **Seeded self-test row `ishpoliansky@gmail.com` (sent=false)** → first fire emails only the owner.
- **Preview workflow `LR5ZjBpmuDWeX2Ok`** — read-only count, NO send node (used for the data audit in §4).
- Gmail credential: `P0fBr0y8LIMtPg9R` ("Gmail-DES info" = info@destec.co.il). Supabase cred: `C1mZDp1RDBiZYzZL`.

**Fire sequence (when approved):** load emails into the Data Table (sent=false) → run once (emails only the self-test row) → verify in inbox → run again to send the rest in 200-batches → dedupe prevents repeats.

---

## 4. KEY DATA FINDING (verified via live Supabase count, 2026-06-05)
Of **3,345** rows in `clients`: only **2** have an email; **3,237** have a phone (~3,038 unique, **~1,060 mobile** = SMS/WhatsApp-reachable; rest are clinic landlines).
➡️ **Email cannot reach the customer base from the DB.** The real outreach channel is **SMS/WhatsApp to the ~1,060 mobiles.** Owner said they have a separate batch of emails to load into the Data Table for the email path.

---

## 5. Google
- **GA4:** property "destec.co.il", ID `G-C1JB32GLV9`, objectives Generate leads + Understand web traffic, web stream "DES Website". Do NOT paste Google's manual gtag snippet — the site already loads it from env.
- **Google Business Profile:** EXISTS, verified/owned, 4.4★ (7 reviews). Review link: **https://g.page/r/CTW-lItmLXp7EAE/review**
  - Pending polish: paste the Hebrew description (§8), add 10–15 photos, fix hours (profile says 9am, site says 08:00), add services list.
  - The "Chat" button is dead (Google sunset Business Profile messaging July 2024) — ignore it; use WhatsApp.

---

## 6. Meta (PENDING)
- FB page exists: facebook.com/destec.co.il.
- TODO: business.facebook.com/events_manager → create web dataset → copy **Pixel ID** (15–16 digits) and generate **Conversions API access token**. Send both → wire into env (Pixel ID public, CAPI token secret) + Vercel.
- TODO: confirm/open Instagram (link to FB page) and WhatsApp Business app.

---

## 7. Decisions & compliance
- Review blast: one-time, from info@destec.co.il, **5% code DES5 tied to a review** (owner's choice — warned this violates Google's incentivized/positive-only review policy; owner accepts risk). Opt-out line included ("…השב/י הסר").
- Israel anti-spam law (חוק הספאם): marketing SMS/email needs opt-out (and ideally opt-in); a discount = advertising. Opt-out included; recommend softening to a service-feedback ask for SMS.
- Tracking is consent-gated for privacy.

---

## 8. Reusable content

**Review-request email (loaded in the workflow):**
- Subject: `איך היה השירות שלנו ב-DES?`
- Body: greeting with `{{name}}`, thank-you, review button → review link, "כאות תודה — קוד 5% הנחה: DES5", signature (03-5081868 · destec.co.il), opt-out line.

**Google Business Profile description (paste into GBP):**
> DES (דסטק) — שירותי ציוד רפואי ודנטלי בבת ים. יבואן מורשה ומפיץ רשמי של מותגי הציוד הדנטלי המובילים בעולם: NSK, W&H, KaVo, Bien-Air, Nouvag, MK-dent, Anthogyr ו-Dentsply Sirona. אנו מספקים מכירה, אספקה ותיקון של טורבינות, זוויתנים, ידיתנים, מנועים, אוטוקלבים וציוד סטריליזציה — למרפאות שיניים, מעבדות שיניים ומרפאות רפואיות. מעבדת תיקונים מקצועית: רוב התיקונים תוך 48 שעות, כולל איסוף ומשלוח ציוד, והצעת מחיר ללא עלות. בעלי תקן ISO 9001 ורישיון אמ"ר.

---

## 9. Next steps (priority order)
1. **Get the new site LIVE on destec.co.il** — unlocks ALL website tracking (currently dormant). Biggest lever. (See `handoff.md` for what's blocking launch: catalog data + accessibility coordinator/audit.)
2. **Meta Pixel + CAPI** — grab IDs, wire env + Vercel (GA4 already done).
3. **GBP polish** — paste description, photos, hours, services. Pays off NOW regardless of site.
4. **Email blast** — load emails into Data Table → self-test → fire (with OK).
5. **SMS channel** — pick gateway (InforU/019/Cellact/Twilio) → build SMS workflow for the ~1,060 mobiles (the real audience).
6. **Instagram + WhatsApp Business** — confirm/open.
7. **After tracking live:** Looker Studio lead dashboard, Meta Custom Audiences + Lookalikes (upload client list), website retargeting, ~2 posts/week, first click-to-WhatsApp ad.

---

## 10. Memory pointers (persistent)
- `~/.claude/projects/-Users-igalsh/memory/destec-marketing-tracking.md`
- `~/.claude/projects/-Users-igalsh/memory/destec-n8n-automations.md`
- Related repos: `~/Projects/destec-site` (public site), `~/Projects/des-manager` (internal CRM, Supabase).
