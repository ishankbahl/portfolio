/*
  Renders public/og.png at 1200x630 by screenshotting a small html document with
  Playwright, which is already a dependency for the tests.

  Run it when the name, the positioning line or the site url changes:
    node scripts/generate-og.mjs

  The alternative was a design tool, which does not live in version control, or
  next/og, which is a second rendering path to keep in step with this one. The
  font is inlined as a data uri so the render does not depend on a font cdn or
  on which machine it runs on.
*/
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const resume = JSON.parse(readFileSync(new URL('../content/resume.json', import.meta.url)))
const font = readFileSync(new URL('../app/fonts/inter-latin-variable.woff2', import.meta.url))
const { name, positioning, siteUrl } = resume.person

const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8')
const token = (n) => {
  const m = css.match(new RegExp(`--${n}:\\s*(#[0-9a-fA-F]{6})`))
  if (!m) throw new Error(`could not read --${n} from app/globals.css`)
  return m[1]
}
const bg = token('bg')
const fg = token('fg')
const muted = token('muted')
const accent = token('accent')

const escape = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Palette read from app/globals.css so the card cannot drift from the site.
const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face {
    font-family: 'Inter';
    src: url(data:font/woff2;base64,${font.toString('base64')}) format('woff2');
    font-weight: 100 900;
  }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    background: ${bg}; color: ${fg};
    font-family: 'Inter', sans-serif;
    padding: 88px 96px;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  h1 { font-size: 92px; line-height: 1.05; font-weight: 600; letter-spacing: -0.03em; }
  p  { font-size: 34px; line-height: 1.4; color: ${muted}; max-width: 940px; margin-top: 32px; }
  .host { font-size: 26px; color: ${accent}; }
</style></head>
<body>
  <div>
    <h1>${escape(name)}</h1>
    <p>${escape(positioning)}</p>
  </div>
  <div class="host">${escape(new URL(siteUrl).host)}</div>
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: fileURLToPath(new URL('../public/og.png', import.meta.url)) })
await browser.close()

console.log('wrote public/og.png at 1200x630')
