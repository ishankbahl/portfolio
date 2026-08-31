import { expect, test } from '@playwright/test'

/*
  Vercel Web Analytics and Speed Insights load their scripts from /_vercel/,
  which the Vercel platform serves and this build does not contain. They 404
  everywhere except production, so without this exception the test goes red on
  behaviour that is correct locally and in CI.
*/
const servedByVercelNotByUs = (url: string) => new URL(url).pathname.startsWith('/_vercel/')

test('no console errors and no failed requests on load', async ({ page }) => {
  const consoleErrors: string[] = []
  const failedRequests: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('requestfailed', (request) => {
    if (!servedByVercelNotByUs(request.url())) {
      failedRequests.push(`${request.url()} (${request.failure()?.errorText})`)
    }
  })
  page.on('response', (response) => {
    if (response.status() >= 400 && !servedByVercelNotByUs(response.url())) {
      failedRequests.push(`${response.url()} (${response.status()})`)
    }
  })

  await page.goto('/', { waitUntil: 'load' })
  await page.waitForLoadState('networkidle')

  expect(consoleErrors, 'console errors on load').toEqual([])
  expect(failedRequests, 'failed or 4xx/5xx requests on load').toEqual([])
})
