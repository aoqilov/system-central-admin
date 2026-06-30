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
} from "recharts";
import {
  LuFerrisWheel,
  LuUsers,
  LuDownload,
  LuTrendingUp,
  LuRefreshCw,
  LuCalendar,
  LuBanknote,
} from "react-icons/lu";
import {
  attractions,
  type AttractionCategory,
  type AttractionStatus,
  type Attraction,
} from "../../../data/attractions";
import {
  CusCard,
  CusCardHeader,
} from "../../../components/shared/card/CusCard";
import { CusButton } from "../../../components/ui/buttons/CusButton";
import {
  CusTable,
  type ColumnDef,
} from "../../../components/ui/table/CusTable";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function _s(n: number) {
  return ((n * 9301 + 49297) % 233280) / 233280;
}

const fmtM = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(2)} млн` : v.toLocaleString();

const fmtK = (v: number) =>
  v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v);

const PRESETS = [
  { label: "Сегодня", days: 1 },
  { label: "7 дней", days: 7 },
  { label: "30 дней", days: 30 },
] as const;

// ─── Category config ──────────────────────────────────────────────────────────

const CAT_COLOR: Record<AttractionCategory, string> = {
  thrill: "#ef4444",
  family: "#3b82f6",
  kids: "#f59e0b",
  water: "#06b6d4",
  playground: "#22c55e",
  entertainment: "#8b5cf6",
};

const CAT_LABEL: Record<AttractionCategory, string> = {
  thrill: "Экстрим",
  family: "Семейные",
  kids: "Детские",
  water: "Водные",
  playground: "Площадка",
  entertainment: "Развлечения",
};

const CATEGORIES: AttractionCategory[] = [
  "thrill",
  "family",
  "kids",
  "water",
  "playground",
  "entertainment",
];

const STATUS_CFG: Record<AttractionStatus, { label: string; color: string }> = {
  open: { label: "Открыт", color: "var(--color-green)" },
  maintenance: { label: "На ремонте", color: "var(--color-yellow)" },
  closed: { label: "Закрыт", color: "var(--color-red)" },
};

// ─── Data generators ──────────────────────────────────────────────────────────

function genVisitors(a: Attraction, di: number): number {
  if (a.status !== "open") return 0;
  const weekTotal = a.statsVisitors?.reduce((s, d) => s + d.count, 0) ?? 0;
  const base = weekTotal / 7;
  return Math.max(0, Math.round(base * (0.6 + _s(a.id * 31 + di * 7) * 0.9)));
}

function genRevenue(a: Attraction, di: number): number {
  return genVisitors(a, di) * a.price;
}

function genRounds(a: Attraction, di: number): number {
  const v = genVisitors(a, di);
  const cap = a.rulesAttraction?.numberOfPlaceRound ?? 1;
  return Math.ceil(v / cap);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface TipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

interface AttractionSummary {
  id: number;
  name: string;
  category: AttractionCategory;
  status: AttractionStatus;
  price: number;
  visitors: number;
  rounds: number;
  revenue: number;
}

// ─── Tooltips ─────────────────────────────────────────────────────────────────

function VisitorTip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 border shadow-xl text-xs"
      style={{
        background: "var(--bg-tooltip)",
        borderColor: "var(--border-2)",
        minWidth: 130,
      }}
    >
      <p className="font-medium mb-1" style={{ color: "var(--text-default)" }}>
        {label}
      </p>
      <div className="flex items-center justify-between gap-4">
        <span style={{ color: "var(--text-muted)" }}>Посещений</span>
        <span
          className="font-semibold tabular-nums"
          style={{ color: "var(--color-cyan)" }}
        >
          {fmtK(payload[0]?.value ?? 0)}
        </span>
      </div>
    </div>
  );
}

function CatTip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value ?? 0), 0);
  return (
    <div
      className="rounded-lg px-3 py-2.5 border shadow-xl text-xs space-y-1"
      style={{
        background: "var(--bg-tooltip)",
        borderColor: "var(--border-2)",
        minWidth: 168,
      }}
    >
      <p
        className="font-medium mb-1.5"
        style={{ color: "var(--text-default)" }}
      >
        {label}
      </p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-sm shrink-0"
              style={{ background: p.color }}
            />
            <span style={{ color: "var(--text-muted)" }}>
              {CAT_LABEL[p.name as AttractionCategory] ?? p.name}
            </span>
          </div>
          <span
            className="font-medium tabular-nums"
            style={{ color: "var(--text-2)" }}
          >
            {(p.value / 1000).toFixed(0)}k
          </span>
        </div>
      ))}
      <div
        className="flex justify-between pt-1 border-t"
        style={{ borderColor: "var(--border-2)" }}
      >
        <span style={{ color: "var(--text-muted)" }}>Итого</span>
        <span
          className="font-semibold tabular-nums"
          style={{ color: "var(--text-default)" }}
        >
          {(total / 1_000_000).toFixed(2)} млн
        </span>
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
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

// ─── Main ─────────────────────────────────────────────────────────────────────

const ReportsAttraction = () => {
  const [dateFrom, setDateFrom] = useState(
    dayjs().subtract(6, "day").format("YYYY-MM-DD"),
  );
  const [dateTo, setDateTo] = useState(dayjs().format("YYYY-MM-DD"));

  // Date range array (max 31)
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

  // Chart 1: daily visitor totals (AreaChart)
  const visitorData = useMemo(
    () =>
      dates.map((date, di) => {
        const d = dayjs(date);
        const total = attractions.reduce((s, a) => s + genVisitors(a, di), 0);
        return { label: `${d.date()}/${d.month() + 1}`, visitors: total };
      }),
    [dates],
  );

  // Chart 2: daily revenue stacked by category (BarChart)
  const categoryData = useMemo(
    () =>
      dates.map((date, di) => {
        const d = dayjs(date);
        const row: Record<string, string | number> = {
          label: `${d.date()}/${d.month() + 1}`,
        };
        CATEGORIES.forEach((cat) => {
          row[cat] = attractions
            .filter((a) => a.category === cat && a.status === "open")
            .reduce((s, a) => s + genRevenue(a, di), 0);
        });
        return row;
      }),
    [dates],
  );

  // Per-attraction summary for table + export
  const summary = useMemo<AttractionSummary[]>(
    () =>
      attractions.map((a) => {
        let visitors = 0;
        let rounds = 0;
        let revenue = 0;
        dates.forEach((_, di) => {
          visitors += genVisitors(a, di);
          rounds += genRounds(a, di);
          revenue += genRevenue(a, di);
        });
        return {
          id: a.id,
          name: a.name,
          category: a.category,
          status: a.status,
          price: a.price,
          visitors,
          rounds,
          revenue,
        };
      }),
    [dates],
  );

  // Aggregates
  const totalRevenue = summary.reduce((s, a) => s + a.revenue, 0);
  const totalVisitors = summary.reduce((s, a) => s + a.visitors, 0);
  const totalRounds = summary.reduce((s, a) => s + a.rounds, 0);
  const openCount = attractions.filter((a) => a.status === "open").length;

  // Excel export
  const exportExcel = () => {
    const rows = summary.map((a) => ({
      Аттракцион: a.name,
      Категория: CAT_LABEL[a.category],
      Статус: STATUS_CFG[a.status].label,
      "Цена (сум)": a.price,
      Посещений: a.visitors,
      Раундов: a.rounds,
      "Выручка (сум)": a.revenue,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [28, 16, 12, 14, 12, 10, 18].map((w) => ({ wch: w }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Отчёт аттракционов");
    XLSX.writeFile(wb, `attraksion-hisobot-${dateFrom}-${dateTo}.xlsx`);
  };

  const applyPreset = (days: number) => {
    setDateFrom(
      dayjs()
        .subtract(days - 1, "day")
        .format("YYYY-MM-DD"),
    );
    setDateTo(dayjs().format("YYYY-MM-DD"));
  };

  const isPreset = (days: number) =>
    dateFrom ===
      dayjs()
        .subtract(days - 1, "day")
        .format("YYYY-MM-DD") && dateTo === dayjs().format("YYYY-MM-DD");

  const columns: ColumnDef<AttractionSummary>[] = [
    {
      key: "name",
      header: "Аттракцион",
      render: (row) => (
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-default)" }}
          >
            {row.name}
          </p>
          <span
            style={{
              display: "inline-block",
              marginTop: 3,
              padding: "1px 7px",
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 600,
              background: `${CAT_COLOR[row.category]}18`,
              color: CAT_COLOR[row.category],
            }}
          >
            {CAT_LABEL[row.category]}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Статус",
      render: (row) => {
        const cfg = STATUS_CFG[row.status];
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
                  row.status === "open" ? `0 0 5px ${cfg.color}` : "none",
              }}
            />
            <span style={{ color: cfg.color }}>{cfg.label}</span>
          </span>
        );
      },
    },
    {
      key: "price",
      header: "Цена",
      align: "right",
      render: (row) => (
        <span
          className="text-xs tabular-nums"
          style={{ color: "var(--text-muted)" }}
        >
          {row.price.toLocaleString()}
        </span>
      ),
    },
    {
      key: "visitors",
      header: "Посещений",
      align: "right",
      render: (row) => (
        <span
          className="text-sm tabular-nums"
          style={{ color: "var(--text-2)" }}
        >
          {row.visitors > 0 ? row.visitors.toLocaleString() : "—"}
        </span>
      ),
    },
    {
      key: "rounds",
      header: "Раундов",
      align: "right",
      render: (row) => (
        <span
          className="text-sm tabular-nums"
          style={{ color: "var(--text-3)" }}
        >
          {row.rounds > 0 ? row.rounds.toLocaleString() : "—"}
        </span>
      ),
    },
    {
      key: "revenue",
      header: "Выручка",
      align: "right",
      render: (row) =>
        row.revenue > 0 ? (
          <p
            className="text-sm font-semibold tabular-nums"
            style={{ color: "var(--text-default)" }}
          >
            {fmtM(row.revenue)}
          </p>
        ) : (
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>
        ),
    },
  ];

  return (
    <div className="p-4 tablet:p-6 space-y-6">
      <div>
        <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
          Analytics
        </p>
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          Отчёты{" "}
          <span style={{ color: "var(--color-blue)" }}>Аттракционы</span>
        </h1>
      </div>
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
                    borderColor: isPreset(days)
                      ? "var(--color-blue)"
                      : "var(--border-default)",
                    background: isPreset(days)
                      ? "var(--color-blue)18"
                      : "var(--bg-hover)",
                    color: isPreset(days)
                      ? "var(--color-blue)"
                      : "var(--text-muted)",
                    transition: "all 0.15s",
                  }}
                >
                  {label}
                </button>
              ))}

              <span
                style={{
                  color: "var(--border-2)",
                  fontSize: 18,
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
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
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  —
                </span>
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
              Скачать Excel
            </CusButton>
          </div>
        </CusCard>

        {/* ── Stat cards ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 desktop:grid-cols-4 gap-4">
          <StatCard
            icon={LuBanknote}
            label="Выручка за период"
            value={fmtM(totalRevenue)}
            sub={`${dates.length} дней`}
            color="var(--color-blue)"
          />
          <StatCard
            icon={LuUsers}
            label="Всего посещений"
            value={totalVisitors.toLocaleString()}
            sub="гостей"
            color="var(--color-cyan)"
          />
          <StatCard
            icon={LuRefreshCw}
            label="Всего раундов"
            value={totalRounds.toLocaleString()}
            sub="аттракционов"
            color="var(--color-purple)"
          />
          <StatCard
            icon={LuFerrisWheel}
            label="Открытых"
            value={String(openCount)}
            sub={`из ${attractions.length}`}
            color="var(--color-green)"
          />
        </div>

        {/* ── Charts ─────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-4">
          {/* Chart 1: Daily visitor trend */}
          <CusCard>
            <CusCardHeader
              icon={LuUsers}
              title="Динамика посещений по дням"
              iconColor="var(--color-cyan)"
              action={
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {dates.length} kun
                </span>
              }
            />
            <div className="px-2 pt-2 pb-3">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart
                  data={visitorData}
                  margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#06b6d4"
                        stopOpacity={0.25}
                      />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--chart-grid)"
                    vertical={false}
                  />
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
                    tickFormatter={(v: number) => fmtK(v)}
                  />
                  <Tooltip
                    content={<VisitorTip />}
                    cursor={{ stroke: "var(--border-2)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fill="url(#visGrad)"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: "#06b6d4" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CusCard>

          {/* Chart 2: Revenue stacked by category */}
          <CusCard>
            <CusCardHeader
              icon={LuTrendingUp}
              title="Выручка по категориям"
              iconColor="var(--color-blue)"
              action={
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {dates.length} kun
                </span>
              }
            />
            <div className="p-4">
              <ResponsiveContainer width="100%" height={188}>
                <BarChart
                  data={categoryData}
                  margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
                  barSize={dates.length > 14 ? 8 : 18}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--chart-grid)"
                    vertical={false}
                  />
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
                    tickFormatter={(v: number) =>
                      `${(v / 1_000_000).toFixed(1)}M`
                    }
                  />
                  <Tooltip
                    content={<CatTip />}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                  {CATEGORIES.map((cat, i) => (
                    <Bar
                      key={cat}
                      dataKey={cat}
                      stackId="a"
                      fill={CAT_COLOR[cat]}
                      radius={
                        i === CATEGORIES.length - 1
                          ? [4, 4, 0, 0]
                          : [0, 0, 0, 0]
                      }
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2">
                {CATEGORIES.map((cat) => (
                  <div key={cat} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ background: CAT_COLOR[cat] }}
                    />
                    <span
                      className="text-[11px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {CAT_LABEL[cat]}
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
            icon={LuFerrisWheel}
            title="Детализация по аттракционам"
            iconColor="var(--color-cyan)"
            action={
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {dateFrom} — {dateTo}
              </span>
            }
          />
          <CusTable<AttractionSummary>
            data={summary}
            columns={columns}
            maxH="420px"
            stickyHeader
            variant="outline"
            colorHeader="var(--bg-hover)"
            colorBodyHover="var(--bg-hover)"
            interactive
            size="sm"
            emptyText="Нет данных"
          />
        </CusCard>
      </div>
    </div>
  );
};

export default ReportsAttraction;
