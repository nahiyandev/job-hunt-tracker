// i18n.ts — v3, tiny EN/BN dictionary ONLY for nav, footer and feed
// headings/filters. Other pages stay English in this patch (see Navbar
// comment). Language is stored in localStorage as 'jht-lang' ("en"|"bn").
// No library, no new dependency.
export type Lang = "en" | "bn";

export function getLang(): Lang {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem("jht-lang") === "bn" ? "bn" : "en";
}

export function setLang(lang: Lang): void {
  if (typeof window !== "undefined") window.localStorage.setItem("jht-lang", lang);
}

const DICT: Record<string, { en: string; bn: string }> = {
  feed: { en: "Feed", bn: "ফিড" },
  dashboard: { en: "Dashboard", bn: "ড্যাশবোর্ড" },
  applications: { en: "Applications", bn: "আবেদন" },
  followUps: { en: "Follow-ups", bn: "ফলো-আপ" },
  linkedinDaily: { en: "LinkedIn Daily", bn: "লিংকডইন ডেইলি" },
  linkedin: { en: "LinkedIn Daily", bn: "লিংকডইন ডেইলি" },
  projects: { en: "Projects", bn: "প্রজেক্ট" },
  profile: { en: "Profile", bn: "প্রোফাইল" },
  admin: { en: "Admin", bn: "অ্যাডমিন" },
  settings: { en: "Settings", bn: "সেটিংস" },
  logout: { en: "Logout", bn: "লগআউট" },
  jobFeed: { en: "Job Feed", bn: "চাকরির ফিড" },
  keyword: { en: "Keyword", bn: "কীওয়ার্ড" },
  location: { en: "Location", bn: "লোকেশন" },
  remoteForBangladeshis: { en: "Remote jobs for Bangladeshis", bn: "বাংলাদেশিদের জন্য রিমোট চাকরি" },
  save: { en: "Save", bn: "সংরক্ষণ" },
  report: { en: "Report", bn: "রিপোর্ট" },
  developedBy: { en: "Developed by Nahian Dev", bn: "তৈরি করেছেন নাহিয়ান ডেভ" },
};

export function t(lang: Lang, key: string): string {
  return DICT[key]?.[lang] ?? DICT[key]?.en ?? key;
}
