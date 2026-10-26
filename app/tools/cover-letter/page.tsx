// tools/cover-letter/page.tsx — v3, PUBLIC, no login required.
// CV text paste + .txt file upload only, JD editor, Generate, LIVE
// preview column, Download .txt. "Save to application" is only shown
// when logged in: it picks an existing application and updates its
// notes with the letter (via the existing updateApplication call).
// 3 columns on desktop, stacked on mobile. Nothing is posted anywhere.
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import type { ApplicationItem } from "@/lib/types";

export default function CoverLetterPage() {
  const { data: session } = authClient.useSession();
  const [cvText, setCvText] = useState("");
  const [jobText, setJobText] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [letter, setLetter] = useState("");
  const [generating, setGenerating] = useState(false);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [selectedApp, setSelectedApp] = useState("");

  useEffect(() => {
    if (session) {
      api.getApplications().then(setApplications).catch(() => setApplications([]));
    }
  }, [session]);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".txt")) {
      toast.error("Only .txt files are supported for upload");
      return;
    }
    setCvText(await file.text());
    toast.success("CV text loaded from file");
  }

  async function handleGenerate() {
    if (!cvText.trim() || !jobText.trim()) {
      toast.error("Paste your CV and the job description first");
      return;
    }
    setGenerating(true);
    try {
      const result = await api.toolsCoverLetter({ cvText, jobText, role, company });
      setLetter(result.letter);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate the letter.");
    } finally {
      setGenerating(false);
    }
  }

  function handleDownload() {
    const blob = new Blob([letter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cover-letter.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleSaveToApplication() {
    if (!selectedApp) {
      toast.error("Pick an application first");
      return;
    }
    try {
      await api.updateApplication(selectedApp, { notes: letter });
      toast.success("Cover letter saved to that application's notes");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save to the application.");
    }
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900">
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6">
        <h1 className="text-2xl font-extrabold">Cover Letter Generator</h1>
        <p className="text-sm text-gray-500">No login needed to generate. Review and edit the letter before you use it — it is a draft, not a sent application.</p>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Your CV (paste text)</label>
            <textarea value={cvText} onChange={(e) => setCvText(e.target.value)} rows={12} className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" placeholder="Paste your CV text here..." />
            <div className="mt-3"><Label>Or upload a .txt CV</Label><Input type="file" accept=".txt" onChange={handleFile} /></div>
          </Card>
          <Card>
            <div className="mb-3 grid gap-3 sm:grid-cols-2">
              <div><Label>Role (for the letter)</Label><Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Example: Frontend Developer" /></div>
              <div><Label>Company (for the letter)</Label><Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Example: Acme Ltd" /></div>
            </div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Job description</label>
            <textarea value={jobText} onChange={(e) => setJobText(e.target.value)} rows={12} className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" placeholder="Paste the job description here..." />
            <Button className="mt-3" onClick={handleGenerate} disabled={generating}>{generating ? "Generating..." : "Generate Cover Letter"}</Button>
          </Card>
          <Card>
            <h3 className="mb-2 font-bold">Live preview</h3>
            {letter ? (
              <>
                <textarea value={letter} onChange={(e) => setLetter(e.target.value)} rows={12} className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={handleDownload}>Download .txt</Button>
                </div>
                {session ? (
                  <div className="mt-4 space-y-2 border-t pt-4">
                    <Label>Save to application</Label>
                    <Select value={selectedApp} onChange={(e) => setSelectedApp(e.target.value)}>
                      <option value="">Pick an application...</option>
                      {applications.map((app) => <option key={app._id} value={app._id}>{app.company} · {app.role}</option>)}
                    </Select>
                    <Button variant="outline" onClick={handleSaveToApplication}>Save to application</Button>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-gray-500">Log in to save this letter to one of your applications.</p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">Your generated letter will appear here, live, as you edit it.</p>
            )}
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  );
}
