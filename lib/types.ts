// types.ts — TypeScript types for the data the backend returns.
// No `any` for main models: every page uses these exact shapes.
export type ApplicationStatus = "Applied" | "Lead" | "Closed";
export type FollowupStatus = "Pending" | "Done";
export type ProjectStatus = "Planning" | "In Progress" | "Completed" | "On Hold";
export type UserRole = "user" | "moderator" | "admin";

export interface ApplicationItem {
  _id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  status: ApplicationStatus;
  appliedDate: string | null;
  postingLink: string;
  notes: string;
  isDemo: boolean;
  createdAt: string;
}

export interface FollowupItem {
  _id: string;
  company: string;
  followupNumber: 1 | 2;
  dueDate: string;
  status: FollowupStatus;
  isDemo: boolean;
}

export interface LinkedInDayItem {
  _id: string;
  date: string;
  comments: number;
  posts: number;
  notes: string;
  isDemo: boolean;
}

export interface ProjectItem {
  _id: string;
  name: string;
  liveLink: string;
  status: ProjectStatus;
  notes: string;
  isDemo: boolean;
}

export interface DashboardSummary {
  totalApplications: number;
  applied: number;
  openLeads: number;
  closed: number;
  nextFollowupDue: { company: string; dueDate: string; followupNumber: number } | null;
  todayComments: number;
  totalComments: number;
  pendingItems: number;
  statusChart: { name: string; value: number }[];
  linkedinChart: { date: string; comments: number; posts: number }[];
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  status: "active" | "disabled";
  createdAt: string;
}

export interface KeywordItem {
  _id: string;
  text: string;
  type: "keyword" | "source";
  status: "pending" | "approved" | "rejected";
  createdBy: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
