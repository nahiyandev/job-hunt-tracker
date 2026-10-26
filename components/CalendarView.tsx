// CalendarView.tsx — v3. Month grid showing follow-up due dates
// and applied dates. Clicking a day lists that day's items below.
// Dates are shown with lib/date.ts format.
"use client";

import { useMemo, useState } from "react";
import { formatDate } from "@/lib/date";
import type { ApplicationItem, FollowupItem } from "@/lib/types";
import { Button } from "./ui/button";

export function CalendarView({
  applications,
  followups,
  onSelectApplication,
}: {
  applications: ApplicationItem[];
  followups: FollowupItem[];
  onSelectApplication?: (app: ApplicationItem) => void;
}) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();

  function itemsForDay(day: number) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dues = followups.filter((f) => f.dueDate.slice(0, 10) === key);
    const applied = applications.filter((a) => a.appliedDate && a.appliedDate.slice(0, 10) === key);
    return { dues, applied };
  }

  const selected = selectedDay === null ? { dues: [], applied: [] } : itemsForDay(selectedDay);
  const monthLabel = firstDay.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  function shift(delta: number) {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
    setSelectedDay(null);
  }

  const cells = useMemo(() => {
    const out: (number | null)[] = [];
    for (let i = 0; i < leadingBlanks; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(d);
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" onClick={() => shift(-1)}>← Previous</Button>
        <h3 className="font-bold">{monthLabel}</h3>
        <Button variant="outline" onClick={() => shift(1)}>Next →</Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`blank-${i}`} />;
          const { dues, applied } = itemsForDay(day);
          const has = dues.length + applied.length > 0;
          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`rounded-xl border p-2 text-left ${selectedDay === day ? "border-violet-500 bg-violet-50 dark:bg-violet-900/40" : "border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-900"} ${has ? "font-bold" : ""}`}
            >
              <span>{day}</span>
              {dues.length > 0 ? <span className="mt-1 block rounded bg-orange-100 px-1 text-[10px] text-orange-800">{dues.length} follow-up</span> : null}
              {applied.length > 0 ? <span className="mt-1 block rounded bg-green-100 px-1 text-[10px] text-green-800">{applied.length} applied</span> : null}
            </button>
          );
        })}
      </div>
      {selectedDay !== null ? (
        <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <h4 className="font-bold">
            {formatDate(`${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`)}
          </h4>
          {selected.dues.length === 0 && selected.applied.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">Nothing on this day.</p>
          ) : (
            <>
              {selected.dues.map((f) => (
                <p key={f._id} className="mt-2 text-sm">⏰ Follow-up #{f.followupNumber} — {f.company} ({f.status})</p>
              ))}
              {selected.applied.map((a) => (
                <p key={a._id} className="mt-2 text-sm">
                  📝 Applied — {a.company} · {a.role}
                  {onSelectApplication ? (
                    <button type="button" onClick={() => onSelectApplication(a)} className="ml-2 text-violet-700 underline">View</button>
                  ) : null}
                </p>
              ))}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
