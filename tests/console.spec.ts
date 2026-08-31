import { expect, test } from '@playwright/test'

// The Vercel analytics scripts 404 outside production. A 404 produces two
// signals, the failed request and the console error it causes, so both are
// filtered, and so is the CDN host the script falls back to.
const servedByVercelNotByUs = (url: string) => {
  if (!url) return false
  try {
    const { pathname, hostname } = new URL(url)
    return pathname.startsWith('/_vercel/') || hostname === 'va.vercel-scripts.com'
  } catch {
    return false
  }
}

test('no console errors and no failed requests on load', async ({ page }) => {
  const consoleErrors: string[] = []
  const failedRequests: string[] = []

  page.on('console', (message) => {
    if (message.type() !== 'error') return
    const source = message.location()?.url ?? ''
    if (servedByVercelNotByUs(source)) return
    consoleErrors.push(`${message.text()} (from ${source || 'unknown'})`)
  })
  page.on('requestfailed', (request) => {
    if (servedByVercelNotByUs(request.url())) return
    failedRequests.push(`${request.url()} (${request.failure()?.errorText})`)
  })
  page.on('response', (response) => {
    if (response.status() < 400 || servedByVercelNotByUs(response.url())) return
    failedRequests.push(`${response.url()} (${response.status()})`)
  })

  await page.goto('/', { waitUntil: 'load' })
  await page.waitForLoadState('networkidle')

  expect(consoleErrors, 'console errors on load').toEqual([])
  expect(failedRequests, 'failed or 4xx/5xx requests on load').toEqual([])

  // Headless Chromium skips the implicit /favicon.ico request a real browser
  // makes, so this asks for the declared icon directly.
  const iconHref = await page.locator('link[rel="icon"]').first().getAttribute('href')
  expect(iconHref, 'the page must declare an icon, or browsers fall back to /favicon.ico').toBeTruthy()

  const icon = await page.request.get(iconHref ?? '')
  expect(icon.status(), `declared icon ${iconHref} must resolve`).toBe(200)
})
