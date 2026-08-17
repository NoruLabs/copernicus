---
name: Copernicus
description: A daily NASA feed on near-white paper with black ink and a sticky feature rail.
colors:
  paper: "#FDFDFC"
  ink: "#111111"
  muted: "rgba(17, 17, 17, 0.64)"
  faint: "rgba(17, 17, 17, 0.08)"
  rule: "rgba(17, 17, 17, 0.16)"
  focus: "#2458c6"
  mediaStage: "#050505"
  modalBackdrop: "rgba(0, 0, 0, 0.78)"
  flairPurple: "#A5A6F6"
  flairGreen: "#7BD88F"
  flairYellow: "#FFD36E"
  flairCoral: "#FF9BB3"
typography:
  display:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "1.35rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  headline:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(1.6rem, 4vw, 2.4rem)"
    fontWeight: 700
    lineHeight: 1.12
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
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: "0.04em"
rounded:
  none: "0"
  pill: "999px"
  circle: "50%"
spacing:
  xs: "0.35rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.25rem"
  xl: "1.4rem"
  rail: "16rem"
  feed: "46rem"
  shell: "72rem"
components:
  feature-rail-item:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 0.7rem"
    height: "3rem"
  feature-rail-item-hover:
    backgroundColor: "{colors.faint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  feed-header:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.25rem"
    height: "4rem"
  section-heading:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "1rem 1.25rem 0.75rem"
  fact-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.15rem 1.25rem"
  image-brief:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.25rem"
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

Copernicus ships as a direct daily NASA feed: near-white paper, black ink, Source Serif / Source Sans, and ruled sections instead of a marketing landing page or dashboard shell. The Ephemeris Ledger world remains the product commitment, but the finished interface reads as a Twitter-like feature rail beside a central newspaper column—quiet, exact, and still.

Imagery and measurements share equal authority. A sticky left rail (bottom bar on small screens) jumps to APOD, Near Earth, Exoplanets, and Image Library. The feed opens with a sticky local date and 24-hour time, then a full-width astronomy picture, plain-language near-Earth facts, five exoplanet rows, and five image briefs. Structure comes from alpha ink rules and typography; motion and color are reserved for the orbit icon and APOD download interaction.

**Key Characteristics:**
- Near-white paper (`#FDFDFC`) and black ink (`#111111`) with muted/rule/faint alpha roles
- Source Serif 4 for brand and editorial titles; Source Sans 3 for reading, metadata, and navigation labels
- X-style sticky left feature rail with named camera, orbit, Earth, and gallery icons; a quiet donation rail on wide screens; mobile bottom navigation with a home control
- Central ruled feed with sticky local date / 24-hour time header
- Full-width APOD plate, plain-language Near Earth facts, five exoplanet rows, five image briefs
- Flat reading surface with three motion exceptions: the Near Earth orbit icon, APOD download flair, and calendar reveal
- User-controlled paper-light and ink-dark themes

## Colors

The palette is ink on paper. Hue is reserved for keyboard focus; every other role is black ink at full strength or reduced alpha.

### Tertiary
- **Focus Blue** (`{colors.focus}`): Keyboard focus outlines only; outside the editorial palette.

### Neutral
- **Cool Paper** (`{colors.paper}`): Continuous page field and browser theme color.
- **Press Ink** (`{colors.ink}`): Brand, headings, icons, selection background, skip-link fill, and primary figures.
- **Muted Ink** (`{colors.muted}`): Explanations, metadata, local time, source labels, colophon, and empty states.
- **Rule Ink** (`{colors.rule}`): Feed column borders and horizontal section / row dividers.
- **Faint Ink** (`{colors.faint}`): Feature-rail hover wash only.
- **Media Stage** (`{colors.mediaStage}`): Letterbox field behind images in the detail viewer.
- **Modal Backdrop** (`{colors.modalBackdrop}`): Page dimming behind the native image detail viewer.

### Named Rules
**The Ink-Only Rule.** Editorial color is paper plus ink alphas. Do not reintroduce warm cream, measure green, or any decorative accent into the reading surface.

**The Focus Exception Rule.** Focus Blue may appear only as a keyboard outline; it never brands sections, figures, or chrome.

**The Download Flair Exception.** Purple (`#A5A6F6`), green (`#7BD88F`), yellow (`#FFD36E`), and coral (`#FF9BB3`) appear only inside the APOD download hover bloom.

## Typography

**Display Font:** Source Serif 4 (with Georgia, serif)
**Body Font:** Source Sans 3 (with Segoe UI, sans-serif)
**Label Font:** Source Sans 3

