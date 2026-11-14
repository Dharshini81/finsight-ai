import { createFileRoute } from "@tanstack/react-router";
import { Calculator } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { AppShell, PageHeader, Panel } from "@/components/finsight/app-shell";
import { NumField } from "@/components/finsight/num-field";
import { Button } from "@/components/ui/button";
import { DEMO_LOAN } from "@/lib/demo-data";
import { amortization, analyzeLoan, inr, type LoanInput } from "@/lib/finance";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Loan Calculator — FinSight AI" },
      { name: "description", content: "Calculate EMI, total interest, fees and the real total repayment of any loan." },
      { property: "og:title", content: "Loan Calculator — FinSight AI" },
      { property: "og:description", content: "See your EMI and the true cost of a loan in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CalculatorPage,
});

function CalculatorPage() {
  const [form, setForm] = useState<LoanInput>({ ...DEMO_LOAN });
  const [applied, setApplied] = useState<LoanInput>({ ...DEMO_LOAN });
  const r = useMemo(() => analyzeLoan(applied), [applied]);
  const schedule = useMemo(() => {
    const rows = amortization(applied.principal, applied.annualRate, Math.min(applied.tenureMonths, 360));
    const step = Math.max(1, Math.ceil(rows.length / 24));
    return rows.filter((_, i) => i % step === 0).map((row) => ({
      month: `M${row.month}`,
      Principal: Math.round(row.principalPaid),
      Interest: Math.round(row.interestPaid),
    }));
  }, [applied]);

  const set = (k: keyof LoanInput) => (v: number) => setForm((f) => ({ ...f, [k]: v }));
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setApplied({ ...form });
  }
  const prepayCost = applied.principal * ((applied.prepaymentPct ?? 0) / 100);

  return (
    <AppShell>
      <PageHeader eyebrow="Calculate" title="Loan calculator" subtitle="Enter the loan details to see the actual repayment — not just the EMI." />
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Panel>
          <form onSubmit={onSubmit} className="space-y-4">
            <NumField id="amount" label="Loan Amount" prefix="₹" value={form.principal} onChange={set("principal")} step={1000} />
            <NumField id="rate" label="Interest Rate" suffix="% p.a." value={form.annualRate} onChange={set("annualRate")} step={0.05} />
            <NumField id="tenure" label="Loan Tenure" suffix="months" value={form.tenureMonths} onChange={set("tenureMonths")} />
            <NumField id="fee" label="Processing Fee" prefix="₹" value={form.processingFee} onChange={set("processingFee")} step={100} />
            <NumField id="prepay" label="Prepayment Charge" suffix="%" value={form.prepaymentPct ?? 0} onChange={set("prepaymentPct")} step={0.5} />
            <Button type="submit" variant="hero" size="xl" className="w-full">
              <Calculator /> Calculate My Loan
            </Button>
            <p className="text-xs text-muted-foreground">Reducing-balance EMI. 18% GST applied on processing fee.</p>
          </form>
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl bg-navy-gradient p-5 text-navy-foreground shadow-elevated sm:col-span-2 xl:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-navy-muted">Monthly EMI</p>
              <p className="num mt-2 font-display text-3xl font-semibold">{inr(r.emi)}</p>
              <p className="mt-1 text-xs text-navy-muted">for {applied.tenureMonths} months</p>
            </div>
            <Stat label="Total Interest" value={inr(r.totalInterest)} />
            <Stat label="Processing Fee (+GST)" value={inr(r.totalFees)} />
            <Stat label="Estimated Total Cost" value={inr(r.costOfBorrowing)} hint={`${r.effectiveCostPct.toFixed(1)}% of loan`} tone="danger" />
            <Stat label="Total Repayment" value={inr(r.totalCost)} hint="EMIs + fees" tone="signal" />
            <Stat label="Prepayment if closed today" value={inr(prepayCost)} hint={`${applied.prepaymentPct ?? 0}% charge`} />
          </div>

          <Panel>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Where each EMI goes</h3>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-chart-1" /> Principal</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-chart-2" /> Interest</span>
              </div>
            </div>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={schedule} margin={{ left: -10, right: 4 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`} />
                  <Tooltip
                    formatter={(v: number) => inr(v)}
                    contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 }}
                    cursor={{ fill: "var(--secondary)" }}
                  />
                  <Bar dataKey="Principal" stackId="a" fill="var(--chart-1)" />
                  <Bar dataKey="Interest" stackId="a" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Early EMIs are mostly interest. Prepaying early saves the most — but check the prepayment charge.</p>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: "danger" | "signal" }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`num mt-2 font-display text-2xl font-semibold ${tone === "danger" ? "text-danger" : tone === "signal" ? "text-signal" : "text-foreground"}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
