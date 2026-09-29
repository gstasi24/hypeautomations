import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { ProductNav } from "@/components/private-ai/ProductNav";
import { ProductHero } from "@/components/private-ai/ProductHero";
import {
  Control,
  Ecosystem,
  Examples,
  Interrupt,
  NotAChatbot,
  Privacy,
  ProductFinalCta,
  Roles,
} from "@/components/private-ai/Story";
import { Pricing } from "@/components/private-ai/Pricing";
import { captureUtm } from "@/lib/private-ai/analytics";
import { Link } from "@tanstack/react-router";

const TITLE = "Hype Private AI | Your Private AI Operator";
const DESCRIPTION =
  "A private AI operator built around your business, designed to work across your connected tools, remember context and help execute everyday workflows with human approval where it matters.";

export const Route = createFileRoute("/private-ai/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivateAiPage,
});

function PrivateAiPage() {
  useEffect(() => captureUtm(), []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProductNav />
      <main>
        <ProductHero />
        <Interrupt />
        <NotAChatbot />
        <Examples />
        <Roles />
        <Ecosystem />
        <Privacy />
        <Control />
        <Pricing />
        <ProductFinalCta />
      </main>
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 text-sm text-muted-foreground sm:flex-row sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Hype Automations · Hype Private AI</p>
          <div className="flex gap-5">
            <Link to="/" className="hover:text-foreground">Automation services</Link>
            <Link to="/app" className="hover:text-foreground">Customer sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
