// tailwind.config.js — v3. Orange + purple theme on a light background.
// v3: darkMode:'class' (driven by the 'dark' class on <html>, see lib/theme.ts)
// and premium font families: Plus Jakarta Sans for English, Hind Siliguri
// and Noto Serif Bengali for Bengali, loaded via a <link> stylesheet in
// app/layout.tsx (NOT next/font/google — its build-time download failed
// on Vercel). All v2 colours and content globs are kept.
const config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { orange: "#EA580C", orangeLight: "#F97316", purple: "#7C3AED", purpleLight: "#8B5CF6" },
        background: "#F9FAFB",
        ink: "#111827",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Hind Siliguri", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Noto Serif Bengali", "Hind Siliguri", "sans-serif"],
        bengali: ["Hind Siliguri", "Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
module.exports = config;
