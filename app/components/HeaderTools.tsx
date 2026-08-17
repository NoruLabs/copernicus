import { LocalDateTime } from "./LocalDateTime";
import { ThemeToggle } from "./ThemeToggle";

export function HeaderTools() {
  return (
    <div className="header-tools">
      <LocalDateTime />
      <ThemeToggle />
    </div>
  );
}
