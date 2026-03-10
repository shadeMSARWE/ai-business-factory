import { redirect } from "next/navigation";

export default function ChatRedirectPage() {
  // AI Chat feature has been removed; redirect users back to the main dashboard.
  redirect("/dashboard");
}
