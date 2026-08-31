# Spec: personal portfolio landing page

Owner: Ishank Bahl
Status: revised during the build. Answers from the interrogation round are folded into the sections
they belong to rather than kept in a separate log.

## What this is

A single page a recruiter or hiring manager lands on from an application or a LinkedIn message. It
answers "who is this and should I book a call" in thirty seconds, and gives an engineer who scrolls
further enough substance to believe the first thirty seconds.

It is a landing page, not a resume dump. The resume is on it, downloadable, and machine readable.
It is not the layout.

With Selected Work deferred, what the second reader gets is the intro paragraph, the experience lines
and one link to code. That is thinner than I wanted. I would rather write it down here than let this
section keep describing a page I did not build.

## Not building

Written down so I do not drift into them.

No CMS, no database, no auth. Content changes are commits and I am the only author.
No blog, because an empty blog is worse than no blog.
No contact form. A form needs a backend, a spam story and a deliverability story. A mailto link and
a LinkedIn link do the same job for nothing.
No dark mode toggle. See the note under Design.
No animation library, no scroll effects.

## Stack

Next.js 15 on the App Router, TypeScript strict, Tailwind v4, prerendered at build with
`output: 'export'`. Playwright for tests. Deployed on Vercel from GitHub. Node 22, pinned in
`.nvmrc`, with pnpm coming through corepack and its version pinned in `package.json`. Pinned because
the default Node on my machine is 16 and would fail the build in a way that looks like my code.

Next.js is more framework than one static page needs. I am using it because it is what I was asked
to use, and because metadata, font handling and image dimensions come free. What it costs is
measured below rather than hand waved.

## Structure

One route, `/`. Sections in order:

1. Hero. Name, one line of positioning, location, and three actions: resume, email, GitHub.
2. What I work on. Three or four sentences of prose. Not bullets.
3. Experience. Compact list. Company, title, dates, up to four lines each. The section closes with
   one line of education, which was sitting in the JSON with no section rendering it. The Wingify
   entry carries a link to the Node SDK on GitHub, which is the only claim on this page a reader can
   check against code.
4. Skills. Grouped plain text. No percentage bars, no star ratings.
5. Footer. Email, LinkedIn, GitHub, resume.

Selected Work was section 3 and it is in Deferred now. Nine paragraphs of considered prose were the
only thing between this spec and a deployed URL, and this week shipping was worth more than the
section. The lines in Experience stayed at four rather than being cut to two, because the cut was
only defensible while Selected Work existed to carry the detail.

Everything renders from `content/resume.json`. A hardcoded string in a component is a bug. Section
labels like "Experience" are structure rather than content, so they stay in the components. The rule
exists so that changing what the page says about me is a content commit, and renaming a section is
not that.

## The resume PDF

Serve the existing PDF as a static asset. The control is an anchor with `download`. Reasoning and
the rejected alternative are in `docs/adr/0001-serve-static-pdf.md`.

It lives at `public/ishank-bahl-resume.pdf` and nowhere else. It started out in `content/` beside the
JSON, which would have left two copies of the same 65 kB file for the same reason ADR 0001 already
worries about, and I would have been maintaining the drift I wrote an ADR about.

The page also carries a `Person` JSON-LD block generated from the same JSON.

## Performance, measured not asserted

I measured the framework baseline before setting any target. Next.js 15.5.24, App Router, static
export, a page with no client components: **102 kB gzipped First Load JS, of which 123 bytes was
application code.** That number is the floor and no amount of care on my side moves it.

So the target is not a total. It is the part I control.

| What | Target | How it is checked |
|---|---|---|
| Route JavaScript on top of the framework baseline | under 6 kB gzipped | CI, fails the build |
| Framework baseline | reported honestly in the README, not hidden | by hand, once |
| Total page transfer, first visit, no cache | under 250 kB | by hand, once |
| Largest Contentful Paint, mobile lab | under 1.5 s | by hand, once, on the deployed URL |
| Cumulative Layout Shift | 0 | by hand, once |
| Lighthouse performance and accessibility, mobile | report the real numbers | by hand, once |

