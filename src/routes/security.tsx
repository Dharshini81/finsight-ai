import { createFileRoute } from "@tanstack/react-router";
import { Ban, CreditCard, EyeOff, FileLock2, KeyRound, ShieldCheck } from "lucide-react";

import { AppShell, PageHeader } from "@/components/finsight/app-shell";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security & privacy — FinSight AI" },
      { name: "description", content: "FinSight never collects OTP, PIN or CVV and never moves money. A decision-support layer you control." },
      { property: "og:title", content: "Designed with privacy in mind — FinSight AI" },
      { property: "og:description", content: "No OTP, PIN or CVV collection. No money movement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SecurityPage,
});

const CARDS = [
  { icon: KeyRound, title: "No OTP collection", text: "We will never ask for one-time passwords." },
  { icon: EyeOff, title: "No PIN collection", text: "ATM, UPI or card PINs are never requested." },
  { icon: CreditCard, title: "No CVV collection", text: "Card security codes are never needed to analyze a document." },
  { icon: Ban, title: "No money movement", text: "FinSight cannot initiate payments, transfers or approvals." },
  { icon: FileLock2, title: "User-controlled analysis", text: "You choose what to upload, and can clear it at any time." },
];

function SecurityPage() {
  return (
    <AppShell variant="site">
      <PageHeader eyebrow="Security" title="Designed with privacy in mind" subtitle="Trust is the product. Here's what FinSight will never do." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {CARDS.map((c) => (
          <div key={c.title} className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-soft text-success">
              <c.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-semibold">🔐 {c.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl bg-navy-gradient p-8 text-navy-foreground shadow-elevated sm:flex-row sm:items-center">
        <ShieldCheck className="h-10 w-10 shrink-0 text-signal" />
        <p className="text-lg">FinSight is designed as a decision-support layer and does not initiate financial transactions.</p>
      </div>
    </AppShell>
  );
}
