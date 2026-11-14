import { Link, useNavigate, type LinkProps } from "@tanstack/react-router";
import { Menu, Presentation, Rocket } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { analysisStore } from "@/lib/analysis-store";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const APP_NAV = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/analyze", label: "Analyze" },
  { to: "/analysis", label: "My Analysis" },
  { to: "/compare", label: "Compare" },
  { to: "/learn", label: "Learn" },
  { to: "/settings", label: "Settings" },
] as const;

const SITE_NAV = [
  { to: "/dashboard", label: "Product" },
  { to: "/about", label: "Why FinSight" },
  { to: "/security", label: "Security" },
  { to: "/technology", label: "Technology" },
] as const;

export function useLaunchDemo() {
  const navigate = useNavigate();
  return () => {
    analysisStore.requestDemo();
    navigate({ to: "/analyze" });
  };
}

function NavLinks({ variant, onNavigate }: { variant: "app" | "site"; onNavigate?: () => void }) {
  const items = variant === "app" ? APP_NAV : SITE_NAV;
  return (
    <>
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          activeProps={{ className: "bg-secondary text-foreground" }}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}

export function SiteHeader({ variant = "app" }: { variant?: "app" | "site" }) {
  const [open, setOpen] = useState(false);
  const launchDemo = useLaunchDemo();
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="ml-6 hidden items-center gap-0.5 lg:flex">
          <NavLinks variant={variant} />
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/present">
              <Presentation /> Presentation Mode
            </Link>
          </Button>
          {variant === "site" ? (
            <Button asChild variant="hero" size="sm">
              <Link to="/dashboard">Open App</Link>
            </Button>
          ) : (
            <Button variant="hero" size="sm" onClick={launchDemo}>
              <Rocket /> Launch Live Demo
            </Button>
          )}
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto md:ml-0 lg:hidden" aria-label="Open menu">
              <Menu className="!size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="mt-8 flex flex-col gap-1">
              <NavLinks variant="app" onNavigate={() => setOpen(false)} />
              <div className="my-3 h-px bg-border" />
              <NavLinks variant="site" onNavigate={() => setOpen(false)} />
              <div className="my-3 h-px bg-border" />
              <Button
                variant="hero"
                onClick={() => {
                  setOpen(false);
                  launchDemo();
                }}
              >
                <Rocket /> Launch Live Demo
              </Button>
              <Button asChild variant="soft" onClick={() => setOpen(false)}>
                <Link to="/present">
                  <Presentation /> Presentation Mode
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            An AI decision-support layer for banking documents. Understand → Analyze → Warn → Recommend.
          </p>
        </div>
        <FooterCol title="Product" links={[["/dashboard", "Dashboard"], ["/analyze", "Analyze a document"], ["/calculator", "Loan calculator"], ["/compare", "Compare offers"], ["/ask", "Ask FinSight"]]} />
        <FooterCol title="Company" links={[["/about", "Why FinSight"], ["/technology", "Technology"], ["/security", "Security & privacy"], ["/learn", "Learn"]]} />
        <FooterCol title="Demo" links={[["/present", "Presentation mode"], ["/admin", "Analytics (demo)"], ["/settings", "Settings"]]} />
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted-foreground sm:px-6">
          FinSight provides informational analysis and does not replace professional financial advice. All
          figures shown are demo / synthetic data and do not belong to any real bank.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [NonNullable<LinkProps["to"]>, string][] }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-foreground">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map(([to, label]) => (
          <li key={to}>
            <Link to={to} className="text-sm text-muted-foreground hover:text-foreground">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AppShell({
  children,
  variant = "app",
  className,
}: {
  children: ReactNode;
  variant?: "app" | "site";
  className?: string;
}) {
  return (
    <div className="min-h-screen">
      <SiteHeader variant={variant} />
      <main className={cn("mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-12", className)}>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function DemoBadge({ className, label = "Demo / Synthetic Data" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning-soft px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-warning-ink",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-warning" />
      {label}
    </span>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6", className)}>{children}</div>
  );
}
