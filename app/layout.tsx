// layout.tsx — root layout for every page.
// Toasts: top-right, auto-close in 3 seconds, with a progress bar.
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Job Hunt Tracker",
  description: "Track job applications, follow-ups, LinkedIn activity and projects.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </body>
    </html>
  );
}
