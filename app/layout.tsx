// layout.tsx — v3 root layout. Keeps v2 metadata + ToastContainer.
// v3 fonts (next/font/google, no new npm dependency):
//   English (display + body): Plus Jakarta Sans 600/700/800, --font-display
//   Bengali body: Hind Siliguri 400/500/600/700, --font-bn
//   Bengali headings: Noto Serif Bengali 600/700, --font-bn-serif
// Font variables are applied as classes on <html> so globals.css and
// tailwind.config.js can use them. No generic/system-only font stack,
// no Times New Roman, no Arial-only stack.
// ThemeInit applies the saved/system theme on mount. Footer is NOT in
// layout: landing already has its own footer, so a layout footer would
// duplicate it — each page renders Footer itself.
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Hind_Siliguri, Noto_Serif_Bengali } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { ThemeInit } from "@/components/ThemeToggle";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const bengali = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bn",
  display: "swap",
});

const bengaliSerif = Noto_Serif_Bengali({
  subsets: ["bengali"],
  weight: ["600", "700"],
  variable: "--font-bn-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Job Hunt Tracker",
  description: "Track job applications, follow-ups, LinkedIn activity and projects.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${bengali.variable} ${bengaliSerif.variable}`}>
      <body>
        <ThemeInit />
        {children}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </body>
    </html>
  );
}
