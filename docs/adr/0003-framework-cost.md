# 0003. Keep Next.js, and publish what it costs

Date: 31 Aug 2026
Status: accepted

## Context

This is one static page with no interactivity. A hand written HTML file would be smaller and faster
than anything a framework produces, so Next.js has to justify itself.

I measured the floor before setting any target. Next.js 15.5.24, App Router, static export, no client
components:

```
Route (app)                     Size  First Load JS
┌ ○ /                          127 B         102 kB
+ First Load JS shared by all            102 kB
```

102 kB gzipped arrives before I write anything. Two clean builds from a deleted `.next` give identical
figures.

Two details behind that number, checked rather than read off the build output. Gzipping the four
shared framework chunks the emitted HTML references, at level 9, comes to 99.5 kB, so Next's 102 kB is
its own estimate and not a transfer size. And there is a chunk the output never lists: 38.6 kB
gzipped of polyfills behind `noModule`, which no current browser fetches.

## Decision

Keep Next.js. Set the budget on application JavaScript rather than the total, and put the framework
number in the README.

## Why

I was asked to build this in Next.js, which is a reasonable instruction to follow. It also gives me
metadata handling and font self hosting with metric overridden fallbacks, which is what holds CLS at
zero.

A framework baseline is a fixed cost you either accept or avoid. Counting only my own bytes hides it,
so both numbers go in the README: the floor, and my delta on top of it.

## Consequence

This page will never beat a hand written HTML file, and on a slow connection the difference is real.
Content is separated from rendering in `content/resume.json`, so moving off Next.js is a template
rewrite rather than a rebuild and the decision stays reversible.
