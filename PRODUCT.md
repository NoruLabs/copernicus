# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers evaluating which NASA and space-data endpoints are reliable enough to use.

## Product Purpose

Noru Search is a small endpoint-checking interface for verifying that supported NASA and related space-data sources return usable data. Success means the retained sources produce a valid response in at least 19 of 20 repeated checks.

## Positioning

The product exposes endpoint reliability and sample data directly instead of presenting itself as a general-purpose space-content portal.

## Operating Context

Developers use the site while evaluating upstream APIs. They need to see which source was checked, whether its response is valid, and a small sample proving the data can be consumed.

## Capabilities and Constraints

- Retain only data sources that pass at least 19 of 20 repeated, uncached checks with a valid response shape.
- Remove routes and interface features that depend on sources below the reliability threshold.
- Keep the existing Next.js web stack.
- Prefer a small, inspectable interface over a broad browsing experience.

## Brand Commitments

- Keep the Noru Search name.
- The interface must be highly minimal and contain no animations.

## Evidence on Hand

- Existing API routes and data consumers in `app/`.
- Local development request logs show APOD, Spaceflight News, and Exoplanet Archive returning HTTP 200, while TechPort repeatedly returns HTTP 500 because its project ID response is not an array.
- No testimonials, performance claims, or production reliability history are available and none should be fabricated.

## Product Principles

- Reliability is demonstrated through repeated checks.
- A valid payload matters more than an HTTP 200 alone.
- Failed sources are removed rather than hidden behind graceful-looking fallbacks.
- Status and source provenance remain easy to inspect.
