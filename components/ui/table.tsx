// table.tsx — shadcn-style Table primitives.
import React from "react";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">{children}</table>
    </div>
  );
}
export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead><tr className="border-b bg-gray-50 text-left text-gray-500">{children}</tr></thead>;
}
export function TableHeaderCell({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2 font-semibold">{children}</th>;
}
export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="border-b last:border-0 hover:bg-gray-50">{children}</tr>;
}
export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2.5 text-gray-800">{children}</td>;
}
