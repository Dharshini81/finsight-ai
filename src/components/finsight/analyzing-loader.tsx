import { Check, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const STEPS = [
  "Reading document pages",
  "Extracting loan terms",
  "Calculating EMI & total cost",
  "Detecting fees and penalties",
  "Generating FinSight verdict",
];

export function AnalyzingLoader({ fileName, onDone }: { fileName: string; onDone: () => void }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= STEPS.length) {
      const t = window.setTimeout(onDone, 350);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), 520);
    return () => window.clearTimeout(t);
  }, [step, onDone]);

  const progress = Math.min(100, (step / STEPS.length) * 100);

  return (
    <div className="mx-auto grid max-w-4xl items-center gap-10 rounded-3xl border border-border bg-card p-6 shadow-elevated sm:p-10 md:grid-cols-[220px_1fr]">
      <div className="relative mx-auto h-64 w-48 overflow-hidden rounded-xl border border-border bg-background p-4 shadow-card">
        <div className="mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-signal" />
          <span className="truncate text-[0.65rem] font-semibold text-muted-foreground">{fileName}</span>
        </div>
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="mb-2.5 h-1.5 rounded-full bg-secondary" style={{ width: `${60 + ((i * 37) % 40)}%` }} />
        ))}
        <div className="absolute inset-x-0 h-10 animate-scan bg-gradient-to-b from-transparent via-signal/30 to-transparent">
          <div className="absolute inset-x-0 top-1/2 h-px bg-signal" />
        </div>
      </div>
      <div>
        <p className="eyebrow">AI at work</p>
        <h2 className="mt-2 text-2xl font-semibold">Analyzing document...</h2>
        <p className="mt-1 text-sm text-muted-foreground">This usually takes a few seconds.</p>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-signal-gradient transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <ul className="mt-6 space-y-3">
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={s} className={cn("flex items-center gap-3 text-sm transition-colors", done || active ? "text-foreground" : "text-muted-foreground/60")}>
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border",
                    done && "border-success bg-success text-primary-foreground",
                    active && "border-signal text-signal",
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : active ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <span className="h-1.5 w-1.5 rounded-full bg-border" />}
                </span>
                {s}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
