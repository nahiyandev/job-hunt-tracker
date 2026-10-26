// layout.tsx — v3 root layout. Keeps v2 metadata + ToastContainer.
// v3 fonts (FIX for Vercel build failure, 2026-10-27):
//   Previous version used next/font/google, which downloads the font
//   files at BUILD time from fonts.gstatic.com. On Vercel that download
//   failed ("request to fonts.gstatic.com ... failed", then
//   "TypeError: Cannot read properties of null" in next/font's loader),
//   so the whole build failed — even though the same code built locally.
//   This version loads the SAME premium fonts at RUNTIME via a normal
//   <link> stylesheet instead, so the build never touches fonts.gstatic.com
//   and can never fail on a font download. If the browser cannot reach
//   Google Fonts at runtime, the page still renders with the fallback
//   stack below — it never breaks the build or the page.
//   English (display + body): Plus Jakarta Sans 600/700/800
//   Bengali body: Hind Siliguri 400/500/600/700
//   Bengali headings: Noto Serif Bengali 600/700
// No generic/system-only font stack, no Times New Roman, no Arial-only.
// ThemeInit applies the saved/system theme on mount. Footer is NOT in
// layout: landing already has its own footer, so a layout footer would
// duplicate it — each page renders Footer itself.
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { ThemeInit } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Job Hunt Tracker",
  description: "Track job applications, follow-ups, LinkedIn activity and projects.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeInit />
        {children}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </body>
    </html>
  );
}
