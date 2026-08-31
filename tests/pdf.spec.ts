import { expect, test } from '@playwright/test'
import { resume } from '../lib/resume'

test('the resume link returns 200 with content type application/pdf', async ({ page, request }) => {
  await page.goto('/')

  // Follow the href the page actually renders, not a path typed into the test.
  // A rename that updates the file but not resume.json still fails here.
  const href = await page
    .getByRole('link', { name: /download resume/i })
    .getAttribute('href')
  expect(href).toBe(resume.person.resumePdf)

  const response = await request.get(href ?? '')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/pdf')
})
