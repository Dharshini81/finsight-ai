import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";

import { AppShell, DemoBadge, PageHeader, Panel } from "@/components/finsight/app-shell";
import { AskPanel } from "@/components/finsight/ask-panel";
import { SUMMARY_ROWS } from "@/components/finsight/analysis-sections";
import { Button } from "@/components/ui/button";
import { DEMO_DOCUMENT } from "@/lib/demo-data";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title: "Ask FinSight — questions about your loan document" },
      { name: "description", content: "Ask plain-language questions about your loan offer: total repayment, fees, early closure and more." },
      { property: "og:title", content: "Ask FinSight AI" },
      { property: "og:description", content: "Document-grounded answers about your financial document." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AskPage,
});

function AskPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Explain" title="Ask FinSight" subtitle="Ask anything about this financial document. Answers are grounded in the extracted terms." actions={<DemoBadge />} />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <AskPanel tall />
        <Panel className="h-fit">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-soft text-signal"><FileText className="h-5 w-5" /></span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{DEMO_DOCUMENT.fileName}</p>
              <p className="text-xs text-muted-foreground">Context for this chat</p>
            </div>
          </div>
          <dl className="mt-4 divide-y divide-border">
            {SUMMARY_ROWS.map((r) => (
              <div key={r.label} className="flex justify-between py-2.5 text-sm">
                <dt className="text-muted-foreground">{r.label}</dt>
                <dd className="num font-semibold">{r.value}</dd>
              </div>
            ))}
          </dl>
          <Button asChild variant="soft" className="mt-4 w-full">
            <Link to="/analysis">View full analysis</Link>
          </Button>
        </Panel>
      </div>
    </AppShell>
  );
}
