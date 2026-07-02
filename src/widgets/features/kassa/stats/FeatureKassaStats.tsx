import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  LuBanknote,
  LuWallet,
  LuCreditCard,
  LuSmartphone,
  LuTrendingUp,
  LuUserCheck,
  LuRotateCcw,
  LuCircleCheck,
  LuClock,
  LuActivity,
  LuPower,
} from "react-icons/lu";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CusTable, type ColumnDef } from "@/components/ui/table/CusTable";
import { CusPagination } from "@/components/ui/table/CusPagination";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { useNavigate } from "react-router-dom";
import { getTodayReports } from "../otchet/api/apiKassaOtchet";
import { getTransactions } from "./api/apiKassaStats";
import type { CashboxTransaction } from "./types";
import { CASHBOX_REPORTS_KEY } from "../kassa.constants";
import { useCashbox } from "../hooks/useCashbox";
import { reportToPaySummary } from "../otchet/otchet.helpers";
import { fmtDateTime } from "@/utils/dateUtils";

const HOURLY = [
  { hour: "08:00", amount: 120_000 },
  { hour: "09:00", amount: 280_000 },
  { hour: "10:00", amount: 350_000 },
  { hour: "11:00", amount: 420_000 },
  { hour: "12:00", amount: 510_000 },
  { hour: "13:00", amount: 390_000 },
  { hour: "14:00", amount: 460_000 },
  { hour: "15:00", amount: 320_000 },
  { hour: "16:00", amount: 290_000 },
  { hour: "17:00", amount: 500_000 },
];

const EMPTY_HOURLY = HOURLY.map((h) => ({ ...h, amount: 0 }));

const TX_PAGE_SIZE = 10;

function payLabel(r: CashboxTransaction): string {
  if (r.payment_type === "cash") return "Naqd";
  if (r.payment_type === "card")
    return r.payment_card_type === "humo" ? "Humo" : "UzCard";
  const svc = r.payment_service_type;
  return svc === "click" ? "Click" : svc === "payme" ? "Payme" : "Uzum";
}

