/*
  Fails the build if the JavaScript this site adds on top of the Next.js
  baseline goes over budget.

  Run after `next build`:
    node scripts/check-js-budget.mjs

  It measures out/index.html rather than the build manifest, because the
  manifest and the html disagree. The manifest lists app/page-*.js for the
  route; the html never references it, since the page is server components
  only and the browser therefore never fetches it. The html is what a browser
  actually reads, so the html is what gets measured.

  Three buckets:
    framework   the chunks a page with no client components already loads,
                taken from build-manifest.json rootMainFiles. Not mine, and
                ADR 0003 covers why they are not in the budget.
    polyfill    served behind noModule, so no current browser fetches it. The
                script asserts that attribute rather than assuming it.
    application everything left. This is the number under budget.
*/
import { existsSync, readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import path from 'node:path'

const BUDGET_BYTES = 6 * 1024
const OUT = 'out'
const html = readFileSync(path.join(OUT, 'index.html'), 'utf8')
const manifest = JSON.parse(readFileSync('.next/build-manifest.json', 'utf8'))

const frameworkChunks = new Set(
  (manifest.rootMainFiles ?? []).map((file) => `/_next/${file}`),
)

const referenced = [...new Set([...html.matchAll(/(?:src|href)="(\/_next\/[^"]+\.js)"/g)].map((m) => m[1]))]
if (referenced.length === 0) {
  console.error('No /_next/ scripts found in out/index.html. Did the build run?')
  process.exit(1)
}

const kb = (bytes) => `${(bytes / 1024).toFixed(2)} kB`
const ANALYTICS_MARKERS = /_vercel\/(insights|speed-insights)|vercel-scripts\.com/

let application = 0
let analytics = 0
let framework = 0
let polyfill = 0
const rows = []

for (const src of referenced) {
  const file = path.join(OUT, src)
  if (!existsSync(file)) {
    // Failing open here would make the budget smaller and still print PASS.
    console.error(`${src} is referenced by out/index.html but missing from out/`)
    process.exit(1)
  }
  const source = readFileSync(file)
  const gzipped = gzipSync(source, { level: 9 }).length
  const name = src.replace('/_next/static/chunks/', '')

  if (src.includes('polyfills')) {
    // Verify the exclusion instead of trusting it. If Next ever ships this
    // without noModule, every browser fetches it and it stops being free.
    const tag = html.match(new RegExp(`<script[^>]*${src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^>]*>`))
    if (!tag || !/\bnomodule\b/i.test(tag[0])) {
      console.error(`\n${name} is not behind noModule, so it is not legacy-only. Excluding it would be a lie.`)
      process.exit(1)
    }
    polyfill += gzipped
    rows.push(['polyfill', name, gzipped])
    continue
  }

  if (frameworkChunks.has(src)) {
    framework += gzipped
    rows.push(['framework', name, gzipped])
    continue
  }

  application += gzipped
  if (ANALYTICS_MARKERS.test(source.toString('utf8'))) analytics += gzipped
  rows.push(['application', name, gzipped])
}

for (const [bucket, name, gzipped] of rows.sort((a, b) => b[2] - a[2])) {
  console.log(`  ${bucket.padEnd(12)} ${name.padEnd(40)} ${kb(gzipped).padStart(10)}`)
}

// Inline <script> blocks, mostly the RSC flight payload. This is javascript the
// browser parses, it scales with the content in resume.json, and the referenced
// chunks above do not include it. Reported rather than budgeted: it is Next's
// serialisation of server output, not code I wrote.
const inlineScripts = [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)]
  .map((m) => m[1])
  .join('\n')
const inline = inlineScripts ? gzipSync(Buffer.from(inlineScripts), { level: 9 }).length : 0

console.log()
console.log(`  framework baseline, not in budget   ${kb(framework).padStart(10)}`)
console.log(`  inline rsc payload, reported only   ${kb(inline).padStart(10)}`)
console.log(`  polyfill behind noModule, not sent  ${kb(polyfill).padStart(10)}`)
console.log(`  application javascript              ${kb(application).padStart(10)}`)
console.log(`    of which vercel analytics         ${kb(analytics).padStart(10)}`)
console.log(`    of which my own code              ${kb(application - analytics).padStart(10)}`)
console.log(`  budget                              ${kb(BUDGET_BYTES).padStart(10)}`)
console.log()

// The analytics share is found by matching endpoint strings in minified source.
// If Vercel renames one, the share silently becomes zero and the tool would
// report the whole chunk as my own code. Assert rather than trust.
if (application > 0 && analytics === 0) {
  console.error('No analytics markers matched, so the split above is wrong. Update ANALYTICS_MARKERS.')
  process.exit(1)
}

if (application > BUDGET_BYTES) {
  console.error(`FAIL application javascript is ${kb(application - BUDGET_BYTES)} over budget`)
  process.exit(1)
}

console.log(`PASS ${kb(BUDGET_BYTES - application)} of budget left`)
