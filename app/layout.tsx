import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Copernicus — daily NASA edition",
  description:
    "A minimal daily newspaper of verified NASA imagery, near-Earth objects, exoplanet discoveries, and Earth observation.",
  authors: [{ name: "Noru Labs", url: "https://github.com/NoruLabs" }],
  icons: {
    icon: "/copernicus-icon.svg",
  },
};

const designContract = `<!--
THESIS: Today's NASA evidence is an almanac, not a landing page or dashboard.
OWN-WORLD: Almanac paper, engraved rules, deep green measure ink, Source Serif/Sans, tabular ledger rows.
STORY: A reader opens the dated edition, sees the day's image, then reads objects and discoveries as equal evidence.
FIRST VIEWPORT: Masthead and dateline above a large APOD plate sharing the fold with the ephemeris table.
FORM: The Ephemeris Ledger; pick over assigned Wire Desk; seed c922ac22.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f7f5ee" />
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
