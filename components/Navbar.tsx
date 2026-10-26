// Navbar.tsx — top navigation: app name, page links, user photo/name, logout.
// Logout shows a toast and returns to the login page.
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/applications", label: "Applications" },
  { href: "/follow-ups", label: "Follow-ups" },
  { href: "/linkedin", label: "LinkedIn Daily" },
  { href: "/projects", label: "Projects" },
  { href: "/admin", label: "Admin" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  async function handleLogout() {
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/login");
  }

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/dashboard" className="bg-gradient-to-r from-orange-600 to-violet-600 bg-clip-text text-xl font-extrabold text-transparent">
          Job Hunt Tracker
        </Link>
        <nav className="flex flex-1 flex-wrap gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${pathname === link.href ? "bg-violet-100 text-violet-800" : "text-gray-600 hover:bg-gray-100"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {user && (
          <div className="flex items-center gap-2">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name || "User"} className="h-8 w-8 rounded-full" />
            ) : null}
            <span className="hidden text-sm font-medium text-gray-800 sm:inline">{user.name || user.email}</span>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        )}
      </div>
    </header>
  );
}
