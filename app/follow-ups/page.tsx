// follow-ups/page.tsx — auto-calculated follow-ups, never typed by hand.
// Overdue = red, due today = orange, upcoming = grey, done = green.
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Protected } from "@/components/Protected";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import type { FollowupItem } from "@/lib/types";

function badgeFor(item: FollowupItem): { tone: "red" | "orange" | "gray" | "green"; label: string } {
  if (item.status === "Done") return { tone: "green", label: "Done" };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(item.dueDate);
  due.setHours(0, 0, 0, 0);
  if (due.getTime() < today.getTime()) return { tone: "red", label: "Overdue" };
  if (due.getTime() === today.getTime()) return { tone: "orange", label: "Due today" };
  return { tone: "gray", label: "Upcoming" };
}

export default function FollowupsPage() {
  const [items, setItems] = useState<FollowupItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  async function handleMarkDone(id: string) {
    try {
      await api.markFollowupDone(id);
      toast.success("Follow-up marked done");
      await loadAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not mark the follow-up done.");
    }
  }

  return (
    <Protected>
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <h1 className="text-2xl font-extrabold">Follow-ups</h1>
        <p className="text-sm text-gray-500">
          Automatic: Follow-up #1 is due 10 days after the applied date, Follow-up #2 is due 14 days after #1. Maximum 2 per application.
        </p>
        <Card>
          {loading ? (
            <p className="text-gray-500">Loading follow-ups...</p>
          ) : items.length === 0 ? (
            <p className="py-6 text-center text-gray-500">No follow-ups yet. Mark an application as Applied to create them automatically.</p>
          ) : (
            <ul className="divide-y">
              {items.map((item) => {
                const badge = badgeFor(item);
                return (
                  <li key={item._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <p className="font-semibold">
                        {item.company} {item.isDemo ? <Badge tone="purple">DEMO</Badge> : null}
                      </p>
                      <p className="text-sm text-gray-500">
                        Follow-up #{item.followupNumber} — Due {new Date(item.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={badge.tone}>{badge.label}</Badge>
                      {item.status === "Pending" ? (
                        <Button variant="secondary" onClick={() => handleMarkDone(item._id)}>Mark Done</Button>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </main>
    </Protected>
  );
}
