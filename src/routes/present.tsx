import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Bell, CreditCard, FileText, Globe2, Link2, UploadCloud, X, XCircle } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { CostBreakdown, HiddenCosts, RiskScore, TermsGrid, VerdictCard } from "@/components/finsight/analysis-sections";
import { DemoBadge } from "@/components/finsight/app-shell";
import { AskPanel } from "@/components/finsight/ask-panel";
import { LogoMark } from "@/components/finsight/logo";
import { Button } from "@/components/ui/button";
import { DEMO_DOCUMENT, DEMO_LOAN, DEMO_RESULT } from "@/lib/demo-data";
import { inr } from "@/lib/finance";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/present")({
  head: () => ({
    meta: [
      { title: "Presentation Mode — FinSight AI" },
      { name: "description", content: "A guided walkthrough of FinSight AI: problem, upload, analysis, hidden costs, impact, verdict and vision." },
      { property: "og:title", content: "FinSight AI — guided presentation" },
      { property: "og:description", content: "From confusing loan document to a clear decision in eight steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PresentPage,
});

interface Slide {
  label: string;
  title: string;
  subtitle?: string;
  body: ReactNode;
}

const SLIDES: Slide[] = [
  {
    label: "Problem",
    title: "People sign financial products they don't fully understand.",
    subtitle: "Loan offers hide the real cost in jargon, fees and fine print.",
    body: (
      <div className="grid gap-3 sm:grid-cols-2">
        {["Confusing documents", "Hidden costs", "Complex terminology", "Difficult comparisons"].map((b) => (
          <div key={b} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-5 text-lg font-semibold shadow-card">
            <XCircle className="h-5 w-5 text-danger" /> {b}
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "Upload",
    title: "Upload a financial document.",
    subtitle: "Loan offers, statements, EMI schedules or bank notices — PDF, JPG or PNG.",
    body: (
      <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border-2 border-dashed border-signal/50 bg-card p-10 text-center shadow-card">
        <span className="flex h-20 w-20 animate-float items-center justify-center rounded-3xl bg-navy-gradient shadow-elevated">
          <UploadCloud className="h-9 w-9 text-signal" />
        </span>
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
          <FileText className="h-5 w-5 text-signal" />
          <span className="font-semibold">{DEMO_DOCUMENT.fileName}</span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">No OTP · No PIN · No CVV · No money movement</p>
      </div>
    ),
  },
  {
    label: "AI analysis",
    title: "FinSight extracts and explains the terms.",
    subtitle: `${inr(DEMO_LOAN.principal)} · ${DEMO_LOAN.annualRate}% · ${DEMO_LOAN.tenureMonths} months · EMI ${inr(DEMO_RESULT.emi)}`,
    body: <TermsGrid />,
  },
  {
    label: "Hidden costs",
    title: "⚠️ Costs you should notice.",
    subtitle: "Every fee and penalty, with why it matters.",
    body: <HiddenCosts />,
  },
  {
    label: "Financial impact",
    title: "What will this loan actually cost?",
    body: <CostBreakdown />,
  },
  {
    label: "Verdict",
    title: "A clear, explainable verdict.",
    body: (
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <VerdictCard />
        <RiskScore />
      </div>
    ),
  },
  {
    label: "Ask AI",
    title: "Ask anything about the document.",
    subtitle: "Try a suggested question.",
    body: <AskPanel className="mx-auto max-w-3xl" />,
  },
  {
    label: "Future vision",
    title: "Clarity for every financial decision.",
    subtitle: "Where FinSight goes next.",
    body: (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: CreditCard, t: "More documents", d: "Credit cards, insurance, BNPL and mortgage agreements." },
          { icon: Globe2, t: "Every language", d: "Explanations in Hindi, Tamil and other regional languages." },
          { icon: Link2, t: "Consent-based data", d: "Plug into account-aggregator flows with explicit user consent." },
          { icon: Bell, t: "Proactive alerts", d: "Warn before rate resets, fee changes or missed EMIs." },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-gradient"><c.icon className="h-5 w-5 text-signal" /></span>
            <p className="mt-4 text-lg font-semibold">{c.t}</p>
            <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </div>
    ),
  },
];

function PresentPage() {
  const [i, setI] = useState(0);
  const next = useCallback(() => setI((v) => Math.min(SLIDES.length - 1, v + 1)), []);
  const prev = useCallback(() => setI((v) => Math.max(0, v - 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === "PageDown") next();
      if (e.key === "ArrowLeft" || e.key === "PageUp") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const s = SLIDES[i];
  return (
    <div className="flex min-h-screen flex-col bg-hero">
      <header className="flex items-center gap-3 px-4 py-4 sm:px-8">
        <LogoMark />
        <span className="font-display font-semibold">FinSight AI</span>
        <span className="hidden text-sm text-muted-foreground sm:inline">· Presentation</span>
        <DemoBadge className="ml-3 hidden md:inline-flex" />
        <span className="num ml-auto text-sm font-semibold text-muted-foreground">
          {i + 1} / {SLIDES.length}
        </span>
        <Button asChild variant="ghost" size="icon" aria-label="Exit presentation">
          <Link to="/dashboard"><X className="!size-5" /></Link>
        </Button>
      </header>

      <div className="h-1 bg-border/60">
        <div className="h-full bg-signal-gradient transition-all duration-500" style={{ width: `${((i + 1) / SLIDES.length) * 100}%` }} />
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-10 sm:px-8">
        <div key={i} className="animate-fade-up">
          <p className="eyebrow">
            {String(i + 1).padStart(2, "0")} · {s.label}
          </p>
          <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl">{s.title}</h1>
          {s.subtitle && <p className="num mt-3 max-w-3xl text-lg text-muted-foreground">{s.subtitle}</p>}
          <div className="mt-10">{s.body}</div>
        </div>
      </main>

      <footer className="flex items-center gap-3 px-4 pb-6 sm:px-8">
        <Button variant="soft" onClick={prev} disabled={i === 0}>
          <ArrowLeft /> Back
        </Button>
        <div className="mx-auto hidden gap-1.5 md:flex">
          {SLIDES.map((sl, idx) => (
            <button
              key={sl.label}
              onClick={() => setI(idx)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                idx === i ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary",
              )}
            >
              {sl.label}
            </button>
          ))}
        </div>
        {i < SLIDES.length - 1 ? (
          <Button variant="hero" onClick={next} className="ml-auto md:ml-0">
            Next <ArrowRight />
          </Button>
        ) : (
          <Button asChild variant="hero" className="ml-auto md:ml-0">
            <Link to="/dashboard">Open the app <ArrowRight /></Link>
          </Button>
        )}
      </footer>
    </div>
  );
}
