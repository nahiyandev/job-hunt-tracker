// Footer.tsx — v3. Shared footer for signed-in pages and public pages
// that do not already have their own footer. Brand logo + developer credit.
// Credit links to https://nahiyandev.vercel.app only — NO LinkedIn link
// anywhere in this footer.
"use client";

import Link from "next/link";
import { getLang, t } from "@/lib/i18n";
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";

export function Footer() {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    setLang(getLang());
    const onStorage = () => setLang(getLang());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <footer className="border-t bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="bg-gradient-to-r from-orange-600 to-violet-600 bg-clip-text font-bold text-gray-800 dark:text-gray-100">
          Job Hunt Tracker
        </Link>
        <span>Track applications, follow-ups, LinkedIn activity and projects.</span>
        <a href="https://nahiyandev.vercel.app" target="_blank" rel="noreferrer" className="font-semibold text-violet-700 hover:underline dark:text-violet-400">
          {t(lang, "developedBy")}
        </a>
      </div>
    </footer>
  );
}
