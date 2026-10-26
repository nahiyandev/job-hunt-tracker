// linkedin/page.tsx — one row per day: date, comments, posts, notes.
// No scraping: the user types these numbers by hand.
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Protected } from "@/components/Protected";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Dialog, ConfirmDialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { SkeletonList } from "@/components/Skeleton";
import { formatDate } from "@/lib/date";
import type { LinkedInDayItem } from "@/lib/types";

export default function LinkedinPage() {
  const [rows, setRows] = useState<LinkedInDayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<LinkedInDayItem | null>(null);
  const [deleting, setDeleting] = useState<LinkedInDayItem | null>(null);
  const [date, setDate] = useState("");
  const [comments, setComments] = useState(0);
  const [posts, setPosts] = useState(0);
  const [notes, setNotes] = useState("");

  async function loadAll() {
    try {
      setRows(await api.getLinkedinDays());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load LinkedIn days.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  function openAdd() {
    setEditing(null);
    setDate(new Date().toISOString().slice(0, 10));
    setComments(0);
    setPosts(0);
    setNotes("");
    setFormOpen(true);
  }

  function openEdit(row: LinkedInDayItem) {
    setEditing(row);
    setDate(row.date.slice(0, 10));
    setComments(row.comments);
    setPosts(row.posts);
    setNotes(row.notes || "");
    setFormOpen(true);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!date) {
      toast.error("Please pick a date");
      return;
    }
    try {
      if (editing) {
        await api.updateLinkedinDay(editing._id, { date, comments, posts, notes });
        toast.success("Day updated successfully");
      } else {
        await api.createLinkedinDay({ date, comments, posts, notes });
        toast.success("Day added successfully");
      }
      setFormOpen(false);
      await loadAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the day.");
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await api.deleteLinkedinDay(deleting._id);
      toast.success("Day deleted successfully");
      setDeleting(null);
      await loadAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete the day.");
    }
  }

  const totalComments = rows.reduce((sum, row) => sum + row.comments, 0);

  return (
    <Protected>
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6 pb-20 sm:pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold">LinkedIn Daily</h1>
          <Button onClick={openAdd}>Add Day</Button>
        </div>
        <p className="text-sm text-gray-500">Total comments (live sum): {totalComments}</p>
        <Card>
          {loading ? (
            <SkeletonList count={3} />
          ) : rows.length === 0 ? (
            <p className="py-6 text-center text-gray-500">No LinkedIn days yet — add your first one.</p>
          ) : (
            <ul className="divide-y">
              {rows.map((row) => (
                <li key={row._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-semibold">
                      {formatDate(row.date)} {row.isDemo ? <Badge tone="purple">DEMO</Badge> : null}
                    </p>
                    <p className="text-sm text-gray-500">Comments: {row.comments} · Posts: {row.posts}{row.notes ? ` · ${row.notes}` : ""}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" onClick={() => openEdit(row)}>Edit</Button>
                    <Button variant="danger" onClick={() => setDeleting(row)}>Delete</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </main>
      <Footer />
      <BottomNav />
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit Day" : "Add Day"}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Comments Done</Label><Input type="number" min={0} value={comments} onChange={(e) => setComments(Number(e.target.value))} /></div>
            <div><Label>Posts</Label><Input type="number" min={0} value={posts} onChange={(e) => setPosts(Number(e.target.value))} /></div>
          </div>
          <div><Label>Notes</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button><Button type="submit">Save</Button></div>
        </form>
      </Dialog>
      <ConfirmDialog open={deleting !== null} onClose={() => setDeleting(null)} onConfirm={handleDelete} message="Delete this LinkedIn day?" />
    </Protected>
  );
}
