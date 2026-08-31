# 0002. End to end tests only

Date: 31 Aug 2026
Status: accepted

## Context

The default for a project like this is Jest and React Testing Library alongside Playwright.

## Decision

Playwright only. Six specs, seven cases in the runner. No unit layer.

## Why

There is no logic here. Components take data from a JSON file and render it. A test asserting that a
heading renders the string it was passed is testing React, not my code, and it will not fail for a
reason I care about.

What can break on a static site is a broken link, a missing asset after a rename, wrong metadata so
the preview breaks when someone shares it, or a regression in keyboard access. None of those are
visible to a unit test.

The end to end list started at ten. Five survived, cut for the same reason: they asserted things that
cannot fail, like a value from a JSON file appearing in the output, or `rel="noopener"` which browsers
imply for `target="_blank"` anyway. A sixth was added later, when the skip link turned out to be doing
nothing in Safari. That one has a failure mode, which is the whole test.

## Consequence

The suite is slower per test than unit tests and points at a symptom rather than a line. On six specs
and this much code, finding the line takes under a minute.

This is a static content site with no logic, not a general position on unit tests. The first
transformation with branches earns a unit layer.
