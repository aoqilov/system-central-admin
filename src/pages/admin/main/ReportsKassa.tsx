import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
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
  LuBanknote,
  LuArrowUpDown,
  LuDownload,
  LuTrendingUp,
  LuCreditCard,
  LuLayoutGrid,
  LuCalendar,
  LuMapPin,
  LuWallet,
} from "react-icons/lu";
import { kassaList } from "../../../data/kassa";
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

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#ef4444",
  "#64748b",
];

const PRESETS = [
  { label: "Сегодня", days: 1 },
  { label: "7 дней", days: 7 },
  { label: "30 дней", days: 30 },
] as const;

const PAY_LEGEND = [
  { label: "Наличные", color: "#22c55e" },
  { label: "UzCard", color: "#3b82f6" },
  { label: "Пополнение карты", color: "#8b5cf6" },
];

// Static base values replacing removed interface fields
const BASE_REV: Record<number, number> = {
  1: 4_850_000,
  2: 3_210_000,
  3: 0,
  4: 2_640_000,
  5: 1_920_000,
  6: 0,
  7: 3_780_000,
  8: 0,
};
const BASE_TX: Record<number, number> = {
  1: 112,
  2: 87,
  3: 0,
  4: 64,
  5: 53,
  6: 0,
  7: 95,
  8: 0,
};

const activeKassas = kassaList.filter((k) => (BASE_REV[k.id] ?? 0) > 0);

// ─── Types ────────────────────────────────────────────────────────────────────

interface TipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

interface KassaSummary {
  id: number;
  name: string;
  location: string;
  status: string;
  transactions: number;
  naqd: number;
  uzcard: number;
  karta: number;
  total: number;
}

// ─── Tooltips ─────────────────────────────────────────────────────────────────

