import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://way2automation.com/way2auto_jquery/index.php');
  await page.locator('input[name="name"]').click();

  //means:Pause the Playwright test execution at this exact line and open Playwright Inspector so you can inspect/debug the test.
  await page.pause();
  await page.locator('input[name="name"]').fill('Rahul');
  await page.locator('input[name="name"]').press('Tab');
  await page.locator('input[name="phone"]').fill('9711111558');
  await page.locator('input[name="phone"]').press('Tab');
  await page.locator('input[name="email"]').fill('trainer@way2automation.com');
  await page.getByRole('combobox').selectOption('Germany');
  await page.locator('input[name="city"]').click();
  await page.locator('input[name="city"]').fill('Berlin');
  await page.locator('input[name="city"]').press('Tab');
  await page.locator('#load_box input[name="username"]').fill('asdfsfds');
  await page.locator('#load_box input[name="username"]').press('Tab');
  await page.locator('#load_box input[name="password"]').fill('ddsfsdfd');
  await page.getByRole('button', { name: 'Submit' }).click();
});