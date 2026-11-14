import { ArrowUp, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { DEMO_DOCUMENT, SUGGESTED_QUESTIONS, answerQuestion } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "ai";
  text: string;
}

export function AskPanel({ className, tall = false }: { className?: string; tall?: boolean }) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "ai",
      text: `Hi! I've read "${DEMO_DOCUMENT.fileName}". Ask me anything about this loan — costs, fees, early repayment or whether to compare offers.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function ask(q: string) {
    const text = q.trim();
    if (!text || typing) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: answerQuestion(text) }]);
      setTyping(false);
    }, 900);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(input);
  }

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card", className)}>
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-navy-gradient text-navy-foreground animate-pulse-ring">
          <Sparkles className="h-5 w-5 text-signal" />
        </span>
        <div>
          <h3 className="text-base font-semibold">Ask FinSight</h3>
          <p className="text-xs text-muted-foreground">Ask anything about this financial document.</p>
        </div>
        <span className="ml-auto hidden items-center gap-1.5 text-xs font-medium text-success sm:flex">
          <span className="h-2 w-2 rounded-full bg-success" /> Grounded in document
        </span>
      </div>

      <div ref={scrollRef} className={cn("flex-1 space-y-4 overflow-y-auto bg-surface/50 px-4 py-5 sm:px-5", tall ? "h-[460px]" : "h-[340px]")}>
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-2.5 animate-fade-up", m.role === "user" && "flex-row-reverse")}>
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                m.role === "ai" ? "bg-navy text-signal" : "bg-secondary text-foreground",
              )}
            >
              {m.role === "ai" ? <Sparkles className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
            </span>
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "ai"
                  ? "rounded-tl-sm border border-border bg-card text-foreground"
                  : "rounded-tr-sm bg-primary text-primary-foreground",
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-signal">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3">
              {[0, 1, 2].map((d) => (
                <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${d * 120}ms` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border px-4 py-3 sm:px-5">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => ask(q)}
              className="shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-signal hover:text-foreground"
            >
              {q}
            </button>
          ))}
        </div>
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about repayment, fees, early closure…"
            className="h-11 flex-1 rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-signal focus:ring-2 focus:ring-ring/30"
            aria-label="Ask a question"
          />
          <Button type="submit" variant="hero" size="icon" className="h-11 w-11 rounded-xl" disabled={!input.trim() || typing} aria-label="Send">
            <ArrowUp className="!size-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
