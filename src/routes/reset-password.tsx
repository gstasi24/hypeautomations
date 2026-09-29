import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password | Hype Automations" },
      { name: "description", content: "Choose a new password for your Hype Automations account." },
      { property: "og:title", content: "Set a new password | Hype Automations" },
      { property: "og:description", content: "Choose a new password for your account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw !== confirm) return toast.error("Passwords don't match.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated.");
    navigate({ to: "/app" });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-5 py-16">
      <div className="brand-glow left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 opacity-60" />
      <form onSubmit={submit} className="relative w-full max-w-md space-y-4 rounded-panel border border-border bg-surface/80 p-7 backdrop-blur">
        <h1 className="text-2xl font-bold">Set a new password</h1>
        <div className="space-y-2">
          <Label htmlFor="pw">New password</Label>
          <Input id="pw" type="password" minLength={8} required autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pw2">Confirm password</Label>
          <Input id="pw2" type="password" minLength={8} required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>Update password</Button>
        <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-foreground">Back to site</Link>
      </form>
    </main>
  );
}
