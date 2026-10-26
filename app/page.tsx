// page.tsx — the site root just sends visitors to the dashboard.
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/dashboard");
}
