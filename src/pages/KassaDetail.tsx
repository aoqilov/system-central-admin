import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  LuArrowLeft,
  LuUserPlus,
  LuMapPin,
  LuClock,
  LuHash,
  LuTrendingUp,
  LuActivity,
  LuReceipt,
  LuBanknote,
  LuInfo,
  LuCalendar,
} from "react-icons/lu";
import { kassaList, type KassaStatus } from "../data/kassa";
import { employees, EmployeeStatus } from "../data/employees";
import { CusBadge } from "../components/ui/badge/CusBadge";
import { CusButton } from "../components/ui/buttons/CusButton";
import { CusDialog } from "../components/ui/dialog/CusDialog";
import {
  CusCard as Card,
  CusCardHeader as CardHeader,
  CusInfoRow as InfoRow,
} from "../components/shared/card/CusCard";

// ─── Types ────────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<KassaStatus, "active" | "pending" | "fired"> = {
  active:      "active",
  maintenance: "pending",
  inactive:    "fired",
};

const STATUS_LABEL: Record<KassaStatus, string> = {
  active:      "Faol",
  maintenance: "Ta'mirda",
  inactive:    "Yopiq",
};

// ─── Chart helpers ────────────────────────────────────────────────────────────

interface TipProps {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}

function TxTooltip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm border shadow-xl"
      style={{ background: "var(--bg-tooltip)", borderColor: "var(--border-2)", color: "var(--text-4)" }}
    >
      <p className="mb-1">{label}:00</p>
      <p className="font-medium" style={{ color: "#22c55e" }}>
        {payload[0].value} ta tranzaksiya
      </p>
    </div>
  );
}

function RevTooltip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm border shadow-xl"
      style={{ background: "var(--bg-tooltip)", borderColor: "var(--border-2)", color: "var(--text-4)" }}
    >
      <p className="mb-1">{label}:00</p>
      <p className="font-medium" style={{ color: "#3b82f6" }}>
        {payload[0].value?.toLocaleString()} UZS
      </p>
    </div>
  );
}

// Deterministic mock hourly data based on kassa id
function _s(n: number) { return ((n * 9301 + 49297) % 233280) / 233280; }

