// KanbanBoard.tsx — v3. Native HTML5 drag-and-drop only, no library.
// Columns: Saved, Applied, Assessment, Interview, Offer, Rejected, Ghosted.
// Dropping a card calls onStatusChange(app, newStatus). Cards are
// clickable to open the detail view (onSelect).
"use client";

import { useState } from "react";
import type { ApplicationItem, ApplicationStatus } from "@/lib/types";

const COLUMNS: ApplicationStatus[] = ["Saved", "Applied", "Assessment", "Interview", "Offer", "Rejected", "Ghosted"];

const COLUMN_TONE: Record<string, string> = {
  Saved: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
  Applied: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Assessment: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Interview: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
  Offer: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Ghosted: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

export function KanbanBoard({
  applications,
  onStatusChange,
  onSelect,
}: {
  applications: ApplicationItem[];
  onStatusChange: (app: ApplicationItem, status: ApplicationStatus) => void;
  onSelect: (app: ApplicationItem) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropColumn, setDropColumn] = useState<ApplicationStatus | null>(null);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {COLUMNS.map((column) => {
        const cards = applications.filter((app) => app.status === column);
        return (
          <section
            key={column}
            className={`w-64 shrink-0 rounded-2xl border p-3 ${dropColumn === column ? "border-violet-400 bg-violet-50 dark:bg-violet-900/30" : "border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDropColumn(column);
            }}
            onDragLeave={() => setDropColumn(null)}
            onDrop={(e) => {
              e.preventDefault();
              setDropColumn(null);
              const id = dragId || e.dataTransfer.getData("text/plain");
              const app = applications.find((item) => item._id === id);
              if (app && app.status !== column) onStatusChange(app, column);
            }}
          >
            <h3 className="mb-3 flex items-center justify-between font-bold">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${COLUMN_TONE[column]}`}>{column}</span>
              <span className="text-sm text-gray-500">{cards.length}</span>
            </h3>
            <div className="space-y-3">
              {cards.map((app) => (
                <article
                  key={app._id}
                  draggable
                  onDragStart={(e) => {
                    setDragId(app._id);
                    e.dataTransfer.setData("text/plain", app._id);
                  }}
                  onDragEnd={() => {
                    setDragId(null);
                    setDropColumn(null);
                  }}
                  onClick={() => onSelect(app)}
                  className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow dark:border-gray-700 dark:bg-gray-900"
                >
                  <p className="font-semibold">{app.company}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{app.role}</p>
                  {app.location ? <p className="mt-1 text-xs text-gray-500">{app.location}</p> : null}
                </article>
              ))}
              {cards.length === 0 ? <p className="py-4 text-center text-xs text-gray-400">No cards yet — drag one here.</p> : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}
