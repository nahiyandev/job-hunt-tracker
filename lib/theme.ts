// theme.ts — v3 dark mode, no library.
// Stored in localStorage 'jht-theme' ("light"|"dark"|"system").
// On first visit with no saved value, the system preference is used.
// Applied as class 'dark' on document.documentElement so Tailwind's
// darkMode:'class' and the .dark overrides in globals.css both work.
export type ThemeChoice = "light" | "dark" | "system";

export function getSavedTheme(): ThemeChoice {
  if (typeof window === "undefined") return "system";
  const saved = window.localStorage.getItem("jht-theme");
  return saved === "light" || saved === "dark" ? saved : "system";
}

export function resolveTheme(choice: ThemeChoice): "light" | "dark" {
  if (choice === "dark") return "dark";
  if (choice === "light") return "light";
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
}

export function applyTheme(choice: ThemeChoice): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", resolveTheme(choice) === "dark");
  document.documentElement.style.colorScheme = resolveTheme(choice);
}

export function saveTheme(choice: ThemeChoice): void {
  if (typeof window !== "undefined") window.localStorage.setItem("jht-theme", choice);
  applyTheme(choice);
}
