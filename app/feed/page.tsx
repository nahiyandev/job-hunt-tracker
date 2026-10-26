// feed/page.tsx — v3, PUBLIC job feed. Browsable WITHOUT login;
// login is required only to Save (or Report). Save when logged out
// goes to /login with a toast. No scraping, no iframe, no auto-apply:
// ready search links open LinkedIn / Bdjobs in a new tab and the user
// browses there themselves. No invented jobs: an empty backend result
// shows the honest empty state below. Salaries shown as written by the
// source; where a BDT note exists it is shown, never converted by guess.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { getLang, t, type Lang } from "@/lib/i18n";
import { formatDate } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { SkeletonList } from "@/components/Skeleton";
import type { FeedJob } from "@/lib/types";

const REPORT_REASONS = ["Applied", "Interview", "Closed", "Fake"];

export default function FeedPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [lang, setLang] = useState<Lang>("en");
  const [jobs, setJobs] = useState<FeedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [level, setLevel] = useState("");
  const [category, setCategory] = useState("");
  const [posted, setPosted] = useState("");
  const [remoteBD, setRemoteBD] = useState(false);
  const [savedSearchKeyword, setSavedSearchKeyword] = useState("");

  useEffect(() => setLang(getLang()), []);

  async function load(params?: Record<string, string | boolean | undefined>) {
    setLoading(true);
    try {
      setJobs(await api.getFeed(params ?? {}));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load the job feed.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyFilters() {
    void load({ keyword, location, workMode, level, category, posted, remoteForBangladesh: remoteBD || undefined });
  }

  async function handleSave(job: FeedJob) {
    if (!session) {
      toast.info("Please log in to save jobs.");
      router.push("/login");
      return;
    }
    try {
      await api.saveFeedJob(job);
      toast.success("Job saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the job.");
    }
  }

  async function handleReport(job: FeedJob, reason: string) {
    if (!session) {
      toast.info("Please log in to report a job.");
      router.push("/login");
      return;
    }
    try {
      await api.reportFeedJob(job, reason);
      toast.success("Thanks — your report was sent.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send the report.");
    }
  }

  async function handleSaveSearch(event: React.FormEvent) {
    event.preventDefault();
    if (!session) {
      toast.info("Please log in to save a search.");
      router.push("/login");
      return;
    }
    try {
      await api.createSavedSearch({ keyword: savedSearchKeyword || keyword, location, workMode, level, category, remoteForBangladesh: remoteBD });
      toast.success("Search saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the search.");
    }
  }

  const q = encodeURIComponent(keyword || "developer");
  const linkedinUrl = `https://www.linkedin.com/jobs/search/?keywords=${q}`;
  const bdjobsUrl = `https://jobs.bdjobs.com/jobsearch.asp?fcatId=&txtsearch=${q}`;

  return (
    <main className="min-h-screen bg-[#F9FAFB] pb-20 sm:pb-0 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6">
        <h1 className="text-2xl font-extrabold">{t(lang, "jobFeed")}</h1>
        <p className="text-sm text-gray-500">Browse real listings from their original sources. We never scrape LinkedIn and never apply for you — open the original posting and apply there yourself.</p>

        <Card>
          <div className="grid gap-3 md:grid-cols-3">
            <div><Label>{t(lang, "keyword")}</Label><Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Example: React Developer" /></div>
            <div><Label>{t(lang, "location")}</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Example: Dhaka" /></div>
            <div>
              <Label>Work mode</Label>
              <Select value={workMode} onChange={(e) => setWorkMode(e.target.value)}>
                <option value="">Any</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="onsite">Onsite</option>
              </Select>
            </div>
            <div>
              <Label>Level</Label>
              <Select value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="">Any</option><option value="junior">Junior</option><option value="mid">Mid</option><option value="senior">Senior</option>
              </Select>
            </div>
            <div><Label>Category</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Example: Frontend" /></div>
            <div>
              <Label>Posted</Label>
              <Select value={posted} onChange={(e) => setPosted(e.target.value)}>
                <option value="">Any time</option><option value="today">Today</option><option value="week">This week</option><option value="month">This month</option>
              </Select>
            </div>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={remoteBD} onChange={(e) => setRemoteBD(e.target.checked)} />
            {t(lang, "remoteForBangladeshis")}
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={applyFilters}>Search</Button>
            <a href={linkedinUrl} target="_blank" rel="noreferrer"><Button variant="outline" type="button">Search on LinkedIn ↗</Button></a>
            <a href={bdjobsUrl} target="_blank" rel="noreferrer"><Button variant="outline" type="button">Search on Bdjobs ↗</Button></a>
          </div>
          {session ? (
            <form onSubmit={handleSaveSearch} className="mt-4 flex flex-wrap items-end gap-2 border-t pt-4">
              <div className="flex-1"><Label>Save this search (keyword)</Label><Input value={savedSearchKeyword} onChange={(e) => setSavedSearchKeyword(e.target.value)} placeholder={keyword || "Example: React Developer"} /></div>
              <Button type="submit" variant="secondary">Save search</Button>
            </form>
          ) : null}
        </Card>

        {loading ? (
          <SkeletonList count={3} />
        ) : jobs.length === 0 ? (
          <Card><p className="py-6 text-center text-gray-500">No jobs yet — try a wider search.</p></Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <Card key={job._id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold">{job.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{job.company}{job.location ? ` · ${job.location}` : ""}</p>
                  </div>
                  {typeof job.matchPercent === "number" ? <Badge tone={job.matchPercent >= 70 ? "green" : job.matchPercent >= 40 ? "yellow" : "gray"}>AI Match {job.matchPercent}%</Badge> : null}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {job.workMode ? `${job.workMode} · ` : ""}{job.level ? `${job.level} · ` : ""}{job.category ? `${job.category} · ` : ""}{job.postedDate ? formatDate(job.postedDate) : ""}
                </p>
                {job.salary ? <p className="mt-1 text-sm font-semibold">{job.salary}{job.salaryNote ? ` — ${job.salaryNote}` : ""}</p> : <p className="mt-1 text-sm text-gray-500">Salary shown on the original posting (BDT where the source lists it).</p>}
                {job.matchReason ? <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">Why it matched: {job.matchReason}</p> : null}
                {job.matchedKeywords && job.matchedKeywords.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1">{job.matchedKeywords.map((k) => <Badge key={k} tone="purple">{k}</Badge>)}</div>
                ) : null}
                {job.description ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{job.description.slice(0, 220)}</p> : null}
                <p className="mt-3 text-sm text-gray-500">Source: {job.source} · <a href={job.url} target="_blank" rel="noreferrer" className="text-violet-700 underline dark:text-violet-400">View original posting ↗</a></p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => handleSave(job)}>{t(lang, "save")}</Button>
                  <a href={job.url} target="_blank" rel="noreferrer"><Button variant="outline" type="button">Apply on source site</Button></a>
                  <Select onChange={(e) => { if (e.target.value) handleReport(job, e.target.value); }} defaultValue="">
                    <option value="" disabled>{t(lang, "report")}</option>
                    {REPORT_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </Select>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
      <BottomNav />
    </main>
  );
}
