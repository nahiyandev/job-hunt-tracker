// projects/page.tsx — simple project cards with add / edit / delete.
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Protected } from "@/components/Protected";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog, ConfirmDialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { SkeletonList } from "@/components/Skeleton";
import type { ProjectItem, ProjectStatus } from "@/lib/types";

export default function ProjectsPage() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [deleting, setDeleting] = useState<ProjectItem | null>(null);
  const [name, setName] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("Planning");
  const [notes, setNotes] = useState("");
  const [techStackText, setTechStackText] = useState("");
  const [repoLink, setRepoLink] = useState("");

  async function loadAll() {
    try {
      setItems(await api.getProjects());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load projects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  function openAdd() {
    setEditing(null);
    setName("");
    setLiveLink("");
    setStatus("Planning");
    setNotes("");
    setTechStackText("");
    setRepoLink("");
    setFormOpen(true);
  }

  function openEdit(item: ProjectItem) {
    setEditing(item);
    setName(item.name);
    setLiveLink(item.liveLink || "");
    setStatus(item.status);
    setNotes(item.notes || "");
    setTechStackText((item.techStack || []).join(", "));
    setRepoLink(item.repoLink || "");
    setFormOpen(true);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Please fill Project Name");
      return;
    }
    try {
      if (editing) {
        await api.updateProject(editing._id, { name, liveLink, status, notes, techStack: techStackText.split(",").map((t) => t.trim()).filter(Boolean), repoLink });
        toast.success("Project updated successfully");
      } else {
        await api.createProject({ name, liveLink, status, notes, techStack: techStackText.split(",").map((t) => t.trim()).filter(Boolean), repoLink });
        toast.success("Project added successfully");
      }
      setFormOpen(false);
      await loadAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the project.");
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await api.deleteProject(deleting._id);
      toast.success("Project deleted successfully");
      setDeleting(null);
      await loadAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete the project.");
    }
  }

  return (
    <Protected>
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6 pb-20 sm:pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold">Projects</h1>
          <Button onClick={openAdd}>Add Project</Button>
        </div>
        {loading ? (
          <SkeletonList count={3} />
        ) : items.length === 0 ? (
          <p className="py-6 text-center text-gray-500">No projects yet — add your first one.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Card key={item._id}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold">{item.name}</h3>
                  {item.isDemo ? <Badge tone="purple">DEMO</Badge> : null}
                </div>
                <p className="mt-1 text-sm text-gray-500">Status: {item.status}</p>
                {item.liveLink ? <a href={item.liveLink} target="_blank" rel="noreferrer" className="text-sm text-violet-700 underline">Live Link</a> : null}
                {item.repoLink ? <span> · <a href={item.repoLink} target="_blank" rel="noreferrer" className="text-sm text-violet-700 underline">Repo</a></span> : null}
                {item.techStack && item.techStack.length > 0 ? <p className="mt-1 text-sm text-gray-500">{item.techStack.join(", ")}</p> : null}
                {item.notes ? <p className="mt-2 text-sm text-gray-700">{item.notes}</p> : null}
                <div className="mt-4 flex gap-1">
                  <Button variant="outline" onClick={() => openEdit(item)}>Edit</Button>
                  <Button variant="danger" onClick={() => setDeleting(item)}>Delete</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <BottomNav />
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit Project" : "Add Project"}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div><Label>Project Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label>Live Link</Label><Input value={liveLink} onChange={(e) => setLiveLink(e.target.value)} placeholder="https://..." /></div>
          <div>
            <Label>Status</Label>
            <Select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </Select>
          </div>
          <div><Label>Tech Stack (comma-separated)</Label><Input value={techStackText} onChange={(e) => setTechStackText(e.target.value)} placeholder="React, TypeScript" /></div>
          <div><Label>Repo Link</Label><Input value={repoLink} onChange={(e) => setRepoLink(e.target.value)} placeholder="https://github.com/..." /></div>
          <div><Label>Notes</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button><Button type="submit">Save</Button></div>
        </form>
      </Dialog>
      <ConfirmDialog open={deleting !== null} onClose={() => setDeleting(null)} onConfirm={handleDelete} message="Delete this project?" />
    </Protected>
  );
}
