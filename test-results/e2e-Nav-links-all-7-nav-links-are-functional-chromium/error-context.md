# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Nav links >> all 7 nav links are functional
- Location: tests/e2e.spec.ts:98:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to content":
    - /url: "#geist-skip-nav"
  - generic [ref=e3]:
    - banner [ref=e4]:
      - link "Vercel logo":
        - /url: /home
        - button "Vercel Logo":
          - img "Vercel Logo"
      - navigation [ref=e5]:
        - navigation [ref=e6]:
          - link "Sign Up" [ref=e7] [cursor=pointer]:
            - /url: /signup?next=%2Fsso-api%3Furl%3Dhttps%253A%252F%252Fdestec-site-ixygc3oow-des-manager.vercel.app%252F%26nonce%3D2d17eea9bdd125381971a45832c3c67d867db5b75974a5d912a94428341f65ad
            - paragraph [ref=e9]: Sign Up
    - main [ref=e10]:
      - generic [ref=e12]:
        - heading "Log in to Vercel" [level=1] [ref=e15]
        - generic [ref=e16]:
          - generic [ref=e17]:
            - textbox "Email Address" [ref=e19]
            - button "Continue with Email" [ref=e21] [cursor=pointer]:
              - generic [ref=e22]: Continue with Email
          - generic [ref=e24]:
            - button "Continue with Google" [ref=e25] [cursor=pointer]:
              - img [ref=e28]
              - generic [ref=e34]: Continue with Google
            - button "Continue with GitHub" [ref=e35] [cursor=pointer]:
              - img [ref=e37]
              - generic [ref=e41]: Continue with GitHub
            - button "Continue with Apple" [ref=e42] [cursor=pointer]:
              - img [ref=e44]
              - generic [ref=e47]: Continue with Apple
            - button "Continue with SAML SSO" [ref=e49] [cursor=pointer]:
              - img [ref=e51]
              - generic [ref=e53]: Continue with SAML SSO
            - button "Continue with Passkey" [ref=e54] [cursor=pointer]:
              - img [ref=e56]
              - generic [ref=e58]: Continue with Passkey
            - button "Show other options" [ref=e59] [cursor=pointer]:
              - generic [ref=e60]: Show other options
        - paragraph [ref=e62]:
          - text: Don't have an account?
          - link "Sign Up" [ref=e63] [cursor=pointer]:
            - /url: /signup?next=%2Fsso-api%3Furl%3Dhttps%253A%252F%252Fdestec-site-ixygc3oow-des-manager.vercel.app%252F%26nonce%3D2d17eea9bdd125381971a45832c3c67d867db5b75974a5d912a94428341f65ad
      - generic [ref=e66]:
        - link "Terms" [ref=e67] [cursor=pointer]:
          - /url: /legal/terms
        - link "Privacy Policy" [ref=e68] [cursor=pointer]:
          - /url: /legal/privacy-policy
  - alert [ref=e69]
  - generic:
    - generic:
      - generic:
        - generic:
          - img
