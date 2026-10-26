// api.ts — v3 patch. ALL v2 calls kept exactly, new v3 calls added below.
// The frontend NEVER talks to MongoDB directly.
// Base URL: NEXT_PUBLIC_API_URL in Vercel, otherwise the deployed server
// URL — NOT localhost. Local dev can override it back to
// http://localhost:5000 via .env if needed.
// Every request sends credentials so the better-auth session cookie is included.
// V3 backend contract (must match backend-patch exactly):
//  /api/profile, /api/feed (GET public, POST /save, POST /report,
//  /saved-searches), /api/companies/watch, /api/tools/match|cover-letter|
//  summarize|interview-questions|extract-jd, /api/followups/:id/snooze|undone.
// The mapping helpers below translate the backend shapes into the
// frontend types, so pages never have to guess backend field names.
import type { ApiResponse } from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://job-hunt-tracker-server.vercel.app";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_URL) {
    throw new Error("Backend URL is not set. Set NEXT_PUBLIC_API_URL in Vercel to https://job-hunt-tracker-server.vercel.app");
  }
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const body = (await response.json().catch(() => ({}))) as ApiResponse<T>;
  if (!response.ok || body.success === false) {
    throw new Error(body.message || "Something went wrong. Please try again.");
  }
  return body.data;
}

