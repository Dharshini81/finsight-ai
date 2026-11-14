import { createFileRoute } from "@tanstack/react-router";
import {
  BrainCircuit,
  Calculator,
  Cloud,
  Database,
  FileInput,
  FileSearch,
  Layout,
  Lightbulb,
  Server,
  ShieldAlert,
  Sparkles,
  User,
} from "lucide-react";

import { AppShell, PageHeader } from "@/components/finsight/app-shell";

export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title: "Technology & architecture — FinSight AI" },
      { name: "description", content: "How FinSight works: document processing, AI analysis, calculation, risk detection and explainable results." },
      { property: "og:title", content: "FinSight AI architecture" },
      { property: "og:description", content: "A modular pipeline from document to explainable recommendation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TechPage,
});

const PIPELINE = [
  { icon: User, label: "User", text: "Uploads or enters financial information" },
  { icon: FileInput, label: "Document / Financial Input", text: "PDF, JPG, PNG or manual entry" },
  { icon: FileSearch, label: "Document Processing", text: "OCR, layout parsing, field extraction" },
  { icon: BrainCircuit, label: "AI Analysis Engine", text: "LLM understands terms and clauses" },
  { icon: Calculator, label: "Financial Calculation Engine", text: "EMI, interest, fees, total cost" },
  { icon: ShieldAlert, label: "Risk & Cost Detection", text: "Flags fees, penalties, conditions" },
  { icon: Lightbulb, label: "Recommendation Engine", text: "Verdict, comparisons, next steps" },
  { icon: Sparkles, label: "Explainable Results", text: "Plain-language, traceable reasons" },
];

const STACK = [
  { icon: Layout, k: "Frontend", v: "React + Tailwind CSS" },
  { icon: Server, k: "Backend-ready architecture", v: "Python / FastAPI" },
  { icon: BrainCircuit, k: "AI", v: "LLM-based document understanding" },
  { icon: Database, k: "Data", v: "PostgreSQL-ready" },
  { icon: Cloud, k: "Deployment", v: "Cloud-ready" },
];

function TechPage() {
  return (
    <AppShell variant="site">
      <PageHeader eyebrow="Technology" title="From document to decision" subtitle="A modular pipeline — each stage can be connected to a real backend service without changing the experience." />
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <ol className="relative space-y-3">
          <div className="absolute bottom-6 left-[27px] top-6 w-px bg-gradient-to-b from-signal via-border to-signal" />
          {PIPELINE.map((p, i) => (
            <li key={p.label} className="relative flex items-center gap-4 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <span className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-card ${i === 0 || i === PIPELINE.length - 1 ? "bg-navy-gradient text-signal" : "border border-border bg-card text-foreground"}`}>
                <p.icon className="h-5 w-5" />
              </span>
              <div className="flex-1 rounded-xl border border-border bg-card px-5 py-3.5 shadow-card">
                <p className="text-xs font-semibold text-muted-foreground">Stage {i + 1}</p>
                <p className="font-semibold">{p.label}</p>
                <p className="text-sm text-muted-foreground">{p.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="h-fit space-y-3 lg:sticky lg:top-24">
          <p className="eyebrow">Stack</p>
          {STACK.map((s) => (
            <div key={s.k} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-soft text-signal"><s.icon className="h-5 w-5" /></span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.k}</p>
                <p className="font-semibold">{s.v}</p>
              </div>
            </div>
          ))}
          <p className="rounded-xl bg-secondary p-4 text-sm text-muted-foreground">
            Prototype: calculation and demo responses run in the browser. Analysis, extraction and chat are isolated modules ready to be
            swapped for API calls.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
