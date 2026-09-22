import { createFileRoute } from "@tanstack/react-router";

import { BookingProvider } from "@/components/booking/BookingProvider";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { StickyCta } from "@/components/site/StickyCta";
import { Hero } from "@/components/sections/Hero";
import { PatternInterrupt } from "@/components/sections/PatternInterrupt";
import { BrokenChain } from "@/components/sections/BrokenChain";
import { WhatWeAutomate } from "@/components/sections/WhatWeAutomate";
import { Integrations } from "@/components/sections/Integrations";
import { UseCases } from "@/components/sections/UseCases";
import { Calculator } from "@/components/sections/Calculator";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

const TITLE = "Hype Automations | AI Automation Systems for Growing Businesses";
const DESCRIPTION =
  "We automate lead follow-up, WhatsApp replies, CRM updates and bookings with AI systems built around the tools you already use. Book a free consultation.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="pb-20 lg:pb-0">
          <Hero />
          <PatternInterrupt />
          <BrokenChain />
          <WhatWeAutomate />
          <Integrations />
          <UseCases />
          <Calculator />
          <HowItWorks />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
        <StickyCta />
      </div>
    </BookingProvider>
  );
}
