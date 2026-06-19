"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  GitBranch,
  Home,
  Megaphone,
  Moon,
  PhoneCall,
  PhoneForwarded,
  Sun
} from "lucide-react";
import { useTheme } from "next-themes";
import { DeshVoxLogo } from "@/components/deshvox-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/extensions", label: "Extensions", icon: PhoneForwarded },
  { href: "/dashboard/live-call", label: "Live Call", icon: PhoneCall },
  { href: "/dashboard/ai-receptionist", label: "AI Receptionist Demo", icon: Bot },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/dashboard/ivr-builder", label: "IVR Builder", icon: GitBranch },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 }
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="flex h-full flex-col border-r bg-card/80 px-4 py-5 backdrop-blur">
      <DeshVoxLogo />
      <nav className="mt-8 grid gap-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-lg border bg-background p-3">
        <div className="text-sm font-semibold">Role</div>
        <div className="mt-1 text-xs text-muted-foreground">Admin workspace · Dhaka tenant</div>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full justify-start gap-2"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="hidden h-4 w-4 dark:block" />
          Toggle theme
        </Button>
      </div>
    </aside>
  );
}
