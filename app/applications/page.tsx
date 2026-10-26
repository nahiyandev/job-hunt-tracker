// applications/page.tsx — v3. Keeps v2 search, status filter,
// add/edit/delete + confirm dialog. Adds: view switch
// Kanban | Table | Calendar, detail view when a row/card is clicked
// (modal showing all fields incl. recruiter, CV version, documents,
// interview notes), all new statuses in the filter, mobile cards
// (table on desktop, cards on mobile), Footer + BottomNav.
"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Protected } from "@/components/Protected";
import { Navbar } from "@/components/Navbar";
import { ApplicationForm, type ApplicationFormValues } from "@/components/ApplicationForm";
import { ApplicationTable } from "@/components/ApplicationTable";
import { KanbanBoard } from "@/components/KanbanBoard";
import { CalendarView } from "@/components/CalendarView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { SkeletonList } from "@/components/Skeleton";
import { formatDate } from "@/lib/date";
import { api } from "@/lib/api";
import type { ApplicationItem, ApplicationStatus, FollowupItem } from "@/lib/types";

const STATUSES: ApplicationStatus[] = ["Saved", "Applied", "Assessment", "Interview", "Offer", "Rejected", "Ghosted", "Lead", "Closed"];

export default function ApplicationsPage() {
  const [apps, setApps] = useState<ApplicationItem[]>([]);
  const [followups, setFollowups] = useState<FollowupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [view, setView] = useState<"kanban" | "table" | "calendar">("table");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ApplicationItem | null>(null);
  const [deleting, setDeleting] = useState<ApplicationItem | null>(null);
  const [detail, setDetail] = useState<ApplicationItem | null>(null);

  async function loadAll() {
    try {
      const [appData, followupData] = await Promise.all([api.getApplications(), api.getFollowups()]);
      setApps(appData);
      setFollowups(followupData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load applications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return apps.filter((app) => {
      const matchesSearch = app.company.toLowerCase().includes(query) || app.role.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "All" || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [apps, search, statusFilter]);

  async function handleSubmit(values: ApplicationFormValues) {
    try {
      if (editing) {
        await api.updateApplication(editing._id, values as unknown as Record<string, unknown>);
        toast.success("Application updated successfully");
      } else {
        await api.createApplication(values as unknown as Record<string, unknown>);
        toast.success("Application added successfully");
      }
      await loadAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the application.");
      throw error;
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await api.deleteApplication(deleting._id);
      toast.success("Application deleted successfully");
      setDeleting(null);
      await loadAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete the application.");
    }
  }

  async function handleStatusChange(app: ApplicationItem, status: ApplicationStatus) {
    try {
      await api.updateApplication(app._id, { status });
      toast.success(`Moved to ${status}`);
      await loadAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not change the status.");
    }
  }

  return (
    <Protected>
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6 pb-20 sm:pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold">Applications</h1>
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>Add Application</Button>
        </div>
        <Card>
          <div className="mb-4 flex flex-wrap gap-3">
            <Input placeholder="Search by company or role..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="w-48">
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
            <div className="flex gap-2">
              {(["kanban", "table", "calendar"] as const).map((v) => (
                <Button key={v} variant={view === v ? "secondary" : "outline"} onClick={() => setView(v)}>
                  {v === "kanban" ? "Kanban" : v === "table" ? "Table" : "Calendar"}
                </Button>
              ))}
            </div>
          </div>
          {loading ? (
            <SkeletonList count={3} />
          ) : view === "kanban" ? (
            <KanbanBoard applications={filtered} onStatusChange={handleStatusChange} onSelect={setDetail} />
          ) : view === "calendar" ? (
            <CalendarView applications={filtered} followups={followups} onSelectApplication={setDetail} />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block">
                <ApplicationTable
                  applications={filtered}
                  followups={followups}
                  onEdit={(app) => { setEditing(app); setFormOpen(true); }}
                  onDelete={(app) => setDeleting(app)}
                  onSelect={setDetail}
                />
              </div>
              {/* Mobile cards — tapping a card opens the detail view */}
              <div className="grid gap-3 sm:hidden">
                {filtered.length === 0 ? <p className="py-8 text-center text-gray-500">No applications yet — add your first one.</p> : filtered.map((app) => (
                  <Card key={app._id} className="cursor-pointer" >
                    <div onClick={() => setDetail(app)}>
                      <p className="font-semibold">{app.company} {app.isDemo ? <Badge tone="purple">DEMO</Badge> : null}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{app.role} · {app.status}</p>
                      <p className="text-sm text-gray-500">{app.location || "—"} · {app.appliedDate ? formatDate(app.appliedDate) : "—"}</p>
                    </div>
                    <div className="mt-3 flex gap-1">
                      <Button variant="outline" onClick={() => { setEditing(app); setFormOpen(true); }}>Edit</Button>
                      <Button variant="danger" onClick={() => setDeleting(app)}>Delete</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </Card>
      </main>
      <ApplicationForm open={formOpen} onClose={() => setFormOpen(false)} initial={editing} onSubmit={handleSubmit} />
      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        message={`Delete the application for ${deleting?.company || ""}? Its follow-ups will be deleted too.`}
      />
      <Dialog open={detail !== null} onClose={() => setDetail(null)} title={detail ? `${detail.company} · ${detail.role}` : "Application"}>
        {detail ? (
          <div className="space-y-2 text-sm">
            <p><strong>Status:</strong> {detail.status}</p>
            <p><strong>Location:</strong> {detail.location || "—"}</p>
            <p><strong>Salary:</strong> {detail.salary || "—"}</p>
            <p><strong>Applied:</strong> {formatDate(detail.appliedDate)}</p>
            <p><strong>Source:</strong> {detail.source || "—"}</p>
            <p><strong>Posting:</strong> {detail.postingLink ? <a href={detail.postingLink} target="_blank" rel="noreferrer" className="text-violet-700 underline">Link</a> : "—"}</p>
            <p><strong>Recruiter:</strong> {detail.recruiterName || "—"}{detail.recruiterUrl ? <> · <a href={detail.recruiterUrl} target="_blank" rel="noreferrer" className="text-violet-700 underline">Profile</a></> : null}</p>
            <p><strong>Recruiter notes:</strong> {detail.recruiterNotes || "—"}</p>
            <p><strong>CV version:</strong> {detail.cvVersion || "—"}</p>
            <p><strong>Documents:</strong> {(detail.documents || []).length > 0 ? (detail.documents || []).map((doc, i) => <span key={i} className="mr-2"><a href={doc} target="_blank" rel="noreferrer" className="text-violet-700 underline">Doc {i + 1}</a></span>) : "—"}</p>
            <p><strong>Interview notes:</strong> {detail.interviewNotes || "—"}</p>
            <p><strong>Notes:</strong> {detail.notes || "—"}</p>
            <div className="flex gap-2 pt-3">
              <Button variant="outline" onClick={() => { setEditing(detail); setDetail(null); setFormOpen(true); }}>Edit</Button>
              <Button variant="danger" onClick={() => { setDeleting(detail); setDetail(null); }}>Delete</Button>
            </div>
          </div>
        ) : null}
      </Dialog>
      <Footer />
      <BottomNav />
    </Protected>
  );
}
