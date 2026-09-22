import { Bot, CalendarCheck, Database, MessageCircle, Send, UserPlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** One example lead, handled end to end. Story copy, not metrics. */
export type RunStep = {
  icon: LucideIcon;
  event: string;
  detail: string;
};

export const RUN_STEPS: RunStep[] = [
  { icon: UserPlus, event: "Sara filled in the contact form", detail: "Website form, 09:12" },
  { icon: Bot, event: "Qualified: budget and timeline fit", detail: "AI read the enquiry" },
  { icon: Database, event: "Added to the CRM", detail: "Contact created, stage set to Qualified" },
  { icon: MessageCircle, event: "WhatsApp sent", detail: "“Hi Sara, thanks for reaching out…”" },
  { icon: Send, event: "Follow-up queued for tomorrow", detail: "Only if there is no reply" },
  { icon: CalendarCheck, event: "Booked Thursday, 14:00", detail: "Invite sent to both sides" },
];

export const RUN_STEP_MS = 450;
