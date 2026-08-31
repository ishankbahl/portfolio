import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/*
  Two runs, one per colour scheme. A single run only ever sees the palette the
  browser happens to be in, which is light, and dark mode is a second set of
  colours. An axe pass that never loads them is not evidence about them.
*/
for (const colorScheme of ['light', 'dark'] as const) {
  test(`axe reports no serious or critical violations in ${colorScheme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme })
    await page.goto('/')

    const { violations } = await new AxeBuilder({ page }).analyze()
    const blocking = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')

    expect(
      blocking.map((v) => `${v.id} (${v.impact}) on ${v.nodes.length} node(s)`),
      `axe found blocking violations in ${colorScheme} mode`,
    ).toEqual([])
  })
}
