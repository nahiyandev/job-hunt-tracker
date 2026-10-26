// tools/resume-matcher/page.tsx — v3, PUBLIC, no login required.
// Paste resume + job description, run the backend match, see an ATS
// score ring (SVG circle out of 100), section bars, matched/missing
// keywords and skill gaps. Scores come only from the backend result;
// nothing is invented here. Template-mode note is shown when the
// backend says the resume looks template-like.
"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import type { ResumeMatchResult } from "@/lib/types";

const DEFAULT_SECTIONS = ["Contact", "Summary", "Experience", "Skills", "Education", "Keywords", "Formatting", "Achievements", "Readability", "Action Verbs"];

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const filled = (Math.max(0, Math.min(100, score)) / 100) * circumference;
  const colour = score >= 70 ? "#16A34A" : score >= 40 ? "#EAB308" : "#DC2626";
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" role="img" aria-label={`ATS score ${score} out of 100`}>
      <circle cx="70" cy="70" r={r} fill="none" stroke="#E5E7EB" strokeWidth="12" />
      <circle cx="70" cy="70" r={r} fill="none" stroke={colour} strokeWidth="12" strokeDasharray={`${filled} ${circumference}`} strokeLinecap="round" transform="rotate(-90 70 70)" />
      <text x="70" y="68" textAnchor="middle" fontSize="28" fontWeight="800" fill="#111827">{score}</text>
      <text x="70" y="88" textAnchor="middle" fontSize="12" fill="#6B7280">/ 100</text>
    </svg>
  );
}

export default function ResumeMatcherPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [result, setResult] = useState<ResumeMatchResult | null>(null);
  const [running, setRunning] = useState(false);

  async function handleRun() {
    if (!resumeText.trim() || !jobText.trim()) {
      toast.error("Paste both your resume and the job description first");
      return;
    }
    setRunning(true);
    try {
      setResult(await api.toolsMatch({ resumeText, jobText }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not run the match.");
    } finally {
      setRunning(false);
    }
  }

  const sections = result?.sections && result.sections.length > 0
    ? result.sections
    : DEFAULT_SECTIONS.map((name) => ({ name, score: 0 }));

  return (
    <main className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900">
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6">
        <h1 className="text-2xl font-extrabold">Resume Matcher</h1>
        <p className="text-sm text-gray-500">Paste your resume and a job description. No login needed, nothing is posted anywhere, and no application is sent for you.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Your resume (paste text)</label>
            <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} rows={14} className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" placeholder="Paste your resume text here..." />
          </Card>
          <Card>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Job description (paste text)</label>
            <textarea value={jobText} onChange={(e) => setJobText(e.target.value)} rows={14} className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" placeholder="Paste the job description here..." />
          </Card>
        </div>
        <Button onClick={handleRun} disabled={running}>{running ? "Checking..." : "Run Match"}</Button>

        {result ? (
          <div className="space-y-4">
            <Card>
              <div className="flex flex-wrap items-center gap-6">
                <ScoreRing score={result.score} />
                <div>
                  <h3 className="font-bold">ATS score</h3>
                  <p className="text-sm text-gray-500">Out of 100, from the backend analysis of your pasted text.</p>
                  {result.templateMode ? <p className="mt-2 text-sm text-orange-700">Template-mode note: this resume looks template-like — add your own achievements and numbers to stand out.</p> : null}
                  {result.note ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{result.note}</p> : null}
                </div>
              </div>
            </Card>
            <Card>
              <h3 className="mb-3 font-bold">Section scores</h3>
              <div className="space-y-3">
                {sections.map((section) => (
                  <div key={section.name}>
                    <div className="flex justify-between text-sm"><span>{section.name}</span><span>{section.score}/100</span></div>
                    <div className="mt-1 h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className={`h-full ${section.score >= 70 ? "bg-green-600" : section.score >= 40 ? "bg-yellow-500" : "bg-red-600"}`} style={{ width: `${Math.max(0, Math.min(100, section.score))}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              {(!result.sections || result.sections.length === 0) ? <p className="mt-3 text-xs text-gray-500">Section bars show 0 because the backend did not return section scores for this run — the overall score above is still the real result.</p> : null}
            </Card>
            <div className="grid gap-4 md:grid-cols-3">
              <Card><h3 className="mb-2 font-bold">Matched keywords</h3><p className="text-sm text-gray-600 dark:text-gray-300">{(result.matchedKeywords || []).join(", ") || "None reported."}</p></Card>
              <Card><h3 className="mb-2 font-bold">Missing keywords</h3><p className="text-sm text-gray-600 dark:text-gray-300">{(result.missingKeywords || []).join(", ") || "None reported."}</p></Card>
              <Card><h3 className="mb-2 font-bold">Skill gaps</h3><p className="text-sm text-gray-600 dark:text-gray-300">{(result.skillGaps || []).join(", ") || "None reported."}</p></Card>
            </div>
          </div>
        ) : null}
      </div>
      <Footer />
    </main>
  );
}
