"use client";

import { Activity, Bot, Phone, TrendingUp, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ClientChart } from "@/components/client-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { callTrend, metrics } from "@/lib/demo-data";

const icons = [Phone, Users, Activity, Bot];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border bg-card p-6 shadow-sm flag-sheen">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="bg-deshvox-red text-white">Bangladesh AI Call Center</Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-normal sm:text-4xl">DeshVox Command Center</h1>
            <p className="mt-2 max-w-2xl font-bangla text-muted-foreground">
              আপনার ব্যবসার স্মার্ট AI Voice Partner
            </p>
          </div>
          <div className="rounded-lg border bg-background/85 px-4 py-3 text-sm">
            <div className="font-semibold text-primary">Admin · SME Growth Workspace</div>
            <div className="text-muted-foreground">Email, phone and Google auth ready</div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = icons[index];
          return (
            <Card key={metric.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="mt-1 flex items-center gap-1 text-xs text-primary">
                  <TrendingUp className="h-3 w-3" />
                  {metric.delta} this month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>AI Call Handling Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ClientChart className="h-80">
              <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={callTrend}>
                <defs>
                  <linearGradient id="calls" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#008000" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#008000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="calls" stroke="#008000" fill="url(#calls)" strokeWidth={2} />
                <Area type="monotone" dataKey="ai" stroke="#FF0000" fill="transparent" strokeWidth={2} />
              </AreaChart>
              </ResponsiveContainer>
            </ClientChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Operations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["Sales queue", "96% answered", "bg-primary"],
              ["Support queue", "AI resolved 68%", "bg-deshvox-red"],
              ["Campaign dialer", "1,240 contacts ready", "bg-primary"],
              ["IVR health", "All flows active", "bg-primary"]
            ].map(([title, detail, color]) => (
              <div key={title} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <div className="font-medium">{title}</div>
                  <div className="text-sm text-muted-foreground">{detail}</div>
                </div>
                <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
