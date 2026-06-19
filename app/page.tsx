import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight, Database, Globe2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { DeshVoxLogo } from "@/components/deshvox-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AutomationDiagram } from "@/components/landing/automation-diagram";
import { HeroVisual } from "@/components/landing/hero-visual";
import { createClient } from "@/lib/supabase/server";

const menuItems = ["Call Center", "Service", "Packages", "Company", "Partners"];
const clientLogos = ["Apex Telecom", "BanglaMart", "North Star", "Dhaka Health", "Pulse Commerce", "Bikreta Pro"];

const scaleCards = [
  {
    title: "For Businesses",
    description: "Unify sales, support, reminders, and customer service in one AI-powered command center.",
    icon: Users,
    points: ["IVR automation", "Smart agent routing", "CRM-ready call logs"]
  },
  {
    title: "For Resellers",
    description: "Package, brand, and launch premium communication infrastructure for your own customer base.",
    icon: Globe2,
    points: ["White-label delivery", "Multi-tenant control", "Recurring revenue"]
  },
  {
    title: "For Providers",
    description: "Deploy a dependable AI PBX stack with compliance, analytics, and scalable integrations.",
    icon: Database,
    points: ["API-first platform", "Compliance visibility", "Growth analytics"]
  }
];

const faqItems = [
  ["What is DeshVox?", "DeshVox is an omnichannel AI PBX ecosystem for Bangladesh that combines voice, marketing, analytics, and automation."],
  ["Can it support both Bangla and English?", "Yes. DeshVox is designed for Bangla-first operations and English fallback across voice and UI flows."],
  ["Does it include AI receptionist features?", "Yes. The platform includes AI receptionist demos, routing, lead capture, and live call handoff patterns."],
  ["Can I build IVR without coding?", "Yes. The IVR builder lets teams design call journeys visually and expand them with business logic."],
  ["Is there support for outbound campaigns?", "Yes. Bulk voice and campaign automation are part of the core product experience."],
  ["How does role-based access work?", "Supabase Auth checks the signed-in user and only allows profiles with admin and agent roles into the dashboard."],
  ["Can I white-label this for my business?", "The reseller experience is designed for branding, tenant separation, and partner growth."],
  ["Is the platform mobile friendly?", "Yes. The landing experience and dashboard sections are responsive and optimized for smaller screens."],
  ["Does DeshVox integrate with real telephony?", "The app is structured for voice APIs, SIP/PSTN handoff, and call session workflows."],
  ["How do I get started?", "Use Free Trial or Try Demo to review the AI receptionist flow, then log in with your workspace account."]
];

export const metadata: Metadata = {
  title: "The Omnichannel AI PBX Ecosystem for Bangladesh",
  description: "DeshVox brings AI voice, automated marketing, and complete business communication tools to Bangladesh."
};

export default async function Home() {
  const supabase = await createClient();
  const { data: userData } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const isLoggedIn = Boolean(userData.user);

  return (
    <main className="overflow-hidden text-white">
      <section className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <DeshVoxLogo />
          <nav className="hidden items-center gap-7 text-sm text-slate-300 lg:flex">
            {menuItems.map((item) => (
              <Link key={item} href="#" className="transition hover:text-white">{item}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-300 sm:inline-flex">EN</div>
            {isLoggedIn ? (
              <Button asChild className="bg-deshvox-green text-white hover:bg-deshvox-green/90"><Link href="/dashboard">Go to Dashboard</Link></Button>
            ) : (
              <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10"><Link href="/login">Login</Link></Button>
            )}
            <Button asChild className="bg-deshvox-red text-white hover:bg-deshvox-red/90"><Link href="/login">Free Trial</Link></Button>
          </div>
        </div>
      </section>

      <section className="relative border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(0,128,0,0.2),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(255,0,0,0.13),transparent_24%),linear-gradient(180deg,#08110b_0%,#050806_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-deshvox-green" /> Bangladesh-first AI infrastructure
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">The Omnichannel AI PBX Ecosystem for Bangladesh</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">Smart AI Voice, Automated Marketing &amp; Complete Business Communication Platform</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-deshvox-green text-white hover:bg-deshvox-green/90"><Link href="/login" className="gap-2">Deploy Infrastructure <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10"><Link href="/login" className="gap-2">Become a Reseller <ChevronRight className="h-4 w-4" /></Link></Button>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ["AI reception", "Bangla and English call handling"],
                ["Campaign automation", "Voice, SMS, and follow-up orchestration"],
                ["Role security", "Admin and agent access control"]
              ].map(([title, copy]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white"><ShieldCheck className="h-4 w-4 text-deshvox-green" /> {title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex items-center"><HeroVisual /></div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-slate-950/90 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.32em] text-deshvox-green">Complete business automation</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Built to automate every step of the call journey</h2>
          </div>
          <div className="mt-10"><AutomationDiagram /></div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#07100b] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Trusted by growing teams</p>
              <h2 className="mt-3 text-3xl font-bold text-white">Client logos</h2>
            </div>
            <p className="max-w-xl text-sm text-slate-400">Placeholder logos are ready to be replaced with partner and client brands.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {clientLogos.map((logo) => (
              <div key={logo} className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-8 text-sm font-medium text-slate-200">{logo}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.32em] text-deshvox-red">Built for every scale</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">One platform for businesses, resellers, and providers</h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {scaleCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.title} className="border-white/10 bg-white/[0.03] text-white shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-deshvox-green"><Icon className="h-5 w-5" /></div>
                    <CardTitle className="pt-2 text-2xl text-white">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-slate-400">{card.description}</p>
                    <div className="mt-5 space-y-2">
                      {card.points.map((point) => (
                        <div key={point} className="flex items-center gap-2 text-sm text-slate-200"><CheckCircle2 className="h-4 w-4 text-deshvox-green" /> {point}</div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#06100a] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-deshvox-green">Integrate native voice</p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Bring voice automation into your product stack</h2>
              <p className="mt-4 text-slate-400">Use DeshVox voice workflows with your app, CRM, or reseller portal and keep telemetry, routing, and compliance in one place.</p>
            </div>
            <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-slate-950/90">
              <div className="border-b border-white/10 px-5 py-3 text-sm text-slate-400">deshvox.voice.ts</div>
              <pre className="overflow-x-auto p-5 text-sm leading-7 text-slate-200">{`export async function startVoiceSession(customerId: string) {
  const session = await fetch("/api/calls/live/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId, channel: "voice" })
  });

  if (!session.ok) throw new Error("Unable to start voice session");

  return session.json();
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Frequently asked questions</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Everything buyers usually ask before they deploy</h2>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {faqItems.map(([question, answer]) => (
              <details key={question} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <summary className="cursor-pointer list-none text-base font-semibold text-white">{question}</summary>
                <p className="mt-3 text-sm leading-7 text-slate-400">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="fixed bottom-5 right-5 z-50">
        <Button asChild size="lg" className="rounded-full bg-deshvox-red px-5 text-white shadow-[0_16px_50px_rgba(255,0,0,0.28)] hover:bg-deshvox-red/90"><Link href={isLoggedIn ? "/dashboard/ai-receptionist" : "/login"}>Try Demo</Link></Button>
      </div>
    </main>
  );
}