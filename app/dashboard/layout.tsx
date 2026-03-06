import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CreditsProvider } from "@/components/providers/credits-provider";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      redirect("/login");
    }
  }
  return (
    <CreditsProvider>
      <DashboardShell>
        {children}
      </DashboardShell>
    </CreditsProvider>
  );
}