function StackedTip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value ?? 0), 0);
  return (
    <div
      className="rounded-lg px-3 py-2.5 border shadow-xl text-xs space-y-1"
      style={{
        background: "var(--bg-tooltip)",
        borderColor: "var(--border-2)",
        minWidth: 160,
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
            <span style={{ color: "var(--text-muted)" }}>{p.name}</span>
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

function PayTip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  const labels: Record<string, string> = {
    naqd: "Наличные",
    uzcard: "UzCard",
    karta: "Пополнение карты",
  };
  const total = payload.reduce((s, p) => s + (p.value ?? 0), 0);
  return (
    <div
      className="rounded-lg px-3 py-2.5 border shadow-xl text-xs space-y-1"
      style={{
        background: "var(--bg-tooltip)",
        borderColor: "var(--border-2)",
        minWidth: 170,
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
              {labels[p.name] ?? p.name}
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

const ReportsKassa = () => {
  const [dateFrom, setDateFrom] = useState(
    dayjs().subtract(6, "day").format("YYYY-MM-DD"),
  );
  const [dateTo, setDateTo] = useState(dayjs().format("YYYY-MM-DD"));

  // All dates in range (max 31)
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

  // Chart 1: stacked revenue per kassa per day
  const stackedData = useMemo(
    () =>
      dates.map((date, di) => {
        const d = dayjs(date);
        const row: Record<string, string | number> = {
          label: `${d.date()}/${d.month() + 1}`,
        };
        activeKassas.forEach((k, ki) => {
          const seed = k.id * 17 + di * 11 + ki * 3;
          row[k.name] = Math.round(
            ((BASE_REV[k.id] ?? 0) / 7) * (0.45 + _s(seed) * 1.1),
          );
        });
        return row;
      }),
    [dates],
  );

  // Chart 2: payment method per day
  const paymentData = useMemo(
    () =>
      dates.map((date, di) => {
        const d = dayjs(date);
        const label = `${d.date()}/${d.month() + 1}`;
        const total = activeKassas.reduce((s, k, ki) => {
          const seed = k.id * 17 + di * 11 + ki * 3;
          return (
            s +
            Math.round(((BASE_REV[k.id] ?? 0) / 7) * (0.45 + _s(seed) * 1.1))
          );
        }, 0);
        const naqd = Math.round(total * (0.38 + _s(di * 19 + 1) * 0.07));
        const uzcard = Math.round(total * (0.33 + _s(di * 19 + 2) * 0.07));
        return {
          label,
          naqd,
          uzcard,
          karta: Math.max(0, total - naqd - uzcard),
        };
      }),
    [dates],
  );

  // Table summary per kassa
  const kassaSummary = useMemo<KassaSummary[]>(
    () =>
      kassaList.map((k) => {
        let total = 0;
        let naqd = 0;
        let uzcard = 0;
        dates.forEach((_, di) => {
          const baseRev = BASE_REV[k.id] ?? 0;
          const rev =
            baseRev > 0
              ? Math.round(
                  (baseRev / 7) * (0.45 + _s(k.id * 17 + di * 11) * 1.1),
                )
              : 0;
          const n = Math.round(rev * (0.38 + _s(k.id * 7 + di * 3) * 0.07));
          const u = Math.round(rev * (0.33 + _s(k.id * 13 + di * 5) * 0.07));
          total += rev;
          naqd += n;
          uzcard += u;
        });
        return {
          id: k.id,
          name: k.name,
          location: k.location,
          status: k.status,
          transactions:
            (BASE_TX[k.id] ?? 0) > 0
              ? Math.round(
                  (BASE_TX[k.id] ?? 0) *
                    dates.length *
                    (0.7 + _s(k.id * 23) * 0.6),
                )
              : 0,
          naqd,
          uzcard,
          karta: Math.max(0, total - naqd - uzcard),
          total,
        };
      }),
    [dates],
  );

  const totalRevenue = kassaSummary.reduce((s, k) => s + k.total, 0);
  const totalTx = kassaSummary.reduce((s, k) => s + k.transactions, 0);
  const avgTx = totalTx > 0 ? Math.round(totalRevenue / totalTx) : 0;
  const activeKassaCount = kassaList.filter(
    (k) => k.status === "active",
  ).length;

  // Excel export
  const exportExcel = () => {
    const rows = kassaSummary.map((k) => ({
      Касса: k.name,
      Расположение: k.location,
      Статус:
        k.status === "active"
          ? "Активна"
          : k.status === "maintenance"
            ? "На ремонте"
            : "Закрыта",
      Транзакции: k.transactions,
      "Наличные (сум)": k.naqd,
      "UzCard (сум)": k.uzcard,
      "Пополнение (сум)": k.karta,
      "Выручка (сум)": k.total,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [20, 22, 12, 16, 18, 18, 18, 22].map((w) => ({ wch: w }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Отчёт по кассам");
    XLSX.writeFile(wb, `kassa-hisobot-${dateFrom}-${dateTo}.xlsx`);
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

  const columns: ColumnDef<KassaSummary>[] = [
    {
      key: "name",
      header: "Касса",
      render: (row) => (
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-default)" }}
          >
            {row.name}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <LuMapPin size={10} style={{ color: "var(--text-muted)" }} />
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {row.location}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "transactions",
      header: "Транзакции",
      align: "right",
      render: (row) => (
        <span
          className="text-sm tabular-nums"
          style={{ color: "var(--text-2)" }}
        >
          {row.transactions > 0 ? row.transactions.toLocaleString() : "—"}
        </span>
      ),
    },
    {
      key: "naqd",
      header: "Наличные",
      align: "right",
      render: (row) => (
        <span
          className="text-xs tabular-nums"
          style={{ color: "var(--color-green)" }}
        >
          {row.naqd > 0 ? fmtM(row.naqd) : "—"}
        </span>
      ),
    },
    {
      key: "uzcard",
      header: "UzCard",
      align: "right",
      render: (row) => (
        <span
          className="text-xs tabular-nums"
          style={{ color: "var(--color-blue)" }}
        >
          {row.uzcard > 0 ? fmtM(row.uzcard) : "—"}
        </span>
      ),
    },
    {
      key: "karta",
      header: "Пополнение",
      align: "right",
      render: (row) => (
        <span
          className="text-xs tabular-nums"
          style={{ color: "var(--color-purple)" }}
        >
          {row.karta > 0 ? fmtM(row.karta) : "—"}
        </span>
      ),
    },
    {
      key: "total",
      header: "Выручка",
      align: "right",
      render: (row) =>
        row.total > 0 ? (
          <div className="text-right">
            <p
              className="text-sm font-semibold tabular-nums"
              style={{ color: "var(--text-default)" }}
            >
              {fmtM(row.total)}
            </p>
          </div>
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
          Отчёты <span style={{ color: "var(--color-blue)" }}>Касса</span>
        </h1>
      </div>
      <div className="space-y-4">
        {/* ── Date filter + export ────────────────────────────────────────────── */}
        <CusCard className="p-3 tablet:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: presets + date inputs */}
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

            {/* Right: export */}
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
            icon={LuArrowUpDown}
            label="Всего транзакций"
            value={totalTx.toLocaleString()}
            sub="за период"
            color="var(--color-cyan)"
          />
          <StatCard
            icon={LuWallet}
            label="Средний чек"
            value={fmtM(avgTx)}
            sub="за транзакцию"
            color="var(--color-purple)"
          />
          <StatCard
            icon={LuLayoutGrid}
            label="Активных касс"
            value={String(activeKassaCount)}
            sub={`из ${kassaList.length}`}
            color="var(--color-green)"
          />
        </div>

        {/* ── Charts ─────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-4">
          {/* Chart 1: Stacked by kassa */}
          <CusCard>
            <CusCardHeader
              icon={LuTrendingUp}
              title="Выручка по кассам"
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
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={stackedData}
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
                    content={<StackedTip />}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                  {activeKassas.map((k, i) => (
                    <Bar
                      key={k.id}
                      dataKey={k.name}
                      stackId="a"
                      fill={COLORS[i % COLORS.length]}
                      radius={
                        i === activeKassas.length - 1
                          ? [4, 4, 0, 0]
                          : [0, 0, 0, 0]
                      }
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                {activeKassas.map((k, i) => (
                  <div key={k.id} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    <span
                      className="text-[11px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {k.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CusCard>

          {/* Chart 2: Payment method */}
          <CusCard>
            <CusCardHeader
              icon={LuCreditCard}
              title="Выручка по типу оплаты"
              iconColor="var(--color-purple)"
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
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={paymentData}
                  margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
                  barSize={dates.length > 14 ? 5 : 10}
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
                    content={<PayTip />}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                  <Bar dataKey="naqd" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="uzcard" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="karta" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                {PAY_LEGEND.map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ background: color }}
                    />
                    <span
                      className="text-[11px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {label}
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
            icon={LuBanknote}
            title="Детализация по кассам"
            iconColor="var(--color-blue)"
            action={
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {dateFrom} — {dateTo}
              </span>
            }
          />
          <CusTable<KassaSummary>
            data={kassaSummary}
            columns={columns}
            variant="outline"
            colorHeader="var(--bg-hover)"
            colorBodyHover="var(--bg-hover)"
            interactive
            size="md"
            emptyText="Нет данных"
          />
        </CusCard>
      </div>
    </div>
  );
};

export default ReportsKassa;
