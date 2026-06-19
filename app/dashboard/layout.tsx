import { MobileNav } from "@/components/dashboard/mobile-nav";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/35">
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
