import { createFileRoute, Link, type LinkProps } from "@tanstack/react-router";
import { ArrowRight, Clock, FileText } from "lucide-react";

import { AppShell, DemoBadge, Panel, useLaunchDemo } from "@/components/finsight/app-shell";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/lib/analysis-store";
import { DEMO_RESULT } from "@/lib/demo-data";
import { inr } from "@/lib/finance";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — FinSight AI" },
      { name: "description", content: "Choose what to understand: analyze a document, check a loan, find hidden costs or compare offers." },
      { property: "og:title", content: "FinSight AI Dashboard" },
      { property: "og:description", content: "What would you like to understand today?" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const ACTIONS: { emoji: string; title: string; text: string; to: NonNullable<LinkProps["to"]>; feature?: boolean }[] = [
  { emoji: "📄", title: "Analyze a Document", text: "Upload a loan offer, statement, credit-card document or bank notification.", to: "/analyze", feature: true },
  { emoji: "💰", title: "Check a Loan", text: "Enter loan amount, interest rate and tenure to calculate the actual repayment.", to: "/calculator" },
  { emoji: "⚠️", title: "Find Hidden Costs", text: "Identify processing fees, penalties and additional charges.", to: "/analysis" },
  { emoji: "🔍", title: "Compare Offers", text: "Compare two financial offers side by side.", to: "/compare" },
  { emoji: "💬", title: "Ask FinSight", text: "Ask questions about your financial document.", to: "/ask" },
];

function Dashboard() {
  const launchDemo = useLaunchDemo();
  const analysis = useAnalysis();
  return (
    <AppShell>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Good to see you</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">What would you like to understand today?</h1>
          <p className="mt-2 text-muted-foreground">Pick a starting point — or launch the guided demo.</p>
        </div>
        <Button variant="hero" size="xl" onClick={launchDemo} className="w-full md:w-auto">
          🚀 Launch Live Demo
        </Button>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {ACTIONS.map((a, i) => (
          <Link
            key={a.title}
            to={a.to}
            className={cn(
              "group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated animate-fade-up",
              a.feature ? "border-transparent bg-navy-gradient text-navy-foreground lg:row-span-2" : "border-border bg-card",
            )}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {a.feature && <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-signal/25 blur-3xl" />}
            <div className="relative">
              <span className={cn("flex h-14 w-14 items-center justify-center rounded-2xl text-2xl", a.feature ? "bg-navy-foreground/10" : "bg-secondary")}>
                {a.emoji}
              </span>
              <h2 className={cn("mt-6 font-semibold", a.feature ? "text-2xl sm:text-3xl" : "text-xl")}>{a.title}</h2>
              <p className={cn("mt-2", a.feature ? "max-w-sm text-navy-foreground/75" : "text-muted-foreground")}>{a.text}</p>
              {a.feature && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {["PDF", "JPG", "PNG"].map((f) => (
                    <span key={f} className="rounded-md bg-navy-foreground/10 px-2.5 py-1 text-xs font-semibold">{f}</span>
                  ))}
                </div>
              )}
            </div>
            <span className={cn("relative mt-8 inline-flex items-center gap-1.5 text-sm font-semibold", a.feature ? "text-signal" : "text-foreground")}>
              Get started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Panel>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Recent analysis</h3>
            <DemoBadge />
          </div>
          {analysis.status === "analyzed" ? (
            <Link to="/analysis" className="mt-4 flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-secondary">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal-soft text-signal"><FileText className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{analysis.fileName}</p>
                <p className="text-xs text-muted-foreground">EMI {inr(DEMO_RESULT.emi)} · Total {inr(DEMO_RESULT.totalCost)}</p>
              </div>
              <span className="rounded-full bg-warning-soft px-2.5 py-1 text-xs font-bold text-warning-ink">Review</span>
            </Link>
          ) : (
            <div className="mt-4 flex flex-col items-start gap-3 rounded-xl border border-dashed border-border p-6 sm:flex-row sm:items-center">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <p className="flex-1 text-sm text-muted-foreground">No documents analyzed yet. Start with the demo document to see FinSight in action.</p>
              <Button variant="soft" size="sm" onClick={launchDemo}>Use demo</Button>
            </div>
          )}
        </Panel>
        <Panel className="bg-signal-soft border-signal/30">
          <p className="eyebrow">Tip</p>
          <p className="mt-2 font-semibold">Compare the total outflow, not just the EMI.</p>
          <p className="mt-1 text-sm text-muted-foreground">A lower EMI over a longer tenure often costs more in total.</p>
          <Button asChild variant="link" className="mt-2 px-0">
            <Link to="/learn">Learn banking terms <ArrowRight /></Link>
          </Button>
        </Panel>
      </div>
    </AppShell>
  );
}
