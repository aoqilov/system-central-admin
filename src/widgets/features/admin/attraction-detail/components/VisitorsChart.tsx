import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LuUsers } from "react-icons/lu";
import {
  CusCard as Card,
  CusCardHeader as CardHeader,
} from "../../../../../components/shared/card/CusCard";
import type { TipProps } from "../types";

function VisitorsTooltip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm border shadow-xl"
      style={{
        background: "var(--bg-tooltip)",
        borderColor: "var(--border-2)",
        color: "var(--text-4)",
      }}
    >
      <p className="mb-1">{label}</p>
      <p className="font-medium" style={{ color: "#22c55e" }}>
        Tashrif: {payload[0].value?.toLocaleString()}
      </p>
    </div>
  );
}

interface Props {
  data: { day: string; visitors: number }[];
}

export function VisitorsChart({ data }: Props) {
  return (
    <Card>
      <CardHeader icon={LuUsers} title="Haftalik tashriflar" iconColor="#22c55e" />
      <div className="p-5">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: "var(--chart-tick)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--chart-tick)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<VisitorsTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
            />
            <Bar dataKey="visitors" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
