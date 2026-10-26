// dashboard/page.tsx — the star of the app: stat cards, alert banner,
// live charts, quick actions, and the Delete All DEMO Data button.
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { toast } from "react-toastify";
import { Protected } from "@/components/Protected";
import { Navbar } from "@/components/Navbar";
import { DashboardCards } from "@/components/DashboardCards";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import type { DashboardSummary } from "@/lib/types";

// Recharts needs the browser, so Charts loads only on the client.
const Charts = dynamic(() => import("@/components/Charts").then((mod) => mod.Charts), { ssr: false });

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoCount, setDemoCount] = useState(0);
  const [confirmDemo, setConfirmDemo] = useState(false);

  async function loadAll() {
    try {
      const [data, demo] = await Promise.all([api.getDashboard(), api.getDemoCount().catch(() => ({ total: 0 }))]);
      setSummary(data);
      setDemoCount(demo.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load the dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  async function handleDeleteDemo() {
    try {
      await api.deleteDemo();
      toast.success("All DEMO data deleted");
      setConfirmDemo(false);
      await loadAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete demo data.");
    }
  }

  function daysUntil(dateString: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateString);
    due.setHours(0, 0, 0, 0);
    return Math.round((due.getTime() - today.getTime()) / 86400000);
  }

  return (
    <Protected>
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-5 px-4 py-6">
        <h1 className="text-2xl font-extrabold">Dashboard</h1>
        {loading || !summary ? (
          <p className="text-gray-500">Loading dashboard...</p>
        ) : (
          <>
            {summary.nextFollowupDue ? (
              <Card className="border-orange-200 bg-orange-50">
                <p className="font-semibold text-orange-800">
                  Next follow-up in {daysUntil(summary.nextFollowupDue.dueDate)} days — {summary.nextFollowupDue.company}
                </p>
              </Card>
            ) : null}
            <DashboardCards summary={summary} />
            <Charts summary={summary} />
            <Card>
              <h3 className="mb-3 font-bold">Quick Actions</h3>
              <div className="flex flex-wrap gap-2">
                <Link href="/applications"><Button>Add Application</Button></Link>
                <Link href="/applications"><Button variant="secondary">Applications</Button></Link>
                <Link href="/follow-ups"><Button variant="outline">Follow-ups</Button></Link>
                <Link href="/linkedin"><Button variant="outline">LinkedIn Daily</Button></Link>
                <Link href="/projects"><Button variant="outline">Projects</Button></Link>
                {demoCount > 0 ? (
                  <Button variant="danger" onClick={() => setConfirmDemo(true)}>
                    Delete All DEMO Data ({demoCount})
                  </Button>
                ) : null}
              </div>
              {summary.totalApplications === 0 ? (
                <p className="mt-4 text-sm text-gray-500">
                  No applications yet — add your first one. New users start with an empty tracker;
                  demo rows only appear if you import demo-data.json yourself.
                </p>
              ) : null}
            </Card>
          </>
        )}
      </main>
      <ConfirmDialog
        open={confirmDemo}
        onClose={() => setConfirmDemo(false)}
        onConfirm={handleDeleteDemo}
        message="Delete all DEMO rows (applications, LinkedIn days, projects and their follow-ups)? Your real rows will not be touched."
      />
    </Protected>
  );
}
