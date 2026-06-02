import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  LuSearch,
  LuCheck,
  LuWrench,
  LuBan,
  LuLayoutGrid,
  LuMapPin,
  LuClock,
  LuPencil,
  LuTrash2,
  LuPlus,
  LuX,
  LuTrendingUp,
  LuBanknote,
  LuCreditCard,
} from "react-icons/lu";
import { kassaList, type Kassa, type KassaStatus } from "../data/kassa";
import { employees } from "../data/employees";
import { CusTable, type ColumnDef } from "../components/ui/table/CusTable";
import { CusBadge } from "../components/ui/badge/CusBadge";
import { CusInput } from "../components/ui/inputs/CusInput";
import CusSelect from "../components/ui/select/CusSelect";
import { CusPagination } from "../components/ui/table/CusPagination";
import { CusButton } from "../components/ui/buttons/CusButton";
import {
  CusCard as Card,
  CusCardHeader as CardHeader,
} from "../components/shared/card/CusCard";

// ─── Configs ──────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<KassaStatus, "active" | "pending" | "fired"> = {
  active: "active",
  maintenance: "pending",
  inactive: "fired",
};

const STATUS_LABEL: Record<KassaStatus, string> = {
  active: "Faol",
  maintenance: "Ta'mirda",
  inactive: "Yopiq",
};

// ─── Chart data ───────────────────────────────────────────────────────────────

const WEEK = ["27/5", "28/5", "29/5", "30/5", "31/5", "1/6", "2/6"];
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

function _s(n: number) {
  return ((n * 9301 + 49297) % 233280) / 233280;
}

const activeKassas = kassaList.filter((k) => k.todayRevenue > 0);

// Chart 1 — stacked weekly revenue per kassa
const weeklyByKassa = WEEK.map((day, di) => {
  const row: Record<string, string | number> = { day };
  activeKassas.forEach((k, ki) => {
    const seed = k.id * 17 + di * 11 + ki * 3;
    row[k.name] = Math.round((k.todayRevenue / 7) * (0.45 + _s(seed) * 1.1));
  });
  return row;
});

// Chart 2 — weekly revenue by payment method
const totalDaily = kassaList.reduce((s, k) => s + k.todayRevenue, 0) / 7;
const weeklyByPayment = WEEK.map((day, di) => {
  const base = Math.round(totalDaily * (0.65 + _s(di * 19) * 0.7));
  const uzcard = Math.round(base * 0.46);
  const toldirish = base - uzcard;
  return { day, uzcard, toldirish };
});

// ─── Tooltips ─────────────────────────────────────────────────────────────────

interface TipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function KassaTip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value ?? 0), 0);
  return (
    <div
      className="rounded-lg px-3 py-2.5 border shadow-xl text-xs space-y-1"
      style={{
        background: "var(--bg-tooltip)",
        borderColor: "var(--border-2)",
        color: "var(--text-4)",
        minWidth: 160,
      }}
    >
      <p className="font-medium mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-sm shrink-0"
              style={{ background: p.color }}
            />
            <span style={{ color: "var(--text-muted)" }}>{p.name}</span>
          </div>
          <span className="font-medium tabular-nums">
            {(p.value / 1000).toFixed(0)}k
          </span>
        </div>
      ))}
      <div
        className="flex justify-between pt-1 border-t"
        style={{ borderColor: "var(--border-2)" }}
      >
        <span style={{ color: "var(--text-muted)" }}>Jami</span>
        <span className="font-semibold tabular-nums">
          {(total / 1000).toFixed(0)}k
        </span>
      </div>
    </div>
  );
}

function PayTip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  const labels: Record<string, string> = {
    naqd: "Naqd pul",
    uzcard: "UzCard",
    toldirish: "Karta to'ldirish",
  };
  const total = payload.reduce((s, p) => s + (p.value ?? 0), 0);
  return (
    <div
      className="rounded-lg px-3 py-2.5 border shadow-xl text-xs space-y-1"
      style={{
        background: "var(--bg-tooltip)",
        borderColor: "var(--border-2)",
        color: "var(--text-4)",
        minWidth: 170,
      }}
    >
      <p className="font-medium mb-1.5">{label}</p>
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
          <span className="font-medium tabular-nums">
            {(p.value / 1000).toFixed(0)}k
          </span>
        </div>
      ))}
      <div
        className="flex justify-between pt-1 border-t"
        style={{ borderColor: "var(--border-2)" }}
      >
        <span style={{ color: "var(--text-muted)" }}>Jami</span>
        <span className="font-semibold tabular-nums">
          {(total / 1000).toFixed(0)}k
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
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-4 border flex items-center gap-4"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
        <p
          className="text-2xl font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

