import { useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Check,
  Compass,
  Heart,
  Lock,
  Pause,
  Scale,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  Workflow,
  Eye,
  KeyRound,
  Cloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Statement, Instrument } from "@/components/site/Section";
import { cn } from "@/lib/utils";
import { track } from "@/lib/private-ai/analytics";

export function Interrupt() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
        <p className="type-statement">
          You don't need another dashboard.{" "}
          <span className="text-gradient">You need your software to work together.</span>
        </p>
      </div>
    </section>
  );
}

const CHAT = ["Ask", "Receive answer", "You do the work"];
const OPERATOR = ["Ask", "Understand", "Check systems", "Prepare actions", "Ask for approval", "Execute", "Report back"];

export function NotAChatbot() {
  return (
    <Instrument
      id="what-it-does"
      rail="flow"
      title="Not another chatbot. A private AI operator built around your business."
      lead="A chat tool gives you an answer. An operator works through your systems and brings the result back for approval."
      className="scroll-mt-20"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        <Flow title="Traditional AI chat" steps={CHAT} muted />
        <Flow title="Private AI operator" steps={OPERATOR} />
      </div>
    </Instrument>
  );
}

function Flow({ title, steps, muted }: { title: string; steps: string[]; muted?: boolean }) {
  return (
    <div>
      <p className={cn("text-xs font-semibold uppercase tracking-[0.2em]", muted ? "text-muted-foreground" : "text-link")}>
        {title}
      </p>
      <ol className="mt-4 flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-control border px-3 py-2 text-sm",
                muted ? "border-dashed border-manual/60 text-muted-foreground" : "border-primary/40",
                !muted && s === "Ask for approval" && "border-success/60 text-success",
              )}
            >
              {s}
            </span>
            {i < steps.length - 1 && <ArrowRight className="size-3.5 text-muted-foreground" />}
          </li>
        ))}
      </ol>
    </div>
  );
}

const EXAMPLES = [
  {
    q: "Schedule a call with Priya next week, but avoid Fridays.",
    steps: ["Checks your calendar and Priya's thread", "Finds open slots Monday–Thursday", "Drafts the invite", "Asks you to approve before sending"],
  },
  {
    q: "Write this week's client update from my email, docs and CRM.",
    steps: ["Reads recent client emails", "Pulls notes from shared docs", "Checks deal stages in the CRM", "Drafts an update for your review"],
  },
  {
    q: "Chase every invoice unpaid for more than 30 days.",
    steps: ["Finds invoices older than 30 days", "Matches each to the right contact", "Prepares polite reminders", "Waits for your approval to send"],
  },
  {
    q: "Give me a briefing every Monday morning.",
    steps: ["Collects meetings, deadlines and open threads", "Highlights what needs you", "Delivers the briefing on schedule"],
  },
  {
    q: "Add everyone from yesterday's webinar to the CRM.",
    steps: ["Reads the attendee list", "Checks for existing contacts", "Prepares new records and tags", "Asks before creating them"],
  },
];

