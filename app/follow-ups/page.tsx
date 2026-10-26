// follow-ups/page.tsx — v3. Keeps v2 auto-calculated follow-ups.
// Adds: Snooze (3/7 days), Mark Done, Mark Undone, overdue items
// highlighted red with filter All / Overdue / Due today / Upcoming,
// dates from lib/date.ts everywhere, skeleton while loading,
// Footer + BottomNav. Overdue = red, due today = orange,
// upcoming = grey, done = green.
"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Protected } from "@/components/Protected";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { SkeletonList } from "@/components/Skeleton";
import { formatDate, isOverdue, isToday } from "@/lib/date";
import { api } from "@/lib/api";
import type { FollowupItem } from "@/lib/types";

type Filter = "All" | "Overdue" | "Due today" | "Upcoming";

function badgeFor(item: FollowupItem): { tone: "red" | "orange" | "gray" | "green"; label: string } {
  if (item.status === "Done") return { tone: "green", label: "Done" };
  if (isOverdue(item.dueDate)) return { tone: "red", label: "Overdue" };
  if (isToday(item.dueDate)) return { tone: "orange", label: "Due today" };
  return { tone: "gray", label: "Upcoming" };
}

function effectiveDue(item: FollowupItem): string {
  // A snoozed follow-up is due on its snoozed date, not the original.
  return item.snoozedUntil || item.dueDate;
}

export default function FollowupsPage() {
  const [items, setItems] = useState<FollowupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("All");

  async function loadAll() {
    try {
      setItems(await api.getFollowups());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load follow-ups.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (filter === "All") return true;
      if (filter === "Overdue") return item.status === "Pending" && isOverdue(effectiveDue(item));
      if (filter === "Due today") return item.status === "Pending" && isToday(effectiveDue(item));
      if (filter === "Upcoming") return item.status === "Pending" && !isOverdue(effectiveDue(item)) && !isToday(effectiveDue(item));
      return true;
    });
  }, [items, filter]);

  async function run(action: () => Promise<unknown>, success: string, failure: string) {
    try {
      await action();
      toast.success(success);
      await loadAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : failure);
    }
  }

  return (
    <Protected>
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6 pb-20 sm:pb-6">
        <h1 className="text-2xl font-extrabold">Follow-ups</h1>
        <p className="text-sm text-gray-500">
          Automatic: Follow-up #1 is due 10 days after the applied date, Follow-up #2 is due 14 days after #1. Maximum 2 per application.
        </p>
        <div className="w-56">
          <Select value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
            <option value="All">All</option>
            <option value="Overdue">Overdue</option>
            <option value="Due today">Due today</option>
            <option value="Upcoming">Upcoming</option>
          </Select>
        </div>
        <Card>
          {loading ? (
            <SkeletonList count={3} />
          ) : filtered.length === 0 ? (
            <p className="py-6 text-center text-gray-500">No follow-ups in this filter. Mark an application as Applied to create them automatically.</p>
          ) : (
            <ul className="divide-y">
              {filtered.map((item) => {
                const badge = badgeFor({ ...item, dueDate: effectiveDue(item) });
                const overdue = item.status === "Pending" && isOverdue(effectiveDue(item));
                return (
                  <li key={item._id} className={`flex flex-wrap items-center justify-between gap-3 py-3 ${overdue ? "rounded-xl bg-red-50 px-2 dark:bg-red-900/20" : ""}`}>
                    <div>
                      <p className="font-semibold">
                        {item.company} {item.isDemo ? <Badge tone="purple">DEMO</Badge> : null}
                      </p>
                      <p className="text-sm text-gray-500">
                        Follow-up #{item.followupNumber} — Due {formatDate(effectiveDue(item))}
                        {item.snoozedUntil ? ` (snoozed, originally ${formatDate(item.dueDate)})` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={badge.tone}>{badge.label}</Badge>
                      {item.status === "Pending" ? (
                        <>
                          <Button variant="secondary" onClick={() => run(() => api.markFollowupDone(item._id), "Follow-up marked done", "Could not mark the follow-up done.")}>Mark Done</Button>
                          <Button variant="outline" onClick={() => run(() => api.snoozeFollowup(item._id, 3), "Snoozed for 3 days", "Could not snooze.")}>Snooze 3d</Button>
                          <Button variant="outline" onClick={() => run(() => api.snoozeFollowup(item._id, 7), "Snoozed for 7 days", "Could not snooze.")}>Snooze 7d</Button>
                        </>
                      ) : (
                        <Button variant="outline" onClick={() => run(() => api.undoneFollowup(item._id), "Follow-up marked undone", "Could not undo.")}>Mark Undone</Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </main>
      <Footer />
      <BottomNav />
    </Protected>
  );
}
