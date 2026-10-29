import { test, expect } from '@playwright/test';
import { createHmac } from 'node:crypto';

// Customer account: login form, a bad link, and a signed session (the server must run with
// SITE_AUTH_SECRET=test-secret and the Supabase service key for the orders query).
const BASE = process.env.BASE_URL || 'http://localhost:3077';
const SECRET = process.env.SITE_AUTH_SECRET || 'test-secret';
const session = (email: string) => {
  const payload = Buffer.from(JSON.stringify({ e: email, x: Date.now() + 3600_000 })).toString('base64url');
  return `${payload}.${createHmac('sha256', SECRET).update(payload).digest('base64url')}`;
};

test('logged out: the login form; a bad link explains itself', async ({ page }) => {
  await page.goto(`${BASE}/account`);
  await expect(page.getByTestId('login-form')).toBeVisible();
  await page.goto(`${BASE}/api/auth/verify?token=not-a-real-token`);
  await expect(page).toHaveURL(/\/account\?login=invalid/);
  await expect(page.getByTestId('login-form')).toContainText('פג תוקף');
});

test('a signed session shows the orders page for that e-mail; logout clears it', async ({ page, context }) => {
  await context.addCookies([{ name: 'des_session', value: session('nobody@example.com'), url: BASE }]);
  await page.goto(`${BASE}/account`);
  await expect(page.getByText('nobody@example.com')).toBeVisible();
  await expect(page.getByTestId('orders-empty')).toBeVisible();
  await page.getByRole('button', { name: 'יציאה' }).click();
  await expect(page.getByTestId('login-form')).toBeVisible();
});

test('a forged session is rejected', async ({ page, context }) => {
  const forged = session('nobody@example.com').replace(/\.[^.]+$/, '.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await context.addCookies([{ name: 'des_session', value: forged, url: BASE }]);
  await page.goto(`${BASE}/account`);
  await expect(page.getByTestId('login-form')).toBeVisible();
});
