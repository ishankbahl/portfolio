# Spec: personal portfolio landing page

Owner: Ishank Bahl

## What this is

A single page a recruiter or hiring manager lands on from an application or a LinkedIn message. It
answers "who is this and should I book a call" in thirty seconds, and gives an engineer who scrolls
further enough substance to believe the first thirty seconds.

A landing page, not a resume dump. The resume is on it, downloadable and machine readable. It is not
the layout.

## Not building

No CMS, database or auth. Content changes are commits and I am the only author.
No blog. An empty blog is worse than no blog.
No contact form. A form needs a backend, a spam story and a deliverability story. A mailto link and a
LinkedIn link do the same job for nothing.
No dark mode toggle. A toggle needs persistence and a flash-prevention script, and neither belongs on
a one page site.
No animation library, no scroll effects, no photography.

## Stack

Next.js 15 on the App Router, TypeScript strict, Tailwind v4, prerendered with `output: 'export'`.
Playwright for tests. Vercel from GitHub. Node 22 pinned in `.nvmrc`, pnpm pinned in `package.json`
through corepack, because the default Node on this machine is 16 and would fail the build in a way
that looks like my code.

Next.js is more framework than one static page needs. I used it because it is what I was asked to
use, and its cost is measured rather than hand waved. See `docs/adr/0003-framework-cost.md`.

## Structure

One route, `/`. Sections in order:

1. Hero. Name, headline, positioning, location, and three actions: resume, email, GitHub.
2. What I work on. Prose, not bullets.
3. Experience. Company, title, period, up to four lines each, closing with one line of education. The
   Wingify entry links the Node SDK on GitHub, the only claim here a reader can check against code.
4. Skills. Grouped, as plain words.
5. Footer. Email, LinkedIn, GitHub, resume.

Everything renders from `content/resume.json`. A hardcoded string in a component is a bug. Section
labels like "Experience" are structure, not content, so they stay in the components: the rule exists
so changing what the page says about me is a content commit.

## The resume PDF

Served as a static asset from `public/ishank-bahl-resume.pdf` and nowhere else. The control is an
anchor with `download`. Reasoning and the rejected alternative are in
`docs/adr/0001-serve-static-pdf.md`.

The page also carries a `Person` JSON-LD block generated from the same JSON.

## Performance

The framework baseline was measured before any target was set: 102 kB gzipped First Load JS for a
page with no client components. That is the floor and no care on my side moves it, so the target is
set on the part I control.

| What | Target | Checked by |
|---|---|---|
| Route JavaScript above the framework baseline | under 6 kB gzipped | CI, fails the build |
| Total page transfer, first visit, no cache | under 250 kB | by hand, once |
| Largest Contentful Paint, mobile lab | under 1.5 s | by hand, once, on the deployed URL |
| Cumulative Layout Shift | 0 | by hand, once |
| Lighthouse, mobile | report the real numbers | by hand, once |

Only the first row is a CI gate, because it is the only one CI can honestly assert on a static
export. The rest are measured once against the deployed URL and the figures go in the README. If one
misses, the real number goes in with a sentence saying why. One does: LCP.

The gate is `scripts/check-js-budget.mjs`, not a number read off the build output. It reads the
scripts `out/index.html` references, drops the shared framework chunks from
`.next/build-manifest.json`, gzips the rest and exits non-zero over 6144 bytes. It measures the HTML
because the manifest disagrees with it: the manifest lists a page chunk the HTML never references,
since the page ships no client code.

If the two analytics components alone exceed 6 kB, the budget goes up and the README says so. It does
not get met by quietly dropping Speed Insights.

CI runs `tsc --noEmit`, ESLint, the production build, the JavaScript budget, and the six Playwright
tests.

Layout shift is held at zero by `next/font` with `adjustFontFallback`, which overrides the fallback
face's metrics so the swap does not change line box height, and by nothing loading after paint.

## Client components

Two exceptions to "server components only": Vercel Web Analytics and Vercel Speed Insights. Both are
client components and their cost is measured, not estimated. Everything else is a server component,
so adding a third is a deliberate decision rather than an accident.

## Images

No images are rendered. The Open Graph image is referenced in a meta tag and never rendered.

If one is added, use a plain `<img>` with explicit `width`, `height` and `loading="lazy"`, not
`next/image`. Two measured reasons. `next/image` adds 5.39 kB to the route, most of the 6 kB budget,
for a component this page has no use for. And under `output: 'export'` it emits `/_next/image?url=...`
URLs with no server to answer them, so the build passes and the images 404 in production.
`images: { unoptimized: true }` fixes the URLs and not the bytes.

Explicit width and height is what holds CLS at zero. That is an attribute, not a component.

## Analytics

Vercel Web Analytics for visits and referrers. Cookieless, so no consent banner on a page whose
argument is that it is simple.

Vercel Speed Insights for real user LCP, INP and CLS at p75. Lab numbers say the page is fast on a
simulated device; field numbers say whether it was fast for the person who opened it.

