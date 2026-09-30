import { Logo } from "./Logo";
import { useBooking } from "@/components/booking/BookingProvider";
import { Link } from "@tanstack/react-router";

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
            <Link to="/" className="font-semibold text-link hover:text-foreground">Hype Private AI</Link>
            <Link to="/custom-workflows" className="text-muted-foreground hover:text-foreground">Custom Workflows</Link>
            <Link to="/custom-workflows" hash="solutions" className="text-muted-foreground hover:text-foreground">
              Solutions
            </Link>
            <Link to="/custom-workflows" hash="automations" className="text-muted-foreground hover:text-foreground">
              Automations
            </Link>
            <Link to="/custom-workflows" hash="how-it-works" className="text-muted-foreground hover:text-foreground">
              How it works
            </Link>
            <button
              type="button"
              onClick={openBooking}
               className="min-h-11 text-left text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Book a free consultation
            </button>
            <Link to="/custom-workflows" hash="faq" className="text-muted-foreground hover:text-foreground">
              FAQ
            </Link>
            <Link to="/custom-workflows" hash="integrations" className="text-muted-foreground hover:text-foreground">
              Integrations
            </Link>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Hype Automations — Hype Digital Consulting.</p>
          <p>Demos and figures on this page are examples, not client results.</p>
        </div>
      </div>
    </footer>
  );
}
