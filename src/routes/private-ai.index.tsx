import { createFileRoute } from "@tanstack/react-router";
import { PrivateAiExperience } from "@/components/private-ai/PrivateAiExperience";

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
  component: PrivateAiExperience,
});
