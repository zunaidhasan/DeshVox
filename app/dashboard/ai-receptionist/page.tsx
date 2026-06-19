"use client";

import { useMemo, useState } from "react";
import { Bot, Mic, PhoneCall, Send, Sparkles, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "ai"; text: string };
type SpeechRecognitionConstructor = new () => {
  lang: string;
  interimResults: boolean;
  onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
};

const samples = [
  "আমি প্রোডাক্ট সম্পর্কে জানতে চাই",
  "I need pricing for call center software",
  "সাপোর্ট টিমের সাথে কথা বলতে চাই"
];

function respond(input: string) {
  const text = input.toLowerCase();
  if (text.includes("price") || text.includes("pricing") || text.includes("দাম")) {
    return "ধন্যবাদ। আমি আপনাকে Sales টিমে রাউট করছি। আগে আপনার নাম, কোম্পানির নাম এবং মোবাইল নম্বরটি বলবেন?";
  }
  if (text.includes("support") || text.includes("সাপোর্ট")) {
    return "অবশ্যই। আপনার সমস্যার ধরনটি বলুন, তারপর আমি সবচেয়ে উপযুক্ত Support Agent এর সাথে কানেক্ট করে দেব।";
  }
  if (text.includes("প্রোডাক্ট") || text.includes("product")) {
    return "DeshVox দিয়ে AI receptionist, bulk campaign, IVR flow এবং analytics চালানো যায়। আপনি কি Sales demo বুক করতে চান?";
  }
  return "আসসালামু আলাইকুম, DeshVox-এ স্বাগতম। আপনি Sales, Support, Billing, নাকি Campaign Automation সম্পর্কে জানতে চান?";
}

export default function AiReceptionistPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "আসসালামু আলাইকুম। আমি DeshVox AI Receptionist। কীভাবে সাহায্য করতে পারি?" }
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  const supported = useMemo(() => typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window), []);

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = /[ঀ-৿]/.test(text) ? "bn-BD" : "en-US";
    window.speechSynthesis.speak(utterance);
  }

  function send(text = input) {
    if (!text.trim()) return;
    const aiText = respond(text);
    setMessages((current) => [...current, { role: "user", text }, { role: "ai", text: aiText }]);
    setInput("");
    setTimeout(() => speak(aiText), 200);
  }

  function listen() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;
    const recognition = new Recognition();
    recognition.lang = "bn-BD";
    recognition.interimResults = false;
    setListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);
      send(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-card p-6 flag-sheen">
        <Badge className="bg-deshvox-red text-white"><Sparkles className="mr-1 h-3 w-3" /> Voice AI Demo</Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-normal">AI Receptionist Demo</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Type or speak in Bangla and English. The receptionist greets callers, detects purpose, routes departments and collects lead information.
        </p>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <Card className="min-h-[620px]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> Live Conversation</CardTitle>
            <Badge variant="outline">bn-BD / en-US</Badge>
          </CardHeader>
          <CardContent className="flex min-h-[520px] flex-col">
            <div className="flex-1 space-y-3 overflow-auto rounded-lg border bg-muted/30 p-4">
              {messages.map((message, index) => (
                <div key={index} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[82%] rounded-lg px-4 py-3 text-sm",
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card shadow-sm"
                  )}>
                    <p className="font-bangla leading-6">{message.text}</p>
                    {message.role === "ai" && (
                      <button className="mt-2 inline-flex items-center gap-1 text-xs text-primary" onClick={() => speak(message.text)}>
                        <Volume2 className="h-3 w-3" /> Play
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Input className="font-bangla" value={input} onChange={(event) => setInput(event.target.value)} placeholder="আমি প্রোডাক্ট সম্পর্কে জানতে চাই" onKeyDown={(event) => event.key === "Enter" && send()} />
              <Button variant="outline" size="icon" onClick={listen} disabled={!supported || listening} aria-label="Speak">
                <Mic className={cn("h-4 w-4", listening && "text-deshvox-red")} />
              </Button>
              <Button size="icon" onClick={() => send()} aria-label="Send">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sample Bangla Flows</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {samples.map((sample) => (
                <Button key={sample} variant="outline" className="h-auto w-full justify-start whitespace-normal py-3 text-left font-bangla" onClick={() => send(sample)}>
                  {sample}
                </Button>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Real Call Bridge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Placeholder for future Retell AI or Vapi integration with live PSTN/SIP handoff.</p>
              <Button className="mt-4 w-full gap-2"><PhoneCall className="h-4 w-4" /> Connect to Real Call</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}
