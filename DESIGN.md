---
name: Noru Search
description: Minimal NASA endpoint reliability register — white field, ink type, green status marks, rules instead of cards.
colors:
  canvas: "#f5f5f2"
  surface: "#ffffff"
  ink: "#171916"
  muted: "#62675f"
  rule: "#d9dbd5"
  code-ink: "#3f443d"
  success: "#137333"
  warning: "#a33a2b"
  focus: "#2458c6"
typography:
  display:
    fontFamily: "Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(2.6rem, 7vw, 5.5rem)"
    fontWeight: 620
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: "normal"
  body:
    fontFamily: "Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.04em"
  brand:
    fontFamily: "Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 650
    lineHeight: 1.4
    letterSpacing: "0.08em"
  mono:
    fontFamily: "Cascadia Code, SFMono-Regular, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
rounded:
  none: "0"
  full: "9999px"
spacing:
  xs: "0.75rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "2.5rem"
  xl: "4rem"
components:
  brand-link:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.brand}"
    rounded: "{rounded.none}"
    padding: "0"
  skip-link:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1rem"
  status-dot-online:
    backgroundColor: "{colors.success}"
    rounded: "{rounded.full}"
    size: "0.55rem"
    width: "0.55rem"
    height: "0.55rem"
  status-dot-degraded:
    backgroundColor: "{colors.warning}"
    rounded: "{rounded.full}"
    size: "0.55rem"
    width: "0.55rem"
    height: "0.55rem"
  endpoint-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.4rem 0"
  summary-measure:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1rem 0 0 1.25rem"
---

# Design System: Noru Search

## Overview

**Creative North Star: "The Endpoint Register"**

Noru Search is a white-field technical register, not a content portal. The page itself is the reliability check: product name, two audit measures, retained sources, live validity, and removals. Atmosphere comes from off-white canvas, ink typography, and hairline rules — never from cards, shadows, gradients, or motion.

Density is sparse and inspectable. Every row is a source record; green and warning marks are the only chromatic signals; monospace is reserved for endpoint URLs. The brand commitment is highly minimal UI with no animations.

Audit provenance (recorded August 16, 2026; n=20 uncached sequential requests per source; GIBS n=40 across two tile classes) is product content that explains why sources appear or disappear. It is not a visual token and must not be encoded as color, type, or spacing.

**Key Characteristics:**
- Off-white canvas with white surfaces and ink/muted hierarchy
- Flat hairline rules define structure; no cards or shadows
- System Segoe UI stack; monospace only for code/URLs
- Status communicated by 0.55rem dots (success green / warning red-brown)
- Zero motion; focus rings and skip link are the accessibility grammar

## Colors

A restrained off-white field with near-black ink, muted secondary text, and three functional accents: success, warning, and focus.

### Primary
- **Signal Green** (`{colors.success}`): Live-online status dots only. Rarity is intentional — green marks validity, not decoration.

### Secondary
- **Degraded Warning** (`{colors.warning}`): Default/degraded status dots when a retained source is not online.

### Tertiary
- **Focus Blue** (`{colors.focus}`): `:focus-visible` outline only (`2px` solid, `4px` offset). Never used as fill or brand accent.

### Neutral
- **Warm Canvas** (`{colors.canvas}`): Page and `html`/`body` background; theme-color meta.
- **Paper Surface** (`{colors.surface}`): Selection text, skip-link text, and any true white surface need.
- **Register Ink** (`{colors.ink}`): Primary text, heavy section rules, skip-link background, selection background.
- **Muted Caption** (`{colors.muted}`): Supporting copy, brand mark, labels, provider lines, timestamps, audit-note body.
- **Hairline Rule** (`{colors.rule}`): Interior row dividers and summary cell borders (lighter than ink rules).
- **Code Ink** (`{colors.code-ink}`): Endpoint URL monospace text only.

### Named Rules
**The Signal Scarcity Rule.** Chromatic color appears only as status dots or focus outline. Do not tint headings, rows, or backgrounds with success/warning/focus.

**The Ink Rule Rule.** Section breaks that start major blocks (intro bottom, endpoint list top, audit-note top) use ink (`1px solid`). Interior separators use rule.

## Typography

**Display Font:** Segoe UI (with -apple-system, BlinkMacSystemFont, sans-serif)
**Body Font:** Same system stack
**Label/Mono Font:** Cascadia Code (with SFMono-Regular, Consolas, monospace) — code/URLs only

**Character:** Neutral system UI type — technical, unstyled, and platform-native. Hierarchy comes from size, weight, tracking, and case, not from a second display family.

### Hierarchy
- **Display** (620, `clamp(2.6rem, 7vw, 5.5rem)`, 0.95 lh, -0.035em tracking): Page title only (`h1`, max-width `12ch`).
- **Title** (650, `0.9375rem`–`1rem`, 1.35 lh): Endpoint names (`h3`) and section headings (`h2` at `1rem` / 650).
- **Body** (400, `1rem` / `0.9375rem`, 1.65 lh): Intro and audit-note prose (max ~`58ch`–`65ch`).
- **Label** (600, `0.75rem`, 0.04em tracking, uppercase): Measure `dt` labels (Live now, Audit threshold, Recorded audit, Live response).
- **Brand** (650, `0.8125rem`, 0.08em tracking, uppercase): Product name link.
- **Mono** (400, `0.75rem`, 1.55 lh): `displayUrl` / endpoint paths only.
- **Measure value** (600, `clamp(1.6rem, 3vw, 2.25rem)`, tabular-nums): Summary `dd` figures.
- **Meta** (400–600, `0.8125rem`, tabular-nums where numeric): Section timestamp, provider, detail, measure `dd`.