function payColor(r: CashboxTransaction): string {
  if (r.payment_type === "cash") return "#22c55e";
  if (r.payment_type === "card")
    return r.payment_card_type === "humo" ? "#8b5cf6" : "#3b82f6";
  return "#f97316";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} mln`;
  return n.toLocaleString();
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  dim,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
  dim?: boolean;
}) {
  return (
    <div
      className="rounded-2xl border p-3 flex flex-col gap-2 flex-shrink-0 transition-opacity"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
        opacity: dim ? 0.5 : 1,
        minWidth: 188,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <p
        className="font-bold leading-none"
        style={{ fontSize: 22, color: "var(--text-default)" }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

interface TipProps {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border px-3 py-2"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
        fontSize: 12,
      }}
    >
      <p style={{ color: "var(--text-muted)", marginBottom: 2 }}>{label}</p>
      <p className="font-bold" style={{ color: "var(--text-default)" }}>
        {(payload[0].value ?? 0).toLocaleString()} so'm
      </p>
    </div>
  );
}

// ─── Table columns ────────────────────────────────────────────────────────────

const COLUMNS: ColumnDef<CashboxTransaction>[] = [
  {
    key: "created_at",
    header: "Vaqt",
    width: 130,
    render: (row) => (
      <span
        className="font-mono text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        {fmtDateTime(row.created_at)}
      </span>
    ),
  },
  {
    key: "card",
    header: "Karta",
    render: (row) => (
      <span
        className="font-mono text-xs"
        style={{ color: "var(--text-default)" }}
      >
        {row.card.card}
      </span>
    ),
  },
  {
    key: "operator",
    header: "Kassir",
    render: (row) => (
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
        {row.operator.firstname} {row.operator.lastname}
      </span>
    ),
  },
  {
    key: "payment_type",
    header: "To'lov turi",
    render: (row) => {
      const label = payLabel(row);
      const color = payColor(row);
      return (
        <span
          className="text-[11px] font-bold px-2 py-0.5 rounded-lg"
          style={{ background: `${color}18`, color }}
        >
          {label}
        </span>
      );
    },
  },
  {
    key: "amount",
    header: "Summa",
    align: "right",
    render: (row) => (
      <span
        className="font-semibold text-sm"
        style={{ color: "var(--text-default)" }}
      >
        {row.amount.toLocaleString()} so'm
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (row) => (
      <CusBadge
        colorPalette={
          row.status === "success"
            ? "green"
            : row.status === "failed"
              ? "red"
              : "yellow"
        }
        variant="subtle"
        size="sm"
      >
        {row.status === "success" ? (
          <>
            <LuCircleCheck size={11} /> Bajarildi
          </>
        ) : row.status === "failed" ? (
          <>
            <LuClock size={11} /> Xato
          </>
        ) : (
          <>
            <LuClock size={11} /> Kutilmoqda
          </>
        )}
      </CusBadge>
    ),
  },
];

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptySmena({ onGoToOtchet }: { onGoToOtchet: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-4"
      style={{ color: "var(--text-muted)" }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "var(--bg-hover)" }}
      >
        <LuPower size={28} style={{ color: "var(--text-dim)" }} />
      </div>
      <div className="text-center">
        <p className="font-semibold" style={{ color: "var(--text-3)" }}>
          Smena ochilmagan
        </p>
        <p className="text-sm mt-0.5">
          Tranzaksiyalarni ko'rish uchun Otchet sahifasidan X-otchet oching
        </p>
      </div>
      <CusButton
        colorPalette="blue"
        variant="outline"
        size="sm"
        onClick={onGoToOtchet}
      >
        Otchet sahifasiga o'tish
      </CusButton>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FeatureKassaStats() {
  const [txPage, setTxPage] = useState(1);
  const { cashboxId } = useCashbox();

  const { data } = useQuery({
    queryKey: CASHBOX_REPORTS_KEY(cashboxId ?? 0),
    queryFn: () => getTodayReports(cashboxId!),
    enabled: !!cashboxId,
  });

  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ["cashbox-transactions", cashboxId, txPage],
    queryFn: () =>
      getTransactions(cashboxId!, { page: txPage, limit: TX_PAGE_SIZE }),
    enabled: !!cashboxId,
  });

  const navigate = useNavigate();

  const xreports = data?.data["cashbox-reports"].xreports ?? [];
  const activeX = xreports.find((x) => x.status === "open") ?? null;
  const s = reportToPaySummary(activeX);
  const op = activeX
    ? `${activeX.operator.firstname} ${activeX.operator.lastname}`
    : "";

  const transactions = txData?.data["cashbox-transactions"] ?? [];
  const txTotal = txData?.data.pagination.total ?? 0;
  const hourlyData = activeX ? HOURLY : EMPTY_HOURLY;

  return (
    <div className="p-4 tablet:p-6 flex flex-col gap-5 pb-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--text-default)" }}
          >
            Kassa smena kunlik
          </h1>
          {activeX ? (
            <span
              className="text-xs font-mono px-2 py-0.5 rounded-lg"
              style={{
                background: "#3b82f618",
                color: "#60a5fa",
                border: "1px solid #3b82f630",
              }}
            >
              X-otchet #{activeX.id}
            </span>
          ) : (
            <span
              className="text-xs px-2 py-0.5 rounded-lg"
              style={{
                background: "#f9731618",
                color: "#fb923c",
                border: "1px solid #f9731630",
              }}
            >
              Smena yopiq
            </span>
          )}
          {activeX && (
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <LuActivity size={12} />
              Faol
            </span>
          )}
        </div>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          {activeX
            ? `${op} · Boshlandi: ${fmtDateTime(activeX.opened_at)}`
            : "Smena ochilmagan. Otchet sahifasidan X-otchet oching."}
        </p>
      </div>

      {/* ── Stat cards ─────────────────────────────────────── */}
      <div className="overflow-x-auto -mx-4 tablet:-mx-6 px-4 tablet:px-6 pb-1">
        <div className="flex gap-3">
          <StatCard
            icon={LuBanknote}
            label="Bugungi daromad"
            value={fmt(s.total)}
            sub="so'm"
            color="#3b82f6"
            dim={!activeX}
          />
          <StatCard
            icon={LuWallet}
            label="Naqd"
            value={fmt(s.naqd)}
            sub="so'm"
            color="#22c55e"
            dim={!activeX}
          />
          <StatCard
            icon={LuCreditCard}
            label="UzCard"
            value={fmt(s.uzcard)}
            sub="so'm"
            color="#3b82f6"
            dim={!activeX}
          />
          <StatCard
            icon={LuCreditCard}
            label="Humo"
            value={fmt(s.humo)}
            sub="so'm"
            color="#8b5cf6"
            dim={!activeX}
          />
          <StatCard
            icon={LuSmartphone}
            label="UzumBank"
            value={fmt(s.uzumbank)}
            sub="so'm"
            color="#06b6d4"
            dim={!activeX}
          />
          <StatCard
            icon={LuSmartphone}
            label="Click"
            value={fmt(s.click)}
            sub="so'm"
            color="#f97316"
            dim={!activeX}
          />
          <StatCard
            icon={LuSmartphone}
            label="Payme"
            value={fmt(s.payme)}
            sub="so'm"
            color="#ef4444"
            dim={!activeX}
          />
          <StatCard
            icon={LuTrendingUp}
            label="Karta sotildi"
            value={String(s.kartaSotildi)}
            sub="bugun"
            color="#eab308"
            dim={!activeX}
          />
          <StatCard
            icon={LuUserCheck}
            label="Karta registratsiya"
            value={String(s.kartaReg)}
            sub="bugun"
            color="#06b6d4"
            dim={!activeX}
          />
          <StatCard
            icon={LuRotateCcw}
            label="Vozvrat karta"
            value="0"
            sub="bugun"
            color="#ef4444"
            dim={!activeX}
          />
        </div>
      </div>

      {/* ── Transactions table ─────────────────────────────── */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
      >
        <div
          className="px-4 py-3 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border-default)" }}
        >
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--text-default)" }}
          >
            Tranzaksiyalar
          </p>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {txTotal} ta yozuv
          </span>
        </div>

        {!activeX ? (
          <EmptySmena onGoToOtchet={() => navigate("/rolekassa/otchet")} />
        ) : (
          <div>
            <div className="overflow-x-auto">
              <CusTable
                data={transactions}
                columns={COLUMNS}
                size="md"
                interactive
                isLoading={txLoading}
                variant="outline"
              />
            </div>
            {txTotal > TX_PAGE_SIZE && (
              <div
                className="flex justify-end px-4 py-3 border-t"
                style={{ borderColor: "var(--border-default)" }}
              >
                <CusPagination
                  count={txTotal}
                  pageSize={TX_PAGE_SIZE}
                  page={txPage}
                  onPageChange={setTxPage}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Hourly chart ───────────────────────────────────── */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
      >
        <div
          className="px-4 py-3 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border-default)" }}
        >
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--text-default)" }}
          >
            Soatlik daromad
          </p>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            bugun
          </span>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourlyData} barSize={28}>
              <CartesianGrid
                vertical={false}
                stroke="var(--border-default)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => fmt(v)}
                tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "var(--bg-hover)", radius: 4 }}
              />
              <Bar
                dataKey="amount"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                fillOpacity={activeX ? 0.85 : 0.25}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
