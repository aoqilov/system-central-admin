import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  LuUsers,
  LuUserCheck,
  LuTrendingUp,
  LuDownload,
  LuCalendar,
  LuClock,
  LuActivity,
} from "react-icons/lu";
import {
  employees,
  EmployeeRole,
  EmployeeStatus,
  type Employee,
} from "../data/employees";
import { CusCard, CusCardHeader } from "../components/shared/card/CusCard";
import { CusButton } from "../components/ui/buttons/CusButton";
import { CusTable, type ColumnDef } from "../components/ui/table/CusTable";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function _s(n: number) {
  return ((n * 9301 + 49297) % 233280) / 233280;
}

const fmtMin = (m: number) => {
  if (!m) return "—";
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h > 0 ? `${h}h ${min}m` : `${min}m`;
};

const fmtH = (m: number) => `${(m / 60).toFixed(1)}h`;

const PRESETS = [
  { label: "Bugun", days: 1 },
  { label: "7 kun", days: 7 },
  { label: "30 kun", days: 30 },
] as const;

// ─── Role / status config ─────────────────────────────────────────────────────

const ROLE_CFG: Record<EmployeeRole, { label: string; color: string }> = {
  [EmployeeRole.ADMIN]:    { label: "Admin",    color: "#8b5cf6" },
  [EmployeeRole.CASHIER]:  { label: "Kassir",   color: "#3b82f6" },
  [EmployeeRole.OPERATOR]: { label: "Operator", color: "#06b6d4" },
  [EmployeeRole.SECURITY]: { label: "Security", color: "#f59e0b" },
  [EmployeeRole.CLEANER]:  { label: "Cleaner",  color: "#64748b" },
};

const STATUS_CFG: Record<EmployeeStatus, { label: string; color: string }> = {
  [EmployeeStatus.ACTIVE]:   { label: "Faol",     color: "var(--color-green)"  },
  [EmployeeStatus.INACTIVE]: { label: "Nofaol",   color: "var(--color-gray)"   },
  [EmployeeStatus.VACATION]: { label: "Ta'tilda", color: "var(--color-yellow)" },
  [EmployeeStatus.FIRED]:    { label: "Ketgan",   color: "var(--color-red)"    },
};

const ROLES = [
  EmployeeRole.ADMIN,
  EmployeeRole.CASHIER,
  EmployeeRole.OPERATOR,
  EmployeeRole.SECURITY,
  EmployeeRole.CLEANER,
];

// ─── Data generators ──────────────────────────────────────────────────────────

function genWorkedMinutes(e: Employee, di: number): number {
  if (e.status === EmployeeStatus.INACTIVE) return 0;
  if (e.status === EmployeeStatus.FIRED)    return 0;
  if (e.status === EmployeeStatus.VACATION) return 0;
  const base = e.statsUser?.core.workedTodayMinutes ?? 0;
  if (!base) return 0;
  const rand = _s(e.id * 31 + di * 7);
  if (rand < 0.08) return 0; // ~8% absent probability
  return Math.round(base * (0.85 + _s(e.id * 17 + di * 11) * 0.3));
}

function genEfficiency(e: Employee, di: number): number {
  const base = e.statsUser?.core.efficiency ?? 0;
  if (!base) return 0;
  return Math.min(100, Math.round(base * (0.9 + _s(e.id * 23 + di * 13) * 0.2)));
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface TipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

interface EmployeeSummary {
  id: number;
  name: string;
  avatarUrl?: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  daysWorked: number;
  avgMinutes: number;
  efficiency: number;
  totalMinutes: number;
  salary: number;
}

// ─── Tooltips ─────────────────────────────────────────────────────────────────

function HoursTip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 border shadow-xl text-xs"
      style={{ background: "var(--bg-tooltip)", borderColor: "var(--border-2)", minWidth: 130 }}
    >
      <p className="font-medium mb-1" style={{ color: "var(--text-default)" }}>{label}</p>
      <div className="flex items-center justify-between gap-4">
        <span style={{ color: "var(--text-muted)" }}>Ish soati</span>
        <span className="font-semibold tabular-nums" style={{ color: "#8b5cf6" }}>
          {(payload[0]?.value ?? 0).toFixed(1)}h
        </span>
      </div>
    </div>
  );
}

