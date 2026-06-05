import { test, expect } from '@playwright/test';

const BASE = 'https://destec-site.vercel.app';

test.describe('Homepage', () => {
  test('loads with RTL and announcement bar', async ({ page }) => {
    await page.goto(BASE);
    const dir = await page.locator('html').getAttribute('dir');
    expect(dir).toBe('rtl');
    await expect(page.locator('body')).toContainText('משלוחים חינם');
  });

  test('all 7 nav categories present', async ({ page }) => {
    await page.goto(BASE);
    const navLabels = ['טורבינות', 'כירורגיה', 'סטריליזציה', 'שיקום', 'פרופילקטיקה', 'מנועים', 'מקדחים'];
    for (const label of navLabels) {
      await expect(page.locator('body')).toContainText(label);
    }
  });

  test('trust bar has ISO 9001 and אמ"ר', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('body')).toContainText('ISO 9001');
    await expect(page.locator('body')).toContainText('אמ"ר');
  });

  test('WhatsApp link uses correct number 972548818681', async ({ page }) => {
    await page.goto(BASE);
    const waLink = page.locator('a[href*="wa.me"]').first();
    const href = await waLink.getAttribute('href');
    expect(href).toContain('972548818681');
    expect(href).not.toContain('97235081868');
  });

  test('product tabs show real items after hydration', async ({ page }) => {
    await page.goto(BASE);
    // Wait for client-side hydration — products load via Supabase after mount
    await page.waitForFunction(() => {
      return document.body.innerText.includes('₪');
    }, { timeout: 20000 });
  });

  test('no internal service records in product tabs', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForTimeout(5000); // let products load
    await expect(page.locator('body')).not.toContainText('ביקור טכנאי');
    await expect(page.locator('body')).not.toContainText('מנוי חודשי');
  });
});

test.describe('Catalog — category pages', () => {
  const categories = [
    { slug: 'surgery',       label: 'כירורגיה והשתלות' },
    { slug: 'handpieces',    label: 'טורבינות זוויתנים וידיתנים' },
    { slug: 'motors',        label: 'מנועים' },
    { slug: 'drills',        label: 'מקדחים' },
    { slug: 'sterilization', label: 'סטריליזציה ותחזוקה' },
    { slug: 'prophylaxis',   label: 'פרופילקטיקה' },
    { slug: 'restorative',   label: 'שיקום הפה' },
  ];

  for (const { slug, label } of categories) {
    test(`${slug} — loads Hebrew label and products`, async ({ page }) => {
      await page.goto(`${BASE}/catalog?category=${slug}`);
      await expect(page.locator('body')).toContainText(label, { timeout: 10000 });
      // Confirm products loaded — "מוצרים נמצאו" count or ₪ price present
      await expect(page.locator('body')).toContainText('₪', { timeout: 15000 });
    });
  }
});

test.describe('Catalog — search', () => {
  test('searching NSK returns relevant products', async ({ page }) => {
    await page.goto(`${BASE}/catalog`);
    const searchBox = page.locator('input[type="search"], input[placeholder*="חיפוש"], input[placeholder*="search" i]').first();
    await searchBox.fill('NSK');
    await page.waitForTimeout(1500);
    const results = page.locator('text=/₪[0-9]/');
    await expect(results.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Contact page', () => {
  test('loads with WhatsApp link and form fields', async ({ page }) => {
    await page.goto(`${BASE}/contact`);
    await expect(page.locator('body')).toContainText('שם');
    await expect(page.locator('body')).toContainText('טלפון');
    await expect(page.locator('body')).toContainText('הודעה');
    const waLink = page.locator('a[href*="wa.me"]').first();
    const href = await waLink.getAttribute('href');
    expect(href).toContain('972548818681');
  });
});

test.describe('Nav links', () => {
  test('all 7 nav links are functional', async ({ page }) => {
    await page.goto(BASE);
    const slugs = ['surgery', 'handpieces', 'motors', 'drills', 'sterilization', 'prophylaxis', 'restorative'];
    for (const slug of slugs) {
      const response = await page.request.get(`${BASE}/catalog?category=${slug}`);
      expect(response.status()).toBe(200);
    }
  });
});
