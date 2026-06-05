import { test } from '@playwright/test';
const BASE = 'https://destec-site.vercel.app';

test('flip cards — front (resting)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(
      e => e.textContent?.trim() === 'המוצרים המובילים שלנו' || 
           e.textContent?.includes('המוצרים המובילים')
    );
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    else window.scrollBy(0, 2800);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/flip-front.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
});

test('flip cards — back (hover first card)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(
      e => e.textContent?.includes('המוצרים המובילים')
    );
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    else window.scrollBy(0, 2800);
  });
  await page.waitForTimeout(800);
  // Hover the first flip card to trigger the back face
  const card = page.locator('[data-flip-card], .flip-card, [class*="flip"]').first();
  if (await card.count() > 0) {
    await card.hover();
  } else {
    // Try hovering whatever is in the showcase strip
    await page.mouse.move(300, 450);
  }
  await page.waitForTimeout(700);
  await page.screenshot({ path: '/tmp/flip-back.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
});

test('flip cards — mobile 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(
      e => e.textContent?.includes('המוצרים המובילים')
    );
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    else window.scrollBy(0, 2400);
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/flip-mobile.png', clip: { x: 0, y: 0, width: 390, height: 844 } });
});
