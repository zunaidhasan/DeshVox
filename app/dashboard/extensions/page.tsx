"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MonitorSmartphone, Plus, Search, Smartphone, Wifi, WifiOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";

type Extension = {
  id: string;
  name: string;
  number: string;
  department: string;
  deviceType: "Mobile App" | "Web" | "Softphone";
  status: "Online" | "Offline";
};

const schema = z.object({
  name: z.string().min(2),
  number: z.string().min(2),
  department: z.string().min(2),
  deviceType: z.enum(["Mobile App", "Web", "Softphone"])
});

const initialExtensions: Extension[] = [
  { id: "1", name: "Nusrat Jahan", number: "101", department: "Sales", deviceType: "Web", status: "Online" },
  { id: "2", name: "Rahim Uddin", number: "102", department: "Support", deviceType: "Mobile App", status: "Offline" },
  { id: "3", name: "Tania Akter", number: "201", department: "Billing", deviceType: "Softphone", status: "Online" },
  { id: "4", name: "AI Receptionist", number: "900", department: "Front Desk", deviceType: "Web", status: "Online" }
];

export default function ExtensionsPage() {
  const [extensions, setExtensions] = useState(initialExtensions);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", number: "", department: "Sales", deviceType: "Web" }
  });

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    const channel = supabase
      .channel("extensions-status")
      .on("postgres_changes", { event: "*", schema: "public", table: "extensions" }, (payload) => {
        const row = payload.new as Record<string, string>;
        if (!row?.id) return;
        setExtensions((current) =>
          current.map((item) =>
            item.id === row.id ? { ...item, status: row.status === "ONLINE" ? "Online" : "Offline" } : item
          )
        );
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(
    () =>
      extensions.filter((extension) => {
        const matchesQuery = `${extension.name} ${extension.number} ${extension.department}`.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = status === "All" || extension.status === status;
        return matchesQuery && matchesStatus;
      }),
    [extensions, query, status]
  );

  function addExtension(values: z.infer<typeof schema>) {
    setExtensions((current) => [
      { id: crypto.randomUUID(), status: "Offline", ...values },
      ...current
    ]);
    form.reset({ name: "", number: "", department: "Sales", deviceType: "Web" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-normal">Extensions Management</h1>
        <p className="mt-2 text-muted-foreground">Unlimited team extensions with live Supabase realtime presence.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Add New Extension</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-5" onSubmit={form.handleSubmit(addExtension)}>
            <div className="space-y-2 md:col-span-1">
              <Label>Name</Label>
              <Input {...form.register("name")} placeholder="Agent name" />
            </div>
            <div className="space-y-2">
              <Label>Number</Label>
              <Input {...form.register("number")} placeholder="103" />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input {...form.register("department")} placeholder="Sales" />
            </div>
            <div className="space-y-2">
              <Label>Device</Label>
              <Select value={form.watch("deviceType")} onValueChange={(value) => form.setValue("deviceType", value as Extension["deviceType"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mobile App">Mobile App</SelectItem>
                  <SelectItem value="Web">Web</SelectItem>
                  <SelectItem value="Softphone">Softphone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="self-end" type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search name, number, department" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Online">Online</SelectItem>
            <SelectItem value="Offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((extension) => (
          <Card key={extension.id} className="overflow-hidden">
            <div className="h-2 flag-sheen" />
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>{extension.name}</CardTitle>
                <p className="text-sm text-muted-foreground">Ext. {extension.number} · {extension.department}</p>
              </div>
              <Badge variant={extension.status === "Online" ? "default" : "secondary"} className="gap-1">
                {extension.status === "Online" ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {extension.status}
              </Badge>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {extension.deviceType === "Mobile App" ? <Smartphone className="h-4 w-4" /> : <MonitorSmartphone className="h-4 w-4" />}
                {extension.deviceType}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExtensions((current) => current.map((item) => item.id === extension.id ? { ...item, status: item.status === "Online" ? "Offline" : "Online" } : item))}
              >
                Toggle
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
