"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Chrome, ArrowLeft, Loader2, LockKeyhole, Mail, UserPlus, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeshVoxLogo } from "@/components/deshvox-logo";
import { createClient } from "@/lib/supabase/client";
import { getFriendlyAuthErrorMessage } from "@/lib/supabase/auth";

export function LoginPanel() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("Use your Supabase-backed workspace account.");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "signup" && password !== confirmPassword) {
      setNotice("Passwords do not match.");
      return;
    }

    setLoading(true);
    setNotice(mode === "signin" ? "Signing in..." : "Creating your account...");

    try {
      const supabase = createClient();
      if (!supabase) {
        setNotice("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable Supabase auth.");
        return;
      }

      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setNotice(getFriendlyAuthErrorMessage(error));
          return;
        }

        router.replace("/dashboard");
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        setNotice(getFriendlyAuthErrorMessage(error));
        return;
      }

      if (data.session) {
        setNotice("Create your DeshVox Account complete. Your access is pending approval until an admin assigns a role.");
      } else {
        setNotice("Create your DeshVox Account complete. Check your email to verify the account and wait for approval.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    const supabase = createClient();
    if (!supabase) {
      setNotice("Set Supabase auth keys to enable Google sign-in.");
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      setNotice(getFriendlyAuthErrorMessage(error));
    }
  }

  async function sendResetLink() {
    const supabase = createClient();
    if (!supabase) {
      setNotice("Configure Supabase to send password reset links.");
      return;
    }

    if (!email) {
      setNotice("Enter your email first, then request a reset link.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`
    });
    setNotice(error ? error.message : "Password reset email sent.");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative flex items-center justify-center overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(0,128,0,0.22),transparent_30%),linear-gradient(180deg,#08110b_0%,#050806_100%)] p-6 lg:border-b-0 lg:border-r">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-25" />
        <motion.div className="relative max-w-lg" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" /> Back to landing page
          </Link>
          <div className="mt-8">
            <DeshVoxLogo />
          </div>
          <h1 className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-5xl">Secure access for the DeshVox control room</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
            Sign in with email, password, or Google to reach the dashboard, AI receptionist demo, campaign tools, and reseller workspace.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white">Role-based access</div>
              <p className="mt-2 text-sm text-slate-400">Only approved admin and agent profiles can enter the dashboard.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white">Bangladesh-ready</div>
              <p className="mt-2 text-sm text-slate-400">Built for voice operations, SMS campaigns, and AI-assisted customer care.</p>
            </div>
          </div>
        </motion.div>
      </section>
      <section className="flex items-center justify-center p-6">
        <motion.div className="w-full max-w-lg" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
          <Card className="border-white/10 bg-slate-950/85 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
            <CardHeader className="space-y-3 pb-2">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-sm">
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 transition ${
                    mode === "signin" ? "bg-deshvox-green text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 transition ${
                    mode === "signup" ? "bg-deshvox-green text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  Register
                </button>
              </div>
              <CardTitle className="text-2xl text-white">
                {mode === "signin" ? "Sign in to DeshVox" : "Create your DeshVox Account"}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {mode === "signin"
                  ? "Use your DeshVox account to continue."
                  : "Sign up for free and start automating your business communication."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label className="text-slate-200">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                    <Input className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-500" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@deshvox.com" autoComplete="email" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">Password</Label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                    <Input className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-500" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required />
                  </div>
                </div>
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label className="text-slate-200">Confirm Password</Label>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                      <Input
                        className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-500"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        required
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 text-sm">
                  <button type="button" onClick={sendResetLink} className="text-deshvox-green transition hover:text-deshvox-red">
                    Forgot Password?
                  </button>
                  <Link href="/" className="text-slate-400 transition hover:text-white">Landing Page</Link>
                </div>
                <Button className="h-11 w-full bg-deshvox-green text-white hover:bg-deshvox-green/90" type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {mode === "signin" ? "Sign in to Dashboard" : "Create your DeshVox Account"}
                </Button>
              </form>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                <div className="relative flex justify-center text-xs uppercase tracking-[0.3em] text-slate-500"><span className="bg-slate-950 px-3">or</span></div>
              </div>
              <Button variant="outline" className="h-11 w-full gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={signInWithGoogle} type="button">
                <Chrome className="h-4 w-4" /> Continue with Google
              </Button>
              {mode === "signup" && (
                <p className="text-sm leading-6 text-slate-400">
                  New registrations create a Supabase auth account. Dashboard access is granted only after an admin assigns an admin or agent profile.
                </p>
              )}
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{mode === "signin" ? "No account yet?" : "Already registered?"}</span>
                <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-deshvox-green transition hover:text-deshvox-red">
                  {mode === "signin" ? "Sign up" : "Sign in"}
                </button>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">{notice}</div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}