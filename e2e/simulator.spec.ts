import { expect, test } from '@playwright/test';

async function unlock(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByLabel('Разблокировать').click();
  for (const digit of ['2','5','8','0']) await page.getByLabel(`Цифра ${digit}`).click();
  await expect(page.getByLabel('Главный экран')).toBeVisible();
}

test('unlock and open an application', async ({ page }) => {
  await unlock(page);
  await page.getByTestId('app-settings').click();
  await expect(page.getByLabel('Настройки')).toBeVisible();
});

test('place and end a phone call', async ({ page }) => {
  await unlock(page);
  await page.getByTestId('app-phone').click();
  for (const digit of ['1','2','3']) await page.getByLabel(`Клавиша ${digit}`).click();
  await page.getByTestId('call-button').click();
  await expect(page.getByTestId('active-call')).toBeVisible();
  await page.getByTestId('end-call').click();
  await expect(page.getByTestId('active-call')).toBeHidden();
});

test('send a message', async ({ page }) => {
  await unlock(page);
  await page.getByTestId('app-messages').click();
  await page.getByText('Мария Соколова').first().click();
  await page.getByLabel('Текст сообщения').fill('Сообщение из E2E');
  await page.getByTestId('send-message').click();
  await expect(page.getByText('Сообщение из E2E')).toBeVisible();
});

test('create a note', async ({ page }) => {
  await unlock(page);
  await page.getByTestId('app-notes').click();
  await page.getByLabel('Новая заметка').click();
  await page.getByLabel('Заголовок заметки').fill('Тест Playwright');
  await page.getByLabel('Текст заметки').fill('Проверка сохранения');
  await page.getByTestId('save-note').click();
  await expect(page.getByText('Тест Playwright')).toBeVisible();
});
