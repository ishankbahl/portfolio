import { expect, test } from '@playwright/test'
import { resume } from '../lib/resume'

test('the page returns 200 and my name is the h1', async ({ page }) => {
  const response = await page.goto('/')

  expect(response?.status()).toBe(200)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(resume.person.name)
})
