import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginPanel } from "@/components/auth/login-panel";
import { createClient } from "@/lib/supabase/server";

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
      if (profile && ["ADMIN", "AGENT"].includes(String(profile.role))) {
        redirect("/dashboard");
      }
    }
  }

  return <LoginPanel />;
}