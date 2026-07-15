import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { fmt } from "./StatCard";

const HOURLY = [
  { hour: "08:00", amount: 120_000 },
  { hour: "09:00", amount: 280_000 },
  { hour: "10:00", amount: 350_000 },
  { hour: "11:00", amount: 420_000 },
  { hour: "12:00", amount: 510_000 },
  { hour: "13:00", amount: 390_000 },
  { hour: "14:00", amount: 460_000 },
  { hour: "15:00", amount: 320_000 },
  { hour: "16:00", amount: 290_000 },
  { hour: "17:00", amount: 500_000 },
];

const EMPTY_HOURLY = HOURLY.map((h) => ({ ...h, amount: 0 }));

interface TipProps {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border px-3 py-2"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
        fontSize: 12,
      }}
    >
      <p style={{ color: "var(--text-muted)", marginBottom: 2 }}>{label}</p>
      <p className="font-bold" style={{ color: "var(--text-default)" }}>
        {(payload[0].value ?? 0).toLocaleString()} сум
      </p>
    </div>
  );
}

export function HourlyChart({ hasActiveSmena }: { hasActiveSmena: boolean }) {
  const data = hasActiveSmena ? HOURLY : EMPTY_HOURLY;

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
    >
      <div
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: "var(--border-default)" }}
      >
        <p className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>
          Почасовая выручка
        </p>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          сегодня
        </span>
      </div>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barSize={28}>
            <CartesianGrid vertical={false} stroke="var(--border-default)" strokeDasharray="3 3" />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => fmt(v)}
              tick={{ fontSize: 10, fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-hover)", radius: 4 }} />
            <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} fillOpacity={hasActiveSmena ? 0.85 : 0.25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
