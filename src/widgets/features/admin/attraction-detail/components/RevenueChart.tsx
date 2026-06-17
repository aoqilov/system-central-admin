import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LuTag } from "react-icons/lu";
import {
  CusCard as Card,
  CusCardHeader as CardHeader,
} from "../../../../../components/shared/card/CusCard";
import type { TipProps } from "../types";

function RevenueTooltip({ active, payload, label }: TipProps) {
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
      <p className="font-medium" style={{ color: "#3b82f6" }}>
        Daromad: {payload[0].value?.toLocaleString()} UZS
      </p>
    </div>
  );
}

interface Props {
  data: { day: string; revenue: number }[];
}

export function RevenueChart({ data }: Props) {
  return (
    <Card>
      <CardHeader icon={LuTag} title="Haftalik daromad" iconColor="#3b82f6" />
      <div className="p-5">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<RevenueTooltip />} cursor={{ stroke: "var(--border-2)" }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#revGrad)"
              dot={{ fill: "#3b82f6", strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: "#3b82f6", stroke: "var(--bg-main)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
