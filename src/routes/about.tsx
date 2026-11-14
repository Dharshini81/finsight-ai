import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, CheckCircle2, XCircle } from "lucide-react";

import { AppShell } from "@/components/finsight/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Why FinSight — making banking understandable" },
      { name: "description", content: "Financial products hide complexity in fees, penalties and jargon. FinSight turns them into clear decisions." },
      { property: "og:title", content: "Banking is digital. Understanding it shouldn't be difficult." },
      { property: "og:description", content: "The problem FinSight AI solves, and the impact it creates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AboutPage,
});

const BEFORE = ["Confusing documents", "Hidden costs", "Complex terminology", "Difficult comparisons"];
const AFTER = ["Clear explanation", "Cost breakdown", "Risk indicators", "Decision support"];

function AboutPage() {
  return (
    <AppShell variant="site">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">The problem</p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Banking is digital. Understanding it shouldn't be difficult.</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Financial products often contain complex terminology, fees, penalties and conditions that are difficult for ordinary users
          to understand.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-3xl">
        <div className="rounded-2xl border border-danger/25 bg-danger-soft p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-danger">Before FinSight</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {BEFORE.map((b) => (
              <li key={b} className="flex items-center gap-2.5 rounded-xl bg-card px-4 py-3 text-sm font-medium shadow-card">
                <XCircle className="h-4 w-4 text-danger" /> {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center py-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-gradient text-navy-foreground shadow-elevated">
            <ArrowDown className="h-5 w-5" />
          </span>
        </div>
        <div className="rounded-2xl border border-success/30 bg-success-soft p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-success">With FinSight</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {AFTER.map((b) => (
              <li key={b} className="flex items-center gap-2.5 rounded-xl bg-card px-4 py-3 text-sm font-medium shadow-card">
                <CheckCircle2 className="h-4 w-4 text-success" /> {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-14 flex flex-wrap justify-center gap-3">
        <Button asChild variant="hero" size="xl">
          <Link to="/analyze">Analyze a Document <ArrowRight /></Link>
        </Button>
        <Button asChild variant="soft" size="xl">
          <Link to="/technology">See the architecture</Link>
        </Button>
      </div>
    </AppShell>
  );
}
