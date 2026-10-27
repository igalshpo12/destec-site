import { test, expect, type Page } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:3077';
const SHOTS = process.env.SHOTS || 'test-results/cart-ajax';
// catalog_products ids of the two spotlighted AJAX units (stable — upserted by konimbo_id)
const AJ15 = '6bb09f83-232a-46ce-86a6-d3edede337d6';
const AJ25 = 'a8d32c03-6f00-4e7d-84af-bc0da90e5843';

async function stubOrder(page: Page) {
  await page.route('**/api/order', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, ref: 'WEB-TEST-0001' }) })
  );
}

for (const vp of [{ name: 'desktop-1100', width: 1100, height: 800 }, { name: 'phone-390', width: 390, height: 844 }]) {
  test.describe(vp.name, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('AJAX catalog, add from card, badge persists, product page, cart, checkout', async ({ page }) => {
      await stubOrder(page);

      // Catalog filtered to AJAX — 14 products, AJ15 first
      await page.goto(`${BASE}/catalog?manufacturer=AJAX`);
      await expect(page.locator('h1')).toContainText('AJAX');
      await expect(page.getByText('14 מוצרים נמצאו')).toBeVisible();
      const firstCard = page.locator('article').first();
      await expect(firstCard).toContainText('AJ15');
      await page.screenshot({ path: `${SHOTS}/${vp.name}-catalog-ajax.png`, fullPage: false });

      // Nav category works
      await page.goto(`${BASE}/catalog?category=clinic`);
      await expect(page.getByText('14 מוצרים נמצאו')).toBeVisible();

      // Add from card must NOT navigate
      await page.goto(`${BASE}/catalog?manufacturer=AJAX`);
      await firstCard.getByTestId('add-to-cart').click();
      await expect(page).toHaveURL(/manufacturer=AJAX/);
      await expect(page.getByTestId('cart-toast')).toBeVisible();
      await expect(page.getByTestId('cart-count')).toHaveText('1');
      await page.screenshot({ path: `${SHOTS}/${vp.name}-added-toast.png` });

      // Badge survives reload
      await page.reload();
      await expect(page.getByTestId('cart-count')).toHaveText('1');

      // Product page: pre-line description, gallery, qty 2 add
      await page.goto(`${BASE}/catalog/${AJ25}`);
      await expect(page.locator('h1')).toContainText('AJ25');
      await expect(page.getByRole('heading', { name: 'תכונות עיקריות' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'מפרט טכני' })).toBeVisible();
      await expect(page.getByRole('heading', { name: /AJ25 מקרוב/ })).toBeVisible();
      await expect(page.locator('figure img')).toHaveCount(8);
      await page.screenshot({ path: `${SHOTS}/${vp.name}-aj25-top.png` });
      await page.screenshot({ path: `${SHOTS}/${vp.name}-aj25-full.png`, fullPage: true });
      await page.getByRole('button', { name: 'הוסף כמות' }).click();
      await expect(page.getByTestId('qty')).toHaveText('2');
      await page.getByTestId('add-to-cart').click();
      await expect(page.getByTestId('cart-count')).toHaveText('3');

      // Cart page
      await page.goto(`${BASE}/cart`);
      await expect(page.getByTestId('cart-line')).toHaveCount(2);
      await expect(page.getByTestId('cart-summary')).toContainText('3 פריטים');
      await expect(page.getByText('מחיר לפי הצעה').first()).toBeVisible();
      await page.screenshot({ path: `${SHOTS}/${vp.name}-cart.png`, fullPage: true });
      // qty + on the AJ25 line → 4 total; remove AJ15 line → 1 line
      const lines = page.getByTestId('cart-line');
      await lines.nth(1).getByLabel('הוסף').click();
      await expect(page.getByTestId('cart-summary')).toContainText('4 פריטים');
      await lines.nth(0).getByLabel('הסר מהעגלה').click();
      await expect(page.getByTestId('cart-line')).toHaveCount(1);

      // Checkout
      await page.getByTestId('to-checkout').click();
      await expect(page).toHaveURL(/\/checkout/);
      await page.fill('input[name=name]', 'בדיקה אוטומטית');
      await page.fill('input[name=phone]', '0501234567');
      await page.fill('input[name=clinic]', 'מרפאת בדיקה');
      await page.screenshot({ path: `${SHOTS}/${vp.name}-checkout.png`, fullPage: true });
      await page.getByTestId('submit-order').click();
      await expect(page.getByTestId('order-success')).toBeVisible();
      await expect(page.getByText('WEB-TEST-0001')).toBeVisible();
      // cart cleared
      await page.goto(`${BASE}/cart`);
      await expect(page.getByText('העגלה שלך ריקה')).toBeVisible();
    });

    test('AJ15 product page renders', async ({ page }) => {
      await page.goto(`${BASE}/catalog/${AJ15}`);
      await expect(page.locator('h1')).toContainText('AJ15');
      await expect(page.locator('figure img')).toHaveCount(8);
      await page.screenshot({ path: `${SHOTS}/${vp.name}-aj15-full.png`, fullPage: true });
    });
  });
}

test('order API validates input', async ({ request }) => {
  const r = await request.post(`${BASE}/api/order`, { data: { name: 'x' } });
  expect(r.status()).toBe(400);
});
