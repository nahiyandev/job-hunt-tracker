// jobs/[slug]/page.tsx — v3, PUBLIC SEO page.
// Slug examples: react-developer-jobs-in-dhaka, remote-junior-frontend-jobs.
// The slug is parsed into search keywords + location (words after "in"
// are the location, "remote" sets remote mode, "junior/mid/senior" sets
// level). It then fetches the real feed — no invented jobs, and an
// honest empty state if the backend returns none.
// Client component with useParams, as specified for this patch.
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/date";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";
import { SkeletonList } from "@/components/Skeleton";
import type { FeedJob } from "@/lib/types";

function parseSlug(slug: string) {
  const words = slug.toLowerCase().replace(/-jobs$/, "").split("-").filter(Boolean);
  const locationIndex = words.indexOf("in");
  const location = locationIndex >= 0 ? words.slice(locationIndex + 1).join(" ") : "";
  const main = locationIndex >= 0 ? words.slice(0, locationIndex) : words;
  const workMode = main.includes("remote") ? "remote" : "";
  const level = main.find((w) => ["junior", "mid", "senior"].includes(w)) || "";
  const keyword = main.filter((w) => w !== "remote" && !["junior", "mid", "senior"].includes(w)).join(" ");
  return { keyword, location, workMode, level };
}

export default function JobSlugPage() {
  const params = useParams();
  const slug = String(params.slug || "");
  const parsed = useMemo(() => parseSlug(slug), [slug]);
  const [jobs, setJobs] = useState<FeedJob[]>([]);
  const [loading, setLoading] = useState(true);

  const title = useMemo(() => {
    const words = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return words || "Jobs";
  }, [slug]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setJobs(await api.getFeed({ keyword: parsed.keyword, location: parsed.location, workMode: parsed.workMode || undefined, level: parsed.level || undefined }));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load jobs.");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [parsed]);

  return (
    <main className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900">
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6">
        <h1 className="text-2xl font-extrabold">{title}</h1>
        <p className="text-sm text-gray-500">
          Real listings for {parsed.keyword || "jobs"}{parsed.location ? ` in ${parsed.location}` : ""}. Open the original posting to apply — we never apply for you.
        </p>
        {loading ? (
          <SkeletonList count={3} />
        ) : jobs.length === 0 ? (
          <Card><p className="py-6 text-center text-gray-500">No jobs yet for this search — try a wider search on the Feed page.</p></Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <Card key={job._id}>
                <h3 className="font-bold">{job.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{job.company}{job.location ? ` · ${job.location}` : ""}</p>
                {typeof job.matchPercent === "number" ? <div className="mt-2"><Badge tone="green">AI Match {job.matchPercent}%</Badge></div> : null}
                <p className="mt-2 text-sm text-gray-500">{job.postedDate ? formatDate(job.postedDate) : ""}</p>
                <p className="mt-3 text-sm text-gray-500">Source: {job.source} · <a href={job.url} target="_blank" rel="noreferrer" className="text-violet-700 underline dark:text-violet-400">View original posting ↗</a></p>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
