// tailwind.config.js — orange + purple theme on a light background.
const config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { orange: "#EA580C", orangeLight: "#F97316", purple: "#7C3AED", purpleLight: "#8B5CF6" },
        background: "#F9FAFB",
        ink: "#111827",
      },
    },
  },
  plugins: [],
};
module.exports = config;
