import React from "react";
import {
  LuUsers,
  LuUserCheck,
  LuUserX,
  LuUmbrellaOff,
  LuFerrisWheel,
  LuBanknote,
  LuActivity,
  LuTrendingUp,
  LuClock,
} from "react-icons/lu";
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
  employees,
  EmployeeRole,
  EmployeeStatus,
  type OperatorStats,
  type CashierStats,
} from "../data/employees";
import { CusCard, CusCardHeader } from "../components/shared/card/CusCard";
import { BarListChart } from "../components/charts/chakra/BarListChart";
import { CusTable, type ColumnDef } from "../components/ui/table/CusTable";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtMin = (m = 0) => {
  if (!m) return "—";
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h > 0 ? `${h}h ${min}m` : `${min}m`;
};

const ROLE_CFG: Record<EmployeeRole, { label: string; color: string }> = {
  [EmployeeRole.ADMIN]: { label: "Admin", color: "var(--color-purple)" },
  [EmployeeRole.CASHIER]: { label: "Kassir", color: "var(--color-blue)" },
  [EmployeeRole.OPERATOR]: { label: "Operator", color: "var(--color-cyan)" },
  [EmployeeRole.SECURITY]: { label: "Security", color: "var(--color-yellow)" },
  [EmployeeRole.CLEANER]: { label: "Cleaner", color: "var(--color-gray)" },
};

const STATUS_CFG: Record<EmployeeStatus, { label: string; color: string }> = {
  [EmployeeStatus.ACTIVE]: { label: "Faol", color: "var(--color-green)" },
  [EmployeeStatus.INACTIVE]: { label: "Nofaol", color: "var(--color-gray)" },
  [EmployeeStatus.VACATION]: {
    label: "Ta'tilda",
    color: "var(--color-yellow)",
  },
  [EmployeeStatus.FIRED]: { label: "Ketgan", color: "var(--color-red)" },
};

// ─── Derived stats ────────────────────────────────────────────────────────────

const activeCount = employees.filter(
  (e) => e.status === EmployeeStatus.ACTIVE,
).length;
const vacationCount = employees.filter(
  (e) => e.status === EmployeeStatus.VACATION,
).length;
const inactiveCount = employees.filter(
  (e) => e.status === EmployeeStatus.INACTIVE,
).length;
const operatorCount = employees.filter(
  (e) => e.role === EmployeeRole.OPERATOR,
).length;

const avgEfficiency = Math.round(
  employees
    .filter((e) => (e.statsUser?.core.efficiency ?? 0) > 0)
    .reduce((s, e) => s + (e.statsUser?.core.efficiency ?? 0), 0) /
    employees.filter((e) => (e.statsUser?.core.efficiency ?? 0) > 0).length,
);

// Top operators by ridesOperatedToday
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

// Efficiency weekly bar chart data (all active employees, averaged by day)
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

// Cashier revenue today for BarListChart
const cashierRevenue = employees
  .filter((e) => e.role === EmployeeRole.CASHIER)
  .map((e) => ({
    label: e.fullName ?? `${e.firstName} ${e.lastName}`,
    value:
      (e.statsUser?.roleStats as CashierStats | undefined)?.revenueToday ?? 0,
    color: "var(--color-blue)",
  }))
  .sort((a, b) => b.value - a.value);

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  icon: React.ElementType;
}) {
  return (
    <CusCard className="p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <div>
        <p
          className="text-xl font-bold"
          style={{ color: "var(--text-default)" }}
        >
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {sub}
          </p>
        )}
      </div>
    </CusCard>
  );
}

// ─── Recharts tooltip ─────────────────────────────────────────────────────────

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

// ─── Main page ────────────────────────────────────────────────────────────────

