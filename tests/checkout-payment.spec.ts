import { test, expect, type Page } from '@playwright/test';

// The browser half of the online payment, with the two API routes stubbed (the live gateway is
// never called from a test). Covers: order → hosted page shown in-page → poll → paid screen;
// and a declined answer → retry screen with the cart kept.
const BASE = process.env.BASE_URL || 'http://localhost:3077';
const ORDER = '11111111-2222-4333-8444-555555555555';
const item = { id: '6bb09f83-232a-46ce-86a6-d3edede337d6', name: 'AJ15 (test)', itemNumber: 'AJ15', manufacturer: 'AJAX', price: 1250, qty: 1 };

async function seedCart(page: Page) {
  await page.addInitScript((it) => localStorage.setItem('des-cart', JSON.stringify([it])), item);
}
async function stubGateway(page: Page, finalStatus: 'approved' | 'declined') {
  let verifies = 0;
  await page.route('**/api/order', (route) => route.fulfill({ status: 200, contentType: 'application/json',
    body: JSON.stringify({ success: true, ref: 'WEB-TEST-0002', payment: { order_id: ORDER, page_url: `${BASE}/privacy`, amount: 1250 } }) }));
  await page.route('**/api/pay/verify', (route) => {
    verifies += 1;
    const status = verifies >= 2 ? finalStatus : 'pending';   // first poll: still unpaid
    route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ ok: true, order_id: ORDER, ref: 'WEB-TEST-0002', status, amount: 1250, approval: status === 'approved' ? '0348557' : '', brand: 'visa', error: status === 'declined' ? 'Return code 004' : '' }) });
  });
}
async function fillAndSubmit(page: Page) {
  await page.goto(`${BASE}/checkout`);
  await page.getByLabel('שם מלא *').fill('בדיקה');
  await page.getByLabel('טלפון *').fill('0501234567');
  await expect(page.getByTestId('submit-order')).toHaveText(/המשך לתשלום/);
  await page.getByTestId('submit-order').click();
}

test('priced cart → hosted page in the checkout, poll settles as paid, cart cleared', async ({ page }) => {
  await seedCart(page); await stubGateway(page, 'approved');
  await fillAndSubmit(page);
  const pay = page.getByTestId('order-payment');
  await expect(pay).toBeVisible();
  await expect(pay.locator('iframe')).toHaveAttribute('src', /\/privacy$/);
  await expect(pay.getByText('WEB-TEST-0002')).toBeVisible();
  await expect(page.getByTestId('order-paid')).toBeVisible({ timeout: 15000 });   // 2 polls × 5 s
  await expect(page.getByTestId('order-paid')).toContainText('0348557');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('des-cart') || '[]').length)).toBe(0);
});

test('declined → retry screen, cart kept', async ({ page }) => {
  await seedCart(page); await stubGateway(page, 'declined');
  await fillAndSubmit(page);
  await expect(page.getByTestId('order-declined')).toBeVisible({ timeout: 15000 });
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('des-cart') || '[]').length)).toBe(1);
  await page.getByRole('button', { name: 'נסיון נוסף' }).click();
  await expect(page.getByTestId('checkout-form')).toBeVisible();
});

test('return page message settles immediately (no poll)', async ({ page }) => {
  await seedCart(page); await stubGateway(page, 'approved');
  await fillAndSubmit(page);
  await expect(page.getByTestId('order-payment')).toBeVisible();
  await page.evaluate((orderId) => window.postMessage({ type: 'c2k-return', order_id: orderId, uid: null,
    view: { order_id: orderId, ref: 'WEB-TEST-0002', status: 'approved', amount: 1250, approval: '0348557', brand: 'visa', error: '' } }, window.location.origin), ORDER);
  await expect(page.getByTestId('order-paid')).toBeVisible({ timeout: 3000 });
});