export function Examples() {
  const [i, setI] = useState(0);
  const ex = EXAMPLES[i]!;
  return (
    <Statement rail="flow" title="Just tell it what needs to happen." lead="Pick a request to see how it would be handled.">
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-2">
          {EXAMPLES.map((e, idx) => (
            <button
              key={e.q}
              onClick={() => setI(idx)}
              className={cn(
                "rounded-control border px-4 py-3 text-left text-sm transition-colors",
                idx === i ? "border-primary/60 bg-surface text-foreground" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              "{e.q}"
            </button>
          ))}
        </div>
        <div key={i} className="animate-float-in rounded-panel border border-border bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-link">How it would run</p>
          <ol className="mt-5 space-y-4">
            {ex.steps.map((s, idx) => (
              <li key={s} className="flex gap-3 text-sm">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/40 text-[11px]">
                  {idx + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs text-muted-foreground">Illustrative. Exact behavior depends on your plan and connected tools.</p>
        </div>
      </div>
    </Statement>
  );
}

const ROLES = [
  { key: "executive", title: "Executive Assistant", icon: Briefcase, text: "Calendar, inbox triage, briefings and follow-ups." },
  { key: "sales", title: "Sales Assistant", icon: TrendingUp, text: "Lead follow-up, CRM hygiene and pipeline updates." },
  { key: "operations", title: "Operations Assistant", icon: Workflow, text: "Recurring tasks, invoices, reporting and handoffs." },
  { key: "lifestyle", title: "Lifestyle Assistant", icon: Heart, text: "Personal scheduling, reminders and planning." },
  { key: "paralegal", title: "Paralegal Assistant", icon: Scale, text: "Supports legal workflows like intake, documents and deadlines. It does not provide legal advice." },
  { key: "custom", title: "Custom Role", icon: Compass, text: "A role designed around your business.", pro: true },
];

export function Roles() {
  return (
    <Statement id="roles" rail="flow" title="Start with the role you need." className="scroll-mt-20">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROLES.map((r) => (
          <button
            key={r.key}
            onClick={() => track("role_selected", { role: r.key })}
            className="group rounded-panel border border-border bg-surface p-6 text-left transition-colors hover:border-primary/50"
          >
            <div className="flex items-center justify-between">
              <r.icon className="size-5 text-link" />
              {r.pro && (
                <span className="rounded-full border border-primary/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-link">
                  Pro
                </span>
              )}
            </div>
            <h3 className="mt-4 font-semibold">{r.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
          </button>
        ))}
      </div>
    </Statement>
  );
}

const ECOSYSTEM = [
  "Google Workspace", "Microsoft 365", "Slack", "Discord", "Telegram", "Microsoft Teams", "Notion", "Asana",
  "Trello", "ClickUp", "HubSpot", "Salesforce", "Pipedrive", "Stripe", "QuickBooks", "Xero", "Calendly",
  "DocuSign", "Google Docs", "Clio", "PracticePanther", "n8n",
];

export function Ecosystem() {
  return (
    <Statement
      rail="flow"
      title="Designed to work with the tools you already use."
      lead="Supported tools we can connect, depending on your plan. Additional API integrations are scoped when required."
    >
      <ul className="flex flex-wrap gap-2">
        {ECOSYSTEM.map((t) => (
          <li key={t} className="rounded-full border border-border bg-surface px-4 py-2 text-sm">
            {t}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs text-muted-foreground">
        Product names are trademarks of their owners. Listing a tool does not imply a partnership.
      </p>
    </Statement>
  );
}

const PRIVACY = [
  { icon: Lock, t: "Dedicated deployment", d: "Each customer is designed to run in their own isolated environment." },
  { icon: ShieldCheck, t: "Not used for training", d: "Your data is not used to train models." },
  { icon: KeyRound, t: "Secret management", d: "Access credentials are designed to be stored in a dedicated secret manager." },
  { icon: Eye, t: "Auditability", d: "Actions are designed to be logged so you can review what happened." },
  { icon: Check, t: "Approval by default", d: "Sensitive write actions ask for approval by default." },
  { icon: Pause, t: "Pause control", d: "You can pause your assistant." },
  { icon: Trash2, t: "Deletion on request", d: "Your data is deleted when you ask." },
  { icon: Cloud, t: "Client-owned cloud (Pro)", d: "Option to run in your own Google Cloud, where agreed." },
];

export function Privacy() {
  return (
    <Statement rail="flow" title="Private by design." lead="These describe how each deployment is designed. They are set up during your onboarding.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRIVACY.map((p) => (
          <div key={p.t} className="rounded-panel border border-border bg-surface p-5">
            <p.icon className="size-5 text-link" />
            <h3 className="mt-3 text-sm font-semibold">{p.t}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{p.d}</p>
          </div>
        ))}
      </div>
    </Statement>
  );
}

const CONTROL = [
  { s: "Read", a: true },
  { s: "Understand", a: true },
  { s: "Draft", a: true },
  { s: "Prepare action", a: true },
  { s: "Send · Create · Pay · Sign", a: false },
];

export function Control() {
  const [approved, setApproved] = useState(false);
  return (
    <Instrument id="control" rail="done" title="It can act. You stay in control." className="scroll-mt-20">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <ol className="space-y-2">
          {CONTROL.map((c) => (
            <li key={c.s} className="flex items-center justify-between rounded-control border border-border px-4 py-3 text-sm">
              <span className="font-medium">{c.s}</span>
              <span className={cn("text-xs font-semibold uppercase tracking-wider", c.a ? "text-link" : "text-success")}>
                {c.a ? "Automatic" : "Approval required by default"}
              </span>
            </li>
          ))}
          <li className="flex items-center gap-2 px-4 pt-2 text-sm text-muted-foreground">
            <ArrowRight className="size-3.5" /> Approve <ArrowRight className="size-3.5" /> Execute
          </li>
        </ol>
        <div className="rounded-panel border border-border bg-background p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-link" /> Action ready
          </div>
          <p className="mt-3 font-semibold">Ready to send 3 invoice reminders</p>
          <p className="mt-1 text-sm text-muted-foreground">Invoices over 30 days · drafts prepared</p>
          <div className="mt-5 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setApproved(false)}>Review</Button>
            <Button size="sm" onClick={() => setApproved(true)}>
              {approved ? <><Check className="size-4" /> Approved</> : "Approve & Send"}
            </Button>
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground">Interactive illustration. Nothing is sent.</p>
        </div>
      </div>
    </Instrument>
  );
}

export function ProductFinalCta() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="brand-glow left-1/2 top-1/4 h-[420px] w-[680px] -translate-x-1/2 opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <h2 className="type-statement">One AI. Your tools. Your business.</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          Choose a plan and we'll start your private setup through a guided onboarding.
        </p>
        <Button size="lg" className="mt-8" asChild onClick={() => track("private_ai_cta_click", { cta: "final" })}>
          <a href="#pricing">Choose Your AI</a>
        </Button>
      </div>
    </section>
  );
}
