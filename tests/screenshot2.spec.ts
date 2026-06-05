import { test } from '@playwright/test';
const BASE = 'https://destec-site.vercel.app';

test('hero section', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/tmp/s1-hero.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
});

test('spline + trustbar', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollBy(0, 900));
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/s2-spline.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
});

test('product tabs + category tiles', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollBy(0, 1900));
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/s3-products.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
});

test('supplier glow cards', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2, h3, p'));
    const el = headings.find(e => e.textContent?.includes('הספקים המובילים'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    else window.scrollBy(0, 5500);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/s4-suppliers.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
});

test('about + footer', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/s5-footer.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
});

test('featured systems', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(
      e => e.textContent?.includes('טכנולוגיה מוכחת')
    );
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    else window.scrollBy(0, 3200);
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/s6-featured.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
});

test('mobile hero 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/tmp/s7-mobile.png', fullPage: false });
});
