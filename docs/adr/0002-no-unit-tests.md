# 0002. End to end tests only

Date: 31 Aug 2026
Status: accepted

## Context

The default for a project like this is Jest and React Testing Library alongside Playwright.

## Decision

Playwright only. Six tests. No unit layer.

## Why

There is no logic here. Components take data from a JSON file and render it. A test asserting that a
heading renders the string it was passed is testing React, not my code, and it will not fail for a
reason I care about.

What can break on a static site is a broken link, a missing asset after a rename, wrong metadata so
the preview breaks when someone shares it, or a regression in keyboard access. None of those are
visible to a unit test.

I also cut the end to end list from ten to five for the same reason. The ones I removed asserted
things that cannot fail: that a value from a JSON file appears in the output, that external links
carry `rel="noopener"` which browsers imply for `target="_blank"` anyway, and that the page renders
correctly at three viewport widths, which is not an assertion without visual snapshots.

## Consequence

The suite is slower per test than unit tests and points at a symptom rather than a line. On six
tests and this much code, finding the line takes under a minute.

This decision is about a static content site with no logic. It is not a general position. The moment
this repository grows a transformation with branches, which it would the day I add an HTML resume
route with date formatting and a null end date, the unit layer is where the value is.
