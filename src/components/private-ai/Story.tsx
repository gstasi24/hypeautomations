import { useState } from "react";
import { ArrowRight, Briefcase, CalendarDays, Check, Compass, FileText, Heart, Lock, Mail, Pause, Scale, ShieldCheck, Sparkles, TrendingUp, Users, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { track } from "@/lib/private-ai/analytics";
import { cn } from "@/lib/utils";

const REQUEST_STEPS = [
  { label: "Request", text: "Give me today's priorities and move anything non-urgent to tomorrow." },
  { label: "Understands", text: "Identifies urgency, deadlines, meetings and open follow-ups." },
  { label: "Acts", text: "Checks calendar, tasks and email, then prepares the changes." },
  { label: "Reports", text: "Returns a clear summary and waits for approval before applying anything." },
];

export function Demonstration() {
  const [active, setActive] = useState(0);
  return (
    <section id="demonstration" className="scene-band scroll-mt-20" aria-labelledby="demo-title">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-link">Show, don't tell</p>
          <h2 id="demo-title" className="type-statement mx-auto mt-4 max-w-4xl">One request becomes coordinated work.</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-[0.75fr_1.25fr] lg:items-stretch">
          <div className="flex flex-col gap-2" role="tablist" aria-label="Illustrative request sequence">
            {REQUEST_STEPS.map((step, index) => (
              <button key={step.label} role="tab" aria-selected={active === index} aria-controls="request-demo" onClick={() => { setActive(index); track("demo_interaction", { step: step.label }); }} className={cn("min-h-16 rounded-control border px-5 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", active === index ? "border-primary/60 bg-surface text-foreground" : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground")}>
                <span className="text-xs font-bold uppercase tracking-[0.18em]">0{index + 1} · {step.label}</span>
              </button>
            ))}
          </div>
          <div id="request-demo" role="tabpanel" className="spotlight-panel min-h-72 rounded-panel border border-border bg-surface p-6 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-link">{REQUEST_STEPS[active]?.label}</p>
            <p className="mt-5 max-w-2xl text-2xl font-semibold leading-snug sm:text-3xl">{REQUEST_STEPS[active]?.text}</p>
            <div className="mt-9 border-t border-border pt-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {[Mail, CalendarDays, Users, FileText].map((Icon, index) => <span key={index} className={cn("inline-flex size-10 items-center justify-center rounded-full border", index <= active ? "border-primary/50 bg-primary/10 text-link" : "border-border")}><Icon className="size-4" aria-hidden="true" /></span>)}
                <span className="ml-auto">Illustrative only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const CAPABILITIES = [
  { title: "Communication", text: "Prepare clear replies and follow-ups from the context already in your approved tools.", example: "Draft this week's client update from email, documents and CRM." },
  { title: "Appointments", text: "Find workable times, respect constraints and prepare the next step for approval.", example: "Schedule Priya next week, but avoid Fridays." },
  { title: "Operations", text: "Coordinate recurring tasks and handoffs without adding another dashboard to maintain.", example: "Prepare Monday's priorities, deadlines and open threads." },
  { title: "Records", text: "Keep customer and workflow records ready to update while sensitive writes stay controlled.", example: "Prepare yesterday's webinar contacts for the CRM." },
];

export function CapabilityStory() {
  const [active, setActive] = useState(0);
  return (
    <section id="capabilities" className="scene-band scroll-mt-20 bg-surface/30" aria-labelledby="capability-title">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-link">Not another chatbot</p>
            <h2 id="capability-title" className="type-statement mt-4">Built to move work forward.</h2>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">A chat tool answers. Hype Private AI is designed to understand context, prepare action and report back.</p>
          </Reveal>
          <div className="mt-8 rounded-panel border border-border bg-background p-6">
            <p className="text-sm text-muted-foreground">Current request</p>
            <p className="mt-3 text-xl font-semibold">“{CAPABILITIES[active]?.example}”</p>
            <div className="mt-6 flex items-center gap-2 text-xs text-success"><Check className="size-4" /> Approval remains with you</div>
          </div>
        </div>
        <div className="space-y-3" role="list">
          {CAPABILITIES.map((item, index) => (
            <Reveal key={item.title} delay={index * 70}>
              <button onClick={() => { setActive(index); track("demo_interaction", { capability: item.title }); }} aria-pressed={active === index} className={cn("group w-full rounded-panel border p-6 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-8", active === index ? "border-primary/60 bg-surface" : "border-border bg-background hover:border-border-strong")}>
                <span className="text-xs font-semibold text-link">0{index + 1}</span>
                <h3 className="mt-3 text-2xl font-bold">{item.title}</h3>
                <p className="mt-3 max-w-xl text-muted-foreground">{item.text}</p>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const ROLES = [
  { key: "executive", title: "Executive", icon: Briefcase, text: "Calendar, inbox, briefings and follow-ups." },
  { key: "sales", title: "Sales", icon: TrendingUp, text: "Lead follow-up, CRM hygiene and pipeline updates." },
  { key: "operations", title: "Operations", icon: Workflow, text: "Recurring tasks, invoices, reporting and handoffs." },
  { key: "lifestyle", title: "Lifestyle", icon: Heart, text: "Personal scheduling, reminders and planning." },
  { key: "paralegal", title: "Paralegal", icon: Scale, text: "Intake, documents and deadlines. No legal advice." },
  { key: "custom", title: "Custom role", icon: Compass, text: "A Pro role designed around your operation." },
];

export function Personalization() {
  const [active, setActive] = useState("executive");
  const selected = ROLES.find((role) => role.key === active) ?? ROLES[0];
  return (
    <section id="personalization" className="scene-band scroll-mt-20" aria-labelledby="personalization-title">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-link">Built around you</p>
          <h2 id="personalization-title" className="type-statement mx-auto mt-4 max-w-4xl">Your operation becomes the interface.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">Choose a role to see the outcome it is designed around. Exact tools and behavior are configured during onboarding.</p>
        </Reveal>
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ROLES.map((role) => <button key={role.key} onClick={() => { setActive(role.key); track("role_selected", { role: role.key }); }} aria-pressed={active === role.key} className={cn("min-h-28 rounded-panel border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", active === role.key ? "border-primary/60 bg-surface" : "border-border hover:border-border-strong")}><role.icon className="size-5 text-link" aria-hidden="true" /><span className="mt-4 block text-sm font-semibold">{role.title}</span></button>)}
          </div>
          <div className="spotlight-panel rounded-panel border border-border bg-surface p-7 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-link">{selected?.title} assistant</p>
            <p className="mt-5 text-2xl font-semibold sm:text-3xl">{selected?.text}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Context", "Approved tools", "Human control"].map((item) => <span key={item} className="rounded-full border border-border px-3 py-2 text-xs text-muted-foreground">{item}</span>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Outcomes() {
  return (
    <section className="scene-band bg-surface/30" aria-labelledby="outcomes-title">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal><h2 id="outcomes-title" className="type-statement max-w-4xl">Less coordination. More continuity.</h2></Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-panel border border-border bg-border md:grid-cols-3">
          {["Work arrives already prepared", "Context follows the request", "Sensitive actions wait for you"].map((text, index) => <Reveal key={text} delay={index * 80} className="bg-background p-7 sm:p-9"><span className="text-xs font-semibold text-link">0{index + 1}</span><p className="mt-5 text-xl font-semibold">{text}</p></Reveal>)}
        </div>
      </div>
    </section>
  );
}

const TRUST = [
  { icon: Lock, title: "Private setup", text: "Your dedicated environment and agreed integrations are prepared during onboarding." },
  { icon: ShieldCheck, title: "Approval by default", text: "Sensitive sends, creates, payments and signatures are designed to wait for approval." },
  { icon: Pause, title: "Clear control", text: "Review prepared work, pause the assistant and request deletion of your data." },
];

export function TrustControl() {
  const [approved, setApproved] = useState(false);
  return (
    <section id="control" className="scene-band scroll-mt-20" aria-labelledby="control-title">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="text-center"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-link">Trust before action</p><h2 id="control-title" className="type-statement mx-auto mt-4 max-w-4xl">It can act. You stay in control.</h2></Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">{TRUST.map((item, index) => <Reveal key={item.title} delay={index * 70} className="rounded-panel border border-border bg-surface p-6"><item.icon className="size-5 text-link" /><h3 className="mt-5 text-lg font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p></Reveal>)}</div>
        <div className="mt-6 grid gap-6 rounded-panel border border-border bg-surface p-6 lg:grid-cols-[1fr_auto] lg:items-center lg:p-8">
          <div><p className="flex items-center gap-2 text-xs text-link"><Sparkles className="size-4" /> Action ready</p><p className="mt-3 text-xl font-semibold">3 invoice reminders are prepared</p><p className="mt-2 text-sm text-muted-foreground">Review the drafts before anything is sent.</p></div>
          <div className="flex flex-col gap-2 sm:flex-row"><Button variant="outline" onClick={() => setApproved(false)}>Review drafts</Button><Button onClick={() => setApproved(true)}>{approved ? <><Check /> Approved</> : "Approve illustration"}</Button></div>
          <p className="text-xs text-muted-foreground lg:col-span-2" aria-live="polite">Interactive illustration only. Nothing is sent or changed.</p>
        </div>
        <ol className="mt-12 grid gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-label="What happens after purchase">{["Purchase confirmed", "Setup review", "Persona", "Integrations", "Testing", "Activation"].map((item, index) => <li key={item} className="rounded-control border border-border p-4 text-sm"><span className="text-xs text-link">0{index + 1}</span><span className="mt-2 block font-medium">{item}</span>{index > 0 ? <span className="mt-1 block text-xs text-muted-foreground">Completed with onboarding</span> : <span className="mt-1 block text-xs text-success">First step</span>}</li>)}</ol>
      </div>
    </section>
  );
}

export function ProductFinalCta() {
  return (
    <section className="scene-band relative overflow-hidden" aria-labelledby="final-title">
      <div className="brand-glow left-1/2 top-1/4 h-[420px] w-[680px] -translate-x-1/2 opacity-40" aria-hidden="true" />
      <Reveal className="relative mx-auto max-w-3xl px-5 text-center"><h2 id="final-title" className="type-statement">Your private AI starts with your business.</h2><p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">Choose a plan, create your account and review the exact setup before secure payment is enabled.</p><Button size="lg" className="mt-8" asChild onClick={() => track("private_ai_cta_click", { cta: "final" })}><a href="#pricing">Choose your AI <ArrowRight /></a></Button></Reveal>
    </section>
  );
}