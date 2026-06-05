import { test } from '@playwright/test';

const BASE = 'https://destec-site.vercel.app';

test('screenshot homepage', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/tmp/site-home.png', fullPage: true });
});

test('screenshot catalog', async ({ page }) => {
  await page.goto(`${BASE}/catalog?category=surgery`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/tmp/site-catalog.png', fullPage: false });
});

test('screenshot hero close', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: '/tmp/site-hero.png', fullPage: false });
});
