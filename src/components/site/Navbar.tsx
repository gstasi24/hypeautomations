import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "./Logo";
import { useBooking } from "@/components/booking/BookingProvider";
import { Bot, ChevronDown, Menu, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

const LINKS = [
  { label: "Solutions", href: "#solutions" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Integrations", href: "#integrations" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openBooking } = useBooking();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border bg-background/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 lg:px-8">
        <a href="#top" aria-label="Hype Automations home">
          <Logo />
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          <div className="group relative">
            <button className="inline-flex h-11 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
              Products <ChevronDown className="size-3.5" />
            </button>
            <div className="invisible absolute left-1/2 top-full w-80 -translate-x-1/2 rounded-control border border-border bg-surface p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link to="/" className="flex items-start gap-3 rounded-control p-3 hover:bg-surface-2"><Bot className="mt-0.5 size-4 shrink-0 text-link" /><span><span className="block font-semibold text-foreground">Hype Private AI</span><span className="block text-xs">Flagship · one operator across your business</span></span></Link>
              <Link to="/custom-workflows" className="flex items-start gap-3 rounded-control p-3 hover:bg-surface-2"><Workflow className="mt-0.5 size-4 shrink-0 text-link" /><span><span className="block font-semibold text-foreground">Hype Custom Workflows</span><span className="block text-xs">Purpose-built process automation</span></span></Link>
            </div>
          </div>
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="hidden lg:inline-flex" onClick={openBooking}>
            Book a free consultation
          </Button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] border-border bg-surface">
              <div className="mt-10 flex flex-col gap-1 px-4">
                <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Products</p>
                <Link to="/" onClick={() => setMenuOpen(false)} className="rounded-control border border-border px-3 py-3 font-semibold text-link hover:bg-surface-2">Hype Private AI<span className="mt-1 block text-xs font-normal text-muted-foreground">Flagship · one operator across your business</span></Link>
                <Link to="/custom-workflows" onClick={() => setMenuOpen(false)} className="mt-1 rounded-control border border-border px-3 py-3 font-semibold hover:bg-surface-2">Hype Custom Workflows<span className="mt-1 block text-xs font-normal text-muted-foreground">Purpose-built process automation</span></Link>
                <div className="my-3 h-px bg-border" />
                {LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-control px-3 py-3.5 text-base text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
                <Button
                  size="lg"
                  className="mt-6 w-full"
                  onClick={() => {
                    setMenuOpen(false);
                    openBooking();
                  }}
                >
                  Book a Consultation
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
