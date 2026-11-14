import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calculator, FileSearch, Lock, Play, ShieldCheck, Sparkles } from "lucide-react";

import { AppShell, useLaunchDemo } from "@/components/finsight/app-shell";
import { DashboardMockup } from "@/components/finsight/dashboard-mockup";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FinSight AI — Understand your money before you decide" },
      {
        name: "description",
        content:
          "Upload a loan offer or bank statement. FinSight AI explains the terms, calculates the real cost and flags hidden charges.",
      },
      { property: "og:title", content: "FinSight AI — AI banking decision assistant" },
      { property: "og:description", content: "Before you accept a financial product, understand exactly what you're signing up for." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FLOW = ["Upload", "Understand", "Calculate", "Detect", "Explain", "Recommend"];

const PILLARS = [
  { icon: FileSearch, title: "Explain", text: "Turn complicated banking language into simple explanations." },
  { icon: Calculator, title: "Calculate", text: "See the actual cost, EMI and total repayment." },
  { icon: ShieldCheck, title: "Protect", text: "Identify fees, penalties and important conditions before accepting." },
];

function Landing() {
  const launchDemo = useLaunchDemo();
  return (
    <AppShell variant="site" className="max-w-none px-0 pt-0 sm:px-0 sm:pt-0">
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 grid-pattern [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-20">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-foreground shadow-card">
              <Sparkles className="h-3.5 w-3.5 text-signal" /> AI banking decision assistant
            </span>
            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.05] text-foreground sm:text-6xl">
              Understand your money <span className="text-signal">before</span> you make a decision.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Upload a financial document, understand the real cost, identify hidden charges, and make better financial
              decisions with AI.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/analyze">
                  Analyze a Document <ArrowRight />
                </Link>
              </Button>
              <Button variant="soft" size="xl" onClick={launchDemo}>
                <Play /> Try Demo
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs font-semibold text-muted-foreground">
              {FLOW.map((f, i) => (
                <span key={f} className="flex items-center gap-2">
                  <span className="rounded-md bg-card px-2 py-1 text-foreground shadow-card">{f}</span>
                  {i < FLOW.length - 1 && <ArrowRight className="h-3 w-3" />}
                </span>
              ))}
            </div>
          </div>
          <div className="animate-fade-up [animation-delay:150ms]">
            <DashboardMockup />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Clarity, not chat</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Your financial decisions deserve clarity.</h2>
          <p className="mt-4 text-muted-foreground">
            Before you accept a financial product, understand exactly what you're signing up for.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.title} className="group rounded-2xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-gradient text-navy-foreground">
                <p.icon className="h-5 w-5 text-signal" />
              </span>
              <h3 className="mt-6 text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-navy-gradient px-6 py-12 text-navy-foreground sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-signal/25 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="text-3xl font-semibold sm:text-4xl">See it work in under 10 seconds.</h2>
              <p className="mt-3 max-w-lg text-navy-foreground/75">
                Load a sample personal-loan offer and watch FinSight extract terms, calculate the true cost and deliver a verdict.
              </p>
              <ul className="mt-6 flex flex-wrap gap-4 text-sm text-navy-foreground/80">
                <li className="flex items-center gap-2"><Lock className="h-4 w-4 text-signal" /> No account needed</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-signal" /> No OTP, PIN or CVV</li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Button variant="signal" size="xl" onClick={launchDemo}>
                🚀 Launch Live Demo
              </Button>
              <Button asChild variant="navyGhost" size="xl">
                <Link to="/present">🎤 Presentation Mode</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
