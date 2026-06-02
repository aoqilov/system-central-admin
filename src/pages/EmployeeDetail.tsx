import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LuArrowLeft,
  LuPhone,
  LuSend,
  LuCalendar,
  LuBriefcase,
  LuUser,
  LuClock,
  LuActivity,
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
import dayjs from "dayjs";
import {
  employees,
  EmployeeRole,
  EmployeeStatus,
  type Employee,
  type OperatorStats,
  type CashierStats,
  type SecurityStats,
  type CleanerStats,
} from "../data/employees";
import {
  CusBadge,
  type BadgeStatus,
  type BadgeRole,
} from "../components/ui/badge/CusBadge";
import { CusButton } from "../components/ui/buttons/CusButton";
import { useTranslation } from "../i18n/languageConfig";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtMin(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const STATUS_TO_BADGE: Record<EmployeeStatus, BadgeStatus> = {
  [EmployeeStatus.ACTIVE]: "active",
  [EmployeeStatus.INACTIVE]: "inactive",
  [EmployeeStatus.FIRED]: "fired",
  [EmployeeStatus.VACATION]: "vacation",
};

type ChartCfg = {
  dataKey: string;
  labelKey: "rides" | "tickets" | "incidents" | "tasks" | "minutes";
  color: string;
  yFmt?: (v: number) => string;
};

const ROLE_CHART: Record<EmployeeRole, ChartCfg> = {
  [EmployeeRole.OPERATOR]: {
    dataKey: "ridesOperated",
    labelKey: "rides",
    color: "#3b82f6",
  },
  [EmployeeRole.CASHIER]: {
    dataKey: "ticketsSold",
    labelKey: "tickets",
    color: "#22c55e",
  },
  [EmployeeRole.SECURITY]: {
    dataKey: "incidents",
    labelKey: "incidents",
    color: "#ef4444",
  },
  [EmployeeRole.CLEANER]: {
    dataKey: "tasksDone",
    labelKey: "tasks",
    color: "#f59e0b",
  },
  [EmployeeRole.ADMIN]: {
    dataKey: "workedMinutes",
    labelKey: "minutes",
    color: "#8b5cf6",
    yFmt: (v) => `${Math.floor(v / 60)}h`,
  },
};

function getRoleMainStat(
  employee: Employee,
  t: (key: string) => string,
): { value: string; label: string } {
  const rs = employee.statsUser?.roleStats;
  if (!rs) {
    const min = employee.statsUser?.core.workedTodayMinutes;
    return { value: min ? fmtMin(min) : "—", label: t("workedToday") };
  }
  switch (employee.role) {
    case EmployeeRole.OPERATOR:
      return {
        value: String((rs as OperatorStats).ridesOperatedToday ?? 0),
        label: t("chart.rides"),
      };
    case EmployeeRole.CASHIER:
      return {
        value: String((rs as CashierStats).ticketsSoldToday ?? 0),
        label: t("chart.tickets"),
      };
    case EmployeeRole.SECURITY:
      return {
        value: String((rs as SecurityStats).incidentsToday ?? 0),
        label: t("chart.incidents"),
      };
    case EmployeeRole.CLEANER:
      return {
        value: String((rs as CleanerStats).tasksDoneToday ?? 0),
        label: t("chart.tasks"),
      };
    default:
      return { value: "—", label: t("workedToday") };
  }
}

// ─── Header Stat (katta raqam) ────────────────────────────────────────────────

function HeaderStat({
  value,
  label,
  color,
  divider = true,
}: {
  value: string;
  label: string;
  color?: string;
  divider?: boolean;
}) {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center py-4 px-2 tablet:px-4 tablet:py-5 bg-[var(--bg-main)] rounded-xl text-center"
      style={divider ? { borderLeft: "1px solid var(--border-default)" } : {}}
    >
      <p
        className="text-xl tablet:text-2xl font-bold leading-none"
        style={{ color: color ?? "var(--text-default)" }}
      >
        {value}
      </p>
      <p
        className="text-xs mt-1.5 text-center"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </p>
      {color && (
        <div
          className="w-5 h-0.5 mt-2 rounded-full"
          style={{ background: color }}
        />
      )}
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
  last = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 py-3"
      style={last ? {} : { borderBottom: "1px solid var(--border-default)" }}
    >
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
        style={{ background: "var(--bg-hover)" }}
      >
        <Icon size={13} style={{ color: "var(--text-muted)" }} />
      </div>
      <div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--text-default)" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Role Stats ───────────────────────────────────────────────────────────────

function RoleStats({ employee }: { employee: Employee }) {
  const { t } = useTranslation("employeeDetail.");
  const { role, statsUser } = employee;
  const rs = statsUser?.roleStats;
  if (!rs) return null;

  const cu = t("countUnit");
  const fmtCount = (n: number) => (cu ? `${n}${cu}` : String(n));

  type Item = { label: string; value: string; color: string };
  const items: Item[] = [];

  if (role === EmployeeRole.OPERATOR) {
    const s = rs as OperatorStats;
    items.push(
      {
        label: t("role.ridesOperatedToday"),
        value: fmtCount(s.ridesOperatedToday ?? 0),
        color: "#3b82f6",
      },
      {
        label: t("role.ridesOperatedTotal"),
        value: fmtCount(s.ridesOperatedTotal ?? 0),
        color: "#3b82f6",
      },
    );
  } else if (role === EmployeeRole.CASHIER) {
    const s = rs as CashierStats;
    items.push(
      {
        label: t("role.ticketsSoldToday"),
        value: fmtCount(s.ticketsSoldToday ?? 0),
        color: "#22c55e",
      },
      {
        label: t("role.revenueToday"),
        value: `${(s.revenueToday ?? 0).toLocaleString()} UZS`,
        color: "#22c55e",
      },
    );
  } else if (role === EmployeeRole.SECURITY) {
    const s = rs as SecurityStats;
    items.push({
      label: t("role.incidentsToday"),
      value: fmtCount(s.incidentsToday ?? 0),
      color: "#ef4444",
    });
  } else if (role === EmployeeRole.CLEANER) {
    const s = rs as CleanerStats;
    items.push({
      label: t("role.tasksDoneToday"),
      value: fmtCount(s.tasksDoneToday ?? 0),
      color: "#f59e0b",
    });
  }

  if (items.length === 0) return null;

  return (
    <div
      className="rounded-xl border p-5"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <LuActivity size={14} style={{ color: "var(--text-muted)" }} />
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          {t("roleStats")}
        </p>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {item.label}
            </p>
            <p className="text-sm font-semibold" style={{ color: item.color }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Chart Tooltip ────────────────────────────────────────────────────────────

type ChartTooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  cfg?: ChartCfg;
  chartLabel?: string;
};

function ChartTooltip({
  active,
  payload,
  label,
  cfg,
  chartLabel,
}: ChartTooltipProps) {
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
      <p
        className="mb-0.5"
        style={{ color: "var(--text-muted)", fontSize: 11 }}
      >
        {label}
      </p>
      <p className="font-semibold" style={{ color: cfg.color }}>
        {chartLabel}: {payload[0].value}
      </p>
    </div>
  );
}

// ─── Weekly Chart ─────────────────────────────────────────────────────────────

function WeeklyChart({ employee }: { employee: Employee }) {
  const { t } = useTranslation("employeeDetail.");
  const data = employee.statsUser?.analytics.weekly.data ?? [];
  const cfg = ROLE_CHART[employee.role];
  const chartLabel = t(`chart.${cfg.labelKey}`);

  return (
    <div
      className="rounded-xl border p-5"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: cfg.color }}
        />
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          {t("weeklyActivity")}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
          barSize={22}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--chart-grid)"
            vertical={false}
          />
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
          <Bar
            dataKey={cfg.dataKey}
            fill={cfg.color}
            fillOpacity={0.85}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("employeeDetail.");
  const [imgOpen, setImgOpen] = useState(false);

  const employee = employees.find((e) => e.id === Number(id));

  if (!employee) {
    return (
      <div
        className="p-6 flex flex-col items-center justify-center gap-3"
        style={{ minHeight: 400 }}
      >
        <p
          className="text-base font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          {t("notFound")}
        </p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          ID: {id}
        </p>
        <CusButton
          size="sm"
          variant="outline"
          leftIcon={<LuArrowLeft size={14} />}
          onClick={() => navigate("/employees")}
        >
          {t("backTo")}
        </CusButton>
      </div>
    );
  }

  const core = employee.statsUser?.core;
  const joinedDays = dayjs().diff(dayjs(employee.createdAt), "day");
  const mainStat = getRoleMainStat(employee, t);
  const roleCfg = ROLE_CHART[employee.role];
  const avatarSrc =
    employee.avatarUrl ?? `https://i.pravatar.cc/150?u=${employee.id}`;

  return (
    <div className="p-4 tablet:p-6 space-y-5">
      {/* ── Image lightbox overlay ────────────────────────────────────────────── */}
      {imgOpen && (
        <div
          onClick={() => setImgOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <img
            src={avatarSrc}
            alt={employee.fullName}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "90dvh",
              borderRadius: 16,
              objectFit: "contain",
              boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
            }}
          />
        </div>
      )}

      {/* ── Back ──────────────────────────────────────────────────────────────── */}
      <CusButton
        variant="outline"
        onClick={() => navigate("/attractions")}
        colorPalette="gray"
        size="xs"
      >
        <LuArrowLeft size={14} />
        {t("backTo")}
      </CusButton>

      {/* ── Header card ───────────────────────────────────────────────────────── */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
      >
        {/* Profile row */}
        <div className="flex flex-col desktop:flex-row">
          {/* Left: avatar + name + badge + contact */}
          <div className="flex items-start gap-4 p-5 desktop:p-6 flex-1">
            <img
              src={avatarSrc}
              alt={employee.fullName}
              onClick={() => setImgOpen(true)}
              className="w-16 h-16 desktop:w-[180px] desktop:h-[180px] shrink-0 object-cover rounded-xl desktop:rounded-[10%] cursor-pointer"
              style={{ border: "3px solid var(--border-default)" }}
            />
            <div className="flex-1 min-w-0">
              <h1
                className="text-xl desktop:text-3xl font-semibold"
                style={{ color: "var(--text-default)" }}
              >
                {employee.fullName}
              </h1>
              <p
                className="text-sm desktop:text-xl mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                {employee.age} {t("ageSuffix")} &nbsp;•&nbsp;{" "}
                {t("sinceDate", {
                  date: dayjs(employee.createdAt).format("DD.MM.YYYY"),
                })}
              </p>
              <div className="flex flex-wrap gap-2 mt-2.5">
                <CusBadge role={employee.role as BadgeRole} size="sm" />
                <CusBadge status={STATUS_TO_BADGE[employee.status]} size="sm" />
              </div>
              {/* Contact — only visible on desktop header */}
              <div className="hidden desktop:flex flex-wrap gap-5 mt-3">
                {employee.phone && (
                  <span
                    className="flex items-center gap-1.5 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <LuPhone size={12} /> {employee.phone}
                  </span>
                )}
                {employee.telegram_username && (
                  <span
                    className="flex items-center gap-1.5 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <LuSend size={12} /> {employee.telegram_username}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: 3 big stat numbers */}
          {core && (
            <div
              className="flex border-t desktop:border-t-0 desktop:border-l items-center justify-center desktop:justify-start gap-4 p-5 desktop:p-6 flex-1"
              style={{ borderColor: "var(--border-default)" }}
            >
              <HeaderStat
                value={mainStat.value}
                label={mainStat.label}
                color={roleCfg.color}
                divider={false}
              />
              <HeaderStat
                value={core.efficiency != null ? `${core.efficiency}%` : "—"}
                label={t("efficiency")}
                color="#3b82f6"
              />
              <HeaderStat
                value={
                  core.attendanceRate != null ? `${core.attendanceRate}%` : "—"
                }
                label={t("attendance")}
                color={
                  (core.attendanceRate ?? 0) >= 90
                    ? "#22c55e"
                    : (core.attendanceRate ?? 0) >= 75
                      ? "#f59e0b"
                      : "#ef4444"
                }
              />
            </div>
          )}
        </div>

        {/* Efficiency progress bar */}
        {core?.efficiency != null && (
          <div
            className="px-5 desktop:px-6 py-4"
            style={{ borderTop: "1px solid var(--border-default)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {t("efficiencyLevel")}
              </p>
              <p
                className="text-xs font-medium"
                style={{ color: "var(--text-default)" }}
              >
                {core.efficiency}%
              </p>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "var(--bg-hover)" }}
            >
              <div
                style={{
                  width: `${core.efficiency}%`,
                  height: "100%",
                  borderRadius: 9999,
                  background: "#3b82f6",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Body: 2-column on desktop ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 desktop:grid-cols-[1fr_300px] gap-4">
        {/* Left: chart + role stats */}
        <div className="space-y-4">
          {employee.statsUser && <WeeklyChart employee={employee} />}
          {employee.statsUser?.roleStats && <RoleStats employee={employee} />}
        </div>

        {/* Right: info sidebar */}
        <div className="space-y-4">
          {/* Personal info */}
          <div
            className="rounded-xl border p-5"
            style={{
              background: "var(--bg-second)",
              borderColor: "var(--border-default)",
            }}
          >
            <p
              className="text-sm font-semibold mb-1"
              style={{ color: "var(--text-default)" }}
            >
              {t("info")}
            </p>
            {employee.phone && (
              <InfoRow
                icon={LuPhone}
                label={t("phone")}
                value={employee.phone}
              />
            )}
            {employee.telegram_username && (
              <InfoRow
                icon={LuSend}
                label={t("telegram")}
                value={employee.telegram_username}
              />
            )}
            {employee.salary && (
              <InfoRow
                icon={LuBriefcase}
                label={t("salary")}
                value={`${employee.salary.toLocaleString()} UZS`}
              />
            )}
            {employee.dateOfBirth && (
              <InfoRow
                icon={LuUser}
                label={t("birthDate")}
                value={dayjs(employee.dateOfBirth).format("DD.MM.YYYY")}
              />
            )}
            <InfoRow
              icon={LuCalendar}
              label={t("joined")}
              value={t("joinedValue", {
                date: dayjs(employee.createdAt).format("DD.MM.YYYY"),
                days: joinedDays,
              })}
              last
            />
          </div>

          {/* Work time */}
          {core && (core.checkIn || core.totalWorkedMinutes) && (
            <div
              className="rounded-xl border p-5"
              style={{
                background: "var(--bg-second)",
                borderColor: "var(--border-default)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <LuClock size={14} style={{ color: "var(--text-muted)" }} />
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-default)" }}
                >
                  {t("workTime")}
                </p>
              </div>
              <div className="space-y-2.5">
                {core.checkIn && (
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {t("checkIn")}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-default)" }}
                    >
                      {core.checkIn}
                    </span>
                  </div>
                )}
                {core.checkOut && (
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {t("checkOut")}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-default)" }}
                    >
                      {core.checkOut}
                    </span>
                  </div>
                )}
                {core.workedTodayMinutes != null && (
                  <div
                    className="flex items-center justify-between"
                    style={{
                      borderTop: "1px solid var(--border-default)",
                      paddingTop: 10,
                      marginTop: 2,
                    }}
                  >
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {t("workedToday")}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "var(--text-default)" }}
                    >
                      {fmtMin(core.workedTodayMinutes)}
                    </span>
                  </div>
                )}
                {core.totalWorkedMinutes && (
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {t("totalWorked")}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-default)" }}
                    >
                      {fmtMin(core.totalWorkedMinutes)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