Only the first row is a CI gate, because it is the only one CI can honestly assert on a static
export. The rest are measured once against the deployed URL and the actual figures go in the README.
If one of them misses, the real number goes in with a sentence saying why.

Measured, not predicted: application JavaScript is **2.34 kB gzipped of the 6 kB budget, and all of
it is the two analytics components. My own code is 0.00 kB.** Every component on this page except
those two is a server component, so none of them reach the browser. I expected to be writing "most
of it is analytics" here and the honest number turned out to be all of it.

The gate is a script rather than a number I read off the build output. It takes the chunk list for `/`
from `.next/app-build-manifest.json`, drops the chunks in the shared framework set, gzips what is
left, sums it, and exits non-zero over 6144 bytes. It prints the analytics share on its own line, so
the figure in the README and the figure CI enforces come from one measurement instead of two that can
disagree.

If the two analytics components alone come in over 6 kB, the budget goes up and the README says it
went up and by how much. It does not get met by quietly dropping Speed Insights. The number is here
because it is true, not because it is small.

CI runs `tsc --noEmit`, ESLint, the production build, the application JavaScript assertion, and the
five Playwright tests. An earlier draft of this section left the tests off that list while Done when
below required them green in CI, so one of the two was wrong.

Layout shift is held at zero by `next/font` with `adjustFontFallback`, which overrides the fallback
face's metrics so the swap does not change line box height, and by there being nothing on the page
that loads after paint.

## Client components

Two exceptions to "no client components": Vercel Web Analytics and Vercel Speed Insights. Both are
client components. Measure what the pair actually costs and put the number in the README rather than
estimating it.

Everything else is a server component. The rule exists so that adding a third client component is a
decision someone makes deliberately rather than something that happens by accident.

## Images

There are no images rendered on this page. The Open Graph image is referenced in a meta tag and never
rendered, so it costs nothing.

If one is ever added, use a plain `<img>` with explicit `width`, `height` and `loading="lazy"`, not
`next/image`. Two measured reasons. `next/image` added 5.44 kB to the route in my own build, which is
more than the entire application budget below. And under `output: 'export'` it silently emits
`/_next/image?url=...` URLs that have no server to answer them, so the build passes and the images
404 in production. Setting `images: { unoptimized: true }` fixes the URLs but not the 5.44 kB, and at
that point the component is doing nothing a plain tag does not.

Explicit width and height is what holds CLS at zero. That is an attribute, not a component.

## Analytics

Vercel Web Analytics for visits and referrers. It is cookieless, so there is no consent banner to
build on a page whose argument is that it is simple.

Vercel Speed Insights for real user LCP, INP and CLS at p75. Lab numbers say the page is fast on a
simulated device. Field numbers say whether it was fast for the person who actually opened it.

Both scripts are served by the Vercel platform under `/_vercel/`, not by this build. They load in
production and they 404 everywhere else, which is fine for the page and not fine for test 4. See the
Tests section.

I originally planned Google Analytics for both. GA measures visits and events. It does not give
useful Core Web Vitals data. That was my mistake and this is the correction.

## Design

The page has to look designed, not templated. Constraints so this does not drift:

One column, left aligned, generous whitespace. One accent hue, on links and the focus ring and
nothing else. A real type scale, body line height 1.6, measure capped around 68 characters. A spacing
scale used consistently. The vertical gap between sections is clearly larger than the gap inside them.

The accent is one hue at two lightness values, one per colour scheme. I wanted it to be a single hex
and it cannot be. A hex that clears 4.5:1 against both a near white and a near black background
exists, and it is a dull mid blue that looks wrong in light mode. Holding the contrast ratio matters
more than holding the sentence, so the sentence changed.

One variable font, self hosted with `next/font/local` from a woff2 committed to the repo, with
`adjustFontFallback` set. Pulling it from Google Fonts at build time would put a network call in the
CI path and buy nothing, and a font fetch is a bad reason for a red build.

Not on this page: gradient blobs, glassmorphism, stock illustration, skill percentage bars, star
ratings, terminal typing effects.

Mobile first. Design at 360 px, check 768 and 1440.

