import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { type Employee } from "@/data/employees";
import { useTranslation } from "@/i18n/languageConfig";
import { ROLE_CHART, type ChartCfg } from "../helpers";

type ChartTooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  cfg?: ChartCfg;
  chartLabel?: string;
};

function ChartTooltip({ active, payload, label, cfg, chartLabel }: ChartTooltipProps) {
  if (!active || !payload?.length || !cfg) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm border shadow-xl"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-2)",
        color: "var(--text-default)",
      }}
    >
      <p className="mb-0.5" style={{ color: "var(--text-muted)", fontSize: 11 }}>
        {label}
      </p>
      <p className="font-semibold" style={{ color: cfg.color }}>
        {chartLabel}: {payload[0].value}
      </p>
    </div>
  );
}

export default function WeeklyChart({ employee }: { employee: Employee }) {
  const { t } = useTranslation("employeeDetail.");
  const data = employee.statsUser?.analytics.weekly.data ?? [];
  const cfg = ROLE_CHART[employee.role];
  const chartLabel = t(`chart.${cfg.labelKey}`);

  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
        <p className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>
          {t("weeklyActivity")}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barSize={22}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--chart-tick)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--chart-tick)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={cfg.yFmt}
          />
          <Tooltip
            content={<ChartTooltip cfg={cfg} chartLabel={chartLabel} />}
            cursor={{ fill: "var(--bg-hover)" }}
          />
          <Bar dataKey={cfg.dataKey} fill={cfg.color} fillOpacity={0.85} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
