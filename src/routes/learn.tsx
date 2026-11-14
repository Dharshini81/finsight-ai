import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";

import { AppShell, PageHeader } from "@/components/finsight/app-shell";
import { GLOSSARY } from "@/lib/demo-data";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn banking terms — FinSight AI" },
      { name: "description", content: "Plain-language explanations of EMI, APR, processing fees, prepayment and other banking terms." },
      { property: "og:title", content: "Learn banking terms — FinSight AI" },
      { property: "og:description", content: "Banking jargon, explained simply." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Learn" title="Banking terms, explained simply" subtitle="The words that matter most when you read a loan or card document." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GLOSSARY.map((g) => (
          <div key={g.term} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <BookOpen className="h-5 w-5 text-signal" />
            <h3 className="mt-3 text-lg font-semibold">{g.term}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{g.meaning}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {([
          ["/about", "Why FinSight exists"],
          ["/security", "How we protect your privacy"],
          ["/technology", "How FinSight works"],
        ] as const).map(([to, label]) => (
          <Link key={to} to={to} className="group flex items-center justify-between rounded-2xl border border-border bg-surface p-5 font-semibold transition-colors hover:bg-secondary">
            {label} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
