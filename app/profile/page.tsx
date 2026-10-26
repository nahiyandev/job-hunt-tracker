// profile/page.tsx — v3, protected. Editable: bio, headline, skills
// (comma list), level, location, keywords, LinkedIn/GitHub/portfolio links.
// Name/photo/email are shown READ-ONLY from Google, with a note that
// they come from Google. GitHub autofill uses the PUBLIC GitHub API only
// (https://api.github.com/users/{username}) — it fills bio and shows the
// public repo count; the user reviews before saving. Portfolio fetch:
// if it fails, show "Could not fetch — paste details manually".
// Never scrape LinkedIn.
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Protected } from "@/components/Protected";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { SkeletonList } from "@/components/Skeleton";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [level, setLevel] = useState("");
  const [location, setLocation] = useState("");
  const [keywordsText, setKeywordsText] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [githubInfo, setGithubInfo] = useState("");
  const [portfolioInfo, setPortfolioInfo] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const profile = await api.getProfile();
        setHeadline(profile.headline || "");
        setBio(profile.bio || "");
        setSkillsText((profile.skills || []).join(", "));
        setLevel(profile.level || "");
        setLocation(profile.location || "");
        setKeywordsText((profile.keywords || []).join(", "));
        setLinkedin(profile.linkedin || "");
        setGithub(profile.github || "");
        setPortfolio(profile.portfolio || "");
      } catch {
        // A missing profile is fine: the user simply fills a new one.
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleGithubAutofill() {
    const username = githubUsername.trim();
    if (!username) {
      toast.error("Enter a GitHub username first");
      return;
    }
    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
      if (!res.ok) throw new Error("GitHub user not found");
      const data = await res.json();
      if (data.bio) setBio(data.bio);
      setGithub(`https://github.com/${username}`);
      setGithubInfo(`Public repos: ${data.public_repos ?? "—"}. Review the filled bio before saving.`);
      toast.success("GitHub profile loaded — review before saving");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load that GitHub profile.");
    }
  }

  async function handlePortfolioFetch() {
    const url = portfolio.trim();
    if (!url) {
      toast.error("Enter a portfolio URL first");
      return;
    }
    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error("Fetch failed");
      setPortfolioInfo("Portfolio reached. Copy the details you want into your bio manually.");
    } catch {
      setPortfolioInfo("Could not fetch — paste details manually");
    }
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    try {
      await api.updateProfile({
        headline,
        bio,
        skills: skillsText.split(",").map((s) => s.trim()).filter(Boolean),
        level,
        location,
        keywords: keywordsText.split(",").map((s) => s.trim()).filter(Boolean),
        linkedin,
        github,
        portfolio,
      });
      toast.success("Profile saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the profile.");
    }
  }

  return (
    <Protected>
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6 pb-20 sm:pb-6">
        <h1 className="text-2xl font-extrabold">Profile</h1>
        {loading ? (
          <SkeletonList count={3} />
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <Card>
              <h3 className="mb-3 font-bold">From Google (read-only)</h3>
              <p className="text-sm text-gray-500">Name, photo and email come from your Google account and cannot be edited here.</p>
              <div className="mt-3 flex items-center gap-3">
                {user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user.name || "User"} className="h-12 w-12 rounded-full" />
                ) : null}
                <div>
                  <p className="font-semibold">{user?.name || "—"}</p>
                  <p className="text-sm text-gray-500">{user?.email || "—"}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="space-y-3">
                <div><Label>Headline</Label><Input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Example: Frontend Developer" /></div>
                <div><Label>Bio</Label><Input value={bio} onChange={(e) => setBio(e.target.value)} /></div>
                <div><Label>Skills (comma-separated)</Label><Input value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="React, TypeScript, Tailwind" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Level</Label>
                    <Select value={level} onChange={(e) => setLevel(e.target.value)}>
                      <option value="">Select level</option><option value="junior">Junior</option><option value="mid">Mid</option><option value="senior">Senior</option>
                    </Select>
                  </div>
                  <div><Label>Location</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Example: Dhaka" /></div>
                </div>
                <div><Label>Keywords (comma-separated)</Label><Input value={keywordsText} onChange={(e) => setKeywordsText(e.target.value)} placeholder="Example: React, remote" /></div>
                <div><Label>LinkedIn URL</Label><Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://www.linkedin.com/in/..." /></div>
              </div>
            </Card>
            <Card>
              <h3 className="mb-3 font-bold">GitHub autofill (public API only)</h3>
              <div className="flex flex-wrap gap-2">
                <div className="flex-1"><Label>GitHub username</Label><Input value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} placeholder="Example: nahiyandev" /></div>
                <Button type="button" variant="secondary" onClick={handleGithubAutofill}>Autofill from GitHub</Button>
              </div>
              {githubInfo ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{githubInfo}</p> : null}
              <div className="mt-3"><Label>GitHub URL</Label><Input value={github} onChange={(e) => setGithub(e.target.value)} /></div>
            </Card>
            <Card>
              <h3 className="mb-3 font-bold">Portfolio</h3>
              <div className="flex flex-wrap gap-2">
                <div className="flex-1"><Label>Portfolio URL</Label><Input value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="https://..." /></div>
                <Button type="button" variant="secondary" onClick={handlePortfolioFetch}>Try fetch</Button>
              </div>
              {portfolioInfo ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{portfolioInfo}</p> : null}
            </Card>
            <Button type="submit">Save Profile</Button>
          </form>
        )}
      </main>
      <Footer />
      <BottomNav />
    </Protected>
  );
}
