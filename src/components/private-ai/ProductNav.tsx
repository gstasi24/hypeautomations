import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";

export function ProductNav({ minimal = false }: { minimal?: boolean }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <div className="flex items-center gap-3">
          <Link to="/" aria-label="Hype Automations home">
            <Logo />
          </Link>
          <span className="hidden h-6 w-px bg-border sm:block" />
          <Link
            to="/private-ai"
            className="hidden text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground sm:block"
          >
            Private AI
          </Link>
        </div>
        {!minimal && (
          <div className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
            <a href="#what-it-does" className="hover:text-foreground">What it does</a>
            <a href="#roles" className="hover:text-foreground">Roles</a>
            <a href="#control" className="hover:text-foreground">Control</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/app">Sign in</Link>
          </Button>
          {!minimal && (
            <Button size="sm" asChild>
              <a href="#pricing">Choose Your AI</a>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
