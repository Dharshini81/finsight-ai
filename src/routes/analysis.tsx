import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, FileText, Info, RotateCcw, Scale } from "lucide-react";

import {
  CostBreakdown,
  ExplainSimply,
  FinancialSummary,
  HiddenCosts,
  RiskScore,
  SectionTitle,
  TermsGrid,
  VerdictCard,
} from "@/components/finsight/analysis-sections";
import { AppShell, DemoBadge, useLaunchDemo } from "@/components/finsight/app-shell";
import { AskPanel } from "@/components/finsight/ask-panel";
import { Button } from "@/components/ui/button";
import { analysisStore, useAnalysis } from "@/lib/analysis-store";
import { DEMO_DOCUMENT } from "@/lib/demo-data";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "My Analysis — FinSight AI" },
      { name: "description", content: "Financial summary, hidden costs, true repayment cost, risk check and FinSight verdict for your document." },
      { property: "og:title", content: "AI Analysis Complete — FinSight AI" },
      { property: "og:description", content: "See the real cost, detected fees and a clear verdict before you accept." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AnalysisPage,
});

function AnalysisPage() {
  const analysis = useAnalysis();
  const launchDemo = useLaunchDemo();

  if (analysis.status !== "analyzed") {
    return (
      <AppShell>
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-10 text-center shadow-card">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold">No analysis yet</h1>
          <p className="mt-2 text-muted-foreground">Upload a document or run the live demo to see your financial decision dashboard.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="hero" size="xl" onClick={launchDemo}>🚀 Launch Live Demo</Button>
            <Button asChild variant="soft" size="xl">
              <Link to="/analyze">Upload a document</Link>
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6 md:flex-row md:items-center">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-success-soft text-success">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold sm:text-3xl">AI Analysis Complete</h1>
            <DemoBadge />
          </div>
          <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
            <FileText className="h-4 w-4 shrink-0" /> {analysis.fileName} · {DEMO_DOCUMENT.product} · {DEMO_DOCUMENT.lender}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="soft">
            <Link to="/compare"><Scale /> Compare</Link>
          </Button>
          <Button
            variant="ghost"
            onClick={() => analysisStore.reset()}
            asChild
          >
            <Link to="/analyze"><RotateCcw /> New analysis</Link>
          </Button>
        </div>
      </div>

      {analysis.source === "upload" && (
        <p className="mt-4 flex gap-2 rounded-xl border border-warning/40 bg-warning-soft px-4 py-3 text-sm text-warning-ink">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          Prototype: your file was received in the browser. Results below use the synthetic demo loan until the document-processing
          backend is connected.
        </p>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.25fr]">
        <FinancialSummary />
        <div className="flex flex-col gap-5">
          <VerdictCard />
          <RiskScore />
        </div>
      </div>

      <section className="mt-14">
        <SectionTitle eyebrow="Understand" title="What did FinSight find?" subtitle="Key terms extracted from your document, in plain language." />
        <TermsGrid />
      </section>

      <section className="mt-14">
        <SectionTitle eyebrow="Warn" title="⚠️ Costs you should notice" subtitle="Charges and conditions that change what this loan really costs you." />
        <HiddenCosts />
      </section>

      <section className="mt-14">
        <SectionTitle eyebrow="Calculate" title="What will this loan actually cost?" subtitle="Principal, interest and fees over the full tenure." />
        <CostBreakdown />
      </section>

      <section className="mt-14 grid gap-5 lg:grid-cols-2">
        <div>
          <SectionTitle eyebrow="Explain" title="In plain words" />
          <ExplainSimply />
        </div>
        <div>
          <SectionTitle eyebrow="Ask" title="Questions about this loan?" />
          <AskPanel />
        </div>
      </section>

      <section className="mt-14 grid gap-5 md:grid-cols-2">
        <Link to="/compare" className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated">
          <p className="eyebrow">Recommend</p>
          <h3 className="mt-2 text-lg font-semibold">Compare with another offer</h3>
          <p className="mt-1 text-sm text-muted-foreground">See if a different lender saves you money.</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">Open Compare <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
        </Link>
        <Link to="/calculator" className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated">
          <p className="eyebrow">What if</p>
          <h3 className="mt-2 text-lg font-semibold">Try a different tenure or rate</h3>
          <p className="mt-1 text-sm text-muted-foreground">Adjust the numbers in the loan calculator.</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">Open Calculator <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
        </Link>
      </section>
    </AppShell>
  );
}
