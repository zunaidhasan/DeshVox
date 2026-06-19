import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginPanel } from "@/components/auth/login-panel";
import { createClient } from "@/lib/supabase/server";
import { getPendingApprovalMessage } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Login",
  description: "Secure sign in for DeshVox admins and agents."
};

export default async function LoginPage() {
  const supabase = await createClient();

  if (supabase) {
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", userData.user.id).maybeSingle();
      const role = String(profile?.role ?? "").toLowerCase();
      if (profile && ["admin", "agent"].includes(role)) {
        redirect("/dashboard");
      }

      if (userData.user) {
        redirect(`/pending-approval?message=${encodeURIComponent(getPendingApprovalMessage(role))}`);
      }
    }
  }

  return <LoginPanel />;
}