function RoleTip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 border shadow-xl text-xs"
      style={{ background: "var(--bg-tooltip)", borderColor: "var(--border-2)", minWidth: 130 }}
    >
      <p className="font-medium mb-1" style={{ color: "var(--text-default)" }}>{label}</p>
      <div className="flex items-center justify-between gap-4">
        <span style={{ color: "var(--text-muted)" }}>Ish soati</span>
        <span className="font-semibold tabular-nums" style={{ color: "var(--text-2)" }}>
          {(payload[0]?.value ?? 0).toFixed(1)}h
        </span>
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon, label, value, sub, color,
}: {
  icon: React.ElementType; label: string; value: string; sub?: string; color: string;
}) {
  return (
    <CusCard className="p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
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
        <p className="text-xl font-bold" style={{ color: "var(--text-default)" }}>
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</p>
        )}
      </div>
    </CusCard>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const ReportsEmployees = () => {
  const [dateFrom, setDateFrom] = useState(
    dayjs().subtract(6, "day").format("YYYY-MM-DD"),
  );
  const [dateTo, setDateTo] = useState(dayjs().format("YYYY-MM-DD"));

  const dates = useMemo(() => {
    const result: string[] = [];
    let cur = dayjs(dateFrom);
    const end = dayjs(dateTo);
    while (!cur.isAfter(end)) {
      result.push(cur.format("YYYY-MM-DD"));
      cur = cur.add(1, "day");
    }
    return result.slice(0, 31);
  }, [dateFrom, dateTo]);

  const tickInterval = dates.length > 14 ? Math.floor(dates.length / 7) : 0;

  // Chart 1: daily total man-hours (AreaChart)
  const dailyHoursData = useMemo(
    () =>
      dates.map((date, di) => {
        const d = dayjs(date);
        const totalMins = employees.reduce((s, e) => s + genWorkedMinutes(e, di), 0);
        return { label: `${d.date()}/${d.month() + 1}`, hours: +(totalMins / 60).toFixed(1) };
      }),
    [dates],
  );

  // Chart 2: role-based total hours in period (BarChart)
  const roleHoursData = useMemo(
    () =>
      ROLES.map((role) => {
        const roleEmps = employees.filter((e) => e.role === role);
        const totalMins = roleEmps.reduce(
          (s, e) => s + dates.reduce((ds, _, di) => ds + genWorkedMinutes(e, di), 0),
          0,
        );
        return {
          name: ROLE_CFG[role].label,
          hours: +(totalMins / 60).toFixed(1),
          color: ROLE_CFG[role].color,
        };
      }),
    [dates],
  );

  // Per-employee summary for table + export
  const summary = useMemo<EmployeeSummary[]>(
    () =>
      employees.map((e) => {
        let totalMinutes = 0;
        let daysWorked = 0;
        let effSum = 0;
        let effDays = 0;
        dates.forEach((_, di) => {
          const m = genWorkedMinutes(e, di);
          if (m > 0) {
            totalMinutes += m;
            daysWorked++;
            effSum += genEfficiency(e, di);
            effDays++;
          }
        });
        const avgMinutes = daysWorked > 0 ? Math.round(totalMinutes / daysWorked) : 0;
        const efficiency = effDays > 0 ? Math.round(effSum / effDays) : 0;
        const salary = e.salary
          ? Math.round(e.salary * (daysWorked / 26))
          : 0;
        return {
          id: e.id,
          name: e.fullName ?? `${e.firstName} ${e.lastName}`,
          avatarUrl: e.avatarUrl,
          role: e.role,
          status: e.status,
          daysWorked,
          avgMinutes,
          efficiency,
          totalMinutes,
          salary,
        };
      }),
    [dates],
  );

  // Aggregates
  const totalManHours   = Math.round(summary.reduce((s, e) => s + e.totalMinutes, 0) / 60);
  const activeCount     = employees.filter((e) => e.status === EmployeeStatus.ACTIVE).length;
  const avgEfficiency   = Math.round(
    summary.filter((e) => e.efficiency > 0).reduce((s, e) => s + e.efficiency, 0) /
    (summary.filter((e) => e.efficiency > 0).length || 1),
  );
  const avgAttendance   = Math.round(
    employees
      .filter((e) => (e.statsUser?.core.attendanceRate ?? 0) > 0)
      .reduce((s, e) => s + (e.statsUser?.core.attendanceRate ?? 0), 0) /
    (employees.filter((e) => (e.statsUser?.core.attendanceRate ?? 0) > 0).length || 1),
  );

  // Excel export
  const exportExcel = () => {
    const rows = summary.map((e) => ({
      "Xodim":             e.name,
      "Lavozim":           ROLE_CFG[e.role].label,
      "Holat":             STATUS_CFG[e.status].label,
      "Ish kunlari":       e.daysWorked,
      "O'rt. ish vaqti":   fmtMin(e.avgMinutes),
      "Jami ish soati":    fmtH(e.totalMinutes),
      "KPI (%)":           e.efficiency || "—",
      "Hisoblangan maosh": e.salary,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [24, 14, 12, 14, 16, 16, 10, 20].map((w) => ({ wch: w }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Xodimlar hisoboti");
    XLSX.writeFile(wb, `xodimlar-hisobot-${dateFrom}-${dateTo}.xlsx`);
  };

  const applyPreset = (days: number) => {
    setDateFrom(dayjs().subtract(days - 1, "day").format("YYYY-MM-DD"));
    setDateTo(dayjs().format("YYYY-MM-DD"));
  };

  const isPreset = (days: number) =>
    dateFrom === dayjs().subtract(days - 1, "day").format("YYYY-MM-DD") &&
    dateTo   === dayjs().format("YYYY-MM-DD");

  const columns: ColumnDef<EmployeeSummary>[] = [
    {
      key: "name",
      header: "Xodim",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src={row.avatarUrl ?? `https://i.pravatar.cc/150?u=${row.id}`}
            alt={row.name}
            style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
          />
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-default)", lineHeight: 1.2 }}>
              {row.name}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>#{row.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Lavozim",
      render: (row) => {
        const cfg = ROLE_CFG[row.role];
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
      render: (row) => {
        const cfg = STATUS_CFG[row.status];
        return (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12 }}>
            <span
              style={{
                width: 7, height: 7, borderRadius: "50%",
                background: cfg.color,
                boxShadow: row.status === EmployeeStatus.ACTIVE ? `0 0 5px ${cfg.color}` : "none",
              }}
            />
            <span style={{ color: cfg.color }}>{cfg.label}</span>
          </span>
        );
      },
    },
    {
      key: "daysWorked",
      header: "Ish kunlari",
      align: "right",
      render: (row) => (
        <span className="text-sm tabular-nums" style={{ color: "var(--text-2)" }}>
          {row.daysWorked > 0 ? `${row.daysWorked} / ${dates.length}` : "—"}
        </span>
      ),
    },
    {
      key: "avgMinutes",
      header: "O'rt. vaqt",
      align: "right",
      render: (row) => (
        <span className="text-xs tabular-nums" style={{ color: "var(--text-3)" }}>
          {fmtMin(row.avgMinutes)}
        </span>
      ),
    },
    {
      key: "totalMinutes",
      header: "Jami soat",
      align: "right",
      render: (row) => (
        <span className="text-sm tabular-nums" style={{ color: "var(--text-2)" }}>
          {row.totalMinutes > 0 ? fmtH(row.totalMinutes) : "—"}
        </span>
      ),
    },
    {
      key: "efficiency",
      header: "KPI",
      align: "right",
      render: (row) => {
        if (!row.efficiency) return <span style={{ color: "var(--text-dim)" }}>—</span>;
        const color =
          row.efficiency >= 90
            ? "var(--color-green)"
            : row.efficiency >= 75
              ? "var(--color-yellow)"
              : "var(--color-red)";
        return (
          <span style={{ fontSize: 13, fontWeight: 600, color }}>{row.efficiency}%</span>
        );
      },
    },
    {
      key: "salary",
      header: "Maosh (hisob.)",
      align: "right",
      render: (row) =>
        row.salary > 0 ? (
          <span className="text-xs tabular-nums" style={{ color: "var(--text-default)" }}>
            {(row.salary / 1_000_000).toFixed(2)} mln
          </span>
        ) : (
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>
        ),
    },
  ];

  return (
    <div className="space-y-4">

      {/* ── Date filter + export ────────────────────────────────────────────── */}
      <CusCard className="p-3 tablet:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {PRESETS.map(({ label, days }) => (
              <button
                key={days}
                onClick={() => applyPreset(days)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: isPreset(days) ? "var(--color-blue)" : "var(--border-default)",
                  background: isPreset(days) ? "var(--color-blue)18" : "var(--bg-hover)",
                  color: isPreset(days) ? "var(--color-blue)" : "var(--text-muted)",
                  transition: "all 0.15s",
                }}
              >
                {label}
              </button>
            ))}

            <span style={{ color: "var(--border-2)", fontSize: 18, lineHeight: 1, userSelect: "none" }}>
              |
            </span>

            <div className="flex items-center gap-2">
              <LuCalendar size={14} style={{ color: "var(--text-muted)" }} />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                style={{
                  padding: "4px 8px",
                  borderRadius: 6,
                  fontSize: 12,
                  border: "1px solid var(--border-default)",
                  background: "var(--bg-input)",
                  color: "var(--text-default)",
                  outline: "none",
                  colorScheme: "dark",
                }}
              />
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                style={{
                  padding: "4px 8px",
                  borderRadius: 6,
                  fontSize: 12,
                  border: "1px solid var(--border-default)",
                  background: "var(--bg-input)",
                  color: "var(--text-default)",
                  outline: "none",
                  colorScheme: "dark",
                }}
              />
            </div>
          </div>

          <CusButton
            size="sm"
            variant="solid"
            colorPalette="green"
            leftIcon={<LuDownload size={14} />}
            onClick={exportExcel}
          >
            Excel yuklab olish
          </CusButton>
        </div>
      </CusCard>

      {/* ── Stat cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 desktop:grid-cols-4 gap-4">
        <StatCard
          icon={LuUsers}
          label="Jami xodimlar"
          value={String(employees.length)}
          sub="ro'yxatda"
          color="var(--color-blue)"
        />
        <StatCard
          icon={LuUserCheck}
          label="Faol xodimlar"
          value={String(activeCount)}
          sub="bugun ishda"
          color="var(--color-green)"
        />
        <StatCard
          icon={LuClock}
          label="Jami ish soati"
          value={`${totalManHours}h`}
          sub={`${dates.length} kun davomida`}
          color="var(--color-purple)"
        />
        <StatCard
          icon={LuTrendingUp}
          label="O'rtacha KPI"
          value={`${avgEfficiency}%`}
          sub={`Davomad: ${avgAttendance}%`}
          color="var(--color-cyan)"
        />
      </div>

      {/* ── Charts ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 desktop:grid-cols-2 gap-4">

        {/* Chart 1: Daily man-hours */}
        <CusCard>
          <CusCardHeader
            icon={LuClock}
            title="Kunlik umumiy ish soatlari"
            iconColor="var(--color-purple)"
            action={
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {dates.length} kun
              </span>
            }
          />
          <div className="px-2 pt-2 pb-3">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={dailyHoursData}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "var(--chart-tick)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval={tickInterval}
                />
                <YAxis
                  tick={{ fill: "var(--chart-tick)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${v}h`}
                />
                <Tooltip content={<HoursTip />} cursor={{ stroke: "var(--border-2)" }} />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#hoursGrad)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: "#8b5cf6" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CusCard>

        {/* Chart 2: Role-based total hours */}
        <CusCard>
          <CusCardHeader
            icon={LuActivity}
            title="Lavozim bo'yicha ish soatlari"
            iconColor="var(--color-cyan)"
            action={
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {dates.length} kun
              </span>
            }
          />
          <div className="px-2 pt-2 pb-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={roleHoursData}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                barSize={32}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--chart-tick)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--chart-tick)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${v}h`}
                />
                <Tooltip
                  content={<RoleTip />}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                  {roleHoursData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1">
              {ROLES.map((role) => (
                <div key={role} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ background: ROLE_CFG[role].color }}
                  />
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {ROLE_CFG[role].label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CusCard>
      </div>

      {/* ── Detailed table ──────────────────────────────────────────────────── */}
      <CusCard>
        <CusCardHeader
          icon={LuUsers}
          title="Xodimlar bo'yicha tafsilot"
          iconColor="var(--color-blue)"
          action={
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {dateFrom} — {dateTo}
            </span>
          }
        />
        <CusTable<EmployeeSummary>
          data={summary}
          columns={columns}
          variant="outline"
          colorHeader="var(--bg-hover)"
          colorBodyHover="var(--bg-hover)"
          interactive
          size="sm"
          emptyText="Ma'lumot topilmadi"
        />
      </CusCard>

    </div>
  );
};

export default ReportsEmployees;
