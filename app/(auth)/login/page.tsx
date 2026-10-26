// login/page.tsx — simple, beautiful login page: app name,
// orange-purple gradient, one "Continue with Google" button.
"use client";

import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  async function handleGoogleLogin() {
    // Do NOT show a success toast here: a real Google login redirects away
    // to Google, so showing "Logged in successfully" before that would be
    // a false success (this happened when the backend was down).
    // No localhost guard here: the auth client falls back to the deployed
    // server URL (https://job-hunt-tracker-server.vercel.app) when
    // NEXT_PUBLIC_API_URL is not set, so login works from Vercel directly.
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/dashboard`,
      });
      if (result?.error) {
        toast.error(result.error.message || "Google login failed. Check the server .env keys and that the server is running on port 5000.");
      }
      // On success better-auth redirects to Google, so no toast here.
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Google login failed. Check server .env keys.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-500 via-orange-400 to-violet-600 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
        <h1 className="bg-gradient-to-r from-orange-600 to-violet-600 bg-clip-text text-3xl font-extrabold text-transparent">
          Job Hunt Tracker
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Track applications, follow-ups, LinkedIn activity and projects — in one beautiful dashboard.
        </p>
        <div className="mt-6">
          <Button variant="primary" className="w-full py-3 text-base" onClick={handleGoogleLogin}>
            Continue with Google
          </Button>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          Sign-in is Google only. Your tracker is private to you.
        </p>
      </div>
    </main>
  );
}
