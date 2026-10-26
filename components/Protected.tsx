// Protected.tsx — v3 wrapper for logged-in pages.
// While the session loads, show skeleton placeholders (not bare
// "Loading..." text). Without a session, go to /login.
// Session persists after refresh because better-auth stores a cookie.
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { SkeletonList } from "./Skeleton";

export function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="mx-auto max-w-6xl p-8">
        <SkeletonList count={3} />
      </div>
    );
  }
  if (!session) {
    return null;
  }
  return <>{children}</>;
}
