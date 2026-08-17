import type { ReactNode } from "react";
import { HeaderTools } from "./HeaderTools";
import { Sidebar } from "./Sidebar";

export function PageShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main id="main-content" className="feed">
        <header className="feed-header">
          <h1>{title}</h1>
          <HeaderTools />
        </header>
        {children}
      </main>
    </div>
  );
}
