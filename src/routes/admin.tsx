import { createFileRoute } from "@tanstack/react-router";
import { Clock, FileText, HelpCircle, TriangleAlert, Users } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { AppShell, DemoBadge, PageHeader, Panel } from "@/components/finsight/app-shell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Analytics (demo) — FinSight AI" },
      { name: "description", content: "Prototype analytics: documents analyzed, analysis time, most detected issues and common questions." },
      { property: "og:title", content: "FinSight AI analytics — prototype demo data" },
      { property: "og:description", content: "Anonymized demo usage trends." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const KPIS = [
  { icon: FileText, label: "Documents analyzed", value: "1,248" },
  { icon: Clock, label: "Average analysis time", value: "8.4 sec" },
  { icon: TriangleAlert, label: "Most detected issue", value: "Processing fees" },
  { icon: Users, label: "Users helped", value: "932" },
  { icon: HelpCircle, label: "Most common question", value: "“How much will I repay?”" },
];

const TREND = [
  { w: "W1", docs: 62 }, { w: "W2", docs: 78 }, { w: "W3", docs: 91 }, { w: "W4", docs: 85 },
  { w: "W5", docs: 112 }, { w: "W6", docs: 128 }, { w: "W7", docs: 121 }, { w: "W8", docs: 146 },
  { w: "W9", docs: 158 }, { w: "W10", docs: 172 }, { w: "W11", docs: 195 },
];
const ISSUES = [
  { k: "Processing fee", n: 812 },
  { k: "Prepayment", n: 604 },
  { k: "Late fee", n: 521 },
  { k: "GST on fee", n: 488 },
  { k: "Insurance add-on", n: 233 },
];

const tooltip = { borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 };

function AdminPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Admin" title="Usage analytics" subtitle="Anonymized, aggregated insights." actions={<DemoBadge label="Prototype Demo Data" />} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {KPIS.map((k) => (
          <Panel key={k.label}>
            <k.icon className="h-5 w-5 text-signal" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k.label}</p>
            <p className="num mt-1 font-display text-xl font-semibold">{k.value}</p>
          </Panel>
        ))}
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Panel>
          <h3 className="font-semibold">Documents analyzed per week</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND} margin={{ left: -20, right: 4 }}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--signal)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--signal)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="w" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tooltip} />
                <Area type="monotone" dataKey="docs" name="Documents" stroke="var(--signal)" strokeWidth={2.5} fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel>
          <h3 className="font-semibold">Most detected issues</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ISSUES} layout="vertical" margin={{ left: 20, right: 8 }}>
                <CartesianGrid horizontal={false} stroke="var(--border)" />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis type="category" dataKey="k" tickLine={false} axisLine={false} fontSize={11} width={100} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tooltip} cursor={{ fill: "var(--secondary)" }} />
                <Bar dataKey="n" name="Detections" fill="var(--chart-1)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">All analytics on this page are Prototype Demo Data and do not represent real users.</p>
    </AppShell>
  );
}
