import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noru Search — NASA endpoint status",
  description:
    "A minimal reliability check for retained NASA and space-data endpoints.",
  authors: [{ name: "Noru Labs", url: "https://github.com/NoruLabs" }],
  icons: {
    icon: "/noru-icon.ico",
  },
};

const designContract = `<!--
THESIS: Endpoint reliability is the page; refuse the content-portal dashboard.
OWN-WORLD: White field, ink typography, green status marks, rules instead of cards.
STORY: A developer sees the threshold, retained sources, live validity, and removals.
FIRST VIEWPORT: Product title and two audit measures lead directly into the source register.
FORM: Minimal technical register, pinned by the brief; seed key user-minimal-endpoint-audit.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
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
        <meta name="theme-color" content="#f5f5f2" />
      </head>
      <body>
        <template
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

