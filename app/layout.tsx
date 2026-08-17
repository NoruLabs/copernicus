import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sourceSans = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    { path: "../public/source-sans-400.ttf", weight: "400" },
    { path: "../public/source-sans-600.ttf", weight: "600" },
    { path: "../public/source-sans-700.ttf", weight: "700" },
  ],
});

const sourceSerif = localFont({
  variable: "--font-serif",
  display: "swap",
  src: [
    { path: "../public/source-serif-400.ttf", weight: "400" },
    { path: "../public/source-serif-600.ttf", weight: "600" },
    { path: "../public/source-serif-700.ttf", weight: "700" },
  ],
});

export const metadata: Metadata = {
  title: "Copernicus — daily NASA edition",
  description:
    "A minimal daily view of NASA imagery, near-Earth objects, exoplanet discoveries, and image-library releases.",
  authors: [{ name: "Noru Labs", url: "https://github.com/NoruLabs" }],
  icons: {
    icon: "/copernicus-icon.svg",
  },
};

const designContract = `<!--
THESIS: NASA data reads as a direct daily feed, not a landing page or dashboard.
OWN-WORLD: Near-white paper, black ink, Source Serif/Sans, ruled feed sections, line icons, and no decorative color.
STORY: A reader uses the feature rail, sees APOD first, then understands nearby objects, recent planets, and image releases.
FIRST VIEWPORT: A Twitter-like left feature rail sits beside a sticky local date header and a full-width APOD story.
FORM: The Ephemeris Ledger; pick over assigned Wire Desk; seed c922ac22.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`;

const themeScript = `
  try {
    const stored = localStorage.getItem("copernicus-theme");
    const dark = stored === "dark" || (!stored && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#111111" : "#FDFDFC");
  } catch {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FDFDFC" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${sourceSans.variable} ${sourceSerif.variable}`}>
        <div
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: designContract }}
        />
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
