import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Bot, CalendarClock, CreditCard, History, Brain, Plug, Settings, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import { track } from "@/lib/private-ai/analytics";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "Your workspace | Hype Private AI" },
      { name: "description", content: "Your Hype Private AI customer workspace." },
      { property: "og:title", content: "Your workspace | Hype Private AI" },
      { property: "og:description", content: "Your Hype Private AI customer workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppShell,
});

export const APP_NAV = [
  { section: "history", label: "History", icon: History },
  { section: "integrations", label: "Integrations", icon: Plug },
  { section: "memory", label: "Memory", icon: Brain },
  { section: "schedules", label: "Schedules", icon: CalendarClock },
  { section: "settings", label: "Settings", icon: Settings },
  { section: "billing", label: "Billing", icon: CreditCard },
] as const;

const itemCls =
  "flex shrink-0 items-center gap-2.5 rounded-control px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground";
const activeCls = "bg-surface-2 text-foreground";

function AppShell() {
  const navigate = useNavigate();
  useEffect(() => track("app_opened"), []);
  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4 lg:block">
          <Link to="/private-ai"><Logo /></Link>
          <p className="hidden pt-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-link lg:block">Private AI</p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/" });
            }}
            className="text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Sign out"
          >
            <LogOut className="size-4" />
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0">
          <Link to="/app" activeOptions={{ exact: true }} className={itemCls} activeProps={{ className: activeCls }}>
            <Bot className="size-4" /> AI
          </Link>
          {APP_NAV.map((n) => (
            <Link key={n.section} to="/app/$section" params={{ section: n.section }} className={itemCls} activeProps={{ className: activeCls }}>
              <n.icon className="size-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/" });
          }}
          className="absolute bottom-6 left-3 hidden items-center gap-2.5 px-3 text-sm text-muted-foreground hover:text-foreground lg:flex"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </aside>
      <main className="min-w-0 px-5 py-8 lg:px-10 lg:py-12">
        <Outlet />
      </main>
    </div>
  );
}
