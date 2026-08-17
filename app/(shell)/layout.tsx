import type { ReactNode } from "react";
import { AppShell } from "../components/PageShell";

export default function ShellLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