**Character:** The serif carries publication authority in compact sizes; the sans keeps navigation, provenance, and explanation lucid. The pairing reads as a current scientific daily, not a vintage pastiche.

### Hierarchy
- **Display** (700, `1.35rem`): Reserved for editorial display text.
- **Headline** (700, `clamp(1.6rem, 4vw, 2.4rem)`, 1.12 line-height, -0.02em tracking): APOD story title; large fact values use a related serif measure (`clamp(1.65rem, 4vw, 2.25rem)`, tabular numerals).
- **Title** (700, `1.15rem`–`1.3rem`, -0.01em tracking): Feed and archive headers, feature section titles, and record names at `1rem`.
- **Body** (400, `0.9rem`–`0.95rem`, 1.5–1.6 line-height): Explanations, fact call-outs, image descriptions, and colophon.
- **Label** (600–700, `0.68rem`–`0.82rem`, 0.04em tracking when uppercase): Feature-rail labels, uppercase source stamps, local time, and meta lines.

### Named Rules
**The Serif Authority Rule.** Serif type names the brand, feed header, section titles, story titles, and quantitative figures; sans serif carries navigation, provenance, and explanation.

**The Tabular Evidence Rule.** Local time and quantitative figures use tabular numerals so columns and clocks stay stable.

**The No Deck Rule.** Do not add marketing decks, kickers, or eyebrows above established headings. Provenance sits in uppercase source stamps, meta lines, or attached plain-language call-outs.

## Layout

The shell is a centered grid with a sticky `16rem` feature rail, a `minmax(0, 46rem)` ruled feed, and a `16rem` donation rail on wide screens. The feed carries left/right Rule Ink borders on desktop and stacks four feature sections: Astronomy picture of the day, Near Earth today, Five recent discoveries, Five latest image briefs.

The feed header is sticky (`4rem` min-height) and holds “What’s new today” beside the device-local date and 24-hour clock; archive pages replace that phrase with their archive title. Each feature section uses a ruled heading band, then content rows divided by Rule Ink. Vertical padding is compact: about `0.85rem`–`1.25rem` inside rows and heading bands.

Responsive behavior:
- Below the wide three-column shell, the donation rail hides so the publication remains readable.
- At `64rem` and below, the feature rail collapses to a `5.25rem` icon-only column; the Copernicus mark remains and nav labels hide.
- At `48rem` and below, the shell becomes a single column; the rail becomes a fixed bottom navigation with six equal icon+label anchors, including Home; feed side borders drop; colophon gains bottom clearance for the bar.
- At `34rem` and below, the feed header stacks, fact and planet rows become single-column, and image thumbs tighten to `5.5rem × 4.25rem`.

### Named Rules
**The Feature Rail Rule.** Desktop navigation is a sticky left rail with icon+label feature routes; small screens move the same routes into a bottom bar. The Copernicus crescent mark is the home control. Do not invent a top marketing nav or hamburger drawer.

**The Ruled Feed Rule.** Editorial content lives in one central column structured by horizontal rules, not by cards or dashboard panels. The donation rail is supporting chrome and never competes with the feed.

## Elevation & Depth

The system is fully flat. There are no shadows, gradients, glows, translucent panels, hover lift, or tonal card stacks. Depth comes from photographic media, the paper field, and the contrast between ink text and alpha rules. Feature-rail hover uses only a faint ink wash.

### Named Rules
**The Printed Plane Rule.** Every element rests on the paper. Use borders, rules, and spacing for structure; never simulate floating interface layers.

**The Bounded Motion Rule.** Motion appears only in the Near Earth orbit icon, APOD download flair, and calendar reveal; all honor reduced-motion preferences. Theme, skip-link, and navigation state changes remain immediate.

## Shapes

Content geometry is square (`0` radius): plates, thumbs, section bands, and rows use straight edges. The feature rail is the exception that defines the chrome: pill-shaped nav items (`999px`) on desktop; the crescent brand mark is unframed and mobile bottom items are square. Media crops are rectangular—APOD at `16 / 10` full width, image briefs at `7rem × 5.25rem` (`5.5rem × 4.25rem` on small phones). Plates and thumbs are borderless; structure comes from surrounding rules, not framed boxes.

### Named Rules
**The Rail Softness Rule.** Soft geometry (pill anchors) belongs only to the desktop feature rail. The crescent mark is unframed; the feed stays square and ruled.

