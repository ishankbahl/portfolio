import { expect, test } from '@playwright/test'

/*
  This test exists because the bug it covers shipped.

  The skip link pointed at <main id="main">, which is not focusable, so
  activating it moved the hash and left document.activeElement on body. Chromium
  masks that: it continues sequential focus from the fragment target anyway, so a
  keyboard user there never notices. WebKit does not, so in Safari the next Tab
  returned to the top of the page and the skip link did nothing at all. For
  anyone relying on focus rather than tab order, including screen readers, it did
  nothing in either engine.

  axe cannot catch this. It inspects a static tree and this is a behaviour. ADR
  0002 says a test earns its place by having a failure mode, and this one has a
  demonstrated one, so the suite is six tests rather than five.
*/
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
