// dashboard/page.tsx — v3. Keeps v2 stat cards, alert banner, live
// charts, quick actions and Delete All DEMO Data. Adds: stat cards for
// Ghosted + Interviewing + Offered (computed from applications),
// conversion text Application → Interview → Offer, weekly target +
// streak (applications in last 7 days, consecutive days with an
// application), a plain-words Funnel Coach box, Footer + BottomNav.
// Charts are legend-friendly via the v3 Charts component.
"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { toast } from "react-toastify";
import { Protected } from "@/components/Protected";
import { Navbar } from "@/components/Navbar";
import { DashboardCards } from "@/components/DashboardCards";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { SkeletonList } from "@/components/Skeleton";
import { daysUntil } from "@/lib/date";
import { api } from "@/lib/api";
import type { ApplicationItem, DashboardSummary } from "@/lib/types";

// Recharts needs the browser, so Charts loads only on the client.
const Charts = dynamic(() => import("@/components/Charts").then((mod) => mod.Charts), { ssr: false });

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoCount, setDemoCount] = useState(0);
  const [confirmDemo, setConfirmDemo] = useState(false);

  async function loadAll() {
    try {
      const [data, demo, apps] = await Promise.all([
        api.getDashboard(),
        api.getDemoCount().catch(() => ({ total: 0 })),
        api.getApplications().catch(() => [] as ApplicationItem[]),
      ]);
      setSummary(data);
      setDemoCount(demo.total);
      setApplications(apps);
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

  const stats = useMemo(() => {
    const count = (status: string) => applications.filter((a) => a.status === status).length;
    const ghosted = count("Ghosted");
    const interviewing = count("Interview");
    const offered = count("Offer");
    const applied = applications.filter((a) => ["Applied", "Assessment", "Interview", "Offer", "Rejected", "Ghosted", "Closed"].includes(a.status)).length;
    const interviewRate = applied > 0 ? Math.round((interviewing / applied) * 100) : 0;
    const offerRate = interviewing > 0 ? Math.round((offered / interviewing) * 100) : 0;
    const weekAgo = Date.now() - 7 * 86400000;
    const last7Days = applications.filter((a) => a.appliedDate && new Date(a.appliedDate).getTime() >= weekAgo).length;
    // Streak: consecutive days (ending today or yesterday) with an application.
    const daysWithApp = new Set(applications.filter((a) => a.appliedDate).map((a) => a.appliedDate!.slice(0, 10)));
    let streak = 0;
    const cursor = new Date();
    if (!daysWithApp.has(cursor.toISOString().slice(0, 10))) cursor.setDate(cursor.getDate() - 1);
    while (daysWithApp.has(cursor.toISOString().slice(0, 10))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    const coach = applied >= 10 && interviewing === 0
      ? "Many applications but no interviews yet — your CV or the roles you target may need work. Try the Resume Matcher and tighten your keywords."
      : applied >= 5 && interviewing > 0 && offered === 0
      ? "You are getting interviews, but no offers yet — focus on interview preparation and follow-ups after each interview."
      : ghosted >= 5
      ? "Several applications went quiet (ghosted). A polite follow-up after 10 days can restart a conversation."
      : "Keep a steady rhythm: a few quality applications each week beat a burst of rushed ones.";
    return { ghosted, interviewing, offered, applied, interviewRate, offerRate, last7Days, streak, coach };
  }, [applications]);

  return (
    <Protected>
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-5 px-4 py-6 pb-20 sm:pb-6">
        <h1 className="text-2xl font-extrabold">Dashboard</h1>
        {loading || !summary ? (
          <SkeletonList count={3} />
        ) : (
          <>
            {summary.nextFollowupDue ? (
              <Card className="border-orange-200 bg-orange-50">
                <p className="font-semibold text-orange-800">
                  Next follow-up in {daysUntil(summary.nextFollowupDue.dueDate) ?? "—"} days — {summary.nextFollowupDue.company}
                </p>
              </Card>
            ) : null}
            <DashboardCards summary={summary} />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              <Card><p className="text-sm font-semibold text-gray-500">Ghosted</p><p className="mt-1 text-3xl font-extrabold text-orange-700">{stats.ghosted}</p></Card>
              <Card><p className="text-sm font-semibold text-gray-500">Interviewing</p><p className="mt-1 text-3xl font-extrabold text-violet-700">{stats.interviewing}</p></Card>
              <Card><p className="text-sm font-semibold text-gray-500">Offered</p><p className="mt-1 text-3xl font-extrabold text-emerald-700">{stats.offered}</p></Card>
            </div>
            <Card>
              <h3 className="mb-2 font-bold">Conversion: Application → Interview → Offer</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {stats.applied} applications → {stats.interviewing} interviews ({stats.interviewRate}%) → {stats.offered} offers ({stats.offerRate}% of interviews).
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Weekly target: {stats.last7Days} applications in the last 7 days · Streak: {stats.streak} day{stats.streak === 1 ? "" : "s"} in a row with an application.</p>
            </Card>
            <Card className="border-violet-200 bg-violet-50">
              <h3 className="mb-2 font-bold">Funnel Coach</h3>
              <p className="text-sm text-gray-700 dark:text-gray-200">{stats.coach}</p>
            </Card>
            <Charts summary={summary} />
            <Card>
              <h3 className="mb-3 font-bold">Quick Actions</h3>
              <div className="flex flex-wrap gap-2">
                <Link href="/applications"><Button>Add Application</Button></Link>
                <Link href="/applications"><Button variant="secondary">Applications</Button></Link>
                <Link href="/follow-ups"><Button variant="outline">Follow-ups</Button></Link>
                <Link href="/linkedin"><Button variant="outline">LinkedIn Daily</Button></Link>
                <Link href="/projects"><Button variant="outline">Projects</Button></Link>
                <Link href="/feed"><Button variant="outline">Job Feed</Button></Link>
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
      <Footer />
      <BottomNav />
    </Protected>
  );
}
