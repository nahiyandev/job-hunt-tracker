// Skeleton.tsx — v3. Placeholder cards used instead of bare
// "Loading..." text while data loads.
export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800" aria-hidden="true">
      <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-3 h-6 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
