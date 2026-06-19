"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { DeshVoxLogo } from "@/components/deshvox-logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { Sidebar } from "./sidebar";

export function MobileNav() {
  return (
    <div className="flex items-center justify-between border-b bg-card/80 px-4 py-3 lg:hidden">
      <Link href="/dashboard">
        <DeshVoxLogo />
      </Link>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="h-[90vh] max-w-sm p-0">
          <Sidebar />
        </DialogContent>
      </Dialog>
    </div>
  );
}
