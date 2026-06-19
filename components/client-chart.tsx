"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ClientChart({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={cn("min-h-72 w-full", className)}>
      {mounted ? children : <div className="h-full min-h-72 rounded-md bg-muted/50" />}
    </div>
  );
}