const LiveMonitorEmployes = () => {
  return (
    <div className="space-y-4">
      {/* ── Row 1: stat cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-6 gap-4">
        <StatCard
          label="Jami xodimlar"
          value={String(employees.length)}
          sub="ro'yxatda"
          color="var(--color-blue)"
          icon={LuUsers}
        />
        <StatCard
          label="Faol"
          value={String(activeCount)}
          sub="bugun ishda"
          color="var(--color-green)"
          icon={LuUserCheck}
        />
        <StatCard
          label="Ta'tilda"
          value={String(vacationCount)}
          sub="xodim"
          color="var(--color-yellow)"
          icon={LuUmbrellaOff}
        />
        <StatCard
          label="Nofaol"
          value={String(inactiveCount)}
          sub="xodim"
          color="var(--color-gray)"
          icon={LuUserX}
        />
        <StatCard
          label="Operatorlar"
          value={String(operatorCount)}
          sub="attraksion"
          color="var(--color-cyan)"
          icon={LuFerrisWheel}
        />
        <CusCard className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Samaradorlik
            </span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--color-purple)18" }}
            >
              <LuTrendingUp
                size={15}
                style={{ color: "var(--color-purple)" }}
              />
            </div>
          </div>
          <div>
            <p
              className="text-xl font-bold"
              style={{ color: "var(--text-default)" }}
            >
              {avgEfficiency}%
            </p>
            <div
              className="mt-1.5 h-1.5 rounded-full overflow-hidden"
              style={{ background: "var(--bg-hover)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${avgEfficiency}%`,
                  background: "var(--color-purple)",
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>
        </CusCard>
      </div>

      {/* ── Row 2: main body ───────────────────────────────── */}
      <div className="grid grid-cols-1 desktop:grid-cols-[3fr_2fr] gap-4 items-start">
        {/* Left — employees table */}
        <CusCard>
          <CusCardHeader
            icon={LuActivity}
            title="Xodimlar holati"
            iconColor="var(--color-green)"
            action={
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "var(--color-green)" }}
                />
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Live
                </span>
              </div>
            }
          />
          <CusTable<(typeof employees)[number]>
            data={employees}
            maxH="400px"
            stickyHeader
            variant="outline"
            colorHeader="var(--bg-hover)"
            size="sm"
            columns={
              [
                {
                  key: "fullName",
                  header: "Xodim",
                  render: (e) => (
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <img
                        src={
                          e.avatarUrl ?? `https://i.pravatar.cc/150?u=${e.id}`
                        }
                        alt={e.fullName}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "var(--text-2)",
                            lineHeight: 1.2,
                          }}
                        >
                          {e.fullName ?? `${e.firstName} ${e.lastName}`}
                        </p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          #{e.id}
                        </p>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "role",
                  header: "Lavozim",
                  render: (e) => {
                    const cfg = ROLE_CFG[e.role];
                    return (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          background: `${cfg.color}18`,
                          color: cfg.color,
                        }}
                      >
                        {cfg.label}
                      </span>
                    );
                  },
                },
                {
                  key: "status",
                  header: "Holat",
                  render: (e) => {
                    const cfg = STATUS_CFG[e.status];
                    return (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 12,
                        }}
                      >
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: cfg.color,
                            display: "inline-block",
                            boxShadow:
                              e.status === EmployeeStatus.ACTIVE
                                ? `0 0 5px ${cfg.color}`
                                : "none",
                          }}
                        />
                        <span style={{ color: cfg.color }}>{cfg.label}</span>
                      </span>
                    );
                  },
                },
                {
                  key: "statsUser",
                  header: "Keldi",
                  render: (e) => (
                    <span
                      className="font-mono text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {e.statsUser?.core.checkIn ?? "—"}
                    </span>
                  ),
                },
                {
                  key: "statsUser",
                  header: "Ish vaqti",
                  render: (e) => (
                    <span style={{ fontSize: 12, color: "var(--text-3)" }}>
                      {fmtMin(e.statsUser?.core.workedTodayMinutes)}
                    </span>
                  ),
                },
                {
                  key: "statsUser",
                  header: "KPI",
                  align: "right",
                  render: (e) => {
                    const eff = e.statsUser?.core.efficiency;
                    if (!eff)
                      return (
                        <span style={{ color: "var(--text-dim)" }}>—</span>
                      );
                    const color =
                      eff >= 90
                        ? "var(--color-green)"
                        : eff >= 75
                          ? "var(--color-yellow)"
                          : "var(--color-red)";
                    return (
                      <span style={{ fontSize: 13, fontWeight: 600, color }}>
                        {eff}%
                      </span>
                    );
                  },
                },
              ] satisfies ColumnDef<(typeof employees)[number]>[]
            }
          />
        </CusCard>

        {/* Right — charts */}
        <div className="flex flex-col gap-4">
          {/* Operatorlar samaradorligi */}
          <CusCard>
            <CusCardHeader
              icon={LuFerrisWheel}
              title="Operatorlar (turlar)"
              iconColor="var(--color-cyan)"
              action={
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Bugun
                </span>
              }
            />
            <div className="p-4">
              <BarListChart
                data={topOperators}
                valueFormatter={(v) => `${v} tur`}
                sort="none"
                barHeight={32}
                gap={8}
                labelWidth="45%"
              />
            </div>
          </CusCard>

          {/* Kassirlar daromadi */}
          <CusCard>
            <CusCardHeader
              icon={LuBanknote}
              title="Kassirlar daromadi"
              iconColor="var(--color-blue)"
              action={
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Bugun
                </span>
              }
            />
            <div className="p-4">
              <BarListChart
                data={cashierRevenue}
                valueFormatter={(v) => `${(v / 1_000_000).toFixed(2)} mln`}
                sort="desc"
                barHeight={32}
                gap={8}
                labelWidth="45%"
              />
            </div>
          </CusCard>

          {/* Haftalik o'rtacha ish vaqti */}
          <CusCard>
            <CusCardHeader
              icon={LuClock}
              title="Haftalik ish vaqti"
              iconColor="var(--color-purple)"
              action={
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  O'rtacha
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
        </div>
      </div>
    </div>
  );
};

export default LiveMonitorEmployes;
