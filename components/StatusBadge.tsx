// StatusBadge.tsx — v3 patch: coloured badge for every application status.
// Old statuses keep their colours; new v3 statuses get their own tones.
// Unknown statuses fall back to grey, never crash.
import { Badge } from "./ui/badge";
import type { ApplicationStatus } from "@/lib/types";

const TONES: Record<string, "green" | "yellow" | "red" | "purple" | "gray"> = {
  Saved: "gray",
  Applied: "green",
  Assessment: "purple",
  Interview: "purple",
  Offer: "green",
  Rejected: "red",
  Ghosted: "red",
  Lead: "yellow",
  Closed: "red",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <Badge tone={TONES[status] || "gray"}>{status}</Badge>;
}
