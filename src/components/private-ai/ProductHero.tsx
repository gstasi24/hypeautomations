import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, CalendarDays, Check, CreditCard, FileText, HardDrive, ListChecks, Mail, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/private-ai/analytics";
import { cn } from "@/lib/utils";

const TOOLS = [
  { label: "Gmail", icon: Mail }, { label: "Calendar", icon: CalendarDays },
  { label: "Drive", icon: HardDrive }, { label: "CRM", icon: Users },
  { label: "Slack", icon: MessageSquare }, { label: "Documents", icon: FileText },
  { label: "Tasks", icon: ListChecks }, { label: "Stripe", icon: CreditCard },
];

const STAGES = ["Request", "Understands", "Prepares", "Reports"];

export function ProductHero() {
  const scene = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    track("private_ai_hero_view");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = reduced ? undefined : window.setInterval(() => setStage((value) => (value + 1) % STAGES.length), 2200);
    const onScroll = () => {
      const el = scene.current;
      if (!el) return;
      const progress = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / Math.max(1, el.offsetHeight)));
      el.style.setProperty("--hero-progress", String(progress));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { if (timer) window.clearInterval(timer); window.removeEventListener("scroll", onScroll); };
  }, []);

  function pointer(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <section ref={scene} id="top" className="relative min-h-[min(920px,100svh)] overflow-hidden pb-16 pt-28 lg:pt-32">
      <div className="ambient-grid absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="brand-glow -top-48 left-1/2 h-[600px] w-[800px] -translate-x-1/2 opacity-45" aria-hidden="true" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-5 text-center lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-link">Your private AI operator</p>
        <h1 className="type-display mt-5 max-w-5xl">One AI. Your tools. <span className="text-gradient">Your business.</span></h1>
        <p className="mt-5 text-xl font-semibold text-foreground sm:text-2xl">Just tell it what needs to happen.</p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Designed around how your business works—understanding context, coordinating approved tools and preparing action while you stay in control.
        </p>
        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
          <Button size="lg" asChild onClick={() => track("private_ai_cta_click", { cta: "hero_choose" })}>
            <a href="#pricing">Choose your AI</a>
          </Button>
          <Button variant="outline" size="lg" asChild onClick={() => track("demo_interaction", { source: "hero" })}>
            <a href="#demonstration">See it work <ArrowDown /></a>
          </Button>
        </div>

        <div onPointerMove={pointer} className="spotlight-panel mt-14 w-full max-w-4xl rounded-panel border border-border bg-surface/70 p-4 shadow-2xl backdrop-blur-xl sm:p-7">
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 sm:gap-3" aria-label="Tools around Hype Private AI">
            {TOOLS.map(({ label, icon: Icon }, index) => (
              <div key={label} className={cn("flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-control border px-1 text-[10px] transition-colors sm:text-xs", stage >= 1 || index < 4 ? "border-primary/40 bg-background/60 text-foreground" : "border-border text-muted-foreground")}>
                <Icon className="size-4 text-link" aria-hidden="true" />{label}
              </div>
            ))}
          </div>
          <div className="relative mx-auto my-6 flex size-32 items-center justify-center rounded-full border border-border-strong bg-background sm:size-40">
            <span className="absolute inset-3 animate-breathe rounded-full bg-brand-gradient opacity-20 blur-xl" aria-hidden="true" />
            <span className="relative text-center text-xs font-extrabold uppercase leading-relaxed tracking-[0.16em]">Hype<br />Private AI</span>
          </div>
          <ol className="grid grid-cols-4 gap-1.5" aria-label="Illustrative request progress">
            {STAGES.map((label, index) => <li key={label} aria-current={stage === index ? "step" : undefined} className={cn("rounded-control border px-2 py-2 text-center text-[10px] font-semibold sm:text-xs", stage === index ? "border-transparent bg-brand-gradient text-primary-foreground" : index < stage ? "border-success/40 text-success" : "border-border text-muted-foreground")}>{index < stage ? <Check className="mx-auto mb-1 size-3" /> : null}{label}</li>)}
          </ol>
          <p className="mt-5 text-xs text-muted-foreground">Illustrative product experience. Your private environment is configured after purchase.</p>
        </div>
      </div>
    </section>
  );
}