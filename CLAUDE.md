# CLAUDE.md

Working rules for this repository. `SPEC.md` is what to build. This is how.

## Constraints

- **Server components only**, with two exceptions: Vercel Web Analytics and Vercel Speed Insights.
  If something else seems to need `"use client"`, stop and ask. The JavaScript budget in `SPEC.md` is
  a CI gate and breaking it should be a decision, not an accident.
- **No new runtime dependency** without asking, and name what it costs in gzipped bytes. Dev
  dependencies are fine.
- **No content hardcoded in components.** Everything comes from `content/resume.json`.
- **No `any`.** Strict mode stays on.
- **No `next/image`.** The page renders no images. If one is added, use a plain `<img>` with explicit
  `width`, `height` and `loading="lazy"`. `next/image` costs 5.44 kB of route JavaScript and under
  `output: 'export'` it emits `/_next/image` URLs with no server to answer them. See the Images
  section of `SPEC.md`.
- **Never edit `public/ishank-bahl-resume.pdf`.** It is the ATS tested artefact.

## How to work

Vertical slices, one section at a time. Write the test for the slice, watch it fail for the right
reason, implement, run `pnpm typecheck && pnpm lint && pnpm build && pnpm test:e2e`, commit.

The branch is green before it merges. Individual commits in a test-first pair are allowed to be red,
because that is what test-first looks like in a log.

Review your own diff before telling me it is done: what you would change with more time, and what you
are unsure about.

## Commits

Conventional commits. Lower case, imperative, under 72 characters, no trailing full stop.

```
feat(hero): render name and positioning from resume.json
test(pdf): assert the resume link returns application/pdf
fix(a11y): raise secondary text contrast to 4.5:1
```

The body says why, not what. The diff already says what.

## Prose

Comments explain why. If a comment restates the code, delete it.

README and page copy: short declarative sentences, first person, no marketing register. If a sentence
would fit in a press release, rewrite it.

## When stuck

Say so in one sentence and say what you tried. Do not widen scope, add a dependency, or skip a test
to get around a problem. A skipped test is worse than a failing one because it is invisible.
