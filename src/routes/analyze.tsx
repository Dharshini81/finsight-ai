import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileText, ShieldCheck, Sparkles, UploadCloud } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import { toast } from "sonner";

import { AnalyzingLoader } from "@/components/finsight/analyzing-loader";
import { AppShell, PageHeader } from "@/components/finsight/app-shell";
import { Button } from "@/components/ui/button";
import { analysisStore } from "@/lib/analysis-store";
import { DEMO_DOCUMENT } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze a financial document — FinSight AI" },
      { name: "description", content: "Upload a loan offer, statement or bank notice (PDF, JPG, PNG) and FinSight AI finds what matters." },
      { property: "og:title", content: "Analyze your financial document — FinSight AI" },
      { property: "og:description", content: "Drag in a document or use the demo loan offer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Analyze,
});

const ACCEPTED = ["application/pdf", "image/jpeg", "image/png"];

function Analyze() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [job, setJob] = useState<{ fileName: string; source: "demo" | "upload" } | null>(null);

  useEffect(() => {
    if (analysisStore.get().pendingDemo) {
      analysisStore.consumeDemo();
      setJob({ fileName: DEMO_DOCUMENT.fileName, source: "demo" });
    }
  }, []);

  const onDone = useCallback(() => {
    if (!job) return;
    analysisStore.complete(job.fileName, job.source);
    navigate({ to: "/analysis" });
  }, [job, navigate]);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Unsupported file", { description: "Please upload a PDF, JPG or PNG." });
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast.error("File too large", { description: "Maximum size is 15 MB." });
      return;
    }
    setJob({ fileName: file.name, source: "upload" });
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  if (job) {
    return (
      <AppShell>
        <AnalyzingLoader fileName={job.fileName} onDone={onDone} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 1 · Upload"
        title="Analyze your financial document"
        subtitle="Upload a document and FinSight AI will identify the important information for you."
      />
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "group flex min-h-[360px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-card p-8 text-center shadow-card transition-all",
            dragging ? "border-signal bg-signal-soft" : "border-border hover:border-signal/60 hover:bg-surface/60",
          )}
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-navy-gradient shadow-elevated transition-transform group-hover:-translate-y-1">
            <UploadCloud className="h-9 w-9 text-signal" />
          </span>
          <h2 className="mt-6 text-xl font-semibold">Drag & drop your document here</h2>
          <p className="mt-2 text-sm text-muted-foreground">or click to browse — loan offers, statements, EMI schedules, bank notices</p>
          <div className="mt-5 flex gap-2">
            {["PDF", "JPG", "PNG"].map((f) => (
              <span key={f} className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">{f}</span>
            ))}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-3xl border border-signal/30 bg-signal-soft p-6 shadow-card">
            <Sparkles className="h-5 w-5 text-signal" />
            <h3 className="mt-3 text-lg font-semibold">No document handy?</h3>
            <p className="mt-1 text-sm text-muted-foreground">Load a realistic sample personal-loan offer and see the full analysis instantly.</p>
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <FileText className="h-5 w-5 text-signal" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{DEMO_DOCUMENT.fileName}</p>
                <p className="text-xs text-muted-foreground">{DEMO_DOCUMENT.pages} pages · Demo / Synthetic Data</p>
              </div>
            </div>
            <Button variant="hero" size="xl" className="mt-4 w-full" onClick={() => setJob({ fileName: DEMO_DOCUMENT.fileName, source: "demo" })}>
              Use Demo Document
            </Button>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <p className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="h-4 w-4 text-success" /> Private by design</p>
            <p className="mt-2 text-sm text-muted-foreground">
              FinSight never asks for OTP, PIN or CVV and cannot move money. In this prototype, uploads stay in your browser and are
              analyzed using the synthetic demo model.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
