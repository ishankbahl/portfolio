import { expect, test } from '@playwright/test'

test('open graph title, description and image are present and the image url is absolute', async ({
  page,
}) => {
  await page.goto('/')

  // count() resolves immediately rather than retrying. These tags are in static
  // html, so if they are absent no amount of waiting will produce them.
  const read = async (property: string) => {
    const tag = page.locator(`meta[property="${property}"]`)
    expect(await tag.count(), `${property} should appear exactly once`).toBe(1)
    return tag.getAttribute('content')
  }

  expect(await read('og:title')).toBeTruthy()
  expect(await read('og:description')).toBeTruthy()

  // A relative og:image breaks the preview on every scraper that will not
  // resolve it, so this asserts the scheme and not just presence.
  const image = await read('og:image')
  expect(image, 'og:image must be absolute').toMatch(/^https?:\/\//)
})