export const api = {
  getApplications: () => request<import("./types").ApplicationItem[]>("/api/applications"),
  createApplication: (data: Record<string, unknown>) =>
    request<import("./types").ApplicationItem>("/api/applications", { method: "POST", body: JSON.stringify(data) }),
  updateApplication: (id: string, data: Record<string, unknown>) =>
    request<import("./types").ApplicationItem>(`/api/applications/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteApplication: (id: string) =>
    request<{ id: string }>(`/api/applications/${id}`, { method: "DELETE" }),

  getFollowups: () => request<import("./types").FollowupItem[]>("/api/followups"),
  markFollowupDone: (id: string) =>
    request<import("./types").FollowupItem>(`/api/followups/${id}/done`, { method: "PUT" }),
  // v3
  snoozeFollowup: (id: string, days: number) =>
    request<import("./types").FollowupItem>(`/api/followups/${id}/snooze`, { method: "PUT", body: JSON.stringify({ days }) }),
  undoneFollowup: (id: string) =>
    request<import("./types").FollowupItem>(`/api/followups/${id}/undone`, { method: "PUT" }),

  getLinkedinDays: () => request<import("./types").LinkedInDayItem[]>("/api/linkedin"),
  createLinkedinDay: (data: Record<string, unknown>) =>
    request<import("./types").LinkedInDayItem>("/api/linkedin", { method: "POST", body: JSON.stringify(data) }),
  updateLinkedinDay: (id: string, data: Record<string, unknown>) =>
    request<import("./types").LinkedInDayItem>(`/api/linkedin/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteLinkedinDay: (id: string) =>
    request<{ id: string }>(`/api/linkedin/${id}`, { method: "DELETE" }),

  getProjects: () => request<import("./types").ProjectItem[]>("/api/projects"),
  createProject: (data: Record<string, unknown>) =>
    request<import("./types").ProjectItem>("/api/projects", { method: "POST", body: JSON.stringify(data) }),
  updateProject: (id: string, data: Record<string, unknown>) =>
    request<import("./types").ProjectItem>(`/api/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProject: (id: string) =>
    request<{ id: string }>(`/api/projects/${id}`, { method: "DELETE" }),

  getDashboard: () => request<import("./types").DashboardSummary>("/api/dashboard"),

  getDemoCount: () => request<{ total: number }>("/api/demo/count"),
  deleteDemo: () =>
    request<Record<string, number>>("/api/demo", { method: "DELETE" }),

  getAdminUsers: () => request<import("./types").PublicUser[]>("/api/admin/users"),
  setUserRole: (id: string, role: string) =>
    request<{ id: string; role: string }>(`/api/admin/users/${id}/role`, { method: "PUT", body: JSON.stringify({ role }) }),
  setUserStatus: (id: string, status: string) =>
    request<{ id: string; status: string }>(`/api/admin/users/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),

  getKeywords: () => request<import("./types").KeywordItem[]>("/api/admin/keywords"),
  createKeyword: (data: Record<string, unknown>) =>
    request<import("./types").KeywordItem>("/api/admin/keywords", { method: "POST", body: JSON.stringify(data) }),
  updateKeyword: (id: string, data: Record<string, unknown>) =>
    request<import("./types").KeywordItem>(`/api/admin/keywords/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteKeyword: (id: string) =>
    request<import("./types").KeywordItem>(`/api/admin/keywords/${id}`, { method: "DELETE" }),

  // v3: profile. Backend stores links as links:{linkedin,github,portfolio}
  // and returns null for a user who never saved a profile. Map both ways.
  getProfile: async () => {
    const raw = await request<Record<string, unknown> | null>("/api/profile");
    if (!raw) return {} as import("./types").ProfileItem;
    const links = (raw.links as Record<string, unknown> | undefined) || {};
    return {
      ...(raw as unknown as import("./types").ProfileItem),
      linkedin: (links.linkedin as string) || (raw.linkedin as string) || "",
      github: (links.github as string) || (raw.github as string) || "",
      portfolio: (links.portfolio as string) || (raw.portfolio as string) || "",
    };
  },
  updateProfile: async (data: Record<string, unknown>) => {
    const { linkedin, github, portfolio, ...rest } = data;
    const raw = await request<Record<string, unknown>>("/api/profile", {
      method: "PUT",
      body: JSON.stringify({ ...rest, links: { linkedin: linkedin || "", github: github || "", portfolio: portfolio || "" } }),
    });
    const links = (raw.links as Record<string, unknown> | undefined) || {};
    return {
      ...(raw as unknown as import("./types").ProfileItem),
      linkedin: (links.linkedin as string) || "",
      github: (links.github as string) || "",
      portfolio: (links.portfolio as string) || "",
    };
  },

  // v3: public job feed. Backend returns {jobs, sourcesSucceeded,
  // sourcesFailed, skippedKeyOnlySources}; map jobs to FeedJob.
  // Frontend filter names (keyword, workMode, posted, remoteForBangladesh)
  // are translated to backend names (q, remote, postedWithin).
  getFeed: async (params: Record<string, string | boolean | undefined> = {}) => {
    const query = new URLSearchParams();
    const map: Record<string, string> = { keyword: "q", workMode: "remote", posted: "postedWithin" };
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === false) return;
      if (key === "remoteForBangladesh") return; // client-side note only, backend has no such filter
      query.set(map[key] || key, String(value));
    });
    const suffix = query.toString();
    const raw = await request<{ jobs: Record<string, unknown>[] }>(`/api/feed${suffix ? `?${suffix}` : ""}`);
    const jobs = Array.isArray(raw?.jobs) ? raw.jobs : [];
    return jobs.map((j) => ({
      _id: String(j.url || `${j.title}-${j.company}`),
      title: String(j.title || ""),
      company: String(j.company || ""),
      location: String(j.location || ""),
      workMode: String(j.remote || ""),
      category: String(j.category || ""),
      salary: String(j.salary || ""),
      salaryNote: j.currency ? String(j.currency) : "",
      source: String(j.source || ""),
      url: String(j.url || ""),
      postedDate: String(j.postedDate || ""),
      matchPercent: typeof j.matchScore === "number" ? j.matchScore : 0,
      matchedKeywords: Array.isArray(j.matchedKeywords) ? (j.matchedKeywords as string[]) : [],
      matchReason: Array.isArray(j.matchedKeywords) && j.matchedKeywords.length > 0
        ? `Matched: ${(j.matchedKeywords as string[]).join(", ")}`
        : "",
    })) as import("./types").FeedJob[];
  },
  saveFeedJob: (job: import("./types").FeedJob) =>
    request(`/api/feed/save`, {
      method: "POST",
      body: JSON.stringify({ title: job.title, company: job.company, location: job.location || "", salary: job.salary || "", url: job.url, postingLink: job.url, source: job.source }),
    }),
  reportFeedJob: (job: import("./types").FeedJob, reason: string) =>
    request(`/api/feed/report`, {
      method: "POST",
      body: JSON.stringify({ jobUrl: job.url, title: job.title, company: job.company, status: reason }),
    }),

  // v3: saved searches live under /api/feed/saved-searches.
  getSavedSearches: () => request<import("./types").SavedSearchItem[]>("/api/feed/saved-searches"),
  createSavedSearch: (data: Record<string, unknown>) => {
    const { keyword, workMode, ...rest } = data;
    return request<import("./types").SavedSearchItem>("/api/feed/saved-searches", {
      method: "POST",
      body: JSON.stringify({ ...rest, q: keyword ?? rest.q ?? "", remote: workMode ?? rest.remote ?? "" }),
    });
  },
  deleteSavedSearch: (id: string) =>
    request<{ id: string }>(`/api/feed/saved-searches/${id}`, { method: "DELETE" }),
  // v3: company watch lives under /api/companies/watch.
  getCompanyWatches: () => request<import("./types").CompanyWatchItem[]>("/api/companies/watch"),
  createCompanyWatch: (data: Record<string, unknown>) =>
    request<import("./types").CompanyWatchItem>("/api/companies/watch", { method: "POST", body: JSON.stringify(data) }),
  deleteCompanyWatch: (id: string) =>
    request<{ id: string }>(`/api/companies/watch/${id}`, { method: "DELETE" }),

  // v3: AI tools (text in, text out — no auto-apply, no auto-post).
  // Backend shapes are mapped to the frontend types here.
  toolsMatch: async (data: { resumeText: string; jobText: string }) => {
    const raw = await request<Record<string, unknown>>("/api/tools/match", { method: "POST", body: JSON.stringify(data) });
    const scores = (raw.sectionScores as Record<string, number> | undefined) || {};
    const order: Array<[string, string]> = [
      ["Contact", "contact"], ["Summary", "summary"], ["Experience", "experience"], ["Skills", "skills"],
      ["Education", "education"], ["Keywords", "keywords"], ["Formatting", "formatting"],
      ["Achievements", "achievements"], ["Readability", "readability"], ["Action Verbs", "actionVerbs"],
    ];
    return {
      score: typeof raw.matchPercent === "number" ? raw.matchPercent : 0,
      sections: order.map(([name, key]) => ({ name, score: typeof scores[key] === "number" ? scores[key] : 0 })),
      matchedKeywords: (raw.matched as string[]) || [],
      missingKeywords: (raw.missing as string[]) || [],
      skillGaps: (raw.missing as string[]) || [],
      templateMode: raw.mode === "template",
      note: typeof raw.note === "string" ? raw.note : "",
    } as import("./types").ResumeMatchResult;
  },
  toolsCoverLetter: async (data: { cvText: string; jobText: string; role?: string; company?: string; name?: string }) => {
    const raw = await request<Record<string, unknown>>("/api/tools/cover-letter", {
      method: "POST",
      body: JSON.stringify({
        name: data.name || "",
        role: data.role || "this role",
        company: data.company || "your company",
        experienceText: data.cvText,
        jdText: data.jobText,
      }),
    });
    return { letter: String(raw.coverLetter || "") } as import("./types").CoverLetterResult;
  },
  toolsSummarize: async (data: { text: string }) => {
    const raw = await request<Record<string, unknown>>("/api/tools/summarize", {
      method: "POST",
      body: JSON.stringify({ jdText: data.text }),
    });
    return {
      text: String(raw.summary || ""),
      summary: String(raw.summary || ""),
      redFlags: (raw.redFlags as string[]) || [],
      keySkills: (raw.keySkills as string[]) || [],
    } as import("./types").ToolTextResult;
  },
  toolsInterview: async (data: { role: string; company?: string }) => {
    const raw = await request<Record<string, unknown>>("/api/tools/interview-questions", {
      method: "POST",
      body: JSON.stringify({ jdText: data.role, company: data.company || "" }),
    });
    const questions = (raw.questions as string[]) || [];
    return {
      text: questions.join("\n"),
      questions,
      starStructure: raw.starStructure,
    } as import("./types").ToolTextResult;
  },
  toolsExtract: async (data: { text: string }) => {
    const raw = await request<Record<string, unknown>>("/api/tools/extract-jd", {
      method: "POST",
      body: JSON.stringify({ text: data.text }),
    });
    return {
      text: String(raw.title || ""),
      title: String(raw.title || ""),
      company: String(raw.company || ""),
      skills: (raw.skills as string[]) || [],
    } as import("./types").ToolTextResult;
  },
};
