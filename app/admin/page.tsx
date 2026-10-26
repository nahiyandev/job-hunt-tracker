// admin/page.tsx — v3. The admin route (/admin).
// v3: role 'user' sees ONLY an access-denied card — no user list, no role controls, no admin controls. Server already rejects; this is UI only. Plus Footer + skeleton + lib/date.ts.
// Tabs: Users and Keywords/Sources. Admins have full access here;
// moderators can view users and manage keywords, but the backend blocks
// them from changing roles or disabling users (those buttons are also
// hidden for moderators). Nobody here can see private tracker data:
// the backend admin routes never return applications, notes or follow-ups.
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Protected } from "@/components/Protected";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { Footer } from "@/components/Footer";
import { SkeletonList } from "@/components/Skeleton";
import { formatDate } from "@/lib/date";
import { authClient } from "@/lib/auth-client";
import type { KeywordItem, PublicUser } from "@/lib/types";

export default function AdminPage() {
  const { data: session } = authClient.useSession();
  const myRole = (session?.user as unknown as { role?: string } | undefined)?.role;
  const isAdmin = myRole === "admin";

  const [tab, setTab] = useState<"users" | "keywords">("users");
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [denied, setDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState("");
  const [newType, setNewType] = useState<"keyword" | "source">("keyword");

  async function loadAll() {
    try {
      const [userData, keywordData] = await Promise.all([api.getAdminUsers(), api.getKeywords()]);
      setUsers(userData);
      setKeywords(keywordData);
      setDenied(false);
    } catch (error) {
      setDenied(true);
      toast.error(error instanceof Error ? error.message : "Admin access only.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleRole(userId: string, role: string) {
    try {
      await api.setUserRole(userId, role);
      toast.success("Role updated successfully");
      await loadAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not change the role.");
    }
  }

  async function handleStatus(userId: string, status: string) {
    try {
      await api.setUserStatus(userId, status);
      toast.success("User status updated successfully");
      await loadAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not change the status.");
    }
  }

  async function handleAddKeyword(event: React.FormEvent) {
    event.preventDefault();
    if (!newText.trim()) {
      toast.error("Please fill the keyword or source text");
      return;
    }
    try {
      await api.createKeyword({ text: newText, type: newType });
      toast.success("Keyword added successfully");
      setNewText("");
      await loadAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the keyword.");
    }
  }

  async function handleKeywordStatus(id: string, status: string) {
    try {
      await api.updateKeyword(id, { status });
      toast.success("Keyword status updated");
      await loadAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the keyword.");
    }
  }

  async function handleDeleteKeyword(id: string) {
    try {
      await api.deleteKeyword(id);
      toast.success("Keyword deleted successfully");
      await loadAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete the keyword.");
    }
  }

  return (
    <Protected>
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <h1 className="text-2xl font-extrabold">Admin</h1>
        <p className="text-sm text-gray-500">
          Admins have full access. Moderators can view users and manage keywords/sources, but cannot change roles,
          enable/disable users, or see any user&apos;s private tracker data.
        </p>
        {myRole === "user" ? (
          <Card>
            <h3 className="font-bold">Access denied</h3>
            <p className="mt-2 text-gray-700">This page is for admins and moderators only. Your tracker data is private and is not shown here.</p>
          </Card>
        ) : loading ? (
          <SkeletonList count={3} />
        ) : denied ? (
          <Card><p className="text-gray-700">Admin or moderator access only. If you are the owner, follow the first-admin steps in README.md.</p></Card>
        ) : (
          <>
            <div className="flex gap-2">
              <Button variant={tab === "users" ? "secondary" : "outline"} onClick={() => setTab("users")}>Users</Button>
              <Button variant={tab === "keywords" ? "secondary" : "outline"} onClick={() => setTab("keywords")}>Keywords / Sources</Button>
            </div>
            {tab === "users" ? (
              <Card>
                {users.length === 0 ? <p className="text-gray-500">No users yet.</p> : (
                  <ul className="divide-y">
                    {users.map((user) => (
                      <li key={user.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.image} alt={user.name} className="h-9 w-9 rounded-full" />
                          ) : null}
                          <div>
                            <p className="font-semibold">{user.name || "(no name)"} <Badge tone={user.role === "admin" ? "purple" : user.role === "moderator" ? "orange" : "gray"}>{user.role}</Badge> {user.status === "disabled" ? <Badge tone="red">disabled</Badge> : null}</p>
                            <p className="text-sm text-gray-500">{user.email} · Joined {formatDate(user.createdAt)}</p>
                          </div>
                        </div>
                        {isAdmin ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <Select value={user.role} onChange={(e) => handleRole(user.id, e.target.value)}>
                              <option value="user">user</option>
                              <option value="moderator">moderator</option>
                              <option value="admin">admin</option>
                            </Select>
                            {user.status === "active" ? (
                              <Button variant="danger" onClick={() => handleStatus(user.id, "disabled")}>Disable</Button>
                            ) : (
                              <Button variant="secondary" onClick={() => handleStatus(user.id, "active")}>Enable</Button>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">Moderator: view only</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            ) : (
              <div className="space-y-4">
                <Card>
                  <form onSubmit={handleAddKeyword} className="flex flex-wrap items-end gap-3">
                    <div className="flex-1 min-w-[220px]"><Label>Keyword or source</Label><Input value={newText} onChange={(e) => setNewText(e.target.value)} /></div>
                    <Select value={newType} onChange={(e) => setNewType(e.target.value as "keyword" | "source")}>
                      <option value="keyword">keyword</option>
                      <option value="source">source</option>
                    </Select>
                    <Button type="submit">Add</Button>
                  </form>
                </Card>
                <Card>
                  {keywords.length === 0 ? <p className="text-gray-500">No keywords or sources yet.</p> : (
                    <ul className="divide-y">
                      {keywords.map((item) => (
                        <li key={item._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                          <p className="font-medium">{item.text} <Badge tone={item.status === "approved" ? "green" : item.status === "rejected" ? "red" : "gray"}>{item.status}</Badge> <span className="text-sm text-gray-400">({item.type})</span></p>
                          <div className="flex gap-1">
                            <Button variant="secondary" onClick={() => handleKeywordStatus(item._id, "approved")}>Approve</Button>
                            <Button variant="outline" onClick={() => handleKeywordStatus(item._id, "rejected")}>Reject</Button>
                            {isAdmin ? <Button variant="danger" onClick={() => handleDeleteKeyword(item._id)}>Delete</Button> : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </Protected>
  );
}
