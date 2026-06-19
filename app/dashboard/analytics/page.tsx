"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Download, FileText, TrendingUp } from "lucide-react";
import { ClientChart } from "@/components/client-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { callTrend, leadSources } from "@/lib/demo-data";
import { toCsv } from "@/lib/utils";

const campaigns = [
  { name: "Eid Offer Voice Blast", sent: 12400, leads: 682, conversion: "5.5%" },
  { name: "B2B SaaS Demo", sent: 4200, leads: 391, conversion: "9.3%" },
  { name: "Support Renewal", sent: 2100, leads: 188, conversion: "9.0%" }
];

const sentiment = [
  { label: "Positive", value: 64, color: "#008000" },
  { label: "Neutral", value: 24, color: "#94a3b8" },
  { label: "Negative", value: 12, color: "#FF0000" }
];

export default function AnalyticsPage() {
  function exportCsv() {
    const blob = new Blob([toCsv(campaigns)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "deshvox-campaigns.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    window.print();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-normal">Analytics Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Executive reporting for calls, campaigns, AI automation and lead quality.</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" className="gap-2" onClick={exportPdf}><FileText className="h-4 w-4" /> PDF</Button>
          <Button className="gap-2" onClick={exportCsv}><Download className="h-4 w-4" /> CSV</Button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Calls Today", "1,728", "+14%"],
          ["Conversion Rate", "8.7%", "+2.1%"],
          ["Cost Saved", "৳86,400", "+19%"],
          ["AI Handled %", "74%", "+6%"]
        ].map(([label, value, delta]) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="mt-1 flex items-center gap-1 text-xs text-primary"><TrendingUp className="h-3 w-3" /> {delta}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Call Volume Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ClientChart className="h-80">
              <ResponsiveContainer width="100%" height="100%">
              <LineChart data={callTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="calls" stroke="#008000" strokeWidth={3} />
                <Line type="monotone" dataKey="ai" stroke="#FF0000" strokeWidth={3} />
              </LineChart>
              </ResponsiveContainer>
            </ClientChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Source Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ClientChart className="h-80">
              <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={leadSources} dataKey="value" nameKey="name" outerRadius={95} label>
                  {leadSources.map((entry, index) => (
                    <Cell key={entry.name} fill={index === 0 ? "#008000" : index === 1 ? "#FF0000" : index === 2 ? "#16a34a" : "#94a3b8"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              </ResponsiveContainer>
            </ClientChart>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Hot Leads</TableHead>
                  <TableHead>Conversion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.name}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{campaign.sent.toLocaleString("en-BD")}</TableCell>
                    <TableCell>{campaign.leads}</TableCell>
                    <TableCell>{campaign.conversion}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sentiment.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="font-medium">{item.value}%</span>
                </div>
                <Progress value={item.value} />
              </div>
            ))}
            <ClientChart className="h-52 min-h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sentiment}>
                  <XAxis dataKey="label" />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {sentiment.map((entry) => <Cell key={entry.label} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ClientChart>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
