import Link from "next/link";
import { AlertTriangle, ArrowLeft, MailQuestion, ShieldCheck } from "lucide-react";
import { DeshVoxLogo } from "@/components/deshvox-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PendingApprovalPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,rgba(0,128,0,0.2),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(255,0,0,0.12),transparent_24%),linear-gradient(180deg,#08110b_0%,#050806_100%)] p-6 text-white">
      <Card className="w-full max-w-xl border-white/10 bg-slate-950/90 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
        <CardContent className="p-8">
          <div className="flex items-center justify-between gap-4">
            <DeshVoxLogo />
            <div className="rounded-full border border-deshvox-red/30 bg-deshvox-red/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-deshvox-red">
              Pending Approval
            </div>
          </div>

          <div className="mt-8 flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="rounded-2xl border border-deshvox-red/20 bg-deshvox-red/10 p-3 text-deshvox-red">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Your account is pending approval</h1>
              <p className="mt-3 max-w-lg text-sm leading-7 text-slate-300">
                Your account is pending approval. Contact admin.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
              <div className="flex items-center gap-2 font-semibold text-white"><ShieldCheck className="h-4 w-4 text-deshvox-green" /> Approved roles only</div>
              <p className="mt-2 leading-6">Only admin and agent accounts can enter the dashboard.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
              <div className="flex items-center gap-2 font-semibold text-white"><MailQuestion className="h-4 w-4 text-deshvox-green" /> Need access?</div>
              <p className="mt-2 leading-6">Ask your workspace admin to assign the correct role in Supabase.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="bg-deshvox-green text-white hover:bg-deshvox-green/90">
              <Link href="/login">Return to Login</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to landing
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
