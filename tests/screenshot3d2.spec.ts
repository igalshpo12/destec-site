import { test } from '@playwright/test';
const BASE = 'https://destec-site.vercel.app';

test('full page scan for showcase', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  // Scroll to bottom gradually and screenshot at multiple depths
  for (const scroll of [3500, 4500, 5000, 5500]) {
    await page.evaluate((y) => window.scrollTo(0, y), scroll);
    await page.waitForTimeout(500);
    const text = await page.evaluate(() => document.body.innerText.slice(0, 200));
    if (text.includes('NSK') || text.includes('Nouvag') || text.includes('מוצרים מובילים')) {
      await page.screenshot({ path: `/tmp/showcase-${scroll}.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } });
    }
  }
});

test('showcase section direct', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('section, div[class*="showcase"], div[class*="Showcase"]'));
    // Find element containing NSK card
    const found = Array.from(document.querySelectorAll('*')).find(
      el => el.children.length < 5 && el.textContent?.includes('NSK') && el.textContent?.includes('מיוצר')
    );
    if (found) { found.scrollIntoView({ behavior: 'instant', block: 'center' }); }
    else {
      // Try the heading
      const h = Array.from(document.querySelectorAll('h2')).find(e => e.textContent?.includes('מובילים'));
      if (h) h.scrollIntoView({ behavior: 'instant', block: 'start' });
      else window.scrollTo(0, 4200);
    }
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/flip-showcase.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
  
  // Also hover first card and capture flip
  await page.evaluate(() => window.scrollTo(0, window.scrollY));
  const cards = page.locator('div').filter({ hasText: /NSK|Nouvag|W&H/ }).first();
  await cards.hover({ force: true });
  await page.waitForTimeout(700);
  await page.screenshot({ path: '/tmp/flip-hover.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
});
