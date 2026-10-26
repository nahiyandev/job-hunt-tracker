// Navbar.tsx — v3. Top navigation: app name, page links, theme toggle,
// EN/BN toggle, avatar+name BUTTON opening a menu (Profile, Settings,
// Logout). Admin link renders ONLY when the session user role is
// 'admin' or 'moderator' — for role 'user' it is not rendered at all
// (not hidden with CSS). NOTE: EN/BN switches Navbar/Footer/Feed labels
// only, via lib/i18n.ts; other pages stay English in this patch.
// Logout shows a toast and returns to the login page.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { getLang, setLang, t, type Lang } from "@/lib/i18n";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user as unknown as { role?: string; image?: string | null; name?: string; email?: string } | undefined;
  const role = user?.role;
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    setLangState(getLang());
  }, []);

  function toggleLang() {
    const next: Lang = lang === "en" ? "bn" : "en";
    setLang(next);
    setLangState(next);
    // Re-render Footer/BottomNav labels on the same page.
    window.dispatchEvent(new Event("storage"));
  }

  async function handleLogout() {
    setMenuOpen(false);
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/login");
  }

  const links: { href: string; key: string }[] = [
    { href: "/feed", key: "feed" },
    { href: "/dashboard", key: "dashboard" },
    { href: "/applications", key: "applications" },
    { href: "/follow-ups", key: "followUps" },
    { href: "/linkedin", key: "linkedinDaily" },
    { href: "/projects", key: "projects" },
    { href: "/profile", key: "profile" },
  ];
  // Admin link: only for admin/moderator. Never rendered for 'user'.
  if (role === "admin" || role === "moderator") {
    links.push({ href: "/admin", key: "admin" });
  }

  return (
    <header className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/dashboard" className="bg-gradient-to-r from-orange-600 to-violet-600 bg-clip-text text-xl font-extrabold text-transparent">
          Job Hunt Tracker
        </Link>
        <nav className="flex flex-1 flex-wrap gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${pathname === link.href ? "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`}
            >
              {t(lang, link.key)}
            </Link>
          ))}
        </nav>
        <Button variant="outline" onClick={toggleLang} title="Switch language / ভাষা বদলান">
          {lang === "en" ? "বাংলা" : "EN"}
        </Button>
        <ThemeToggle />
        {user && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name || "User"} className="h-8 w-8 rounded-full" />
              ) : null}
              <span className="hidden text-sm font-medium text-gray-800 sm:inline dark:text-gray-100">{user.name || user.email}</span>
              <span aria-hidden="true">▾</span>
            </button>
            {menuOpen ? (
              <div role="menu" className="absolute right-0 z-50 mt-2 w-48 rounded-2xl border bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                  {t(lang, "profile")}
                </Link>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                  {t(lang, "settings")}
                </Link>
                <button type="button" onClick={handleLogout} className="block w-full rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30">
                  {t(lang, "logout")}
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </header>
  );
}
