# CLAUDE.md

Working rules for this repository. `SPEC.md` is what to build. This is how.

## Constraints

- **Server components only**, with two exceptions: Vercel Web Analytics and Vercel Speed Insights.
  If something else seems to need `"use client"`, stop and ask. The JavaScript budget in `SPEC.md` is
  a CI gate and breaking it should be a decision, not an accident.
- **No new runtime dependency** without asking, and name what it costs in gzipped bytes. Dev
  dependencies are fine.
- **No content hardcoded in components.** Everything the page claims about me comes from
  `content/resume.json`. Structural labels are not content: section titles and control labels like
  "Download resume" live in the components. The rule exists so changing what the page says about me is
  a content commit.
- **No `any`.** Strict mode stays on.
- **No `next/image`.** Under `output: 'export'` it emits `/_next/image` URLs with no server to answer
  them, so the build passes and the images 404 in production. It also costs 5.39 kB of route
  JavaScript, most of the 6 kB budget, for a component this page has no use for. Use a plain `<img>` with explicit
  `width` and `height`. `loading="lazy"` for anything below the fold; the hero photo is the LCP
  element so it is `eager` with `fetchpriority="high"`.
- **Never edit `public/ishank-bahl-resume.pdf`.** It is the ATS tested artefact. If it has to change,
  regenerate it from its source document rather than editing the PDF.

## How to work

Vertical slices, one section at a time. Write the test for the slice, watch it fail for the right
reason, implement, then run the full gate before committing:

```
pnpm typecheck && pnpm lint && pnpm build && pnpm budget && pnpm test:e2e
```

That is the same five steps CI runs, in the same order.

The branch is green before it merges. Individual commits in a test-first pair are allowed to be red,
because that is what test-first looks like in a log.

Review your own diff before telling me it is done: what you would change with more time, and what you
are unsure about. That review goes in the pull request or in chat. It does not go in a commit message
or an ADR.

## Commits

Conventional commits. Lower case, imperative, under 72 characters, no trailing full stop. One concern
per commit.

```
feat(hero): render name and positioning from resume.json
test(pdf): assert the resume link returns application/pdf
fix(a11y): raise secondary text contrast to 4.5:1
```

The body says why, not what. The diff already says what. **Six lines maximum.** If the reasoning
needs more than that, it is an ADR, or the commit is too big and should be split.

A commit body never mentions feedback, a reviewer, a previous version of itself, or what I learned.

## Prose

This applies to everything written in the repository: the README, `SPEC.md`, the ADRs, code comments,
commit messages and page copy.

Comments explain why. If a comment restates the code, delete it. A comment should not be longer than
the code it describes.

Short declarative sentences, first person, no marketing register.

Two tests before you keep a sentence. If it tells the reader what you learned, what you got wrong, or
how carefully you checked, cut it and keep only the fact. And if it is a closing line that sounds
satisfying, delete it: an unfinished flat ending reads as a person, a polished one reads as a machine.

## When stuck

Say so in one sentence and say what you tried. Do not widen scope, add a dependency, or skip a test
to get around a problem. A skipped test is worse than a failing one because it is invisible.