export default function KassaPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRows, setSelected] = useState<number[]>([]);

  const filtered = useMemo(() => {
    setPage(1);
    setSelected([]);
    const q = search.toLowerCase();
    return kassaList.filter((k) => {
      const matchSearch =
        !q ||
        k.name.toLowerCase().includes(q) ||
        k.location.toLowerCase().includes(q);
      const matchStatus = !statusFilter || k.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  const total = kassaList.length;
  const activeCount = kassaList.filter((k) => k.status === "active").length;
  const maintCount = kassaList.filter((k) => k.status === "maintenance").length;
  const inactCount = kassaList.filter((k) => k.status === "inactive").length;

  const columns: ColumnDef<Kassa>[] = [
    {
      key: "name",
      header: "Kassa",
      sortable: false,
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
      key: "status",
      header: "Status",
      sortable: false,
      render: (row) => (
        <CusBadge status={STATUS_BADGE[row.status]} size="sm">
          {STATUS_LABEL[row.status]}
        </CusBadge>
      ),
    },
    {
      key: "cashierId",
      header: "Kassir",
      sortable: false,
      render: (row) => {
        if (!row.cashierId)
          return (
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>
          );
        const emp = employees.find((e) => e.id === row.cashierId);
        if (!emp)
          return (
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>
          );
        return (
          <div className="flex items-center gap-2">
            <img
              src={emp.avatarUrl ?? `https://i.pravatar.cc/150?u=${emp.id}`}
              alt={emp.fullName ?? emp.firstName}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            <span className="text-xs" style={{ color: "var(--text-2)" }}>
              {emp.fullName ?? `${emp.firstName} ${emp.lastName}`}
            </span>
          </div>
        );
      },
    },
    {
      key: "openedAt",
      header: "Ochildi",
      sortable: false,
      render: (row) =>
        row.openedAt ? (
          <div className="flex items-center gap-1.5">
            <LuClock size={11} style={{ color: "var(--text-muted)" }} />
            <span
              className="text-xs tabular-nums"
              style={{ color: "var(--text-2)" }}
            >
              {row.openedAt}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>
        ),
    },
    {
      key: "todayTransactions",
      header: "Tranzaksiya",
      align: "right",
      sortable: true,
      render: (row) => (
        <span
          className="text-sm tabular-nums"
          style={{ color: "var(--text-2)" }}
        >
          {row.todayTransactions > 0 ? (
            row.todayTransactions
          ) : (
            <span style={{ color: "var(--text-muted)" }}>—</span>
          )}
        </span>
      ),
    },
    {
      key: "todayRevenue",
      header: "Bugungi daromad",
      align: "right",
      sortable: true,
      render: (row) =>
        row.todayRevenue > 0 ? (
          <div className="text-right">
            <p
              className="text-sm font-semibold tabular-nums"
              style={{ color: "var(--text-default)" }}
            >
              {row.todayRevenue.toLocaleString()}
            </p>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              UZS
            </p>
          </div>
        ) : (
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>
        ),
    },
    {
      key: "lastActivity",
      header: "Oxirgi faollik",
      sortable: false,
      render: (row) =>
        row.lastActivity ? (
          <span
            className="text-xs tabular-nums"
            style={{ color: "var(--text-muted)" }}
          >
            {row.lastActivity}
          </span>
        ) : row.note ? (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {row.note}
          </span>
        ) : (
          <span style={{ color: "var(--text-muted)" }}>—</span>
        ),
    },
  ];

  const STATUS_OPTIONS = [
    { label: "Barcha statuslar", value: "" },
    { label: "Faol", value: "active" },
    { label: "Ta'mirda", value: "maintenance" },
    { label: "Yopiq", value: "inactive" },
  ];

  return (
    <div className="p-4 tablet:p-6 space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
          Moliya
        </p>
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          Kassalar
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Park kassa butkalari va holatini boshqarish.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3">
        <StatCard
          icon={LuLayoutGrid}
          label="Jami kassalar"
          value={total}
          color="#3b82f6"
        />
        <StatCard
          icon={LuCheck}
          label="Faol"
          value={activeCount}
          color="#22c55e"
        />
        <StatCard
          icon={LuWrench}
          label="Ta'mirda"
          value={maintCount}
          color="#f59e0b"
        />
        <StatCard
          icon={LuBan}
          label="Yopiq"
          value={inactCount}
          color="#ef4444"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 desktop:grid-cols-2 gap-4">
        {/* Chart 1: Stacked weekly by kassa */}
        <Card>
          <CardHeader
            icon={LuTrendingUp}
            title="Haftalik tushum (kassalar bo'yicha)"
            iconColor="#3b82f6"
          />
          <div className="p-5">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={weeklyByKassa}
                margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
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
                  tick={{ fill: "var(--chart-tick)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) =>
                    `${(v / 1_000_000).toFixed(1)}M`
                  }
                />
                <Tooltip
                  content={<KassaTip />}
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
                    maxBarSize={44}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
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
        </Card>

        {/* Chart 2: Payment method grouped bar */}
        <Card>
          <CardHeader
            icon={LuCreditCard}
            title="To'lov turi bo'yicha haftalik tushum"
            iconColor="#8b5cf6"
          />
          <div className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={weeklyByPayment}
                margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
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
                  width={52}
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
                <Legend
                  formatter={(value: string) =>
                    ({
                      uzcard: "UzCard",
                      toldirish: "Karta to'ldirish",
                    })[value] ?? value
                  }
                  wrapperStyle={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    paddingTop: 8,
                  }}
                />

                <Bar
                  dataKey="uzcard"
                  fill="#3b82f6"
                  activeBar={{ fill: "#1d4ed8", stroke: "#1e40af" }}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="toldirish"
                  fill="#8b5c"
                  activeBar={{ fill: "#7c3aed", stroke: "#6d28d9" }}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Table card */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
      >
        {/* Toolbar */}
        <div
          className="px-4 py-3 border-b flex flex-col tablet:flex-row gap-3"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div className="flex-1">
            <CusInput
              placeholder="Kassa nomi yoki joylashuv bo'yicha qidirish..."
              leftElement={<LuSearch size={14} />}
              clearable
              inputSize="sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              style={{ maxWidth: 420 }}
            />
          </div>
          <div style={{ width: 180 }}>
            <CusSelect
              options={STATUS_OPTIONS}
              placeholder="Status"
              size="sm"
              value={statusFilter}
              onChange={(v) => setStatus(v as string)}
            />
          </div>
        </div>

        {/* Count + action row */}
        <div
          className="px-4 py-2 border-b flex items-center justify-between gap-3"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div className="flex items-center gap-2">
            {selectedRows.length === 0 ? (
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {filtered.length} ta kassa topildi
              </span>
            ) : (
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text-default)",
                }}
              >
                {selectedRows.length} ta tanlandi
              </span>
            )}
            {(search || statusFilter) && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatus("");
                }}
                style={{
                  fontSize: 11,
                  color: "var(--text-3)",
                  cursor: "pointer",
                  textDecoration: "underline",
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
              >
                Filterni tozalash
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedRows.length === 0 && (
              <CusButton
                size="xs"
                variant="solid"
                colorPalette="blue"
                leftIcon={<LuPlus size={13} />}
                onClick={() => alert("Yangi kassa qo'shish")}
              >
                Qo'shish
              </CusButton>
            )}
            {selectedRows.length === 1 && (
              <>
                <CusButton
                  size="xs"
                  variant="solid"
                  colorPalette="orange"
                  leftIcon={<LuPencil size={13} />}
                  onClick={() => alert("Tahrirlash")}
                >
                  Tahrirlash
                </CusButton>
                <CusButton
                  size="xs"
                  variant="solid"
                  colorPalette="red"
                  leftIcon={<LuTrash2 size={13} />}
                  onClick={() => {
                    alert("O'chirish");
                    setSelected([]);
                  }}
                >
                  O'chirish
                </CusButton>
                <button
                  onClick={() => setSelected([])}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: 4,
                    borderRadius: 4,
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                  }}
                >
                  <LuX size={14} />
                </button>
              </>
            )}
            {selectedRows.length > 1 && (
              <>
                <CusButton
                  size="xs"
                  variant="outline"
                  colorPalette="red"
                  leftIcon={<LuTrash2 size={13} />}
                  onClick={() => {
                    alert(`${selectedRows.length} ta o'chirildi`);
                    setSelected([]);
                  }}
                >
                  O'chirish ({selectedRows.length})
                </CusButton>
                <button
                  onClick={() => setSelected([])}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: 4,
                    borderRadius: 4,
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                  }}
                >
                  <LuX size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        <CusTable<Kassa>
          data={paginated}
          columns={columns}
          showColumnBorder
          variant="outline"
          size="md"
          interactive
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelected}
          onRowClick={(row) => navigate(`/kassa/${row.id}`)}
          emptyText="Kassalar topilmadi"
        />

        {/* Pagination */}
        <div
          className="px-4 py-3 border-t"
          style={{ borderColor: "var(--border-default)" }}
        >
          <CusPagination
            count={filtered.length}
            pageSize={PAGE_SIZE}
            page={page}
            onPageChange={setPage}
            showPageText
          />
        </div>
      </div>
    </div>
  );
}
