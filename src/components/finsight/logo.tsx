import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-navy-gradient shadow-card",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path d="M5 17V7h9" stroke="currentColor" className="text-navy-foreground" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 12h6" stroke="currentColor" className="text-navy-foreground" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="17.5" cy="15.5" r="2.5" className="fill-signal" />
      </svg>
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)} aria-label="FinSight AI home">
      <LogoMark />
      <span className="font-display text-[1.05rem] font-semibold tracking-tight text-foreground">
        FinSight <span className="text-signal">AI</span>
      </span>
    </Link>
  );
}
