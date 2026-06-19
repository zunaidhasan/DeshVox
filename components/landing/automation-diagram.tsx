"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock3, Headphones, Inbox, Mail, Mic2, ShoppingBag, Sparkles, ShieldCheck, Wand2 } from "lucide-react";

const nodes = [
  { title: "Inbound Call", icon: PhoneNode, tone: "from-deshvox-green/20 to-deshvox-green/5" },
  { title: "AI Intent Detection", icon: Sparkles, tone: "from-white/10 to-white/[0.03]" },
  { title: "Order Verification", icon: ShieldCheck, tone: "from-deshvox-red/20 to-deshvox-red/5" },
  { title: "Route to Team", icon: Headphones, tone: "from-white/10 to-white/[0.03]" }
];

const verificationSteps = [
  "Invoice ID confirmed",
  "Customer name matched",
  "Delivery address verified",
  "OTP approval captured",
  "CRM note logged"
];

function PhoneNode() {
  return <Mic2 className="h-4 w-4" />;
}

export function AutomationDiagram() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <motion.div
        className="rounded-[1.6rem] border border-white/10 bg-slate-950/75 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.4)]"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.65 }}
      >
        <div className="flex items-center gap-2 text-sm text-slate-300"><Wand2 className="h-4 w-4 text-deshvox-green" /> Inbound & Outbound Flow Builder</div>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            return (
              <div key={node.title} className="relative">
                {index < nodes.length - 1 && (
                  <ArrowRight className="absolute -right-6 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-white/30 md:block" />
                )}
                <motion.div
                  className={`h-full rounded-2xl border border-white/10 bg-gradient-to-br ${node.tone} p-4`}
                  whileHover={{ y: -3 }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-deshvox-green">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="mt-4 text-sm font-semibold text-white">{node.title}</div>
                  <div className="mt-2 text-xs leading-5 text-slate-400">
                    {index === 0 && "Detect caller source, language, and priority."}
                    {index === 1 && "Route with AI prompts, queues, and intent rules."}
                    {index === 2 && "Verify purchase details before agent handoff."}
                    {index === 3 && "Transfer to sales, support, or backend teams."}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-300"><Inbox className="h-4 w-4 text-deshvox-green" /> Inbound</div>
            <div className="mt-2 text-xs text-slate-400">IVR, WhatsApp, web chat, or voice call.</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-300"><Mail className="h-4 w-4 text-deshvox-red" /> Outbound</div>
            <div className="mt-2 text-xs text-slate-400">Campaigns, collections, alerts, and follow-ups.</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-300"><Clock3 className="h-4 w-4 text-deshvox-green" /> SLA logic</div>
            <div className="mt-2 text-xs text-slate-400">Queue routing, fallback, and escalation timers.</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="rounded-[1.6rem] border border-white/10 bg-slate-950/75 p-5"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, delay: 0.05 }}
      >
        <div className="flex items-center gap-2 text-sm text-slate-300"><ShoppingBag className="h-4 w-4 text-deshvox-red" /> AI Auto Order Verification</div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/35 p-4">
          <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Order #DV-2048</div>
          <div className="mt-3 text-lg font-semibold text-white">Customer intent confirmed</div>
          <div className="mt-2 text-sm text-slate-400">The AI validates order details before the call is routed to a human agent.</div>
          <div className="mt-4 space-y-2">
            {verificationSteps.map((step) => (
              <div key={step} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-deshvox-green" />
                {step}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-deshvox-green/20 bg-deshvox-green/10 p-4 text-sm text-slate-200">
          Business outcome: fewer manual calls, faster confirmations, and cleaner CRM data.
        </div>
      </motion.div>
    </div>
  );
}