### Named Rules
**The Mono Enclosure Rule.** Monospace is exclusive to endpoint URLs. Never mono the brand, headings, or measure labels.

**The Tabular Measure Rule.** Counts, latencies, percentages, and timestamps use `font-variant-numeric: tabular-nums`.

## Layout

Centered shell: `width: min(100% - 2rem, 72rem)`, vertical padding `clamp(2.5rem, 7vw, 6.5rem) 0 4rem`. Intro is a two-column grid (copy | summary) with `4rem` gap, ended by an ink rule. Retained sources follow with a baseline-aligned section heading, then a full-width endpoint register. Audit note is a two-column aside (heading | prose) under an ink rule.

**Spacing rhythm:** `0.75rem` / `1rem` / `1.5rem` / `2.5rem` / `4rem` dominate gaps and padding. Row padding is `1.4rem 0`.

**Breakpoints:**
- **≤56rem:** Intro stacks; summary caps at `22rem`; endpoint row becomes two columns (name+url | measures+detail span).
- **≤37rem:** Shell inset tightens to `1.25rem` sides and `1.5rem` top; brand margin grows; section heading stacks; endpoint row and audit note become single column.

**Density:** Register density — one job per band, generous vertical air, no side rails or card grids.

### Named Rules
**The Register First Rule.** First viewport is brand, one headline, one supporting sentence, two measures, then the source list — not a dashboard of widgets.

## Elevation & Depth

Fully flat. No `box-shadow`, no blur, no tonal card lift. Depth is implied only by ink vs rule hairlines and the canvas/surface distinction.

### Shadow Vocabulary
None. Shadows are prohibited.

### Named Rules
**The Flat Register Rule.** Structure is drawn with `1px` borders. Do not introduce cards, elevation, or hover lift.

## Shapes

Corners are square everywhere except status dots (`border-radius: 50%`, `0.55rem`). No pill chrome, no rounded panels, no clipped media. Borders are straight hairlines. Selection inverts to ink fill / surface text.

### Named Rules
**The Dot Exception Rule.** The only round geometry is the live-status marker. Everything else is orthogonal.

## Components

### Brand link
- **Shape:** No radius; inline text link
- **Style:** Muted uppercase brand type; no underline; `margin-bottom: 3rem` (`4rem` on ≤37rem)
- **Focus:** `2px` focus outline in focus blue, `4px` offset

### Skip to content
- **Shape:** Square; off-canvas until focused
- **Primary:** Ink background, surface text, `0.75rem 1rem` padding
- **Focus:** Slides to `left: 0` (no animation curve — instantaneous position change)

### Summary measures
- **Shape:** Two-cell definition list under a rule top edge; cells split by left rule
- **Style:** Uppercase muted `dt`; large tabular `dd`
- **Role:** Live now count and audit threshold only

### Endpoint row (signature)
- **Shape:** Transparent row; bottom hairline rule; desktop three-column grid (name | url | measures), detail under measures column
- **Name cell:** Status dot + title + muted provider
- **URL:** Mono code-ink, `overflow-wrap: anywhere`
- **Measures:** Two-up `dl` with uppercase labels and tabular values (Online/Degraded · latency)
- **Detail:** Muted caption for sample/validity note

### Status dot
- **Shape:** `0.55rem` circle; `aria-hidden`
- **Online:** Success green
- **Degraded / default:** Warning

### Section heading
- **Style:** `h2` title + muted tabular timestamp on one baseline row; stacks on small screens

### Audit note
- **Shape:** Two-column aside under ink rule; single column ≤37rem
- **Content:** Removed-source provenance prose in muted body type — informational, not a chrome pattern

### Navigation
- **Style:** Brand home link only; no app chrome, tabs, or side nav

## Do's and Don'ts

### Do:
- **Do** keep the off-white canvas (`#f5f5f2`) and ink/muted/rule hierarchy as the default field.
- **Do** separate major bands with ink rules and rows with rule hairlines.
- **Do** use status dots (`0.55rem`) for live state — success online, warning degraded.
- **Do** reserve monospace for endpoint URLs and tabular nums for measures.
- **Do** preserve focus-visible rings (`2px` / `#2458c6` / `4px` offset) and the skip link.
- **Do** treat audit methodology text as content (August 16, 2026; n=20; GIBS n=40), not as design tokens.

### Don't:
- **Don't** add cards, shadows, gradients, glow, or rounded panels.
- **Don't** introduce animation, transitions, or motion of any kind.
- **Don't** use Inter/Roboto/custom display pairings; stay on the Segoe UI system stack.
- **Don't** spread success/warning/focus into fills, badges, or decorative accents.
- **Don't** turn the page into a browsing portal — the register is the product.

### Named Rules
**The No Motion Rule.** Brand commitment: the interface contains no animations.
