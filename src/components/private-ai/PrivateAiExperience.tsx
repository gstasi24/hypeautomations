import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductNav } from "@/components/private-ai/ProductNav";
import { ProductHero } from "@/components/private-ai/ProductHero";
import {
  CapabilityStory,
  Demonstration,
  Outcomes,
  Personalization,
  ProductFinalCta,
  TrustControl,
} from "@/components/private-ai/Story";
import { Pricing } from "@/components/private-ai/Pricing";
import { captureUtm } from "@/lib/private-ai/analytics";

const FLOW = ["Lead", "AI Qualification", "CRM", "Follow-Up", "Booking"];

export function PrivateAiExperience() {
  useEffect(() => captureUtm(), []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProductNav />
      <main>
        <ProductHero />
        <Demonstration />
        <CapabilityStory />
        <Personalization />
        <Outcomes />
        <TrustControl />
        <Pricing />
        <CustomWorkflowsBridge />
        <ProductFinalCta />
      </main>
      <footer className="border-t border-border py-8">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 text-sm text-muted-foreground sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center lg:px-8">
          <p>© {new Date().getFullYear()} Hype Automations · Hype Private AI</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/custom-workflows" className="hover:text-foreground">Custom Workflows</Link>
            <Link to="/app" className="hover:text-foreground">Customer sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CustomWorkflowsBridge() {
  return (
    <section className="scene-band relative" aria-labelledby="custom-workflows-bridge-title">
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
        <div className="border-y border-border py-10 sm:py-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-link">Hype Custom Workflows</p>
              <h2 id="custom-workflows-bridge-title" className="type-statement mt-4 max-w-3xl">
                Sometimes you don't need an AI assistant. You need the workflow itself automated.
              </h2>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
                We design custom automation systems around a specific process, connecting the apps, decisions and handoffs that keep it moving.
              </p>
              <Link
                to="/custom-workflows"
                className="mt-7 inline-flex min-h-11 items-center gap-2 font-semibold text-link transition-colors hover:text-foreground"
              >
                Explore Hype Custom Workflows <ArrowRight className="size-4" />
              </Link>
            </div>
            <ol className="flex min-w-0 flex-wrap items-center gap-y-3" aria-label="Example custom workflow">
              {FLOW.map((step, index) => (
                <li key={step} className="flex items-center">
                  <span className="rounded-full border border-border-strong bg-surface px-3.5 py-2 text-sm font-medium">{step}</span>
                  {index < FLOW.length - 1 ? <span aria-hidden="true" className="h-px w-5 bg-brand-gradient sm:w-7" /> : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}