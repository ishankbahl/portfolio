# 0001. Serve a static resume PDF instead of generating one in the browser

Date: 31 Aug 2026
Status: accepted

## Context

The spec asks for a resume download, and it asks for the resume to be readable by an applicant
tracking system. My first design satisfied one and defeated the other.

That design was a button that renders the page to PDF client side, with something like `html2canvas`
and `jsPDF`. That approach rasterises the DOM, so the output contains an image of text and no text
layer. An ATS extracts a text layer. The feature would have produced a document no recruiting system
can read, in service of a requirement about being readable by recruiting systems.

## Decision

Serve the existing PDF as a static asset at `/ishank-bahl-resume.pdf`. The control is an anchor tag
with a `download` attribute.

## Consequence

The file a recruiter receives is the one I already maintain and have already checked against parsers,
rather than one regenerated from a layout designed for a screen. It also removes two dependencies
from a page that is trying to ship almost no application JavaScript.

The cost is drift. The page and the PDF are now two artefacts rather than one derived from the other.
Mitigation is a rule rather than a mechanism: any edit to `content/resume.json` regenerates the PDF
in the same pull request. A rule is weaker than a mechanism and I am aware of it.

## Alternative

Generate the PDF at build time from the same JSON with a headless browser. That keeps the text layer
and removes the drift. I did not do it because it adds a Puppeteer dependency and a build step, and
because I would then be shipping a PDF whose parser behaviour I have not tested. It is the second
item in the deferred list in `SPEC.md`.