function buildHourlyData(kassaId: number, totalTx: number, totalRev: number) {
  const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17];
  return hours.map((h, i) => {
    const seed = kassaId * 31 + i * 7;
    const txShare  = 0.5 + _s(seed) * 1.1;
    const revShare = 0.5 + _s(seed + 3) * 1.1;
    const tx  = totalTx  > 0 ? Math.max(1,  Math.round((totalTx  / hours.length) * txShare))  : 0;
    const rev = totalRev > 0 ? Math.max(0,  Math.round((totalRev / hours.length) * revShare)) : 0;
    return { hour: String(h), tx, rev };
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KassaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignOpen, setAssignOpen]     = useState(false);
  const [selectedEmp, setSelectedEmp]   = useState<number | null>(null);
  const [localCashierId, setLocalCashier] = useState<number | undefined>(undefined);

  const kassa = kassaList.find((k) => k.id === Number(id));

  if (!kassa) {
    return (
      <div className="p-6 flex flex-col items-center justify-center gap-3" style={{ minHeight: 400 }}>
        <p className="text-base font-semibold" style={{ color: "var(--text-default)" }}>
          Kassa topilmadi
        </p>
        <CusButton size="sm" variant="outline" leftIcon={<LuArrowLeft size={14} />} onClick={() => navigate("/kassa")}>
          Kassalarga qaytish
        </CusButton>
      </div>
    );
  }

  // ── Derived ────────────────────────────────────────────────────────────────

  const cashierId = localCashierId ?? kassa.cashierId;
  const cashier   = cashierId ? employees.find((e) => e.id === cashierId) : null;

  const hourlyData = buildHourlyData(kassa.id, kassa.todayTransactions, kassa.todayRevenue);

  const assignCandidates = employees.filter((e) => e.status === EmployeeStatus.ACTIVE);

  function handleAssign() {
    if (selectedEmp !== null) {
      setLocalCashier(selectedEmp);
      setAssignOpen(false);
      setSelectedEmp(null);
    }
  }

  return (
    <div className="p-4 tablet:p-6 space-y-4">

      {/* Back */}
      <CusButton variant="outline" colorPalette="gray" size="xs" onClick={() => navigate("/kassa")}>
        <LuArrowLeft size={14} />
        Kassalarga qaytish
      </CusButton>

      {/* ══════════════════════════════════════════════════════════════════════
          ROW 1: Kassa info + Kassir
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 desktop:grid-cols-[3fr_2fr] gap-4 items-start">

        {/* Kassa info card */}
        <Card>
          <div className="flex" style={{ minHeight: 148 }}>
            {/* Icon panel */}
            <div
              className="shrink-0 self-stretch flex items-center justify-center rounded-l-xl"
              style={{ width: 120, background: "var(--bg-hover)" }}
            >
              <LuBanknote size={40} style={{ color: "var(--text-muted)" }} />
            </div>
            {/* Info */}
            <div className="flex-1 p-5 min-w-0 flex flex-col justify-center">
              <h1 className="text-xl font-semibold leading-tight truncate" style={{ color: "var(--text-default)" }}>
                {kassa.name}
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <LuMapPin size={11} style={{ color: "var(--text-muted)" }} />
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{kassa.location}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <CusBadge status={STATUS_BADGE[kassa.status]} size="sm">
                  {STATUS_LABEL[kassa.status]}
                </CusBadge>
                <span className="text-xs px-2 py-0.5 rounded"
                  style={{ background: "var(--bg-hover)", color: "var(--text-2)" }}>
                  #{kassa.id}
                </span>
              </div>
              {kassa.note && (
                <p className="text-xs mt-2.5" style={{ color: "var(--text-muted)" }}>
                  {kassa.note}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Kassir card */}
        {cashier ? (
          <Card>
            <div className="flex" style={{ minHeight: 148 }}>
              <div className="shrink-0 self-stretch" style={{ width: 120 }}>
                <img
                  src={cashier.avatarUrl ?? `https://i.pravatar.cc/150?u=${cashier.id}`}
                  alt={cashier.fullName ?? cashier.firstName}
                  className="w-full h-full object-cover rounded-l-xl"
                  style={{ display: "block" }}
                />
              </div>
              <div className="flex-1 p-4 min-w-0 flex flex-col justify-center">
                <span className="text-[11px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Kassir
                </span>
                <p className="text-sm font-semibold leading-tight truncate" style={{ color: "var(--text-default)" }}>
                  {cashier.fullName ?? `${cashier.firstName} ${cashier.lastName}`}
                </p>
                <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                  {cashier.createdAt ?? ""}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <CusBadge
                    status={cashier.status === EmployeeStatus.ACTIVE ? "active" : "fired"}
                    size="sm"
                  >
                    {cashier.status}
                  </CusBadge>
                  {cashier.currency && (
                    <CusBadge colorPalette="gray" variant="surface" size="sm">
                      {cashier.currency}
                    </CusBadge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <button
            onClick={() => setAssignOpen(true)}
            className="relative rounded-xl border overflow-hidden w-full"
            style={{
              background: "var(--bg-second)",
              borderColor: "var(--border-default)",
              minHeight: 148,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {/* Blur skeleton */}
            <div style={{ filter: "blur(5px)", opacity: 0.2, pointerEvents: "none", position: "absolute", inset: 0, display: "flex" }}>
              <div style={{ width: 120, background: "var(--bg-hover)", borderRadius: "12px 0 0 12px" }} />
              <div className="flex-1 p-5" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
                <div className="rounded" style={{ width: 130, height: 14, background: "var(--bg-hover)" }} />
                <div className="rounded" style={{ width: 90,  height: 11, background: "var(--bg-hover)" }} />
                <div className="rounded" style={{ width: 60,  height: 20, marginTop: 4, background: "var(--bg-hover)" }} />
              </div>
            </div>
            {/* Overlay */}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "var(--bg-hover)", border: "1.5px dashed var(--border-2)" }}>
                <LuUserPlus size={22} style={{ color: "var(--text-muted)" }} />
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Kassir biriktirish</p>
            </div>
          </button>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          BODY: Charts (left) + Aside info (right)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 desktop:grid-cols-[3fr_1.2fr] gap-4 items-start">

        {/* Left: charts */}
        <div className="space-y-4">

          {/* Hourly transactions bar chart */}
          <Card>
            <CardHeader icon={LuReceipt} title="Bugungi tranzaksiyalar (soatlik)" iconColor="#22c55e" />
            <div className="p-5">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={hourlyData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: "var(--chart-tick)", fontSize: 12 }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${v}:00`} />
                  <YAxis tick={{ fill: "var(--chart-tick)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<TxTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="tx" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Hourly revenue area chart */}
          <Card>
            <CardHeader icon={LuTrendingUp} title="Bugungi daromad (soatlik)" iconColor="#3b82f6" />
            <div className="p-5">
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={hourlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="kassaRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: "var(--chart-tick)", fontSize: 12 }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${v}:00`} />
                  <YAxis tick={{ fill: "var(--chart-tick)", fontSize: 11 }} axisLine={false} tickLine={false}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<RevTooltip />} cursor={{ stroke: "var(--border-2)" }} />
                  <Area type="monotone" dataKey="rev" stroke="#3b82f6" strokeWidth={2}
                    fill="url(#kassaRevGrad)"
                    dot={{ fill: "#3b82f6", strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 5, fill: "#3b82f6", stroke: "var(--bg-main)", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right: aside info */}
        <Card>
          <CardHeader icon={LuActivity} title="Kassa ma'lumoti" iconColor="#a78bfa" />
          <div className="px-5 pb-2">
            <InfoRow icon={LuHash}      label="Kassa ID"          value={`#${kassa.id}`} />
            <InfoRow icon={LuMapPin}    label="Joylashuv"          value={kassa.location} />
            <InfoRow icon={LuClock}     label="Ochilish vaqti"
              value={kassa.openedAt ? kassa.openedAt : "Ochilmagan"} />
            {kassa.closedAt && (
              <InfoRow icon={LuClock}   label="Yopilish vaqti"     value={kassa.closedAt} />
            )}
            <InfoRow icon={LuReceipt}   label="Tranzaksiyalar"
              value={kassa.todayTransactions > 0 ? `${kassa.todayTransactions} ta` : "—"} />
            <InfoRow icon={LuBanknote}  label="Bugungi daromad"
              value={kassa.todayRevenue > 0 ? `${kassa.todayRevenue.toLocaleString()} UZS` : "—"} />
            {kassa.lastActivity && (
              <InfoRow icon={LuCalendar} label="Oxirgi faollik"    value={kassa.lastActivity} />
            )}
            {kassa.note && (
              <InfoRow icon={LuInfo}    label="Izoh"               value={kassa.note} last />
            )}
          </div>
        </Card>
      </div>

      {/* ── Assign kassir dialog ──────────────────────────────────────────────── */}
      <CusDialog
        open={assignOpen}
        onClose={() => { setAssignOpen(false); setSelectedEmp(null); }}
        title="Kassir biriktirish"
        footer={
          <div className="flex justify-end gap-2">
            <CusButton size="sm" variant="outline" colorPalette="gray"
              onClick={() => { setAssignOpen(false); setSelectedEmp(null); }}>
              Bekor qilish
            </CusButton>
            <CusButton size="sm" variant="solid" colorPalette="blue"
              isDisabled={selectedEmp === null} onClick={handleAssign}>
              Biriktirish
            </CusButton>
          </div>
        }
      >
        <div className="space-y-1">
          {assignCandidates.map((emp) => (
            <button
              key={emp.id}
              onClick={() => setSelectedEmp(emp.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
              style={{
                background: selectedEmp === emp.id ? "var(--bg-hover)" : "transparent",
                border: `1px solid ${selectedEmp === emp.id ? "var(--border-2)" : "transparent"}`,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <img
                src={emp.avatarUrl ?? `https://i.pravatar.cc/150?u=${emp.id}`}
                alt={emp.fullName ?? emp.firstName}
                style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--text-default)" }}>
                  {emp.fullName ?? `${emp.firstName} ${emp.lastName}`}
                </p>
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                  {emp.role ?? ""}
                </p>
              </div>
            </button>
          ))}
        </div>
      </CusDialog>

    </div>
  );
}
