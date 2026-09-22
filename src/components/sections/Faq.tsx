import { Statement } from "@/components/site/Section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ITEMS = [
  {
    q: "Do I need to change the tools I use?",
    a: "No. We build around your existing tools wherever possible and connect them instead of replacing them.",
  },
  {
    q: "Is this only for large companies?",
    a: "No. Smaller teams often benefit most, because there are fewer people available to handle repetitive work.",
  },
  {
    q: "How long does it take to build?",
    a: "It depends on how many processes are involved. We give you a realistic timeline in the consultation, before anything is built.",
  },
  {
    q: "Will automation make my business feel impersonal?",
    a: "The opposite is the goal. Automation handles the mechanical steps so your team has time for real conversations.",
  },
  {
    q: "What happens if something breaks?",
    a: "Workflows are monitored and we adjust them when your tools or processes change. You have a direct contact for issues.",
  },
  {
    q: "Do I need technical knowledge?",
    a: "No. We handle the setup and hand over a system you can operate without touching any code.",
  },
  {
    q: "What happens in the free consultation?",
    a: "We walk through your current process, identify what can be automated first and show you what a system for your business would look like. No obligation.",
  },
];

export function Faq() {
  return (
    <Statement id="faq" rail="flow" title="Questions, answered.">
      <Accordion type="single" collapsible className="max-w-3xl">
        {ITEMS.map((item) => (
          <AccordionItem
            key={item.q}
            value={item.q}
            className="border-border border-b last:border-b-0"
          >
            <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-base leading-relaxed text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Statement>
  );
}
