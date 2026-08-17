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

const description =
  "Search, explore, and visualize NASA (and many more) datasets from a single interface";
const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
);

export const metadata: Metadata = {
  metadataBase,
  title: "Copernicus - astronomy & astrophysics",
  description,
  authors: [{ name: "Noru Labs", url: "https://github.com/NoruLabs" }],
  icons: {
    icon: [
      {
        url: "/copernicus.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/copernicus_black.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
  openGraph: {
    title: "Copernicus",
    description,
    siteName: "Copernicus",
    type: "website",
    images: [
      {
        url: "/copernicus.png",
        width: 400,
        height: 400,
        alt: "Copernicus",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Copernicus",
    description,
    images: ["/copernicus.png"],
  },
};

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
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
