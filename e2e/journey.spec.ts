import { expect, test, type Page } from '@playwright/test';

async function finishIntro(page: Page) {
  await expect(page.getByTestId('intro')).toBeVisible();
  for (let i = 0; i < 3; i++) await page.getByTestId('intro-next').click();
  await expect(page.getByTestId('find')).toBeVisible();
}

test('ages + filters → roll the dice → steps → done today, and it persists', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await finishIntro(page);
  await page.getByTestId('age-input').fill('4');
  await page.getByTestId('age-add').click();
  await page.getByTestId('age-input').fill('7');
  await page.getByTestId('age-add').click();
  await page.getByRole('radio', { name: 'Indoors' }).click();
  await page.getByTestId('time-30').click();
  await expect(page.getByTestId('result-count')).toContainText('ideas fit');
  await page.getByTestId('dice').click();
  await expect(page.getByTestId('activity')).toBeVisible();
  await expect(page.getByText('How to')).toBeVisible();
  await page.getByTestId('done').click();
  await expect(page.getByTestId('celebrate')).toContainText('Sticker on the chart');
  await page.reload();
  await expect(page.getByTestId('done')).toContainText('Done today');
  await page.goto('/');
  await expect(page.getByTestId('age-chip-4')).toBeVisible();
  await expect(page.getByTestId('result-count')).toContainText('1 done so far');
  expect(errors).toEqual([]);
});

test('save and plan an activity for the week', async ({ page }) => {
  await page.goto('/');
  await finishIntro(page);
  await page.getByTestId('activity-a001').click();
  await page.getByTestId('save').click();
  await page.getByTestId('plan').click();
  await page.locator('[data-testid^="plan-20"]').last().click();
  await expect(page.getByTestId('toast')).toContainText('Planned for');
  await page.goto('/saved');
  await expect(page.getByTestId('activity-a001')).toBeVisible();
  await page.goto('/plan');
  await expect(page.locator('[data-testid^="planned-"]')).toHaveCount(1);
});

test('locked activities show the paywall; impossible filters say so kindly', async ({ page }) => {
  await page.goto('/');
  await finishIntro(page);
  const locked = page.locator('[aria-label*=", Premium."]').first();
  await locked.click();
  await expect(page.getByTestId('paywall')).toBeVisible();
  await page.getByTestId('sheet-close').click();
  await page.getByTestId('age-input').fill('2');
  await page.getByTestId('age-add').click();
  await page.getByTestId('age-input').fill('12');
  await page.getByTestId('age-add').click();
  await page.getByTestId('tag-cooking').click();
  await expect(page.getByText('Nothing fits all of that')).toBeVisible();
  await expect(page.getByTestId('dice')).toBeDisabled();
});
