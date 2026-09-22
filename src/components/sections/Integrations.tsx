import { Statement } from "@/components/site/Section";

const GROUPS = [
  {
    title: "Communication",
    tools: ["WhatsApp Business", "Email", "SMS", "Slack", "Telegram"],
  },
  {
    title: "CRM and sales",
    tools: ["HubSpot", "Pipedrive", "Salesforce", "Zoho", "Airtable"],
  },
  {
    title: "Calendars and forms",
    tools: ["Google Calendar", "Outlook", "Typeform", "Webflow", "Website forms"],
  },
  {
    title: "Data and operations",
    tools: ["Google Sheets", "Notion", "Databases", "Invoicing tools", "Internal systems"],
  },
];

export function Integrations() {
  return (
    <Statement
      id="integrations"
      rail="flow"
      title="Works with the tools you already use."
      lead="You don't need to change your systems. We connect them."
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-semibold">{group.title}</h3>
            <ul className="mt-3 space-y-1.5 text-muted-foreground">
              {group.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-10 max-w-xl text-sm text-muted-foreground">
        Using something else? Most modern tools can be connected. We'll confirm yours on the call.
      </p>
    </Statement>
  );
}
