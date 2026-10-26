// BottomNav.tsx — v3. Mobile-only bottom navigation.
// sm:hidden means it never appears on tablet/desktop.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLang, t } from "@/lib/i18n";
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";

export function BottomNav() {
  const pathname = usePathname();
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => setLang(getLang()), []);

  const links = [
    { href: "/feed", key: "feed" },
    { href: "/dashboard", key: "dashboard" },
    { href: "/applications", key: "applications" },
    { href: "/follow-ups", key: "followUps" },
    { href: "/profile", key: "profile" },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-white pb-[env(safe-area-inset-bottom)] sm:hidden dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto grid max-w-6xl grid-cols-5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`py-3 text-center text-xs font-semibold ${pathname === link.href ? "text-violet-700 dark:text-violet-400" : "text-gray-500 dark:text-gray-400"}`}
          >
            {t(lang, link.key)}
          </Link>
        ))}
      </div>
    </nav>
  );
}
