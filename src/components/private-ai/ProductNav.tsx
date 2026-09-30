import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bot, ChevronDown, Menu, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductNav({ minimal = false }: { minimal?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled ? "border-b border-border bg-background/85 backdrop-blur-xl" : "border-b border-transparent bg-background/30 backdrop-blur-md")}>
      <nav className={cn("mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 transition-[height] duration-300 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:px-8", scrolled ? "h-14" : "h-16")} aria-label="Primary navigation">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/" aria-label="Hype Automations home">
            <Logo />
          </Link>
          <span className="hidden h-6 w-px bg-border sm:block" />
          <Link
            to="/"
            className="hidden text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground sm:block"
          >
            Private AI
          </Link>
        </div>
        {!minimal ? (
          <div className="hidden items-center justify-center gap-6 text-sm text-muted-foreground lg:flex">
            <ProductsMenu />
            <Link to="/" hash="demonstration" className="hover:text-foreground">How it works</Link>
            <Link to="/" hash="control" className="hover:text-foreground">Control</Link>
            <Link to="/" hash="pricing" className="hover:text-foreground">Pricing</Link>
          </div>
        ) : null}
        <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/app">Sign in</Link>
          </Button>
          {!minimal && (
            <Button size="sm" className="hidden sm:inline-flex" asChild>
              <Link to="/" hash="pricing">Choose Your AI</Link>
            </Button>
          )}
          {!minimal ? (
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[88vw] border-border bg-surface sm:max-w-sm">
                <div className="mt-10 flex flex-col gap-2 px-3">
                  <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Products</p>
                  <ProductMobileLink to="/" title="Hype Private AI" text="Flagship · one operator across your business" close={() => setMenuOpen(false)} />
                  <ProductMobileLink to="/custom-workflows" title="Hype Custom Workflows" text="Purpose-built process automation" close={() => setMenuOpen(false)} />
                  <div className="my-3 h-px bg-border" />
                   <Link to="/" hash="demonstration" onClick={() => setMenuOpen(false)} className="rounded-control px-3 py-3 text-muted-foreground hover:bg-surface-2 hover:text-foreground">How it works</Link>
                  <Link to="/" hash="control" onClick={() => setMenuOpen(false)} className="rounded-control px-3 py-3 text-muted-foreground hover:bg-surface-2 hover:text-foreground">Control</Link>
                  <Link to="/" hash="pricing" onClick={() => setMenuOpen(false)} className="rounded-control px-3 py-3 text-muted-foreground hover:bg-surface-2 hover:text-foreground">Pricing</Link>
                  <Button className="mt-4 w-full" asChild><Link to="/" hash="pricing" onClick={() => setMenuOpen(false)}>Choose Your AI</Link></Button>
                </div>
              </SheetContent>
            </Sheet>
          ) : null}
        </div>
      </nav>
    </header>
  );
}

export function ProductsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-10 items-center gap-1 rounded-control px-2 text-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
        Products <ChevronDown className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-80 border-border bg-surface p-2">
        <DropdownMenuLabel className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Hype products</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer p-3 focus:bg-surface-2">
          <Link to="/" className="items-start">
            <Bot className="mt-0.5 text-link" />
            <span><span className="block font-semibold">Hype Private AI</span><span className="mt-0.5 block text-xs text-muted-foreground">Flagship · one operator across your business</span></span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer p-3 focus:bg-surface-2">
          <Link to="/custom-workflows" className="items-start">
            <Workflow className="mt-0.5 text-link" />
            <span><span className="block font-semibold">Hype Custom Workflows</span><span className="mt-0.5 block text-xs text-muted-foreground">Purpose-built process automation</span></span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProductMobileLink({ to, title, text, close }: { to: "/" | "/custom-workflows"; title: string; text: string; close: () => void }) {
  return (
    <Link to={to} onClick={close} className="rounded-control border border-border px-4 py-3 hover:border-primary/50 hover:bg-surface-2">
      <span className="block font-semibold">{title}</span>
      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{text}</span>
    </Link>
  );
}
