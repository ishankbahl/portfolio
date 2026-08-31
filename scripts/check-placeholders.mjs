/*
  The "no placeholders left" line from the Done when list in SPEC.md, as
  something runnable rather than an instruction I would forget.

    node scripts/check-placeholders.mjs

  Deliberately not a CI gate. Three of the remaining markers are production
  measurements that cannot exist until the site is deployed, so wiring this into
  CI would mean a red branch for a reason that is not a defect.

  It does not scan SPEC.md. The line in there describing this check has to
  contain the markers this check looks for, so a repository wide grep could
  never go green. That was the first version and it was unpassable.
*/
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const ROOTS = ['content', 'app', 'public', 'lib', 'tests', 'scripts', 'README.md']
const MARKERS = /\b(TODO|FIXME|MEASURE|XXX)\b/
const SKIP_FILES = new Set(['scripts/check-placeholders.mjs'])
const BINARY = /\.(woff2|pdf|png|jpg|ico)$/

const files = []
const walk = (entry) => {
  if (!statSync(entry, { throwIfNoEntry: false })) return
  if (statSync(entry).isDirectory()) {
    for (const child of readdirSync(entry)) walk(path.join(entry, child))
    return
  }
  if (!BINARY.test(entry) && !SKIP_FILES.has(entry)) files.push(entry)
}
ROOTS.forEach(walk)

const hits = []
for (const file of files) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, index) => {
      if (MARKERS.test(line)) hits.push(`${file}:${index + 1}  ${line.trim()}`)
    })
}

if (hits.length > 0) {
  console.error(`${hits.length} placeholder marker(s) left:\n`)
  hits.forEach((hit) => console.error(`  ${hit}`))
  console.error('\nThe repository is not done. See the Done when list in SPEC.md.')
  process.exit(1)
}

console.log('No placeholder markers left.')
