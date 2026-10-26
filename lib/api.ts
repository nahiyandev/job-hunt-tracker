// api.ts — ALL backend API calls in one place.
// The frontend NEVER talks to MongoDB directly.
// DEPLOYED-URL BUILD (user request, 2026-10-26): the base URL comes from
// NEXT_PUBLIC_API_URL when set in Vercel, and otherwise falls back to the
// deployed server URL below — NOT localhost. Local dev can override it
// back to http://localhost:5000 via .env if needed.
// Every request sends credentials so the better-auth session cookie is included.
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
    request<{ id: string }>(`/api/admin/keywords/${id}`, { method: "DELETE" }),
};
