import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Sparkles, Trophy } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell, DemoBadge, PageHeader, Panel } from "@/components/finsight/app-shell";
import { NumField } from "@/components/finsight/num-field";
import { DEMO_LOAN } from "@/lib/demo-data";
import { compareOffers, inr, type Offer } from "@/lib/finance";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare financial offers — FinSight AI" },
      { name: "description", content: "Put two loan offers side by side and see which one really costs less, including fees and penalties." },
      { property: "og:title", content: "Compare financial offers — FinSight AI" },
      { property: "og:description", content: "Side-by-side loan comparison with an AI recommendation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ComparePage,
});

const OFFER_B: Offer = {
  name: "Offer B",
  principal: 100000,
  annualRate: 13.25,
  tenureMonths: 24,
  processingFee: 1500,
  gstRate: 18,
  prepaymentPct: 0,
  latePaymentFee: 400,
};

function ComparePage() {
  const [a, setA] = useState<Offer>({ name: "Offer A", ...DEMO_LOAN });
  const [b, setB] = useState<Offer>(OFFER_B);
  const cmp = useMemo(() => compareOffers(a, b), [a, b]);

  type Row = { label: string; av: number; bv: number; fmt: (n: number) => string; lowerBetter?: boolean };
  const rows: Row[] = [
    { label: "Loan amount", av: a.principal, bv: b.principal, fmt: inr },
    { label: "Interest rate", av: a.annualRate, bv: b.annualRate, fmt: (n) => `${n}%`, lowerBetter: true },
    { label: "Monthly EMI", av: cmp.a.emi, bv: cmp.b.emi, fmt: inr, lowerBetter: true },
    { label: "Processing fee (+GST)", av: cmp.a.totalFees, bv: cmp.b.totalFees, fmt: inr, lowerBetter: true },
    { label: "Prepayment charge", av: a.prepaymentPct ?? 0, bv: b.prepaymentPct ?? 0, fmt: (n) => `${n}%`, lowerBetter: true },
    { label: "Late payment charge", av: a.latePaymentFee ?? 0, bv: b.latePaymentFee ?? 0, fmt: inr, lowerBetter: true },
    { label: "Total repayment", av: cmp.a.totalCost, bv: cmp.b.totalCost, fmt: inr, lowerBetter: true },
    { label: "Estimated cost of borrowing", av: cmp.a.costOfBorrowing, bv: cmp.b.costOfBorrowing, fmt: inr, lowerBetter: true },
  ];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Recommend"
        title="Compare financial offers"
        subtitle="Edit either offer — FinSight recalculates and highlights the differences that matter."
        actions={<DemoBadge />}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <OfferForm offer={a} onChange={setA} tag="A" winner={cmp.winner === "A"} note="Loaded from your analyzed document" />
        <OfferForm offer={b} onChange={setB} tag="B" winner={cmp.winner === "B"} note="Sample alternative offer" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Panel className="overflow-x-auto p-0 sm:p-0">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-4 font-semibold">Detail</th>
                <th className="px-5 py-4 text-right font-semibold">Offer A</th>
                <th className="px-5 py-4 text-right font-semibold">Offer B</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => {
                const better = !r.lowerBetter || r.av === r.bv ? null : r.av < r.bv ? "A" : "B";
                return (
                  <tr key={r.label}>
                    <td className="px-5 py-3.5 text-muted-foreground">{r.label}</td>
                    {(["A", "B"] as const).map((k) => (
                      <td key={k} className="px-5 py-3.5 text-right">
                        <span
                          className={cn(
                            "num inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-semibold",
                            better === k && "bg-success-soft text-success",
                            better && better !== k && "text-foreground/70",
                          )}
                        >
                          {better === k && <ArrowDown className="h-3 w-3" />}
                          {r.fmt(k === "A" ? r.av : r.bv)}
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>

        <div className="relative overflow-hidden rounded-2xl bg-navy-gradient p-6 text-navy-foreground shadow-elevated">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-signal/25 blur-3xl" />
          <div className="relative">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-navy-muted">
              <Sparkles className="h-4 w-4 text-signal" /> FinSight Recommendation
            </p>
            {cmp.winner === "tie" ? (
              <h3 className="mt-4 text-2xl font-semibold">Both offers cost about the same</h3>
            ) : (
              <>
                <h3 className="mt-4 flex items-center gap-2 text-2xl font-semibold">
                  <Trophy className="h-6 w-6 text-warning" /> Offer {cmp.winner} may be more cost-effective
                </h3>
                <p className="mt-2 text-navy-foreground/80">
                  You could save about <span className="num font-semibold text-signal">{inr(cmp.savings)}</span> over the loan period.
                </p>
                <ul className="mt-5 space-y-2.5">
                  {cmp.reasons.map((r) => (
                    <li key={r} className="flex gap-2.5 text-sm text-navy-foreground/85">
                      {r.startsWith("Note") ? <ArrowUp className="mt-0.5 h-4 w-4 shrink-0 text-warning" /> : <ArrowDown className="mt-0.5 h-4 w-4 shrink-0 text-signal" />}
                      {r}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p className="mt-6 text-xs text-navy-muted">Informational comparison only. Confirm final terms with the lender.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function OfferForm({
  offer,
  onChange,
  tag,
  winner,
  note,
}: {
  offer: Offer;
  onChange: (o: Offer) => void;
  tag: "A" | "B";
  winner: boolean;
  note: string;
}) {
  const set = (k: keyof Offer) => (v: number) => onChange({ ...offer, [k]: v });
  return (
    <Panel className={cn("transition-all", winner && "border-success/50 ring-2 ring-success/20")}>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-gradient font-display font-semibold text-navy-foreground">{tag}</span>
        <div>
          <p className="font-semibold">Offer {tag}</p>
          <p className="text-xs text-muted-foreground">{note}</p>
        </div>
        {winner && <span className="ml-auto rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success">Lower cost</span>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <NumField id={`${tag}-amt`} label="Loan amount" prefix="₹" value={offer.principal} onChange={set("principal")} step={1000} />
        <NumField id={`${tag}-rate`} label="Interest rate" suffix="%" value={offer.annualRate} onChange={set("annualRate")} step={0.05} />
        <NumField id={`${tag}-ten`} label="Tenure" suffix="mo" value={offer.tenureMonths} onChange={set("tenureMonths")} />
        <NumField id={`${tag}-fee`} label="Processing fee" prefix="₹" value={offer.processingFee} onChange={set("processingFee")} step={100} />
        <NumField id={`${tag}-pre`} label="Prepayment" suffix="%" value={offer.prepaymentPct ?? 0} onChange={set("prepaymentPct")} step={0.5} />
        <NumField id={`${tag}-late`} label="Late fee" prefix="₹" value={offer.latePaymentFee ?? 0} onChange={set("latePaymentFee")} step={50} />
      </div>
    </Panel>
  );
}
