import { useState } from "react";
import { LuChartColumn, LuLayers, LuActivity } from "react-icons/lu";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { BarListChart } from "@/components/charts/chakra/BarListChart";
import { CusCard, CusCardHeader } from "@/components/shared/card/CusCard";
import { NFC_TYPE_META, type NfcAllStats } from "../nfc-all.types";

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
  const chartData = (["classic", "vip", "organization"] as const).map((t) => ({
    name:  NFC_TYPE_META[t].label,
    total: stats.byType[t].total,
    color: NFC_TYPE_META[t].color,
  }));

  return (
    <div className="p-5">
      <BarListChart
        data={chartData.map((d) => ({
          label: d.name,
          value: d.total,
          color: d.color,
        }))}
        valueFormatter={(v) => `${v} карт`}
        sort="none"
        barHeight={36}
        gap={10}
        labelWidth="40%"
      />
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
