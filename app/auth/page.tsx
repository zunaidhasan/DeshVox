"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chrome, Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DeshVoxLogo } from "@/components/deshvox-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email(),
  phone: z.string().min(8),
  tenant: z.string().min(2)
});

type FormValues = z.infer<typeof schema>;

export default function AuthPage() {
  const [message, setMessage] = useState("Demo mode works without Supabase keys.");
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", phone: "+8801700000000", tenant: "dhaka-business" }
  });

  async function signInWithGoogle() {
    const supabase = createClient();
    if (!supabase) return setMessage("Add Supabase keys to enable Google OAuth.");
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/dashboard` } });
  }

  async function submit(values: FormValues) {
    const supabase = createClient();
    if (!supabase) {
      setMessage(`Demo tenant "${values.tenant}" accepted. Connect Supabase for real auth.`);
      return;
    }
    await supabase.auth.signInWithOtp({ email: values.email });
    setMessage("Magic link sent. Phone OTP can be enabled from Supabase Auth settings.");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <DeshVoxLogo />
          <CardTitle className="pt-4">Sign in to your call center</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
            <div className="space-y-2">
              <Label>Workspace / Tenant</Label>
              <Input {...form.register("tenant")} placeholder="your-company" />
            </div>
            <Tabs defaultValue="email">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email"><Mail className="mr-2 h-4 w-4" />Email</TabsTrigger>
                <TabsTrigger value="phone"><Phone className="mr-2 h-4 w-4" />Phone</TabsTrigger>
              </TabsList>
              <TabsContent value="email" className="space-y-2">
                <Label>Email</Label>
                <Input {...form.register("email")} placeholder="admin@company.com" />
              </TabsContent>
              <TabsContent value="phone" className="space-y-2">
                <Label>Phone</Label>
                <Input {...form.register("phone")} placeholder="+8801XXXXXXXXX" />
              </TabsContent>
            </Tabs>
            <Button className="w-full" type="submit">Continue</Button>
          </form>
          <Button variant="outline" className="mt-3 w-full gap-2" onClick={signInWithGoogle}>
            <Chrome className="h-4 w-4" /> Continue with Google
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
    </main>
  );
}
