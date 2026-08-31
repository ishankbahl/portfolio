import { expect, test } from '@playwright/test'

/*
  Vercel Web Analytics and Speed Insights fetch their scripts from /_vercel/,
  which the Vercel platform serves and this build does not contain, falling back
  to va.vercel-scripts.com when it detects it is not on Vercel. Either way they
  404 anywhere except production.

  That produces two separate signals and the exception has to cover both: the
  failed request itself, and the "Failed to load resource" the browser logs to
  the console because of it. Filtering only the first is what I did initially,
  and the test still went red on the second.

  This test asks whether my page loaded cleanly. It is not a monitor for whether
  Vercel's CDN is up.
*/
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
})
