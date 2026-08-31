# Ishank Bahl, portfolio landing page

One static route, prerendered, deployed on Vercel. This was titled `ishankbahl.com` before the site
had a URL. It does not have that one yet, so the title says what is true instead.

Live: https://portfolio-six-azure-25.vercel.app
Resume: https://portfolio-six-azure-25.vercel.app/ishank-bahl-resume.pdf

## Why this exists

I was asked in an interview to build a portfolio page from my resume, and I spent the time talking
about how I would build it instead of building it. This is the finished version. The page itself is
one page of text. What is worth reading is the three decisions below and whether the numbers hold.

## Numbers

Every row says where it came from. Nothing here is predicted, and the rows I have not measured yet
say so rather than carrying a flattering guess.

| | | Measured |
|---|---|---|
| Framework baseline, First Load JS | 102 kB gzipped | build output, two clean builds |
| My code and analytics on top of it | 2.34 kB gzipped, of which analytics is 2.34 kB | `pnpm budget`, CI gate |
| My own code, excluding analytics | 0.00 kB | same |
| Total page transfer, first visit | 168.4 kB, 10 requests | production, cold cache, brotli, CDP wire bytes |
| Largest Contentful Paint | 1.11 to 1.81 s, **target missed about half the time** | Lighthouse mobile, four runs |
| Largest Contentful Paint, applied throttling | 0.71 s | Playwright, 4x CPU and Slow 4G applied not simulated |
| Cumulative Layout Shift | 0, and 0.00003 in one of four runs | Lighthouse mobile |
| Lighthouse performance | 98 to 100 | four runs against production |
| Lighthouse accessibility / best practices / SEO | 100 / 100 / 100 | same |

The framework number is the interesting one. Next.js on the App Router ships 102 kB gzipped to the
browser for a page with no client components at all, and I measured that on an empty page before
setting any target. I could not have moved it. So the budget in CI is on my delta, which is the part
I actually control, and both numbers are here rather than just the flattering one.
See [docs/adr/0003-framework-cost.md](docs/adr/0003-framework-cost.md).

The second row is the one I did not expect. Every component on this page is a server component
except Vercel Web Analytics and Speed Insights, so the entire 2.34 kB of application JavaScript is
those two libraries and none of it is mine. I had written "most of it is analytics" in the spec
before measuring. It is all of it.

**The LCP target missed and I am leaving the number in.** The spec asked for under 1.5 s on a mobile
lab profile. Four Lighthouse runs against production gave 1.11, 1.38, 1.77 and 1.81 s, so it is over
as often as it is under. Measuring the same page with throttling actually applied rather than
simulated gives 0.71 s. Both numbers are real and they disagree because Lighthouse models a slow
network instead of imposing one, and it models it differently each run. I would rather publish the
spread than pick the run that agreed with my target. What I would do about it, with more time, is
find out why a page whose largest element is text that arrives in the HTML has an LCP that moves by
700 ms between runs. My suspicion is the font swap, and a suspicion is not a measurement.

I also predicted the transfer size wrong. The README used to say production would come in under my
157.7 kB local figure because Vercel serves brotli. It is 168.4 kB. Brotli did help, and it was
outweighed by two things the local number could not include: the analytics scripts, which only exist
in production and are 6.4 kB, and per response header overhead, which wire bytes count and file sizes
do not. Of the 168.4 kB, 48.6 kB is the font, served uncompressed because woff2 already is, and
104 kB is the framework.

![Lighthouse mobile against production](docs/lighthouse.png)

## Three decisions

**The download button does not generate a PDF.** My first design rendered the page to PDF in the
browser. That rasterises the DOM, so you get an image of text with no text layer, which no applicant
tracking system can parse. The feature would have defeated the requirement that motivated it. It is
now an anchor pointing at the PDF I already maintain and have tested. [docs/adr/0001-serve-static-pdf.md](docs/adr/0001-serve-static-pdf.md).

**There are no unit tests, and there are five end to end tests rather than ten.** There is no logic
here to unit test, and half the end to end list was asserting things that had no failure mode, so it
went. [docs/adr/0002-no-unit-tests.md](docs/adr/0002-no-unit-tests.md).

**Analytics is two tools, not one.** Vercel Web Analytics for visits, Speed Insights for real user
Core Web Vitals. I had originally planned Google Analytics for both, which was wrong, because GA does
not give useful field performance data.

## How it was built

Claude Code, spec first. `SPEC.md` landed before any application code and the history shows it.

The part of that workflow that actually earns its place is the interrogation step. Before it writes
anything I have it read the spec and ask me every question where it would otherwise guess, in one
batch, with a recommended answer for each. A model that is not asked to do this picks a default
silently and you find out three files later.

On this project it produced twenty questions and four of the answers changed the build. My own
`resume.json` said I wrote the VWO Node SDK "from scratch", and the repository I link to lists two
authors with me second, which is a claim that dies on the first click. Test 4, no failed network
requests, was going to fail on the analytics scripts 404ing, because those are served by Vercel and
do not exist in a local build. The version of Next my spec was written around turned out to be
deprecated with a critical advisory against it. And my own completion check, the one that was
supposed to stop me shipping with placeholders in the repo, searched for a spelling that most of the
placeholders did not use, so it would have gone green on a repository still full of them.

None of those were caught by being clever. They were caught by being asked before anything was
written.

One thing the questions did not catch, and no test did either. There was no favicon, so every real
visitor took a 404 on `/favicon.ico`. Test 4 asserts that nothing fails to load and reported a clean
page, because headless Chromium does not make the automatic favicon request a real browser makes.
Lighthouse found it in production. The test now reads the declared icon off the page and fetches it,
which is the assertion that would have caught it, and I only knew to write it after measuring the
deployed site. That is the argument for the last row of the Done when list being a real deployment
rather than a green branch.

I checked three things by hand and did not delegate them: every factual claim about my own work,
because a model with a resume will happily write a sentence I cannot defend on the third follow up
question; the confidentiality boundary, since none of this names an internal system or a customer;
and the numbers above, which are measured rather than predicted.

## Running it

Node 22, pinned in `.nvmrc`. pnpm comes from the `packageManager` field through corepack.

```
pnpm install
pnpm dev
```

The gate, in the order CI runs it:

```
pnpm typecheck
pnpm lint
pnpm build
pnpm budget
pnpm test:e2e
```

`pnpm budget` is the one worth explaining. It reads `out/index.html`, sorts every script into
framework, legacy polyfill or application, gzips the application ones and exits non-zero over 6 kB.
It measures the HTML rather than the build manifest because the two disagree: the manifest lists a
page chunk that the HTML never references, since this page ships no client code.

`pnpm og` regenerates `public/og.png`. Run it if the name, the positioning line or the site URL
changes, and commit the result.

`pnpm check:placeholders` is the Done when list's "no placeholders left" line as something runnable.
It currently exits 1 and names four, all of them measurements that need the deployed URL. It is not
a CI gate, because a red branch for a number that cannot exist yet is not a useful signal.

## Not here

No CMS, no blog, no contact form, no dark mode toggle, no animation library. Reasons in `SPEC.md`.

Deferred rather than rejected: a Selected Work section, per project detail pages, build time PDF
generation from the same JSON, generated Open Graph images.

Selected Work is the real gap. Three cards, one per company, each naming a decision I made and what
it cost. It needed nine paragraphs I had not written, and it was the only thing standing between the
spec and a deployed URL, so it went to the deferred list and the page shipped without it. That is the
honest version. It is the first thing going back in.
