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
┌ ○ /                          127 B         102 kB
+ First Load JS shared by all            102 kB
```

102 kB gzipped arrives before I write anything. My code was 127 bytes of it. Two clean builds from a
deleted `.next` give identical figures, which is the only reason I am willing to write them down.

Two things sit behind that number and I checked both rather than trusting the build output, because
the number is the entire subject of this ADR. Gzipping the four shared framework chunks the emitted
HTML references, at level 9, comes to 99.5 kB, so Next's 102 kB is its own estimate and not a
transfer size. And there is a chunk the build output never lists: 38.6 kB gzipped of polyfills
carrying `noModule`, which no current browser fetches.

This ADR has been wrong twice and both corrections are worth more here than a clean page would be.

It said 103 kB for about an hour. I had moved the pin from 15.5.4 to 15.5.24, because 15.5.4 is
deprecated with a critical advisory against it, then re-measured on a `.next` I had not deleted and
wrote the result down. Two clean builds put it back at 102 kB. The version pin changed; the headline
number never did.

It also said the route was 123 B. That was true when I measured an empty `main`, and stopped being
true the moment the JSON-LD block and the two analytics components landed. 127 B is the figure this
page actually emits. A number that was accurate when written is still wrong once the thing it
describes changes, which is the whole failure mode this document was supposed to guard against.

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
