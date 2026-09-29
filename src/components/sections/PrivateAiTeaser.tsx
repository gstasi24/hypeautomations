import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/private-ai/analytics";

/** Entry point from the automation funnel into the Hype Private AI product. */
export function PrivateAiTeaser() {
  return (
    <section id="private-ai" className="relative py-12 lg:py-16">
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-panel border border-primary/40 bg-surface p-7 glow-ring sm:p-10">
          <div className="brand-glow -right-24 -top-24 h-72 w-72 opacity-50" aria-hidden />
          <p className="relative text-xs font-semibold uppercase tracking-[0.28em] text-link">New · Hype Private AI</p>
          <h2 className="type-statement relative mt-4 max-w-2xl">One AI. Your tools. Your business.</h2>
          <p className="relative mt-4 max-w-xl text-lg text-muted-foreground">
            A private AI operator built around your business. Connected to the tools you approve, with your approval where it matters.
          </p>
          <div className="relative mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Button size="lg" asChild onClick={() => track("private_ai_cta_click", { cta: "home_teaser" })}>
              <Link to="/private-ai">Discover Private AI</Link>
            </Button>
            <Button variant="link" size="lg" className="px-0" asChild>
              <Link to="/private-ai" hash="pricing">See plans</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
