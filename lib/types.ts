// types.ts — v3 patch. ALL v2 types kept unchanged, then expanded.
// No `any` for main models: every page uses these exact shapes.
// New statuses and optional fields are optional/backwards-compatible:
// old rows without them still render (fields are `?` and guarded in UI).
export type ApplicationStatus =
  | "Saved"
  | "Applied"
  | "Assessment"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Ghosted"
  | "Lead"
  | "Closed";
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
  // v3 optional fields
  source?: string;
  recruiterName?: string;
  recruiterUrl?: string;
  recruiterNotes?: string;
  cvVersion?: string;
  documents?: string[];
  interviewNotes?: string;
}

export interface FollowupItem {
  _id: string;
  company: string;
  followupNumber: 1 | 2;
  dueDate: string;
  status: FollowupStatus;
  isDemo: boolean;
  // v3: when set, this follow-up is snoozed until this date
  snoozedUntil?: string | null;
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
  // v3 optional fields
  techStack?: string[];
  repoLink?: string;
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

// v3: editable profile. Name/photo/email are NOT editable here —
// they come from Google (see app/profile/page.tsx).
export interface ProfileItem {
  _id?: string;
  userId?: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  level?: string;
  location?: string;
  keywords?: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
  theme?: "light" | "dark" | "system";
}

// v3: a job listing from the feed. Every card must show `source` and
// `url` (the original posting link). No invented jobs: if the backend
// returns none, the feed shows an honest empty state.
export interface FeedJob {
  _id: string;
  title: string;
  company: string;
  location?: string;
  workMode?: "remote" | "hybrid" | "onsite" | string;
  level?: string;
  category?: string;
  salary?: string;
  salaryNote?: string;
  source: string;
  url: string;
  postedDate?: string;
  description?: string;
  matchPercent?: number;
  matchedKeywords?: string[];
  matchReason?: string;
  remoteForBangladesh?: boolean;
}

export interface SavedSearchItem {
  _id: string;
  keyword?: string;
  location?: string;
  workMode?: string;
  level?: string;
  category?: string;
  remoteForBangladesh?: boolean;
  createdAt?: string;
}

export interface CompanyWatchItem {
  _id: string;
  company: string;
  createdAt?: string;
}

// v3: AI tools results (backend returns these shapes; the UI only
// renders what is present and never invents scores).
export interface ResumeMatchSection {
  name: string;
  score: number;
}
export interface ResumeMatchResult {
  score: number;
  sections?: ResumeMatchSection[];
  matchedKeywords?: string[];
  missingKeywords?: string[];
  skillGaps?: string[];
  templateMode?: boolean;
  note?: string;
}
export interface CoverLetterResult {
  letter: string;
}
export interface ToolTextResult {
  text: string;
  summary?: string;
  redFlags?: string[];
  keySkills?: string[];
  questions?: string[];
  starStructure?: Record<string, string>;
  title?: string;
  company?: string;
  skills?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
