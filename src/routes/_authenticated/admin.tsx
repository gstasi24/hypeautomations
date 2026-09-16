import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getAdminOverview,
  addBlockedDate,
  removeBlockedDate,
  setBookingStatus,
  toggleAvailabilityRule,
  updateBookingSettings,
} from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { CalendarX2, Loader2, LogOut, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Consultations Dashboard | Hype Automations" },
      { name: "description", content: "Manage consultation bookings and availability." },
      { property: "og:title", content: "Consultations Dashboard | Hype Automations" },
      { property: "og:description", content: "Manage consultation bookings and availability." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
  errorComponent: ({ error }) => (
    <main className="flex min-h-screen items-center justify-center px-5 text-center">
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </main>
  ),
});

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchOverview = useServerFn(getAdminOverview);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => fetchOverview(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-overview"] });

  const statusMutation = useMutation({
    mutationFn: useServerFn(setBookingStatus),
    onSuccess: () => {
      toast.success("Booking updated");
      invalidate();
    },
    onError: () => toast.error("Could not update the booking"),
  });

  const toggleRule = useMutation({
    mutationFn: useServerFn(toggleAvailabilityRule),
    onSuccess: invalidate,
    onError: () => toast.error("Could not update availability"),
  });

  const addBlocked = useMutation({
    mutationFn: useServerFn(addBlockedDate),
    onSuccess: () => {
      toast.success("Date blocked");
      invalidate();
    },
    onError: () => toast.error("Could not block that date"),
  });

  const removeBlocked = useMutation({
    mutationFn: useServerFn(removeBlockedDate),
    onSuccess: invalidate,
    onError: () => toast.error("Could not remove that date"),
  });

  const saveSettings = useMutation({
    mutationFn: useServerFn(updateBookingSettings),
    onSuccess: () => {
      toast.success("Settings saved");
      invalidate();
    },
    onError: () => toast.error("Could not save settings"),
  });

  const [blockDate, setBlockDate] = useState("");
  const [blockReason, setBlockReason] = useState("");

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!data?.isAdmin) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="text-xl font-semibold">No dashboard access</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          This account isn't an administrator yet. An existing administrator needs to grant access
          before consultations become visible.
        </p>
        <Button variant="outline" onClick={handleSignOut}>
          Sign out
        </Button>
      </main>
    );
  }

  const bookings = data.bookings;
  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" && Date.parse(b.slot_start) >= Date.now(),
  );
  const settings = data.settings;

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Hype Automations
          </p>
          <h1 className="mt-1 text-2xl font-bold">Consultations</h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          <LogOut className="size-4" /> Sign out
        </Button>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Upcoming", value: upcoming.length },
          { label: "Total booked", value: bookings.length },
          { label: "Blocked dates", value: data.blockedDates.length },
          { label: "Active windows", value: data.availability.filter((a) => a.enabled).length },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="bookings" className="mt-8">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="mt-5 space-y-3">
          {bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No consultations booked yet.</p>
          ) : (
            bookings.map((booking) => (
              <article key={booking.id} className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "full",
                        timeStyle: "short",
                        timeZone: settings?.timezone ?? "Europe/Rome",
                      }).format(new Date(booking.slot_start))}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.full_name}
                      {booking.company ? ` · ${booking.company}` : ""}
                    </p>
                  </div>
                  <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                    {booking.status}
                  </Badge>
                </div>

                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">Email</dt>
                    <dd>{booking.email}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Phone / WhatsApp</dt>
                    <dd>{booking.phone ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Business type</dt>
                    <dd>{booking.business_type ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Website</dt>
                    <dd>{booking.website ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Wants to automate</dt>
                    <dd>{booking.automation_goals.join(", ") || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Enquiries come from</dt>
                    <dd>{booking.enquiry_sources.join(", ") || "—"}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Tools</dt>
                    <dd>
                      {[...booking.tools, booking.tools_other].filter(Boolean).join(", ") || "—"}
                    </dd>
                  </div>
                  {booking.notes ? (
                    <div className="sm:col-span-2">
                      <dt className="text-muted-foreground">Notes</dt>
                      <dd>{booking.notes}</dd>
                    </div>
                  ) : null}
                </dl>

                <div className="mt-4 flex flex-wrap gap-2">
                  {booking.status !== "cancelled" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        statusMutation.mutate({ data: { id: booking.id, status: "cancelled" } })
                      }
                    >
                      <CalendarX2 className="size-4" /> Cancel
                    </Button>
                  ) : null}
                  {booking.status !== "completed" ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        statusMutation.mutate({ data: { id: booking.id, status: "completed" } })
                      }
                    >
                      Mark completed
                    </Button>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </TabsContent>

        <TabsContent value="availability" className="mt-5 space-y-6">
          <section className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold">Weekly windows</h2>
            <ul className="mt-4 space-y-2">
              {data.availability.map((rule) => (
                <li key={rule.id} className="flex items-center justify-between gap-3 text-sm">
                  <span>
                    {WEEKDAYS[rule.weekday]} · {rule.start_time.slice(0, 5)}–
                    {rule.end_time.slice(0, 5)}
                  </span>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={(enabled) =>
                      toggleRule.mutate({ data: { id: rule.id, enabled } })
                    }
                  />
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold">Blocked dates</h2>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <div className="space-y-2">
                <Label htmlFor="block-date">Date</Label>
                <Input
                  id="block-date"
                  type="date"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="block-reason">Reason (optional)</Label>
                <Input
                  id="block-reason"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Holiday"
                />
              </div>
              <Button
                onClick={() => {
                  if (!blockDate) return;
                  addBlocked.mutate({
                    data: { date: blockDate, reason: blockReason || undefined },
                  });
                  setBlockDate("");
                  setBlockReason("");
                }}
              >
                Block date
              </Button>
            </div>

            <ul className="mt-5 space-y-2">
              {data.blockedDates.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span>
                    {item.blocked_on}
                    {item.reason ? ` · ${item.reason}` : ""}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeBlocked.mutate({ data: { id: item.id } })}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        </TabsContent>

        <TabsContent value="settings" className="mt-5">
          {settings ? (
            <form
              className="grid gap-4 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget as HTMLFormElement);
                saveSettings.mutate({
                  data: {
                    timezone: String(form.get("timezone")),
                    slot_duration_minutes: Number(form.get("slot_duration_minutes")),
                    buffer_minutes: Number(form.get("buffer_minutes")),
                    max_bookings_per_day: Number(form.get("max_bookings_per_day")),
                    min_notice_hours: Number(form.get("min_notice_hours")),
                    booking_horizon_days: Number(form.get("booking_horizon_days")),
                    meeting_type: String(form.get("meeting_type")),
                  },
                });
              }}
            >
              {[
                { name: "timezone", label: "Timezone", type: "text" },
                { name: "meeting_type", label: "Meeting type", type: "text" },
                { name: "slot_duration_minutes", label: "Meeting length (min)", type: "number" },
                { name: "buffer_minutes", label: "Buffer between calls (min)", type: "number" },
                { name: "max_bookings_per_day", label: "Max bookings per day", type: "number" },
                { name: "min_notice_hours", label: "Minimum notice (hours)", type: "number" },
                { name: "booking_horizon_days", label: "Bookable days ahead", type: "number" },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    defaultValue={String(settings[field.name as keyof typeof settings] ?? "")}
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <Button type="submit">Save settings</Button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">Settings unavailable.</p>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
