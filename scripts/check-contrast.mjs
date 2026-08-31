/*
  Asserts the WCAG contrast ratios the design depends on, reading the hex values
  out of app/globals.css so the check cannot drift from the palette.

    node scripts/check-contrast.mjs
*/
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8')

// :root holds the light scheme, the prefers-color-scheme block holds dark.
const darkStart = css.indexOf('prefers-color-scheme: dark')
const read = (name, from, to) => {
  const match = css.slice(from, to).match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))
  if (!match) throw new Error(`could not find --${name} in app/globals.css`)
  return match[1]
}
const scheme = (label, from, to) => ({
  label,
  bg: read('bg', from, to),
  fg: read('fg', from, to),
  muted: read('muted', from, to),
  accent: read('accent', from, to),
  onAccent: read('on-accent', from, to),
})

const channel = (c) => {
  const v = c / 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}
const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
}
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const schemes = [
  scheme('light', 0, darkStart),
  scheme('dark', darkStart, css.length),
]

// Minimums, and why each one is the number it is.
const checks = (s) => [
  ['body text on background', s.fg, s.bg, 4.5],
  ['muted text on background', s.muted, s.bg, 4.5],
  ['accent text on background', s.accent, s.bg, 4.5],
  ['button label on accent fill', s.onAccent, s.accent, 4.5],
  // 3:1 is what WCAG asks when colour alone distinguishes a link. It does not
  // here, because text links keep an underline, so this is recorded and not
  // enforced. See the palette note in SPEC.md.
  ['accent against body text (informational)', s.accent, s.fg, 0],
]

let failed = 0
for (const s of schemes) {
  console.log(`\n  ${s.label}  bg ${s.bg}`)
  for (const [label, a, b, min] of checks(s)) {
    const r = ratio(a, b)
    const ok = r >= min
    if (!ok) failed++
    const verdict = min === 0 ? 'recorded' : ok ? 'ok' : `FAIL, needs ${min}:1`
    console.log(`    ${label.padEnd(42)} ${r.toFixed(2).padStart(6)}:1  ${verdict}`)
  }
}

console.log()
if (failed > 0) {
  console.error(`${failed} contrast check(s) failed`)
  process.exit(1)
}
console.log('All enforced contrast ratios pass.')
