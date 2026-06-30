import React from "react";
import { LuTrendingUp } from "react-icons/lu";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CusCard, CusCardHeader } from "../../../../../../components/shared/card/CusCard";

interface HourlyPoint {
  hour: string;
  visitors: number;
}

interface TipProps {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}

const hourlyVisitors: HourlyPoint[] = [
  { hour: "09:00", visitors: 42 },
  { hour: "10:00", visitors: 118 },
  { hour: "11:00", visitors: 196 },
  { hour: "12:00", visitors: 244 },
  { hour: "13:00", visitors: 210 },
  { hour: "14:00", visitors: 278 },
  { hour: "15:00", visitors: 312 },
  { hour: "16:00", visitors: 290 },
  { hour: "17:00", visitors: 268 },
  { hour: "17:45", visitors: 152 },
];

function HourlyTooltip({ active, payload, label }: TipProps) {
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
      <p className="font-semibold" style={{ color: "var(--text-default)" }}>
        {payload[0].value?.toLocaleString()}{" "}
        <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>чел.</span>
      </p>
    </div>
  );
}

export function HourlyVisitorsChart() {
  return (
    <CusCard>
      <CusCardHeader
        icon={LuTrendingUp}
        title="Посетители по часам"
        iconColor="var(--color-cyan)"
        action={
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Сегодня
          </span>
        }
      />
      <div className="px-2 pt-2 pb-3">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart
            data={hourlyVisitors}
            margin={{ top: 8, right: 12, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="attrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--chart-grid)"
              vertical={false}
            />
            <XAxis
              dataKey="hour"
              tick={{ fill: "var(--chart-tick)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={1}
            />
            <YAxis
              tick={{ fill: "var(--chart-tick)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<HourlyTooltip />}
              cursor={{ stroke: "var(--border-2)" }}
            />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fill="url(#attrGrad)"
              dot={{ fill: "#06b6d4", strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: "#06b6d4", stroke: "var(--bg-main)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CusCard>
  );
}
