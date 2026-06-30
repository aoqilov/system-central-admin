import React from "react";
import { LuFerrisWheel, LuBanknote, LuClock } from "react-icons/lu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CusCard,
  CusCardHeader,
} from "../../../../../../components/shared/card/CusCard";
import { BarListChart } from "../../../../../../components/charts/chakra/BarListChart";
import {
  employees,
  EmployeeRole,
  type OperatorStats,
  type CashierStats,
} from "../../../../../../data/employees";

const fmtMin = (m = 0) => {
  if (!m) return "—";
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h > 0 ? `${h}h ${min}m` : `${min}m`;
};

interface TipProps {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}

function WorkTooltip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  const mins = payload[0].value ?? 0;
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm border shadow-xl"
      style={{
        background: "var(--bg-tooltip)",
        borderColor: "var(--border-2)",
      }}
    >
      <p style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="font-semibold" style={{ color: "var(--text-default)" }}>
        {fmtMin(mins)}
      </p>
    </div>
  );
}

const topOperators = employees
  .filter((e) => e.role === EmployeeRole.OPERATOR)
  .map((e) => ({
    label: e.fullName ?? `${e.firstName} ${e.lastName}`,
    value:
      (e.statsUser?.roleStats as OperatorStats | undefined)
        ?.ridesOperatedToday ?? 0,
    color: "var(--color-cyan)",
  }))
  .sort((a, b) => b.value - a.value);

const cashierRevenue = employees
  .filter((e) => e.role === EmployeeRole.CASHIER)
  .map((e) => ({
    label: e.fullName ?? `${e.firstName} ${e.lastName}`,
    value:
      (e.statsUser?.roleStats as CashierStats | undefined)?.revenueToday ?? 0,
    color: "var(--color-blue)",
  }))
  .sort((a, b) => b.value - a.value);

const weekDays = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
const efficiencyByDay = weekDays.map((day) => {
  const vals = employees
    .map(
      (e) =>
        e.statsUser?.analytics.weekly.data.find((d) => d.date === day)
          ?.workedMinutes ?? 0,
    )
    .filter((v) => v > 0);
  const avg = vals.length
    ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length)
    : 0;
  return { day, minutes: avg };
});

export function EmployeeCharts() {
  return (
    <>
      <CusCard>
        <CusCardHeader
          icon={LuFerrisWheel}
          title="Операторы (туры)"
          iconColor="var(--color-cyan)"
          action={
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Сегодня
            </span>
          }
        />
        <div className="p-4">
          <BarListChart
            data={topOperators}
            valueFormatter={(v) => `${v} тур`}
            sort="none"
            barHeight={32}
            gap={8}
            labelWidth="45%"
          />
        </div>
      </CusCard>

      <CusCard>
        <CusCardHeader
          icon={LuBanknote}
          title="Выручка кассиров"
          iconColor="var(--color-blue)"
          action={
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Сегодня
            </span>
          }
        />
        <div className="p-4">
          <BarListChart
            data={cashierRevenue}
            valueFormatter={(v) => `${(v / 1_000_000).toFixed(2)} млн`}
            sort="desc"
            barHeight={32}
            gap={8}
            labelWidth="45%"
          />
        </div>
      </CusCard>

      <CusCard>
        <CusCardHeader
          icon={LuClock}
          title="Рабочее время за неделю"
          iconColor="var(--color-purple)"
          action={
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              В среднем
            </span>
          }
        />
        <div className="px-2 pt-2 pb-3">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={efficiencyByDay}
              margin={{ top: 4, right: 8, left: -24, bottom: 0 }}
              barSize={18}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--chart-grid)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "var(--chart-tick)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--chart-tick)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${Math.floor(v / 60)}h`}
              />
              <Tooltip
                content={<WorkTooltip />}
                cursor={{ fill: "var(--bg-hover)" }}
              />
              <Bar
                dataKey="minutes"
                fill="var(--color-purple)"
                radius={[4, 4, 0, 0]}
                fillOpacity={0.85}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CusCard>
    </>
  );
}
