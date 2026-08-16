# Copernicus

A daily NASA newspaper. Open the site and read today's edition—no landing page, no dashboard chrome.

Live NASA evidence is arranged as an almanac: the Astronomy Picture of the Day, near-Earth object measures, recent exoplanet discoveries, image briefs, and an Earth observation plate.

## Sources

Only feeds retained after the August 16, 2026 reliability audit (≥95% valid payloads):

- NASA APOD
- NASA Near Earth Objects
- NASA Image and Video Library
- NASA Exoplanet Archive
- NASA GIBS imagery

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## Setup

```bash
npm install
```

Create `.env` or `.env.local`:

```env
NASA_API_KEY=your_api_key_here
```

Get a free key at https://api.nasa.gov. Without one, the app falls back to `DEMO_KEY`.

```bash
npm run dev
```

Open http://localhost:3000

## License

MIT. See `LICENSE`.
