// Client-safe helpers and constants shared by the booking flow.

export const BUSINESS_TYPES = [
  "Professional Services",
  "Hospitality",
  "Agency",
  "E-commerce",
  "Local Business",
  "Sales Team",
  "Other",
] as const;

export const AUTOMATION_GOALS = [
  "Lead management",
  "WhatsApp",
  "Follow-ups",
  "Appointments",
  "Customer support",
  "Internal operations",
  "Not sure yet",
] as const;

export const ENQUIRY_SOURCES = [
  "Website",
  "WhatsApp",
  "Instagram / Meta",
  "Email",
  "Phone",
  "Other",
] as const;

export const TOOL_OPTIONS = [
  "WhatsApp Business",
  "Google Calendar",
  "Gmail / Outlook",
  "Google Sheets / Excel",
  "Notion",
  "HubSpot",
  "Stripe",
  "Shopify",
  "Meta Ads",
  "None yet",
] as const;

export type AvailabilityDay = {
  date: string;
  label: string;
  slots: { start: string; end: string; label: string }[];
};

export type AvailabilityResponse = {
  timezone: string;
  meetingType: string;
  durationMinutes: number;
  days: AvailabilityDay[];
};

export type BookingConfirmation = {
  id: string;
  slotStart: string;
  slotEnd: string;
  timezone: string;
  dateLabel: string;
  timeLabel: string;
  manageToken: string;
};

export function formatInTimeZone(
  iso: string,
  timeZone: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone, ...options }).format(new Date(iso));
}
