// ThemeToggle.tsx — v3. ThemeInit applies the saved theme on mount
// (used in app/layout.tsx). ThemeToggle is the header button, rendered
// next to the avatar in Navbar. No library.
"use client";

import { useEffect, useState } from "react";
import { applyTheme, getSavedTheme, saveTheme, type ThemeChoice } from "@/lib/theme";
import { Button } from "./ui/button";

export function ThemeInit() {
  useEffect(() => {
    // Apply saved theme (or system preference on first visit) once,
    // before the user interacts with anything.
    applyTheme(getSavedTheme());
  }, []);
  return null;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeChoice>("system");
  const [resolvedDark, setResolvedDark] = useState(false);

  useEffect(() => {
    const saved = getSavedTheme();
    setTheme(saved);
    setResolvedDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next: ThemeChoice = resolvedDark ? "light" : "dark";
    saveTheme(next);
    setTheme(next);
    setResolvedDark(next === "dark");
  }

  return (
    <Button variant="outline" onClick={toggle} aria-label="Toggle dark mode" title={theme === "system" ? "Theme: system" : `Theme: ${theme}`}>
      {resolvedDark ? "☀️ Light" : "🌙 Dark"}
    </Button>
  );
}
