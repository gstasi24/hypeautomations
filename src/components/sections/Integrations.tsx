import { Reveal } from "@/components/site/Reveal";

const GROUPS = [
  {
    title: "Communication",
    tools: ["WhatsApp Business", "Email", "SMS", "Slack", "Telegram"],
  },
  {
    title: "CRM & Sales",
    tools: ["HubSpot", "Pipedrive", "Salesforce", "Zoho", "Airtable"],
  },
  {
    title: "Calendars & Forms",
    tools: ["Google Calendar", "Outlook", "Typeform", "Webflow", "Website forms"],
  },
  {
    title: "Data & Operations",
    tools: ["Google Sheets", "Notion", "Databases", "Invoicing tools", "Internal systems"],
  },
];

export function Integrations() {
  return (
    <section id="integrations" className="relative py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Works with the tools <span className="text-gradient">you already use.</span>
          </h2>
          <p className="mt-5 max-w-xl text-muted-foreground">
            You don't need to change your systems. We connect them.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GROUPS.map((group, index) => (
            <Reveal key={group.title} delay={index * 80}>
              <div className="h-full rounded-2xl border border-border bg-surface/60 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                  {group.title}
                </p>
                <ul className="mt-4 space-y-2">
                  {group.tools.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-xl border border-border bg-surface-2/50 px-3.5 py-2.5 text-sm transition-colors hover:border-primary/50 hover:text-foreground"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <p className="mt-8 text-sm text-muted-foreground">
            Using something else? Most modern tools can be connected — we'll confirm yours on the
            call.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
