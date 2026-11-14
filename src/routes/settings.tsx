import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { AppShell, PageHeader, Panel } from "@/components/finsight/app-shell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { analysisStore, useAnalysis } from "@/lib/analysis-store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — FinSight AI" },
      { name: "description", content: "Choose your explanation style and manage the documents analyzed in this session." },
      { property: "og:title", content: "Settings — FinSight AI" },
      { property: "og:description", content: "Control how FinSight explains things and clear your data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const a = useAnalysis();
  return (
    <AppShell>
      <PageHeader eyebrow="Settings" title="Settings" subtitle="Everything here stays in this browser session." />
      <div className="max-w-2xl space-y-4">
        <Panel className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">Explain like I'm new to banking</p>
            <p className="text-sm text-muted-foreground">Use the simplest possible language in explanations.</p>
          </div>
          <Switch checked={a.simpleMode} onCheckedChange={(v) => analysisStore.setSimpleMode(v)} aria-label="Simple explanations" />
        </Panel>
        <Panel className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">Clear my analysis</p>
            <p className="text-sm text-muted-foreground">
              {a.status === "analyzed" ? `Removes "${a.fileName}" from this session.` : "No document stored right now."}
            </p>
          </div>
          <Button
            variant="soft"
            disabled={a.status !== "analyzed"}
            onClick={() => {
              analysisStore.reset();
              toast.success("Analysis cleared");
            }}
          >
            Clear
          </Button>
        </Panel>
        <Panel>
          <p className="font-semibold">About this prototype</p>
          <p className="mt-1 text-sm text-muted-foreground">
            FinSight provides informational analysis and does not replace professional financial advice. Demo figures are synthetic and
            do not belong to any real bank.
          </p>
        </Panel>
      </div>
    </AppShell>
  );
}
