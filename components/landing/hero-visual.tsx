"use client";

import { motion } from "framer-motion";
import { Activity, Bot, PhoneCall, ShieldCheck, Sparkles, Waves } from "lucide-react";

const floatingStats = [
  { label: "Live calls", value: "1.2k", icon: PhoneCall, tone: "text-deshvox-green" },
  { label: "AI accuracy", value: "98.4%", icon: Bot, tone: "text-deshvox-red" },
  { label: "Uptime", value: "99.95%", icon: ShieldCheck, tone: "text-deshvox-green" }
];

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[620px]">
      <motion.div
        className="absolute -left-6 top-12 h-32 w-32 rounded-full bg-deshvox-green/15 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-4 top-4 h-28 w-28 rounded-full bg-deshvox-red/15 blur-3xl"
        animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative rounded-[2rem] border border-white/10 bg-slate-950/75 p-4 shadow-[0_25px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(0,128,0,0.18),transparent_35%),linear-gradient(145deg,rgba(255,255,255,0.04),transparent_40%)]" />
        <div className="relative grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <motion.div
            className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="inline-flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-deshvox-green" /> DeshVox Command Center</span>
              <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.28em]">Bangladesh</span>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-300"><Activity className="h-4 w-4 text-deshvox-green" /> AI Reception Desk</div>
                <div className="mt-4 space-y-2">
                  <div className="h-2 rounded-full bg-deshvox-green/70" />
                  <div className="h-2 w-5/6 rounded-full bg-white/10" />
                  <div className="h-2 w-2/3 rounded-full bg-white/10" />
                </div>
                <div className="mt-4 rounded-xl border border-deshvox-green/20 bg-deshvox-green/10 p-3 text-sm text-slate-200">
                  Incoming lead routed to Sales in 3.2 seconds.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-300"><Waves className="h-4 w-4 text-deshvox-red" /> Live analytics</div>
                <div className="mt-4 flex h-40 items-end gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                  {[38, 72, 55, 92, 66, 84, 58].map((height, index) => (
                    <motion.div
                      key={index}
                      className={`w-full rounded-t-md ${index % 2 === 0 ? "bg-deshvox-green" : "bg-deshvox-red"}`}
                      initial={{ height: 12 }}
                      animate={{ height }}
                      transition={{ duration: 0.8, delay: index * 0.08 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4">
            <motion.div
              className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-4"
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.75, ease: "easeOut", delay: 0.1 }}
            >
              <div className="rounded-[1.25rem] border border-white/10 bg-black/35 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Mobile</span>
                  <span className="rounded-full bg-deshvox-green/15 px-2 py-1 text-deshvox-green">AI Ready</span>
                </div>
                <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-slate-950 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-200"><PhoneCall className="h-4 w-4 text-deshvox-green" /> +880 1700 000000</div>
                  <div className="mt-4 space-y-3">
                    <div className="h-10 rounded-xl bg-white/5" />
                    <div className="h-10 rounded-xl bg-white/5" />
                    <div className="h-10 rounded-xl bg-deshvox-red/15" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4"
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.75, ease: "easeOut", delay: 0.18 }}
            >
              <div className="text-sm text-slate-300">Business signal</div>
              <div className="mt-3 grid gap-3">
                {floatingStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 px-3 py-3">
                      <div className="flex items-center gap-2 text-sm text-slate-300"><Icon className={`h-4 w-4 ${stat.tone}`} /> {stat.label}</div>
                      <div className={`text-lg font-semibold ${stat.tone}`}>{stat.value}</div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}