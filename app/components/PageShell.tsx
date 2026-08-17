import type { ReactNode } from "react";
import { DonationPanel } from "./DonationPanel";
import { FeedHeader } from "./FeedHeader";
import { Sidebar } from "./Sidebar";

export function PageShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <FeedHeader title={title} />
      {children}
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main id="main-content" className="feed">
        {children}
      </main>
      <DonationPanel />
    </div>
  );
}
