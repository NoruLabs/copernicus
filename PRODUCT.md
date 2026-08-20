# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Curious readers who want to understand today's NASA observations without digging through raw APIs or marketing pages.

## Product Purpose

Copernicus is a daily NASA newspaper. It turns verified NASA data feeds into one readable edition so people can see the sky, nearby objects, discoveries, and recent imagery directly.

## Positioning

The product publishes evidence as an almanac-style edition instead of offering a landing page, dashboard, or endpoint catalog.

## Operating Context

Readers open the site to today's issue. A left feature menu opens dedicated APOD, Near Earth, Exoplanets, Image Library, and Canvas pages; the Copernicus wordmark returns to the issue. The displayed date and 24-hour time follow the reader's device locale and time zone.

## Capabilities and Constraints

- Publish only from APOD, Near Earth Objects, NASA Image Library, and Exoplanet Archive.
- English only for the first edition.
- Automatic daily front page; no separate marketing landing page.
- Dedicated archive pages preserve the same publication shell and load large catalogs in small batches.
- Current APOD data refreshes every minute, exoplanet data refreshes every five minutes, and globally sorted image indexes refresh every thirty minutes.
- Route transitions keep the feature rail mounted and show skeleton placeholders until page data arrives.
- The Image Library continues loading as the reader scrolls and opens full details without leaving the archive.
- A donation rail uses the shared Noru Labs Polar checkout link on wide screens.
- Keep the Next.js web stack.
- Interface stays minimal; motion is limited to the Near Earth orbit icon, APOD download hover, calendar reveal, and data-driven archive object illustrations, with reduced-motion fallbacks.
- Near Earth and Exoplanet archive records include a shared-canvas Three.js illustration mapped from live NASA measurements.
- Readers can switch between the paper-light and ink-dark themes from the issue header.
- The current feature is emphasized in the navigation, and mobile navigation always includes a route home.
- Canvas is a coming-soon creative workspace for composing with NASA imagery.
- Do not fabricate news copy, quotes, or scientific claims beyond what the feeds provide.

## Brand Commitments

- Product name: Copernicus.
- Visual world: The Ephemeris Ledger (seed `c922ac22`, chosen pick).
- No landing-page marketing, hero slogans, or decorative AI-dashboard chrome.

## Evidence on Hand

- Retained NASA and NASA-adjacent feeds proven in the endpoint audit.
- APOD supplies the day's picture and caption.
- NEO feed supplies near-Earth object counts and sample approaches.
- Exoplanet Archive supplies recent discoveries with measurable fields.
- NASA Image Library supplies the five latest image briefs available from the current search result.
- No testimonials, traffic claims, or editorial staff claims exist and none should be fabricated.

## Product Principles

- Open directly into today's edition.
- Imagery and measurements share equal authority.
- Every figure carries a plain-language call-out and a named source.
- Prefer removal of unreliable sources over graceful-looking emptiness.
- Interest comes from real NASA evidence, not from interface theatrics.
