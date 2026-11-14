import { AlertTriangle, CheckCircle2, ChevronDown, Info, ShieldAlert, Sparkles } from "lucide-react";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { analysisStore, useAnalysis } from "@/lib/analysis-store";
import {
  DEMO_LOAN,
  DEMO_RESULT,
  HIDDEN_COSTS,
  IMPORTANT_TERMS,
  RISK,
  VERDICT,
  explanation,
  type Level,
} from "@/lib/demo-data";
import { inr } from "@/lib/finance";
import { cn } from "@/lib/utils";
import { Panel } from "./app-shell";

export function SectionTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h2 className="text-xl font-semibold text-foreground sm:text-2xl">{title}</h2>
      {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export const SUMMARY_ROWS = [
  { label: "Loan Amount", value: inr(DEMO_LOAN.principal) },
  { label: "Interest Rate", value: `${DEMO_LOAN.annualRate}% p.a.` },
  { label: "Tenure", value: `${DEMO_LOAN.tenureMonths} months` },
  { label: "Monthly EMI", value: inr(DEMO_RESULT.emi), highlight: true },
  { label: "Processing Fee", value: inr(DEMO_LOAN.processingFee) },
  { label: "GST on Fee (18%)", value: inr(DEMO_RESULT.gstOnFee) },
  { label: "Total Repayment (24 EMIs)", value: inr(DEMO_RESULT.totalRepayment), highlight: true },
];

export function FinancialSummary() {
  return (
    <Panel className="p-0 sm:p-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
        <h3 className="text-base font-semibold">Financial summary</h3>
        <span className="text-xs text-muted-foreground">Extracted from document</span>
      </div>
      <dl className="divide-y divide-border">
        {SUMMARY_ROWS.map((row) => (
          <div key={row.label} className="flex items-center justify-between px-5 py-3.5 sm:px-6">
            <dt className="text-sm text-muted-foreground">{row.label}</dt>
            <dd className={cn("num text-sm font-semibold text-foreground", row.highlight && "text-base")}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

export function VerdictCard({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative overflow-hidden rounded-2xl bg-navy-gradient p-6 text-navy-foreground shadow-elevated sm:p-7">
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-signal/25 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2 text-navy-muted">
          <Sparkles className="h-4 w-4 text-signal" />
          <span className="text-xs font-bold uppercase tracking-[0.16em]">FinSight Verdict</span>
        </div>
        <div className="mt-4 inline-flex items-center gap-2.5 rounded-full bg-warning px-4 py-2 text-sm font-bold tracking-wide text-navy">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-navy/40" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-navy" />
          </span>
          {VERDICT.status}
        </div>
        <p className={cn("mt-4 max-w-xl text-navy-foreground/90", compact ? "text-base" : "text-lg leading-relaxed")}>
          {VERDICT.summary}
        </p>
        {!compact && (
          <Collapsible open={open} onOpenChange={setOpen} className="mt-5">
            <CollapsibleTrigger className="inline-flex items-center gap-2 rounded-lg border border-navy-foreground/20 px-3.5 py-2 text-sm font-semibold transition-colors hover:bg-navy-foreground/10">
              Why am I getting this verdict?
              <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent className="data-[state=open]:animate-in data-[state=open]:fade-in-0">
              <ul className="mt-4 space-y-2.5">
                {VERDICT.reasons.map((r) => (
                  <li key={r} className="flex gap-2.5 text-sm text-navy-foreground/85">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
                    {r}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-navy-muted">
                Verdict combines rate, fees, penalty conditions and repayment burden. Informational only.
              </p>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
}

export function TermsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {IMPORTANT_TERMS.map((t, i) => (
        <div key={t.label} className="animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
          <Panel className="h-full">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.label}</p>
            <p className="num mt-2 font-display text-2xl font-semibold text-foreground">{t.value}</p>
            <p className="mt-3 text-sm text-foreground/80">{t.explain}</p>
            <p className="mt-2 text-xs text-muted-foreground">{t.detail}</p>
          </Panel>
        </div>
      ))}
    </div>
  );
}

const LEVEL_STYLE: Record<Level, { dot: string; chip: string; icon: typeof Info; tag: string }> = {
  good: { dot: "bg-success", chip: "bg-success-soft text-success", icon: CheckCircle2, tag: "Clear" },
  warn: { dot: "bg-warning", chip: "bg-warning-soft text-warning-ink", icon: AlertTriangle, tag: "Notice" },
  risk: { dot: "bg-danger", chip: "bg-danger-soft text-danger", icon: ShieldAlert, tag: "Important" },
};

export function HiddenCosts({ limit }: { limit?: number }) {
  const items = limit ? HIDDEN_COSTS.slice(0, limit) : HIDDEN_COSTS;
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const s = LEVEL_STYLE[item.level];
        const Icon = s.icon;
        return (
          <div
            key={item.label}
            className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-3 sm:w-64 sm:shrink-0">
              <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", s.chip)}>
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="num text-sm font-semibold text-muted-foreground">{item.value}</p>
              </div>
            </div>
            <p className="flex-1 text-sm text-muted-foreground">{item.why}</p>
            <span className={cn("inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold", s.chip)}>
              <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
              {s.tag}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export const COST_PARTS = [
  { name: "Loan amount", value: DEMO_LOAN.principal, color: "var(--chart-1)", cls: "bg-chart-1" },
  { name: "Interest", value: DEMO_RESULT.totalInterest, color: "var(--chart-2)", cls: "bg-chart-2" },
  { name: "Fees + GST", value: DEMO_RESULT.totalFees, color: "var(--chart-3)", cls: "bg-chart-3" },
];

export function CostBreakdown() {
  const total = DEMO_RESULT.totalCost;
  return (
    <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
      <Panel>
        <div className="grid items-center gap-6 sm:grid-cols-[200px_1fr]">
          <div className="relative mx-auto h-[200px] w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={COST_PARTS} dataKey="value" innerRadius={66} outerRadius={94} paddingAngle={2} stroke="none" startAngle={90} endAngle={-270}>
                  {COST_PARTS.map((p) => (
                    <Cell key={p.name} fill={p.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-muted-foreground">Total outflow</span>
              <span className="num font-display text-lg font-semibold">{inr(total)}</span>
            </div>
          </div>
          <div className="space-y-4">
            {COST_PARTS.map((p) => (
              <div key={p.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className={cn("h-2.5 w-2.5 rounded-sm", p.cls)} />
                    {p.name}
                  </span>
                  <span className="num font-semibold">{inr(p.value)}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className={cn("h-full rounded-full", p.cls)} style={{ width: `${(p.value / total) * 100}%` }} />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="font-semibold">Cost of borrowing</span>
              <span className="num font-semibold text-danger">+{inr(DEMO_RESULT.costOfBorrowing)}</span>
            </div>
          </div>
        </div>
      </Panel>
      <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-signal/30 bg-signal-soft p-6 shadow-card">
        <div>
          <p className="eyebrow">The number that matters</p>
          <p className="num mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">{inr(total)}</p>
          <p className="mt-3 text-sm text-foreground/75">
            This is the estimated total amount you may repay over the loan period — all {DEMO_LOAN.tenureMonths} EMIs plus the
            processing fee and GST.
          </p>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          You pay <span className="num font-semibold text-foreground">{DEMO_RESULT.effectiveCostPct.toFixed(1)}%</span> more than you
          borrow.
        </p>
      </div>
    </div>
  );
}

export function ExplainSimply() {
  const { simpleMode } = useAnalysis();
  const lines = explanation(simpleMode);
  return (
    <Panel>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-gradient text-signal-foreground shadow-glow">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base font-semibold">Explain it to me simply</h3>
            <p className="text-xs text-muted-foreground">AI-generated plain-language summary</p>
          </div>
        </div>
        <Select value={simpleMode ? "new" : "standard"} onValueChange={(v) => analysisStore.setSimpleMode(v === "new")}>
          <SelectTrigger className="w-full sm:w-[260px]" aria-label="Explanation level">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard explanation</SelectItem>
            <SelectItem value="new">Explain like I'm new to banking</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div key={String(simpleMode)} className="mt-5 space-y-3 animate-fade-up">
        {lines.map((l, i) => (
          <p key={i} className="flex gap-3 text-[0.95rem] leading-relaxed text-foreground/85">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
            {l}
          </p>
        ))}
      </div>
    </Panel>
  );
}

const RISK_LEVEL: Record<"Low" | "Medium" | "High", string> = {
  Low: "bg-success",
  Medium: "bg-warning",
  High: "bg-danger",
};
const RISK_TEXT: Record<"Low" | "Medium" | "High", string> = {
  Low: "text-success",
  Medium: "text-warning-ink",
  High: "text-danger",
};

export function RiskScore() {
  const pct = RISK.score / 100;
  const C = 2 * Math.PI * 52;
  return (
    <Panel>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold">Financial Risk Check</h3>
          <p className="text-xs text-muted-foreground">Prototype decision-support indicator</p>
        </div>
        <span className="rounded-full bg-warning-soft px-2.5 py-1 text-xs font-bold text-warning-ink">🟡 {RISK.label}</span>
      </div>
      <div className="mt-5 grid items-center gap-6 sm:grid-cols-[140px_1fr]">
        <div className="relative mx-auto h-[140px] w-[140px]">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="52" className="stroke-secondary" strokeWidth="10" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="52"
              className="stroke-warning"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="num font-display text-3xl font-semibold">{RISK.score}</span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>
        <ul className="space-y-3">
          {RISK.breakdown.map((b) => (
            <li key={b.label}>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{b.label}</span>
                <span className={cn("font-semibold", RISK_TEXT[b.level])}>{b.level}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className={cn("h-full rounded-full", RISK_LEVEL[b.level])} style={{ width: `${b.value}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-5 flex gap-2 rounded-lg bg-secondary px-3 py-2.5 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Not an official credit score or financial guarantee. FinSight provides informational analysis and does not replace
        professional financial advice.
      </p>
    </Panel>
  );
}
