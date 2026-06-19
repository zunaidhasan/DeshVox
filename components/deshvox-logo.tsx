import { PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeshVoxLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative grid h-10 w-10 place-items-center rounded-lg bg-deshvox-green text-white shadow-soft">
        <span className="absolute right-1.5 top-1.5 h-3 w-3 rounded-full bg-deshvox-red" />
        <PhoneCall className="h-5 w-5" />
      </div>
      <div>
        <div className="text-lg font-bold leading-none tracking-normal">DeshVox</div>
        <div className="font-bangla text-xs text-muted-foreground">আপনার ব্যবসার স্মার্ট AI Voice Partner</div>
      </div>
    </div>
  );
}