Dark is handled with `prefers-color-scheme`, same accent, inverted neutrals. No toggle. A toggle is
not expensive, it is an inline blocking script that sets a data attribute before paint, but it needs
persistence and a flash-prevention script and I did not want either on a one page site.

## Tests

Five Playwright tests. Written before the code they cover.

1. The page returns 200 and renders my name in an `h1`.
2. The resume link returns 200 with content type `application/pdf`.
3. `axe-core` reports zero violations at serious or critical level, run once per colour scheme.
4. No console errors and no failed network requests on load, ignoring `/_vercel/`.
5. Open Graph title, description and image are present, and the image URL is absolute.

Test 3 runs twice because one run only ever sees the palette the browser happens to be in, which is
light. Dark mode is a second set of colours and an axe run that never loads them is not evidence
about them. It is one test of five in this list and two cases in the runner, which reports six, and
it is two cases rather than one loop so a failure says which scheme broke.

That second run is not theoretical. I dropped the dark accent to a failing colour and rebuilt: light
stayed green and dark failed with `color-contrast` at serious on eight nodes. A light-only run would
have shipped it.

Test 4 needs the `/_vercel/` exception or it fails on a 404 that is correct behaviour everywhere
except production, since the analytics scripts come from the platform and not from this build. The
alternative was finding that out on the first push to CI and assuming I had broken something.

`next start` refuses to run under `output: 'export'`, so the suite runs against `out/` behind `serve`
as a dev dependency. That server is not incidental. Test 2 asserts a content type, and a content type
comes from whatever is serving the file, so the server is part of what test 2 covers. A `BASE_URL`
variable aims the same five tests at production once, after deploy.

No unit tests. Reasoning in `docs/adr/0002-no-unit-tests.md`.

This was ten. The five I removed had no failure mode. Reasoning in ADR 0002.

## Accessibility

One `h1`, heading levels do not skip. Landmark elements. Contrast checked with a tool in both colour
schemes, not by eye in one of them. A skip link. Focus visible and never removed.

No `prefers-reduced-motion` block unless a hover transition survives the build. Nothing on this page
animates, so the media query would be guarding an empty room. That is the argument I used to cut five
tests and it applies to a line in my own spec.

Automated checks are test 3. They catch roughly a third of WCAG criteria, so keyboard order, heading
structure and contrast are also checked by hand. I am not claiming enforced AA conformance from an
axe run.

## SEO

Unique title and meta description. Open Graph and Twitter tags with a static 1200x630 image checked
into the repo. `robots.txt` from `app/robots.ts`, so the host comes out of the JSON like everything
else. Canonical URL. The `Person` JSON-LD above. No sitemap, there is one URL.

`metadataBase` reads `person.siteUrl`. That is what makes the Open Graph image URL absolute, which is
what test 5 asserts, which means the production URL has to be settled before the first build rather
than discovered after the first deploy.

The 1200x630 image is generated once by a script that renders a small HTML file and screenshots it at
that size with Playwright, which is already here for the tests. The PNG is committed. I did not want a
design tool in this loop and I did not want a second image library either.

`twitter:site` is left out rather than filled in with a handle I do not use.

## Done when

- Five Playwright tests pass locally and in CI, CI green on the default branch
- Deployed to Vercel, production URL live
- Lighthouse run against the production URL, real numbers in the README, screenshot committed at
  `docs/lighthouse.png`
- README written, every measured number filled in
- Resume PDF downloads and opens from production
- Link preview verified on WhatsApp and LinkedIn
- No placeholder markers left in `content/`, `app/`, `public/` or `README.md`, checked by a case
  sensitive grep. It does not scan this file, because the line describing the check has to contain
  the markers the check looks for, so a repository wide grep could never go green. The first version
  of this line only looked for `TODO_` with the underscore, and most of the placeholders in this
  repository never had one

## Deferred

Selected Work. Three cards, one per company, each naming the problem in a line, what I built in a
paragraph, and one decision with its cost. This is the first thing going back in and it is the reason
the page is worth a second visit.
Per project detail pages, which is the same idea with room to explain a system properly.
Build time PDF generation from the same JSON, which removes the drift risk in ADR 0001.
Generated Open Graph images per project.
