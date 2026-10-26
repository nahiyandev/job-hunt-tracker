// badge.tsx — small coloured label, used for statuses everywhere.
import React from "react";

export function Badge({ tone = "gray", children }: { tone?: "green" | "yellow" | "red" | "gray" | "orange" | "purple"; children: React.ReactNode }) {
  const tones: Record<string, string> = {
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
    gray: "bg-gray-100 text-gray-700",
    orange: "bg-orange-100 text-orange-800",
    purple: "bg-violet-100 text-violet-800",
  };
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}
