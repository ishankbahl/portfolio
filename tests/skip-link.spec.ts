import { expect, test } from '@playwright/test'

// `main` is not focusable by default, so the skip link moved the hash and left
// focus on body. WebKit does not mask that the way Chromium does.
test('activating the skip link moves focus into main', async ({ page }) => {
  await page.goto('/')

  const skipLink = page.locator('a[href="#main"]')
  await expect(skipLink).toHaveCount(1)

  // focus() rather than Tab, because a skip link is visually hidden until
  // focused and Tab-driven focus is unreliable in headless WebKit.
  await skipLink.focus()
  await page.keyboard.press('Enter')

  await expect
    .poll(() => page.evaluate(() => document.activeElement?.id ?? ''), { timeout: 2000 })
    .toBe('main')
})
