// StatusBadge.tsx — coloured badge for an application status.
// Applied = green, Lead = yellow, Closed = red/grey.
import { Badge } from "./ui/badge";
import type { ApplicationStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const tone = status === "Applied" ? "green" : status === "Lead" ? "yellow" : "red";
  return <Badge tone={tone}>{status}</Badge>;
}
