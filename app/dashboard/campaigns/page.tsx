"use client";

import { useMemo, useState } from "react";
import { CalendarClock, FileUp, Megaphone, Play, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type HotLead = { id: string; phone: string; interest: string; source: string; score: number };

export default function CampaignsPage() {
  const [name, setName] = useState("Eid Offer Voice Blast");
  const [type, setType] = useState("Bulk Voice Call");
  const [numbers, setNumbers] = useState("+8801711000001\n+8801811000002\n+8801911000003\n+8801611000004");
  const [script, setScript] = useState("আসসালামু আলাইকুম। DeshVox থেকে বলছি। আমাদের AI call center demo জানতে 1 চাপুন।");
  const [schedule, setSchedule] = useState("");
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [leads, setLeads] = useState<HotLead[]>([]);

  const parsedNumbers = useMemo(
    () => numbers.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean),
    [numbers]
  );

  function previewTts() {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.lang = "bn-BD";
    window.speechSynthesis.speak(utterance);
  }

  function uploadCsv(file?: File) {
    if (!file) return;
    file.text().then((text) => {
      const extracted = text.split(/[\n,]+/).map((item) => item.trim()).filter((item) => /^\+?\d{8,}$/.test(item));
      setNumbers(extracted.join("\n"));
    });
  }

  function runCampaign() {
    setRunning(true);
    setProgress(0);
    setLeads([]);
    const total = parsedNumbers.length || 1;
    let sent = 0;
    const timer = window.setInterval(() => {
      sent += 1;
      setProgress(Math.round((sent / total) * 100));
      if (sent % 2 === 1) {
        const phone = parsedNumbers[sent - 1] ?? `+88017${sent}`;
        setLeads((current) => [
          { id: crypto.randomUUID(), phone, interest: "Pressed 1 - connect with agent", source: name, score: 92 - sent },
          ...current
        ]);
      }
      if (sent >= total) {
        window.clearInterval(timer);
        setRunning(false);
      }
    }, 550);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-normal">Campaigns</h1>
        <p className="mt-2 text-muted-foreground">Bulk voice, SMS and AI sequence campaigns with automatic hot lead capture.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Megaphone className="h-5 w-5 text-primary" /> Create New Campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Campaign Name</Label>
                <Input value={name} onChange={(event) => setName(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bulk Voice Call">Bulk Voice Call</SelectItem>
                    <SelectItem value="Bulk SMS">Bulk SMS</SelectItem>
                    <SelectItem value="AI Sequence">AI Sequence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Numbers</Label>
              <Textarea value={numbers} onChange={(event) => setNumbers(event.target.value)} />
              <div className="flex items-center gap-2">
                <Input type="file" accept=".csv,text/csv" className="max-w-xs" onChange={(event) => uploadCsv(event.target.files?.[0])} />
                <Badge variant="secondary" className="gap-1"><FileUp className="h-3 w-3" /> {parsedNumbers.length} contacts</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Voice Message Script</Label>
              <Textarea className="font-bangla" value={script} onChange={(event) => setScript(event.target.value)} />
              <Button type="button" variant="outline" className="gap-2" onClick={previewTts}>
                <Volume2 className="h-4 w-4" /> Text-to-speech preview
              </Button>
            </div>

            <div className="rounded-lg border bg-muted/35 p-4">
              <div className="font-medium">Interactive Option</div>
              <p className="mt-1 text-sm text-muted-foreground">Press 1 to connect with agent. Every press becomes a Hot Lead automatically.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <Label>Schedule</Label>
                <Input type="datetime-local" value={schedule} onChange={(event) => setSchedule(event.target.value)} />
              </div>
              <Button className="self-end gap-2" onClick={runCampaign} disabled={running}>
                <Play className="h-4 w-4" /> Mock Execute
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Execution Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} />
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-md border p-3">
                <div className="text-2xl font-bold">{Math.round((progress / 100) * parsedNumbers.length)}</div>
                <div className="text-xs text-muted-foreground">Sent</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-2xl font-bold">{Math.max(0, Math.round(leads.length * 1.6))}</div>
                <div className="text-xs text-muted-foreground">Connected</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-2xl font-bold text-primary">{leads.length}</div>
                <div className="text-xs text-muted-foreground">Hot Leads</div>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2 font-medium"><CalendarClock className="h-4 w-4 text-primary" /> Schedule</div>
              <p className="mt-1 text-sm text-muted-foreground">{schedule || "Run immediately when executed"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hot Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phone</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.phone}</TableCell>
                  <TableCell>{lead.interest}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell><Badge>{lead.score}</Badge></TableCell>
                </TableRow>
              ))}
              {!leads.length && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">Run the mock campaign to generate hot leads.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
