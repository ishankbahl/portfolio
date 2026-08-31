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
┌ ○ /                          123 B         102 kB
+ First Load JS shared by all            102 kB
```

102 kB gzipped arrives before I write anything. My code was 123 bytes of it. Two clean builds from a
deleted `.next` give identical figures, which is the only reason I am willing to write them down.

Two things sit behind that number and I checked both rather than trusting the build output, because
the number is the entire subject of this ADR. Gzipping the four chunks the emitted HTML references at
level 9 comes to 99.5 kB, so Next's 102 kB is its own estimate and not a transfer size. And there is
a fifth chunk the build output never lists: 38.6 kB gzipped of polyfills carrying `noModule`, which no
current browser fetches. Production will be lower again because Vercel serves brotli, which is why the
README figures are measured against the deployed URL instead of copied from here.

For about an hour this ADR said 103 kB. I had moved the pin from 15.5.4 to 15.5.24 because 15.5.4 is
deprecated with a critical advisory against it, re-measured, and wrote down the result. I had
re-measured on a dirty `.next`. Two clean builds say 102 kB was right all along and that only the
route size really moved, 127 B to 123 B, because the page I measured is not the page the first
measurement used. So the version pin in this ADR changed and the headline number did not. I am
leaving this paragraph in, because publishing a number from a tree I had not reset, in the document
whose whole purpose is publishing honest numbers, is worth more as a warning than as a deletion.

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
