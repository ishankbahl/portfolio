# 0003. Keep Next.js, and publish what it costs

Date: 31 Aug 2026
Status: accepted

## Context

This is one static page with no interactivity. A hand written HTML file would be smaller and faster
than anything a framework produces, so Next.js has to justify itself.

Before setting a performance target I measured the floor. Next.js 15.5.24, App Router, static export,
a page with an empty `main` and no client components anywhere:

```
Route (app)                     Size  First Load JS
┌ ○ /                          123 B         103 kB
+ First Load JS shared by all            103 kB
```

103 kB gzipped arrives before I write anything. My code was 123 bytes of it.

Two things sit behind that number, and I checked both rather than trusting the build output, because
the number is the entire point of this ADR. Next reports 103 kB. Gzipping the four chunks the emitted
HTML actually references gives 100.4 kB, the gap being Next's gzip settings rather than the browser's.
And there is a fifth chunk of 38.5 kB gzipped polyfills that the build output does not list, which
carries `noModule`, so no current browser fetches it.

The first version of this ADR measured 102 kB on 15.5.4. That release turned out to be deprecated
with a critical advisory against it, so the pin moved to 15.5.24 and the figures above come from the
version that actually ships. One kilobyte of drift across twenty patch releases.

## Decision

Keep Next.js. Set the budget on application JavaScript, not on the total, and put the framework
number in the README rather than hiding it.

## Why

I was asked to build this in Next.js and that is a reasonable instruction to follow. It also gives me
metadata handling, font self hosting with metric overridden fallbacks, and image dimensions, which is
what actually holds CLS at zero.

The honest framing is that a framework baseline is a fixed cost you either accept or avoid, and
pretending it is not there by counting only your own bytes is the kind of number that falls apart
when someone opens devtools. So both numbers go in the README: the framework floor, and my delta on
top of it.

## Consequence

This page will never beat a hand written HTML file, and on a slow connection the difference is real.
Because content is separated from rendering in `content/resume.json`, moving off Next.js is a
template rewrite rather than a rebuild, so the decision stays reversible.

If this were a page whose whole purpose was to be the fastest thing on the internet, the answer would
be different and it would be one HTML file.