Both load their scripts from the Vercel platform, not from this build, so they 404 anywhere except
production. That is why test 4 carries an exception.

Google Analytics was the original plan for both. It does not give useful Core Web Vitals data.

## Design

One column, left aligned, generous whitespace. A real type scale, body line height 1.6, measure
capped around 68 characters. The vertical gap between sections is clearly larger than the gap inside
them. Mobile first: design at 360 px, check 768 and 1440. Dark via `prefers-color-scheme`.

One variable font, self hosted with `next/font/local` from a woff2 committed to the repo. Fetching it
from Google at build time would put a network call in the CI path for nothing.

**Palette.** One accent hue at two lightness values, one per scheme, plus one highlight colour for
the marker on the headline. The accent is on links, the focus ring, the primary button and the list
markers. Every colour is checked by script in both schemes, not by eye.

Two constraints came out of that checking rather than taste. Links cannot be carried by colour alone,
because the accent is 2.5:1 against body text and WCAG asks for 3:1 when colour is the only cue, so
text links keep a visible underline and the primary action is a filled button. And white on the dark
scheme's lighter violet is 2.72:1 and fails, so the dark button uses near-black text.

**On the page:** a soft radial wash behind the hero, rounded cards for experience, pills for skills.
All CSS, so no JavaScript cost, and the wash is a fixed pseudo element so it cannot affect layout.

**Not on the page:** stock illustration, skill percentage bars, star ratings, terminal typing
effects. Bars and ratings assert a precision nobody can defend. A pill is a word with a border round
it and claims nothing.

## Tests

Six Playwright tests, seven cases in the runner. Five written before the code they cover, one added
after review because the bug it covers had already shipped.

1. The page returns 200 and renders my name in an `h1`.
2. The resume link returns 200 with content type `application/pdf`.
3. `axe-core` reports zero serious or critical violations, run once per colour scheme.
4. No console errors and no failed requests on load, ignoring the Vercel analytics scripts, plus the
   declared icon resolves.
5. Open Graph title, description and image are present, and the image URL is absolute.
6. Activating the skip link moves focus into `main`.

Three of these earn a note.

Test 3 runs twice because one run only sees the palette the browser is in, which is light. Two cases
rather than a loop, so a failure says which scheme broke. Not theoretical: dropping the dark accent
to a failing colour keeps light green and fails dark on eight nodes.

Test 4 needs its exception or it fails on a 404 that is correct everywhere but production. The 404
produces two signals, the failed request and the console error it causes, and the exception has to
cover both.

Test 6 exists because `main` is not focusable, so the skip link moved the hash and left focus on
`body`. Chromium masks that by continuing sequential focus from the fragment anyway; WebKit does not,
so in Safari the skip link did nothing. axe cannot see it, because axe reads a static tree and this is
a behaviour.

`next start` will not run under `output: 'export'`, so the suite runs against `out/` behind `serve`.
That server is part of what test 2 covers, since a content type comes from whatever serves the file.
`BASE_URL` aims the same six tests at production after deploy.

No unit tests. This was ten tests; the ones removed had no failure mode. Reasoning in
`docs/adr/0002-no-unit-tests.md`.

## Accessibility

One `h1`, heading levels do not skip, named landmarks. Contrast checked with a tool in both schemes,
not by eye in one. A skip link that moves focus. Focus visible and never removed.
`prefers-reduced-motion` respected, because two colour transitions survived the build.

Test 3 is the automated part. It catches roughly a third of WCAG criteria, so keyboard order, heading
structure and contrast are also checked by hand. I am not claiming enforced AA conformance from an
axe run.

## SEO

Unique title and meta description. Open Graph and Twitter tags with a static 1200x630 image committed
to the repo, generated by `scripts/generate-og.mjs` from the same font and tokens as the page.
`robots.txt` from `app/robots.ts`. Canonical URL. `Person` JSON-LD. No sitemap, there is one URL.
No `twitter:site`, rather than a handle I do not use.

`metadataBase` reads `person.siteUrl`, which is what makes the Open Graph image URL absolute. The
production URL therefore has to be settled before the build, not discovered after the deploy.

## Done when

- Six Playwright tests pass locally and in CI, CI green on the default branch
- Deployed to Vercel, production URL live
- Lighthouse run against production, real numbers in the README, screenshot at `docs/lighthouse.png`
- README written, every measured number filled in
- Resume PDF downloads and opens from production
- Link preview verified on WhatsApp and LinkedIn
- `pnpm check:placeholders` exits 0

## Deferred

Selected Work. Three cards, one per company, each naming the problem in a line, what I built in a
paragraph, and one decision with its cost. The first thing going back in, and the reason the page
would be worth a second visit.

Per project detail pages, the same idea with room to explain a system properly.
Build time PDF generation from the same JSON, which removes the drift risk in ADR 0001.
Generated Open Graph images per project.
