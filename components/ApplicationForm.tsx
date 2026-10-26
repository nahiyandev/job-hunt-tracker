// ApplicationForm.tsx — v3. Add / edit form inside a Dialog.
// Company + Role are required; missing values show a red toast.
// v2 fields kept; v3 adds source, recruiter (name/url/notes), CV version
// and documents (comma-separated links, stored as an array).
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Dialog } from "./ui/dialog";
import { Input, Label } from "./ui/input";
import { Select } from "./ui/select";
import { Button } from "./ui/button";
import type { ApplicationItem, ApplicationStatus } from "@/lib/types";

export interface ApplicationFormValues {
  company: string;
  role: string;
  location: string;
  salary: string;
  status: ApplicationStatus;
  appliedDate: string;
  postingLink: string;
  notes: string;
  source: string;
  recruiterName: string;
  recruiterUrl: string;
  recruiterNotes: string;
  cvVersion: string;
  documents: string[];
  interviewNotes: string;
}

const EMPTY: ApplicationFormValues = {
  company: "",
  role: "",
  location: "",
  salary: "",
  status: "Lead",
  appliedDate: "",
  postingLink: "",
  notes: "",
  source: "",
  recruiterName: "",
  recruiterUrl: "",
  recruiterNotes: "",
  cvVersion: "",
  documents: [],
  interviewNotes: "",
};

const STATUSES: ApplicationStatus[] = ["Saved", "Applied", "Assessment", "Interview", "Offer", "Rejected", "Ghosted", "Lead", "Closed"];

export function ApplicationForm({
  open,
  onClose,
  initial,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  initial: ApplicationItem | null;
  onSubmit: (values: ApplicationFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<ApplicationFormValues>(EMPTY);
  const [documentsText, setDocumentsText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setValues({
        company: initial.company,
        role: initial.role,
        location: initial.location || "",
        salary: initial.salary || "",
        status: initial.status,
        appliedDate: initial.appliedDate ? initial.appliedDate.slice(0, 10) : "",
        postingLink: initial.postingLink || "",
        notes: initial.notes || "",
        source: initial.source || "",
        recruiterName: initial.recruiterName || "",
        recruiterUrl: initial.recruiterUrl || "",
        recruiterNotes: initial.recruiterNotes || "",
        cvVersion: initial.cvVersion || "",
        documents: initial.documents || [],
        interviewNotes: initial.interviewNotes || "",
      });
      setDocumentsText((initial.documents || []).join(", "));
    } else {
      setValues(EMPTY);
      setDocumentsText("");
    }
  }, [initial, open]);

  function set(field: keyof ApplicationFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!values.company.trim() || !values.role.trim()) {
      toast.error("Please fill Company and Role");
      return;
    }
    const documents = documentsText.split(",").map((s) => s.trim()).filter(Boolean);
    setSaving(true);
    try {
      await onSubmit({ ...values, documents });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={initial ? "Edit Application" : "Add Application"}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div><Label>Company *</Label><Input value={values.company} onChange={(e) => set("company", e.target.value)} placeholder="Example: Acme Ltd" /></div>
        <div><Label>Role *</Label><Input value={values.role} onChange={(e) => set("role", e.target.value)} placeholder="Example: Frontend Developer" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Location</Label><Input value={values.location} onChange={(e) => set("location", e.target.value)} /></div>
          <div><Label>Salary</Label><Input value={values.salary} onChange={(e) => set("salary", e.target.value)} placeholder="As written in the posting" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Status</Label>
            <Select value={values.status} onChange={(e) => set("status", e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>
          <div><Label>Applied Date</Label><Input type="date" value={values.appliedDate} onChange={(e) => set("appliedDate", e.target.value)} /></div>
        </div>
        <div><Label>Posting Link</Label><Input value={values.postingLink} onChange={(e) => set("postingLink", e.target.value)} placeholder="https://..." /></div>
        <div><Label>Source</Label><Input value={values.source} onChange={(e) => set("source", e.target.value)} placeholder="Example: LinkedIn, Bdjobs, referral" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Recruiter Name</Label><Input value={values.recruiterName} onChange={(e) => set("recruiterName", e.target.value)} /></div>
          <div><Label>Recruiter Link</Label><Input value={values.recruiterUrl} onChange={(e) => set("recruiterUrl", e.target.value)} placeholder="https://..." /></div>
        </div>
        <div><Label>Recruiter Notes</Label><Input value={values.recruiterNotes} onChange={(e) => set("recruiterNotes", e.target.value)} /></div>
        <div><Label>CV Version</Label><Input value={values.cvVersion} onChange={(e) => set("cvVersion", e.target.value)} placeholder="Example: v2-frontend" /></div>
        <div><Label>Documents (comma-separated links)</Label><Input value={documentsText} onChange={(e) => setDocumentsText(e.target.value)} placeholder="https://..., https://..." /></div>
        <div><Label>Interview Notes</Label><Input value={values.interviewNotes} onChange={(e) => set("interviewNotes", e.target.value)} /></div>
        <div><Label>Notes</Label><Input value={values.notes} onChange={(e) => set("notes", e.target.value)} /></div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
