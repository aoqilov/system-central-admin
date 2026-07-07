import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { LuChartColumn, LuLayers, LuActivity } from "react-icons/lu";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { BarListChart } from "@/components/charts/chakra/BarListChart";
import { CusCard, CusCardHeader } from "@/components/shared/card/CusCard";
import { NFC_TYPE_META, type NfcAllStats } from "../nfc-all.types";

// ─── Tooltip ──────────────────────────────────────────────────────────────────

interface TipProps {
  active?: boolean;
  payload?: Array<{ value?: number; name?: string; color?: string }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs border shadow-xl space-y-1"
      style={{ background: "var(--bg-tooltip)", borderColor: "var(--border-2)" }}
    >
      <p className="font-semibold mb-1" style={{ color: "var(--text-default)" }}>
        {label}
      </p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ background: p.color }}
          />
          <span style={{ color: "var(--text-muted)" }}>{p.name}:</span>
          <span className="font-medium" style={{ color: "var(--text-default)" }}>
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Status chart ─────────────────────────────────────────────────────────────

function StatusChart({ stats }: { stats: NfcAllStats }) {
  const data = [
    { label: "Активна",       value: stats.total.active,   color: "#22c55e" },
    { label: "Не активна",    value: stats.total.inactive, color: "#6b7280" },
    { label: "Заблокирована", value: stats.total.blocked,  color: "#ef4444" },
    { label: "Заморожена",    value: stats.total.frozen,   color: "var(--color-blue)" },
    { label: "Утеряна",       value: stats.total.lost,     color: "#f59e0b" },
  ].filter((d) => d.value > 0);

  return (
    <div className="p-5">
      <BarListChart
        data={data}
        valueFormatter={(v) => `${v} карт`}
        sort="desc"
        barHeight={36}
        gap={10}
        labelWidth="40%"
      />
    </div>
  );
}

// ─── Type chart ───────────────────────────────────────────────────────────────

function TypeChart({ stats }: { stats: NfcAllStats }) {
  const chartData = (["classic", "vip", "org"] as const).map((t) => ({
    name:     NFC_TYPE_META[t].label,
    active:   stats.byType[t].active,
    inactive: stats.byType[t].inactive,
    blocked:  stats.byType[t].blocked + stats.byType[t].lost,
    frozen:   stats.byType[t].frozen,
  }));

  return (
    <div className="px-2 pt-4 pb-3">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          margin={{ top: 4, right: 16, left: -20, bottom: 0 }}
          barSize={32}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--chart-grid)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--chart-tick)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--chart-tick)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--bg-hover)" }} />
          <Legend
            formatter={(value: string) => (
              <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{value}</span>
            )}
          />
          <Bar dataKey="active"   name="Активна"    fill="#22c55e" stackId="a" />
          <Bar dataKey="inactive" name="Не активна" fill="#6b7280" stackId="a" />
          <Bar dataKey="frozen"   name="Заморожена" fill="var(--color-blue)" stackId="a" />
          <Bar dataKey="blocked"  name="Заблок./Утер." fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Batch chart ──────────────────────────────────────────────────────────────

function BatchChart({ stats }: { stats: NfcAllStats }) {
  const data = [...stats.batches]
    .sort((a, b) => b.total - a.total)
    .map((b) => ({
      label:       b.batchName,
      value:       b.total,
      color:       NFC_TYPE_META[b.type].color,
      description: `${NFC_TYPE_META[b.type].label} · Активных: ${b.active}`,
    }));

  return (
    <div className="p-5">
      <BarListChart
        data={data}
        valueFormatter={(v) => `${v} карт`}
        sort="none"
        barHeight={34}
        gap={10}
        labelWidth="42%"
      />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

type ChartTab = "status" | "type" | "batch";

interface Props {
  stats: NfcAllStats;
}

export function NfcAllCharts({ stats }: Props) {
  const [tab, setTab] = useState<ChartTab>("status");

  const TABS = [
    { id: "status", label: "По статусу", icon: <LuActivity size={13} /> },
    { id: "type",   label: "По типу",    icon: <LuChartColumn size={13} /> },
    { id: "batch",  label: "По партии",  icon: <LuLayers size={13} /> },
  ];

  const headerAction = (
    <CusSegment
      size="xs"
      layout="inline"
      value={tab}
      onValueChange={(v) => setTab(v as ChartTab)}
      items={TABS}
    />
  );

  return (
    <CusCard>
      <CusCardHeader
        icon={LuChartColumn}
        title="Статистика карт"
        iconColor="var(--color-blue)"
        action={headerAction}
      />

      {tab === "status" && <StatusChart stats={stats} />}
      {tab === "type"   && <TypeChart   stats={stats} />}
      {tab === "batch"  && <BatchChart  stats={stats} />}
    </CusCard>
  );
}