```

# Test source

```ts
  3   | const BASE = 'https://destec-site-ixygc3oow-des-manager.vercel.app';
  4   | 
  5   | test.describe('Homepage', () => {
  6   |   test('loads with RTL and announcement bar', async ({ page }) => {
  7   |     await page.goto(BASE);
  8   |     const dir = await page.locator('html').getAttribute('dir');
  9   |     expect(dir).toBe('rtl');
  10  |     await expect(page.locator('body')).toContainText('משלוחים חינם');
  11  |   });
  12  | 
  13  |   test('all 7 nav categories present', async ({ page }) => {
  14  |     await page.goto(BASE);
  15  |     const navLabels = ['טורבינות', 'כירורגיה', 'סטריליזציה', 'שיקום', 'פרופילקטיקה', 'מנועים', 'מקדחים'];
  16  |     for (const label of navLabels) {
  17  |       await expect(page.locator('body')).toContainText(label);
  18  |     }
  19  |   });
  20  | 
  21  |   test('trust bar has ISO 9001 and אמ"ר', async ({ page }) => {
  22  |     await page.goto(BASE);
  23  |     await expect(page.locator('body')).toContainText('ISO 9001');
  24  |     await expect(page.locator('body')).toContainText('אמ"ר');
  25  |   });
  26  | 
  27  |   test('WhatsApp link uses correct number 972548818681', async ({ page }) => {
  28  |     await page.goto(BASE);
  29  |     const waLink = page.locator('a[href*="wa.me"]').first();
  30  |     const href = await waLink.getAttribute('href');
  31  |     expect(href).toContain('972548818681');
  32  |     expect(href).not.toContain('97235081868');
  33  |   });
  34  | 
  35  |   test('product tabs show real items after hydration', async ({ page }) => {
  36  |     await page.goto(BASE);
  37  |     // Wait for client-side hydration to load products
  38  |     const priceLocator = page.locator('text=/₪[0-9]/').first();
  39  |     await expect(priceLocator).toBeVisible({ timeout: 15000 });
  40  |     const priceCount = await page.locator('text=/₪[0-9]/').count();
  41  |     expect(priceCount).toBeGreaterThanOrEqual(3);
  42  |   });
  43  | 
  44  |   test('no internal service records in product tabs', async ({ page }) => {
  45  |     await page.goto(BASE);
  46  |     await page.waitForTimeout(5000); // let products load
  47  |     await expect(page.locator('body')).not.toContainText('ביקור טכנאי');
  48  |     await expect(page.locator('body')).not.toContainText('מנוי חודשי');
  49  |   });
  50  | });
  51  | 
  52  | test.describe('Catalog — category pages', () => {
  53  |   const categories = [
  54  |     { slug: 'surgery',       label: 'כירורגיה והשתלות' },
  55  |     { slug: 'handpieces',    label: 'טורבינות זוויתנים וידיתנים' },
  56  |     { slug: 'motors',        label: 'מנועים' },
  57  |     { slug: 'drills',        label: 'מקדחים' },
  58  |     { slug: 'sterilization', label: 'סטריליזציה ותחזוקה' },
  59  |     { slug: 'prophylaxis',   label: 'פרופילקטיקה' },
  60  |     { slug: 'restorative',   label: 'שיקום הפה' },
  61  |   ];
  62  | 
  63  |   for (const { slug, label } of categories) {
  64  |     test(`${slug} — loads Hebrew label and products`, async ({ page }) => {
  65  |       await page.goto(`${BASE}/catalog?category=${slug}`);
  66  |       await expect(page.locator('body')).toContainText(label, { timeout: 10000 });
  67  |       // At least one price visible
  68  |       const price = page.locator('text=/₪[0-9]/').first();
  69  |       await expect(price).toBeVisible({ timeout: 10000 });
  70  |     });
  71  |   }
  72  | });
  73  | 
  74  | test.describe('Catalog — search', () => {
  75  |   test('searching NSK returns relevant products', async ({ page }) => {
  76  |     await page.goto(`${BASE}/catalog`);
  77  |     const searchBox = page.locator('input[type="search"], input[placeholder*="חיפוש"], input[placeholder*="search" i]').first();
  78  |     await searchBox.fill('NSK');
  79  |     await page.waitForTimeout(1500);
  80  |     const results = page.locator('text=/₪[0-9]/');
  81  |     await expect(results.first()).toBeVisible({ timeout: 10000 });
  82  |   });
  83  | });
  84  | 
  85  | test.describe('Contact page', () => {
  86  |   test('loads with WhatsApp link and form fields', async ({ page }) => {
  87  |     await page.goto(`${BASE}/contact`);
  88  |     await expect(page.locator('body')).toContainText('שם');
  89  |     await expect(page.locator('body')).toContainText('טלפון');
  90  |     await expect(page.locator('body')).toContainText('הודעה');
  91  |     const waLink = page.locator('a[href*="wa.me"]').first();
  92  |     const href = await waLink.getAttribute('href');
  93  |     expect(href).toContain('972548818681');
  94  |   });
  95  | });
  96  | 
  97  | test.describe('Nav links', () => {
  98  |   test('all 7 nav links are functional', async ({ page }) => {
  99  |     await page.goto(BASE);
  100 |     const slugs = ['surgery', 'handpieces', 'motors', 'drills', 'sterilization', 'prophylaxis', 'restorative'];
  101 |     for (const slug of slugs) {
  102 |       const response = await page.request.get(`${BASE}/catalog?category=${slug}`);
> 103 |       expect(response.status()).toBe(200);
      |                                 ^ Error: expect(received).toBe(expected) // Object.is equality
  104 |     }
  105 |   });
  106 | });
  107 | 
```