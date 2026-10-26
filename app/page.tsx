// page.tsx — public landing page for the site root (/).
// This page is NOT a login page and does NOT redirect visitors.
// Logged-out visitors see what the app does and a clear way to start.
// Logged-in visitors see a "Go to Dashboard" button instead.
// The real login lives at /login, and /dashboard stays protected.
"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    title: "Dashboard at a glance",
    text: "Stat cards, your next follow-up, and charts for applications and LinkedIn activity — all from your own data, live.",
  },
  {
    title: "Applications, organised",
    text: "Add every application with company, role, status and date. Filter by status and never lose track of a role again.",
  },
  {
    title: "Smart follow-ups",
    text: "Applied? Follow-up #1 is set to applied date + 10 days, and #2 to #1 + 14 days. Maximum 2 per application, recalculated if the date changes.",
  },
  {
    title: "LinkedIn Daily",
    text: "Log comments and posts per day and watch the bar chart grow. No scraping, no auto-login, no auto-apply — just your own log.",
  },
  {
    title: "Projects that prove skill",
    text: "Keep your projects, links and notes next to your applications, so you always know what to talk about in interviews.",
  },
  {
    title: "Private by design",
    text: "One user = one private tracker. Every query is filtered by your user id, and no session means no data. Admins never see private tracker data.",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Sign in with Google",
    text: "Google only, no password to remember. Your session is stored as a secure cookie.",
  },
  {
    step: "2",
    title: "Add your applications",
    text: "Company, role, status, applied date — follow-ups are created for you automatically.",
  },
  {
    step: "3",
    title: "Follow up on time",
    text: "Open Follow-ups, see what is due, mark it done, and move on to the next opportunity.",
  },
];

export default function HomePage() {
  const { data: session } = authClient.useSession();
  const isLoggedIn = Boolean(session?.user);

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      {/* Top bar */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="bg-gradient-to-r from-orange-600 to-violet-600 bg-clip-text text-xl font-extrabold text-transparent">
            Job Hunt Tracker
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 sm:flex">
            <a href="#features" className="hover:text-gray-900">Features</a>
            <a href="#how-it-works" className="hover:text-gray-900">How it works</a>
            <a href="#privacy" className="hover:text-gray-900">Privacy</a>
          </nav>
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button variant="primary">Go to Dashboard</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="primary">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-400 to-violet-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-100">
            For your personal job hunt
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Your job hunt, finally organised.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-orange-50">
            Track every application, every follow-up, and every LinkedIn win — in one
            beautiful dashboard. No spreadsheets, no forgotten follow-ups.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button className="bg-white px-6 py-3 text-base text-gray-900 hover:bg-gray-100">
                  Go to Dashboard →
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button className="bg-white px-6 py-3 text-base text-gray-900 hover:bg-gray-100">
                  Start Tracking — Continue with Google →
                </Button>
              </Link>
            )}
            <a href="#features" className="rounded-xl border border-white/40 px-6 py-3 text-base font-semibold text-white hover:bg-white/10">
              See features
            </a>
          </div>
          <p className="mt-4 text-sm text-orange-100">
            Sign-in is Google only · Your tracker is private to you · No fake data
          </p>
        </div>
      </section>

      {/* Follow-up timeline */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">Never miss a follow-up</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            The follow-up rule is built in — you just add the application.
          </p>
          <div className="mt-8 grid gap-4 text-center sm:grid-cols-3">
            <div className="rounded-2xl bg-orange-50 p-5">
              <p className="text-sm font-semibold text-orange-600">Day 0</p>
              <p className="mt-1 font-bold text-gray-900">Applied</p>
              <p className="mt-1 text-sm text-gray-600">You add the application with its applied date.</p>
            </div>
            <div className="rounded-2xl bg-violet-50 p-5">
              <p className="text-sm font-semibold text-violet-600">+ 10 days</p>
              <p className="mt-1 font-bold text-gray-900">Follow-up #1</p>
              <p className="mt-1 text-sm text-gray-600">First follow-up, created automatically.</p>
            </div>
            <div className="rounded-2xl bg-orange-50 p-5">
              <p className="text-sm font-semibold text-orange-600">+ 14 more days</p>
              <p className="mt-1 font-bold text-gray-900">Follow-up #2</p>
              <p className="mt-1 text-sm text-gray-600">Second and last follow-up. Maximum 2 per application.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-center text-3xl font-bold text-gray-900">Everything in one place</h2>
        <p className="mt-2 text-center text-gray-600">Six pages, one private tracker.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-3xl border bg-white p-6 shadow-sm">
              <h3 className="font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-gray-900">How it works</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {STEPS.map((item) => (
              <div key={item.step} className="rounded-3xl border bg-[#F9FAFB] p-6">
                <p className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-violet-600 font-bold text-white">
                  {item.step}
                </p>
                <h3 className="mt-4 font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-3xl bg-gradient-to-r from-orange-600 to-violet-600 p-8 text-center text-white sm:p-10">
          <h2 className="text-2xl font-bold">Private, honest, yours</h2>
          <p className="mx-auto mt-3 max-w-2xl text-orange-50">
            No LinkedIn scraping, no auto-login, no auto-apply, no fake data.
            New users start empty. Admins can manage roles and keywords, but
            they cannot see your private tracker data.
          </p>
          <div className="mt-6">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button className="bg-white px-6 py-3 text-base text-gray-900 hover:bg-gray-100">
                  Open my Dashboard →
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button className="bg-white px-6 py-3 text-base text-gray-900 hover:bg-gray-100">
                  Continue with Google →
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-gray-500">
          <span className="font-bold text-gray-800">Job Hunt Tracker</span>
          <span>Track applications, follow-ups, LinkedIn activity and projects.</span>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-gray-900">Login</Link>
            <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