**The Borderless Plate Rule.** Full-width APOD and image thumbs sit without decorative frames; do not wrap evidence in cards or ink picture borders.

## Components

### Feature rail
- **Character:** X-style sticky left navigation, not a masthead or app drawer.
- **Brand:** Theme-aware Copernicus crescent mark linking to `/`.
- **Items:** Five feature routes plus a mobile-only Home route. APOD uses the Flaticon camera, Near Earth uses orbit-dot motion, Exoplanets uses the Flaticon Earth, Image Library uses the Flaticon gallery, and Canvas uses a line-art frame.
- **Selected state:** The current route uses bold type and a Faint Ink wash.
- **Hover:** Faint Ink wash; no lift or color shift.
- **Responsive:** Icon-only mid widths; fixed bottom bar with visible labels below `48rem`.

### Feed header
- **Character:** Sticky issue strip for the reading column.
- **Structure:** Serif “What’s new today” (or the current archive title) baseline-aligned with muted local date and 24-hour time (`hourCycle: h23`), paper background, bottom Rule Ink.
- **Behavior:** Updates on the client about every 30 seconds; placeholder reads “Local date and time” before hydration.

### Section heading
- **Structure:** Serif feature title and muted uppercase source stamp share a baseline above a Rule Ink divider.
- **Language:** Direct section names (`Astronomy picture of the day`, `Near Earth today`, `Five recent discoveries`, `Five latest image briefs`) with source attribution (`NASA APOD`, `NASA NEO`, `NASA Exoplanet Archive`, `NASA Image Library`).

### APOD story
- **Character:** Full-width lead evidence, not an inset card.
- **Media:** Borderless `16 / 10` plate (image or iframe); paper loading field.
- **Copy:** Large serif title, muted date/credit meta, muted explanation—no deck above the title.

### Near Earth fact rows
- **Character:** Plain-language measurement register in ruled rows.
- **Structure:** Large serif tabular figure beside a serif heading and muted explanation; three rows for count, hazardous flag, and closest approach.
- **Color:** Figures use Press Ink, never a separate measure accent.

### Exoplanet rows
- **Character:** Five discovery records in a ruled list.
- **Structure:** Serif name, muted host/method/year meta, right-aligned sans figure (radius × Earth and light-years when available).

### Image brief rows
- **Character:** Five latest library releases as compact ruled briefs.
- **Structure:** Rectangular thumb, serif title, muted date, muted description (truncated near 220 characters in data).

### Image Library
- **Grid:** A masonry stream that requests the next 20 records before the reader reaches the end.
- **Tile:** Image, title, date, publisher, and one icon-only external link. No description appears in the grid.
- **Detail:** Clicking the image opens a native modal detail view with the full available description, keywords, and NASA Images link.

### Donation rail
- **Character:** One quiet ruled line on wide screens, with no card, heading block, illustration, or supporting paragraph.
- **Action:** “Support Copernicus” and “Donate” share one direct link to the Noru Labs Polar checkout.

### Skip to content
- **Structure:** Off-canvas until keyboard focus, then immediate upper-left reveal.
- **Style:** Press Ink background, Cool Paper text, square corners, `0.75rem 1rem` padding.
- **Focus:** `2px` Focus Blue outline with `3px` offset.

## Do's and Don'ts

### Do:
- **Do** keep Cool Paper (`#FDFDFC`) as the continuous field and Press Ink (`#111111`) as the only editorial ink.
- **Do** express secondary hierarchy with muted (`0.64`), rule (`0.16`), and faint (`0.08`) alpha roles of ink.
- **Do** pair Source Serif 4 editorial titles with Source Sans 3 reading and navigation.
- **Do** use the sticky left feature rail (bottom bar on small screens) for dedicated archive routes; use the Copernicus mark for home.
- **Do** lead the feed with sticky local date/24-hour time, then full-width APOD, Near Earth facts, five exoplanets, and five image briefs.
- **Do** attach plain-language call-outs to Near Earth figures and keep provenance on every section and media item.
- **Do** preserve the blue keyboard focus ring and immediate skip-link behavior.

### Don't:
- **Don't** reintroduce warm cream paper, measure green, GIBS / Earth observation plates, deck copy, cards, or decorative color.
- **Don't** add shadows, gradients, glow, glass, or motion beyond the three named exceptions.
- **Don't** add kickers, eyebrows, slogans, promotional copy, or dashboard chrome.
- **Don't** frame APOD or thumbs as bordered cards or floating media tiles.
- **Don't** turn the edition into a landing page, endpoint catalog, or multi-panel analytics shell.
