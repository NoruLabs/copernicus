---
name: Copernicus
description: A daily NASA almanac set as an engraved ephemeris ledger.
colors:
  paper: "#f7f5ee"
  ink: "#20231f"
  muted: "#5a6158"
  rule: "#c8ccc2"
  measure: "#35564a"
  surface: "#ffffff"
  focus: "#2458c6"
typography:
  display:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(2.4rem, 7vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "1.15rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Source Sans 3, Segoe UI, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Source Sans 3, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: "0.04em"
rounded:
  none: "0"
spacing:
  xs: "0.55rem"
  sm: "0.75rem"
  md: "0.85rem"
  lg: "1.5rem"
  xl: "1.75rem"
  section: "2.5rem"
components:
  masthead:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    rounded: "{rounded.none}"
    padding: "0 0 1rem"
  plate:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    width: "100%"
  ledger-row:
    backgroundColor: "transparent"
    textColor: "{colors.measure}"
    rounded: "{rounded.none}"
    padding: "0.7rem 0"
  section-heading:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "0 0 0.55rem"
  skip-link:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1rem"
---

# Design System: Copernicus

## Overview

**Creative North Star: "The Ephemeris Ledger"**

Copernicus is a daily astronomical almanac: evidence is printed, measured, ruled, and dated rather than wrapped in application chrome. Warm paper, near-black ink, restrained green measurements, serif authority, and compact sans-serif notation make the edition feel archival without becoming nostalgic theater.

The composition gives imagery and measurements equal authority. A masthead establishes the issue, the lead plate supplies the day’s visual evidence, and ephemeris and ledger patterns turn live NASA fields into readable records. The interface is flat, square, and still; interest comes from real imagery, typographic contrast, and engraved rules rather than decoration or motion.

**Key Characteristics:**
- Warm almanac paper with ink, muted notation, and pale rule hierarchy
- Source Serif 4 for masthead and editorial titles; Source Sans 3 for reading and measurement
- Square image plates bounded by fine ink strokes
- Tabular ledger rows with deep green measure values and plain-language call-outs
- Engraved horizontal rules organize the edition without cards or shadows
- No animation, decorative dashboard chrome, kickers, or eyebrows

## Colors

The palette resembles ink printed on warm stock, with green reserved for measured values and blue reserved for keyboard focus.

### Primary
- **Measure Green** (`{colors.measure}`): Numerical findings, figures, and evidence values. It identifies measurement, not status or decoration.

### Tertiary
- **Focus Blue** (`{colors.focus}`): Keyboard focus outlines only; it remains outside the editorial palette.

### Neutral
- **Almanac Paper** (`{colors.paper}`): The uninterrupted page field and browser theme color.
- **Ledger Ink** (`{colors.ink}`): Masthead, headlines, body hierarchy, major rules, selection background, and image borders.
- **Muted Notation** (`{colors.muted}`): Datelines, deck copy, sources, captions, metadata, and explanatory call-outs.
- **Engraved Rule** (`{colors.rule}`): Interior ledger dividers and quiet media borders.
- **Plate White** (`{colors.surface}`): Image loading field and the lightest material contrast.

### Named Rules
**The Measure Ink Rule.** Green belongs to measured evidence. Never spread it into broad fills, headings, badges, or ornamental accents.

**The Two-Rule Rule.** Major editorial divisions use ink; repeated interior records use the paler engraved rule.

## Typography

**Display Font:** Source Serif 4 (with Georgia, serif)
**Body Font:** Source Sans 3 (with Segoe UI, sans-serif)
**Label Font:** Source Sans 3

**Character:** The serif is engraved, authoritative, and editorial; the sans serif is lucid and contemporary. Together they read as a current scientific almanac rather than a vintage pastiche.

### Hierarchy
- **Display** (700, `clamp(2.4rem, 7vw, 4.5rem)`, 0.92 line-height, -0.03em tracking): The Copernicus masthead only.
- **Headline** (700, `clamp(1.6rem, 3.5vw, 2.4rem)`, 1.15 line-height, -0.02em tracking): Lead plate title.
- **Title** (700, `1rem`–`1.15rem`, approximately 1.2 line-height): Ephemeris, section titles, and record names.
- **Body** (400, `0.95rem`–`1rem`, 1.55–1.6 line-height): Deck, APOD explanation, notes, and colophon; the masthead deck is constrained to `58ch`.
- **Label** (600–700, `0.75rem`–`0.82rem`, 0.03–0.04em tracking, uppercase where used): Ledger labels and named sources.
- **Measure** (600–700, `0.9rem`–`0.95rem`, tabular numerals): Ephemeris values and discovery figures in Measure Green.

### Named Rules
**The Serif Authority Rule.** Serif type names the publication, plates, sections, and records; sans serif carries explanation, provenance, and measurement.

**The Tabular Evidence Rule.** Dates and quantitative figures use tabular numerals so ledger columns remain stable.

**The No Eyebrow Rule.** Do not add marketing kickers or decorative eyebrows above established headings. Provenance belongs in captions, datelines, or source lines.

## Layout

The edition sits in a centered `68rem` measure with `1rem` desktop side insets, `2rem` top padding, and `4rem` bottom padding. The masthead is a baseline-aligned brand/date row followed by a short deck and a heavy lower rule.

The lead folio is a two-column grid: a wider plate column (`1.35fr`) and an ephemeris column (`0.9fr`) with a `1.75rem` gutter. The lower edition repeats the model at `1.4fr / 0.8fr` for discoveries and image briefs. Vertical rhythm is compact and editorial: `0.55rem`–`0.85rem` within records, `1.5rem`–`1.75rem` between major bands, and `2.5rem` before the colophon.

At `56rem` and below, folio and lower grids become a single reading column. At `37rem` and below, side insets tighten to `0.625rem`, the masthead brand and date stack, and planet figures move below their record names. Mobile preserves the same editorial order: masthead, plate, explanation, ephemeris, then lower ledgers.

### Named Rules
**The Plate-and-Ledger Rule.** On wide screens, the lead image and ephemeris share the folio; on narrow screens, preserve their order and stack them without changing their visual language.

## Elevation & Depth

The system is fully flat. There are no shadows, gradients, glows, translucent panels, hover lift, or tonal card stacks. Material depth comes from the warm paper field, white image loading surfaces, photographic plates, and the contrast between heavy ink rules and pale engraved dividers.

### Named Rules
**The Printed Plane Rule.** Every element rests on the paper. Use borders and spacing for structure; never simulate floating interface layers.

**The No Motion Rule.** The edition contains no animation or transitions. State changes, including skip-link reveal, are immediate.

## Shapes

All geometry is square (`0` radius). Image plates, thumbnails, tables, section bands, and focus-adjacent controls use straight edges. One-pixel strokes frame imagery and divide records; the masthead alone uses a stronger `2px` ink rule. Cropping is rectangular and purposeful: lead media uses `16 / 10`, thumbnails are `4.5rem` squares, and Earth observation is square.

### Named Rules
**The Engraved Edge Rule.** Use crisp rectangular frames and horizontal rules. Do not introduce pills, rounded cards, circles, or ornamental containers.

## Components

### Masthead
- **Character:** A publication mark, not navigation chrome.
- **Structure:** Source Serif 4 brand and a muted tabular dateline share a baseline; a concise sans-serif deck follows.
- **Rule:** A `2px` Ledger Ink border closes the masthead.
- **Responsive:** Brand and dateline stack below `37rem`.

### Lead plate
- **Character:** The edition’s primary visual evidence.
- **Frame:** Square corners, `1px` Ledger Ink border, Plate White loading field, `16 / 10` media crop.
- **Caption stack:** Serif headline, muted source/date/credit note, then readable explanation.
- **Fallback:** Plain muted text occupies the same editorial flow; no decorative empty-state illustration.

### Ephemeris
- **Character:** A compact daily measurement register paired with the plate.
- **Structure:** Serif title above a full-width collapsed table, introduced by a `1px` ink rule.
- **Rows:** Muted uppercase labels occupy roughly 42%; Measure Green values align beside them.
- **Call-outs:** Each value carries a smaller muted plain-language explanation underneath.

### Ledger rows
- **Character:** Repeated evidence records, never cards.
- **Structure:** Transparent rows with `0.7rem`–`0.85rem` vertical padding and a pale engraved bottom rule.
- **Values:** Quantitative figures align right on wide screens and move beneath the title on small screens.

### Section heading
- **Structure:** Serif title and muted uppercase source share a baseline above a `1px` ink rule.
- **Spacing:** `0.55rem` below the heading line and `0.85rem` before content.
- **Language:** Use direct section names and source attribution; do not prepend kickers.

### Image brief
- **Structure:** A `4.5rem` square thumbnail beside serif title and muted date metadata.
- **Frame:** Thumbnail receives a `1px` Engraved Rule border and Plate White loading field.

### Earth observation
- **Structure:** Reuses the section heading, followed by a square plate and muted source/date metadata.
- **Frame:** Full-width square crop with a `1px` Ledger Ink border.

### Skip to content
- **Structure:** Off-canvas until keyboard focus, then immediately appears at the upper left.
- **Style:** Ledger Ink background, Almanac Paper text, square corners, `0.75rem 1rem` padding.
- **Focus:** `2px` Focus Blue outline with `3px` offset.

## Do's and Don'ts

### Do:
- **Do** use Almanac Paper as the continuous field, with Ledger Ink and Engraved Rule defining hierarchy.
- **Do** pair Source Serif 4 editorial authority with Source Sans 3 reading clarity.
- **Do** reserve Measure Green for numerical evidence and tabular figures.
- **Do** treat NASA imagery as a bordered plate with source, date, and credit close by.
- **Do** keep plain-language call-outs attached to every ephemeris figure.
- **Do** preserve the `68rem` edition measure and stack folio columns below `56rem`.
- **Do** preserve the blue keyboard focus ring and immediate skip-link behavior.

### Don't:
- **Don't** add cards, shadows, gradients, glow, glass, or rounded containers.
- **Don't** animate or transition any interface element.
- **Don't** add kickers, eyebrows, slogans, promotional copy, or dashboard labels.
- **Don't** use Measure Green as decoration or a broad background.
- **Don't** detach provenance from the image or measurement it qualifies.
- **Don't** turn the edition into a landing page, dashboard, endpoint register, or app shell.
