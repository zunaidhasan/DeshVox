import { redirect } from "next/navigation";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  if (!supabase) {
    redirect("/login");
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userData.user.id).maybeSingle();

  if (!profile || !["ADMIN", "AGENT"].includes(String(profile.role))) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(0,128,0,0.08),transparent_30%),linear-gradient(180deg,#08110b_0%,#050806_100%)]">
      <MobileNav />
      <div className="mx-auto grid min-h-screen w-full grid-cols-1 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
