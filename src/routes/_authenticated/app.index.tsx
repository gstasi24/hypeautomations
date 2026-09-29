import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Info, Lock, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMyAccount, primaryOrder } from "@/components/private-ai/useAccount";

export const Route = createFileRoute("/_authenticated/app/")({
  validateSearch: (s: Record<string, unknown>) => ({
    purchase: s["purchase"] === "success" ? ("success" as const) : undefined,
  }),
  component: AiScreen,
});

const STAGES = [
  "Purchase confirmed",
  "Setup review",
  "Persona configuration",
  "Integrations",
  "Private deployment",
  "Testing",
  "Activation",
];

function AiScreen() {
  const { purchase } = Route.useSearch();
  const { data } = useMyAccount();
  const [input, setInput] = useState("");
  const [blocked, setBlocked] = useState(false);
  const order = data ? primaryOrder(data.orders) : null;
  const paid = order?.payment_status === "paid";
  const stageIdx = paid ? 1 : -1;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-3xl flex-col">
      <div className="flex items-center justify-between gap-3">
        <h1 className="type-title">AI</h1>
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold">
          <span className="size-2 animate-breathe rounded-full bg-primary" /> Setup pending
        </span>
      </div>

      {purchase === "success" && paid && (
        <div className="mt-6 rounded-panel border border-success/50 bg-surface p-5 text-sm">
          <p className="font-semibold text-success">Purchase confirmed. Your private AI setup is next.</p>
          <p className="mt-1 text-muted-foreground">
            We will use the onboarding process to configure your environment and prepare the required integrations.
          </p>
        </div>
      )}

      {data && !order && (
        <div className="mt-6 rounded-panel border border-border bg-surface p-5 text-sm">
          <p className="font-semibold">You don't have a plan yet.</p>
          <p className="mt-1 text-muted-foreground">Choose a plan to start your private AI setup.</p>
          <Button size="sm" className="mt-4" asChild><Link to="/private-ai" hash="pricing">Choose Your AI</Link></Button>
        </div>
      )}
      {order && !paid && (
        <div className="mt-6 rounded-panel border border-border bg-surface p-5 text-sm">
          <p className="font-semibold">Your order is saved and awaiting payment.</p>
          <p className="mt-1 text-muted-foreground">Secure payment integration will be enabled before launch. No payment has been taken.</p>
          <Button size="sm" variant="outline" className="mt-4" asChild>
            <Link to="/private-ai/checkout" search={{ tier: order.tier as "essential", model: order.payment_model as "one_time", step: "review" }}>
              View order
            </Link>
          </Button>
        </div>
      )}

      <div className="relative mt-10 flex flex-1 flex-col items-center justify-center text-center">
        <div className="brand-glow left-1/2 top-0 h-64 w-64 -translate-x-1/2 opacity-40" aria-hidden />
        <div className="relative flex size-16 items-center justify-center rounded-full border border-border-strong bg-surface">
          <span className="size-7 rounded-full bg-brand-gradient opacity-70" />
        </div>
        <p className="relative mt-6 max-w-md text-lg font-semibold">
          Your private AI environment is being prepared. Your future assistant will live here.
        </p>
        <p className="relative mt-2 max-w-md text-sm text-muted-foreground">
          Once activated, you'll be able to ask it to work across your connected tools from this conversation.
        </p>

        <ol className="relative mt-8 w-full max-w-md space-y-1.5 text-left text-sm">
          {STAGES.map((s, i) => (
            <li key={s} className={cn("flex items-center gap-3 rounded-control px-3 py-2", i === stageIdx && "bg-surface")}>
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full border text-[10px]",
                  i < stageIdx && "border-success bg-success text-success-foreground",
                  i === stageIdx && "border-primary",
                  i > stageIdx && "border-border text-muted-foreground",
                )}
              >
                {i < stageIdx ? <Check className="size-3" /> : i + 1}
              </span>
              <span className={i <= stageIdx ? "text-foreground" : "text-muted-foreground"}>{s}</span>
              {i === stageIdx && <span className="ml-auto text-xs text-link">Setup pending</span>}
            </li>
          ))}
        </ol>
      </div>

      <div className="sticky bottom-4 mt-10">
        {blocked && (
          <p role="status" className="mb-2 flex items-start gap-2 rounded-control border border-border bg-surface p-3 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-link" />
            Your AI environment isn't active yet. We'll enable this workspace once your private deployment is ready.
          </p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setBlocked(true);
          }}
          className="flex items-center gap-2 rounded-panel border border-border bg-surface p-2"
        >
          <Lock className="ml-2 size-4 text-muted-foreground" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Setup pending: your assistant isn't active yet"
            aria-label="Message"
            className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <Button type="submit" size="icon" variant="ghost" aria-label="Send">
            <SendHorizonal className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
