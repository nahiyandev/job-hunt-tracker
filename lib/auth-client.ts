// auth-client.ts — better-auth client for the browser.
// baseURL is the BACKEND origin (from NEXT_PUBLIC_API_URL in Vercel,
// otherwise the deployed server URL below — NOT localhost).
// Auth endpoints live under /api/auth on the backend, and the session
// cookie is shared with API calls because api.ts sends credentials: "include".
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://job-hunt-tracker-server.vercel.app",
});

export const { useSession, signIn, signOut } = authClient;
