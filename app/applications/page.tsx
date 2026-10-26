// applications/page.tsx — table, search, status filter, add/edit/delete.
"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Protected } from "@/components/Protected";
import { Navbar } from "@/components/Navbar";
import { ApplicationForm, type ApplicationFormValues } from "@/components/ApplicationForm";
import { ApplicationTable } from "@/components/ApplicationTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { ApplicationItem, FollowupItem } from "@/lib/types";

export default function ApplicationsPage() {
  const [apps, setApps] = useState<ApplicationItem[]>([]);
  const [followups, setFollowups] = useState<FollowupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ApplicationItem | null>(null);
  const [deleting, setDeleting] = useState<ApplicationItem | null>(null);

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

  return (
    <Protected>
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
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
                <option value="Applied">Applied</option>
                <option value="Lead">Lead</option>
                <option value="Closed">Closed</option>
              </Select>
            </div>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading applications...</p>
          ) : (
            <ApplicationTable
              applications={filtered}
              followups={followups}
              onEdit={(app) => { setEditing(app); setFormOpen(true); }}
              onDelete={(app) => setDeleting(app)}
            />
          )}
        </Card>
      </main>
      <ApplicationForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editing}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        message={`Delete the application for ${deleting?.company || ""}? Its follow-ups will be deleted too.`}
      />
    </Protected>
  );
}
