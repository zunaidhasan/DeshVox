"use client";

import { useEffect, useRef, useState } from "react";
import { Headphones, Mic, MicOff, PhoneCall, PhoneOff, RefreshCw, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type CallSession = {
  id: string;
  provider: "RETELL" | "DEMO";
  providerCallId?: string | null;
  callerName: string;
  callerPhone: string;
  department: string;
  status: "REGISTERED" | "ONGOING" | "ENDED" | "ERROR";
  consentGiven: boolean;
  dncBlocked: boolean;
  createdAt: string;
};

type RetellWebClientShape = {
  startCall: (config: { accessToken: string; emitRawAudioSamples?: boolean }) => Promise<void>;
  stopCall: () => void;
  mute: () => void;
  unmute: () => void;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
};

export default function LiveCallPage() {
  const [callerName, setCallerName] = useState("Ayesha Rahman");
  const [callerPhone, setCallerPhone] = useState("+8801712345678");
  const [department, setDepartment] = useState("Sales");
  const [consentGiven, setConsentGiven] = useState(true);
  const [calls, setCalls] = useState<CallSession[]>([]);
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [status, setStatus] = useState("Ready for secure live call handling.");
  const [muted, setMuted] = useState(false);
  const [agentTalking, setAgentTalking] = useState(false);
  const retellClient = useRef<RetellWebClientShape | null>(null);

  async function refreshCalls() {
    const response = await fetch("/api/calls/live", { cache: "no-store" });
    const data = await response.json();
    setCalls(data.calls ?? []);
  }

  useEffect(() => {
    refreshCalls();
  }, []);

  async function createCall() {
    setStatus("Creating compliant Retell web call...");
    const response = await fetch("/api/calls/live", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callerName, callerPhone, department, consentGiven })
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error ?? "Unable to create call.");
      return;
    }

    setActiveCall(data.call);
    setCalls((current) => [data.call, ...current.filter((call) => call.id !== data.call.id)]);
    setStatus(data.retellConfigured ? "Retell call registered. Agent can join now." : "Demo call registered. Add Retell keys for real audio.");
  }

  async function joinCall(call = activeCall) {
    if (!call) return;
    setStatus("Joining call and logging compliance event...");
    const response = await fetch("/api/calls/live/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callSessionId: call.id, consentGiven })
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error ?? "Unable to join call.");
      return;
    }

    setActiveCall(data.call);
    setCalls((current) => current.map((item) => (item.id === data.call.id ? data.call : item)));

    if (data.accessToken && data.canStartBrowserAudio) {
      const { RetellWebClient } = await import("retell-client-js-sdk");
      const client = new RetellWebClient() as RetellWebClientShape;
      client.on("call_started", () => setStatus("Live Retell audio connected."));
      client.on("call_ready", () => setStatus("AI agent audio is ready."));
      client.on("call_ended", () => setStatus("Call ended."));
      client.on("agent_start_talking", () => setAgentTalking(true));
      client.on("agent_stop_talking", () => setAgentTalking(false));
      client.on("error", () => setStatus("Retell audio connection failed."));
      await client.startCall({ accessToken: data.accessToken, emitRawAudioSamples: true });
      retellClient.current = client;
      setStatus("Connecting browser microphone to Retell...");
    } else {
      setStatus(data.message ?? "Joined demo call without live audio.");
    }
  }

  async function endCall() {
    if (!activeCall) return;
    retellClient.current?.stopCall();
    await fetch("/api/calls/live/end", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callSessionId: activeCall.id })
    });
    setActiveCall({ ...activeCall, status: "ENDED" });
    setCalls((current) => current.map((item) => (item.id === activeCall.id ? { ...item, status: "ENDED" } : item)));
    setStatus("Call ended and compliance log recorded.");
  }

  function toggleMute() {
    if (!retellClient.current) return;
    if (muted) retellClient.current.unmute();
    else retellClient.current.mute();
    setMuted(!muted);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-card p-6 flag-sheen">
        <Badge className="bg-deshvox-red text-white"><Headphones className="mr-1 h-3 w-3" /> Retell AI Voice</Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-normal">Live Call</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Register compliant AI web calls, run simulated BTRC consent and DNC checks, and let agents join ongoing Retell sessions.
        </p>
      </section>

      <div className="grid gap-4 xl:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PhoneCall className="h-5 w-5 text-primary" /> Start Call</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Caller Name</Label>
              <Input value={callerName} onChange={(event) => setCallerName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Bangladesh Phone</Label>
              <Input value={callerPhone} onChange={(event) => setCallerPhone(event.target.value)} placeholder="+8801XXXXXXXXX" />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Sales", "Support", "Billing", "Operations", "Marketing", "Front Desk"].map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border bg-muted/35 p-3 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={consentGiven}
                onChange={(event) => setConsentGiven(event.target.checked)}
              />
              <span>
                <span className="font-medium">Recording consent captured</span>
                <span className="block text-muted-foreground">Simulates BTRC-ready consent logging before call recording.</span>
              </span>
            </label>
            <div className="flex gap-2">
              <Button className="flex-1 gap-2" onClick={createCall}><PhoneCall className="h-4 w-4" /> Create</Button>
              <Button variant="outline" className="flex-1 gap-2" onClick={() => joinCall()} disabled={!activeCall}>
                <Headphones className="h-4 w-4" /> Join
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Agent Console</CardTitle>
            <Badge variant={activeCall?.status === "ONGOING" ? "default" : "secondary"}>{activeCall?.status ?? "IDLE"}</Badge>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Provider</div>
                <div className="mt-1 font-semibold">{activeCall?.provider ?? "None"}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">AI Agent</div>
                <div className={cn("mt-1 font-semibold", agentTalking && "text-primary")}>{agentTalking ? "Talking" : "Listening"}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Compliance</div>
                <div className="mt-1 flex items-center gap-2 font-semibold text-primary"><ShieldCheck className="h-4 w-4" /> Logged</div>
              </div>
            </div>
            <div className="rounded-lg border bg-muted/35 p-4 text-sm text-muted-foreground">{status}</div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="gap-2" onClick={toggleMute} disabled={!retellClient.current}>
                {muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {muted ? "Unmute" : "Mute"}
              </Button>
              <Button variant="destructive" className="gap-2" onClick={endCall} disabled={!activeCall || activeCall.status === "ENDED"}>
                <PhoneOff className="h-4 w-4" /> End Call
              </Button>
              <Button variant="outline" className="gap-2" onClick={refreshCalls}><RefreshCw className="h-4 w-4" /> Refresh</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ongoing Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Caller</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>
                    <div className="font-medium">{call.callerName}</div>
                    <div className="text-xs text-muted-foreground">{call.callerPhone}</div>
                  </TableCell>
                  <TableCell>{call.department}</TableCell>
                  <TableCell>{call.provider}</TableCell>
                  <TableCell><Badge variant={call.status === "ONGOING" ? "default" : "secondary"}>{call.status}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={call.dncBlocked ? "destructive" : "outline"}>
                      {call.consentGiven && !call.dncBlocked ? "Consent + DNC clear" : "Review"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => {
                      setActiveCall(call);
                      joinCall(call);
                    }}>
                      Join
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!calls.length && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No live calls yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
