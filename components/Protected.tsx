// Protected.tsx — wrapper for logged-in pages.
// While the session loads, show a spinner. Without a session, go to /login.
// Session persists after refresh because better-auth stores a cookie.
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return <p className="mx-auto max-w-6xl p-8 text-gray-500">Loading...</p>;
  }
  if (!session) {
    return null;
  }
  return <>{children}</>;
}
