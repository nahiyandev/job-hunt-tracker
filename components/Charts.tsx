// Charts.tsx — v3. Live Recharts charts, fed only by dashboard API data.
// Pie: application status. Bar: LinkedIn comments per day.
// v3: every chart has a legend AND labels, so colours are never a mystery.
"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card } from "./ui/card";
import type { DashboardSummary } from "@/lib/types";

const PIE_COLORS = ["#16A34A", "#EAB308", "#DC2626", "#7C3AED", "#EA580C", "#0EA5E9", "#6B7280"];

export function Charts({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <h3 className="mb-1 font-bold">Application Status</h3>
        <p className="mb-3 text-xs text-gray-500">Each slice is labelled with its status and count. Legend below the chart.</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={summary.statusChart} dataKey="value" nameKey="name" outerRadius={80} label>
                {summary.statusChart.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="mb-1 font-bold">LinkedIn Comments per Day</h3>
        <p className="mb-3 text-xs text-gray-500">Bars show comments per day; posts are shown in the tooltip.</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary.linkedinChart}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="comments" name="Comments" fill="#7C3AED" radius={[6, 6, 0, 0]} />
              <Bar dataKey="posts" name="Posts" fill="#EA580C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
