import { createClient } from "@/lib/supabase/server";
import { AuthProvider } from "@/components/providers/auth-provider";

export async function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  let initialSession = null;
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    initialSession = data.session;
  }
  return <AuthProvider initialSession={initialSession}>{children}</AuthProvider>;
}
