// DashboardCards.tsx — the two rows of stat cards on the dashboard.
// All numbers come from the dashboard API; nothing is hard-coded here.
import { Card, CardTitle } from "./ui/card";
import type { DashboardSummary } from "@/lib/types";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString();
}

export function DashboardCards({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="bg-orange-50"><CardTitle>Total Applications</CardTitle><p className="mt-1 text-3xl font-extrabold">{summary.totalApplications}</p></Card>
        <Card className="bg-green-50"><CardTitle>Applied</CardTitle><p className="mt-1 text-3xl font-extrabold text-green-700">{summary.applied}</p></Card>
        <Card className="bg-yellow-50"><CardTitle>Open Leads</CardTitle><p className="mt-1 text-3xl font-extrabold text-yellow-700">{summary.openLeads}</p></Card>
        <Card className="bg-red-50"><CardTitle>Closed</CardTitle><p className="mt-1 text-3xl font-extrabold text-red-700">{summary.closed}</p></Card>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardTitle>Next Follow-up Due</CardTitle>
          <p className="mt-1 font-bold">{summary.nextFollowupDue ? `${summary.nextFollowupDue.company} — ${formatDate(summary.nextFollowupDue.dueDate)}` : "No pending follow-up"}</p>
        </Card>
        <Card><CardTitle>Today&apos;s LinkedIn Comments</CardTitle><p className="mt-1 text-3xl font-extrabold">{summary.todayComments}</p></Card>
        <Card><CardTitle>Total LinkedIn Comments</CardTitle><p className="mt-1 text-3xl font-extrabold">{summary.totalComments}</p></Card>
        <Card><CardTitle>Pending Items</CardTitle><p className="mt-1 text-3xl font-extrabold">{summary.pendingItems}</p></Card>
      </div>
    </div>
  );
}
