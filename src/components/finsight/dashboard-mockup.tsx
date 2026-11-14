import { AlertTriangle, FileText, Sparkles, TrendingUp } from "lucide-react";

import { DEMO_DOCUMENT, DEMO_LOAN, DEMO_RESULT } from "@/lib/demo-data";
import { inr } from "@/lib/finance";

export function DashboardMockup() {
  const stats = [
    { label: "Loan amount", value: inr(DEMO_LOAN.principal) },
    { label: "Interest rate", value: `${DEMO_LOAN.annualRate}%` },
    { label: "Monthly EMI", value: inr(DEMO_RESULT.emi) },
    { label: "Total repayment", value: inr(DEMO_RESULT.totalCost) },
  ];
  const bars = [38, 52, 44, 61, 57, 72, 66, 80, 74, 88, 82, 94];
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-signal/10 blur-3xl" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
        <div className="flex items-center gap-2 border-b border-border bg-surface/70 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
          <span className="ml-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" /> {DEMO_DOCUMENT.fileName}
          </span>
          <span className="ml-auto rounded-full bg-success-soft px-2 py-0.5 text-[0.65rem] font-bold text-success">ANALYZED</span>
        </div>
        <div className="grid gap-4 p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-background p-3">
                <p className="text-[0.68rem] text-muted-foreground">{s.label}</p>
                <p className="num mt-1 font-display text-base font-semibold sm:text-lg">{s.value}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr]">
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold">Repayment progress</p>
                <TrendingUp className="h-3.5 w-3.5 text-signal" />
              </div>
              <div className="mt-3 flex h-20 items-end gap-1.5">
                {bars.map((h, i) => (
                  <div key={i} className="flex-1 rounded-t bg-chart-1/85" style={{ height: `${h}%` }}>
                    <div className="h-1/3 rounded-t bg-chart-2" />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-warning/40 bg-warning-soft p-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-warning-ink">
                <AlertTriangle className="h-3.5 w-3.5" /> Fees detected
              </p>
              <p className="num mt-2 font-display text-xl font-semibold text-foreground">{inr(DEMO_RESULT.totalFees)}</p>
              <p className="text-[0.7rem] text-muted-foreground">Processing fee + 18% GST</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-navy-gradient p-4 text-navy-foreground">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-widest text-navy-muted">AI recommendation</p>
              <p className="mt-1 text-sm">
                <span className="font-semibold text-warning">Review before accepting.</span> Negotiate the processing fee and check
                prepayment terms.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-4 hidden animate-float rounded-xl border border-border bg-card px-4 py-3 shadow-elevated sm:block">
        <p className="text-[0.68rem] text-muted-foreground">Cost of borrowing</p>
        <p className="num font-display text-lg font-semibold text-danger">+{inr(DEMO_RESULT.costOfBorrowing)}</p>
      </div>
    </div>
  );
}
