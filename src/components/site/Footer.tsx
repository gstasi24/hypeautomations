import { Logo } from "./Logo";
import { useBooking } from "@/components/booking/BookingProvider";

export function Footer() {
  const { openBooking } = useBooking();

  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">by Hype Digital Consulting</p>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Turn manual work into systems. Automate smarter. Grow faster.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
            <a href="#solutions" className="text-muted-foreground hover:text-foreground">
              Solutions
            </a>
            <a href="#automations" className="text-muted-foreground hover:text-foreground">
              Automations
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground">
              How It Works
            </a>
            <button
              type="button"
              onClick={openBooking}
              className="text-left text-muted-foreground hover:text-foreground"
            >
              Book a free consultation
            </button>
            <a href="#faq" className="text-muted-foreground hover:text-foreground">
              FAQ
            </a>
            <a href="#integrations" className="text-muted-foreground hover:text-foreground">
              Integrations
            </a>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Hype Automations — Hype Digital Consulting.</p>
          <p>
            Dashboards and figures shown on this page are illustrative examples, not client results.
          </p>
        </div>
      </div>
    </footer>
  );
}
