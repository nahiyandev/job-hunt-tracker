// ApplicationTable.tsx — v3 patch: the applications table.
// Dates use ONE format everywhere: "26 Oct 2026" via lib/date.ts.
// Columns: Company, Role, Location, Salary, Status, Applied Date,
// Next Follow-up (calculated by the backend), Posting Link, Notes.
// Clicking View opens the detail view (wired in app/applications/page.tsx).
import { Table, TableHead, TableHeaderCell, TableRow, TableCell } from "./ui/table";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { formatDate } from "@/lib/date";
import type { ApplicationItem, FollowupItem } from "@/lib/types";

export function ApplicationTable({
  applications,
  followups,
  onEdit,
  onDelete,
  onSelect,
}: {
  applications: ApplicationItem[];
  followups: FollowupItem[];
  onEdit: (app: ApplicationItem) => void;
  onDelete: (app: ApplicationItem) => void;
  onSelect?: (app: ApplicationItem) => void;
}) {
  function nextFollowupFor(company: string): string {
    const pending = followups
      .filter((item) => item.company === company && item.status === "Pending")
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
    return pending ? formatDate(pending.dueDate) : "—";
  }

  if (applications.length === 0) {
    return <p className="py-8 text-center text-gray-500">No applications yet — add your first one.</p>;
  }

  return (
    <Table>
      <TableHead>
        <TableHeaderCell>Company</TableHeaderCell>
        <TableHeaderCell>Role</TableHeaderCell>
        <TableHeaderCell>Location</TableHeaderCell>
        <TableHeaderCell>Salary</TableHeaderCell>
        <TableHeaderCell>Status</TableHeaderCell>
        <TableHeaderCell>Applied Date</TableHeaderCell>
        <TableHeaderCell>Next Follow-up</TableHeaderCell>
        <TableHeaderCell>Posting Link</TableHeaderCell>
        <TableHeaderCell>Notes</TableHeaderCell>
        <TableHeaderCell>Actions</TableHeaderCell>
      </TableHead>
      <tbody>
        {applications.map((app) => (
          <TableRow key={app._id}>
            <TableCell>
              <span className="font-semibold">{app.company}</span>
              {app.isDemo ? <span className="ml-2"><Badge tone="purple">DEMO</Badge></span> : null}
            </TableCell>
            <TableCell>{app.role}</TableCell>
            <TableCell>{app.location || "—"}</TableCell>
            <TableCell>{app.salary || "—"}</TableCell>
            <TableCell><StatusBadge status={app.status} /></TableCell>
            <TableCell>{app.appliedDate ? formatDate(app.appliedDate) : "—"}</TableCell>
            <TableCell>{nextFollowupFor(app.company)}</TableCell>
            <TableCell>{app.postingLink ? <a href={app.postingLink} target="_blank" rel="noreferrer" className="text-violet-700 underline">Link</a> : "—"}</TableCell>
            <TableCell>{app.notes || "—"}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                {onSelect ? <Button variant="secondary" onClick={() => onSelect(app)}>View</Button> : null}
                <Button variant="outline" onClick={() => onEdit(app)}>Edit</Button>
                <Button variant="danger" onClick={() => onDelete(app)}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
}
