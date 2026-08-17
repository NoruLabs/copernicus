"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next ? "#111111" : "#FDFDFC");
    window.localStorage.setItem("copernicus-theme", next ? "dark" : "light");
  }

  return (
    <button
      aria-label="Toggle light and dark theme"
      className="theme-toggle"
      onClick={toggleTheme}
      title="Toggle light and dark theme"
      type="button"
    >
      <Moon aria-hidden="true" className="theme-icon-moon" />
      <Sun aria-hidden="true" className="theme-icon-sun" />
    </button>
  );
}
