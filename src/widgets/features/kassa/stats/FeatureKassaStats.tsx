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
  LuCircleCheck,
  LuClock,
  LuActivity,
  LuPower,
} from "react-icons/lu";
import { CusTable, type ColumnDef } from "@/components/ui/table/CusTable";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { useSmena } from "@/context/SmenaContext";
import { useNavigate } from "react-router-dom";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_NAQD     = 265_000;
const MOCK_UZCARD   = 180_000;
const MOCK_HUMO     = 110_000;
const MOCK_UZUMBANK = 75_000;
const MOCK_CLICK    = 65_000;
const MOCK_PAYME    = 80_000;
const MOCK_KARTA_SOTILDI = 54;
const MOCK_KARTA_REG     = 31;
const MOCK_TOTAL = MOCK_NAQD + MOCK_UZCARD + MOCK_HUMO + MOCK_UZUMBANK + MOCK_CLICK + MOCK_PAYME;

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

interface TxRow {
  id: number;
  time: string;
  token: string;
  partiya: string;
  type: "Naqd" | "UzCard" | "Karta";
  amount: number;
  status: "success" | "pending";
}

const TRANSACTIONS: TxRow[] = [
  { id: 1,  time: "17:51", token: "TKN-8F3D-A12C", partiya: "B2-007", type: "Naqd",   amount: 45_000,  status: "success" },
  { id: 2,  time: "17:48", token: "TKN-2C1A-F09E", partiya: "B2-006", type: "UzCard", amount: 120_000, status: "success" },
  { id: 3,  time: "17:43", token: "TKN-7D4B-C33F", partiya: "B3-001", type: "Karta",  amount: 60_000,  status: "pending" },
  { id: 4,  time: "17:39", token: "TKN-1E5C-D80A", partiya: "B2-005", type: "Naqd",   amount: 90_000,  status: "success" },
  { id: 5,  time: "17:34", token: "TKN-9A2D-E41B", partiya: "B1-012", type: "UzCard", amount: 30_000,  status: "success" },
  { id: 6,  time: "17:29", token: "TKN-4F6E-B72C", partiya: "B3-002", type: "Karta",  amount: 75_000,  status: "success" },
  { id: 7,  time: "17:21", token: "TKN-3C8A-A55D", partiya: "B2-004", type: "Naqd",   amount: 50_000,  status: "success" },
  { id: 8,  time: "17:15", token: "TKN-0B1F-C94E", partiya: "B1-011", type: "UzCard", amount: 200_000, status: "success" },
  { id: 9,  time: "17:08", token: "TKN-6D3C-F18A", partiya: "B3-003", type: "Naqd",   amount: 45_000,  status: "pending" },
  { id: 10, time: "17:01", token: "TKN-5E7B-D26F", partiya: "B2-003", type: "Karta",  amount: 150_000, status: "success" },
  { id: 11, time: "16:54", token: "TKN-2A4D-E03C", partiya: "B1-010", type: "UzCard", amount: 80_000,  status: "success" },
  { id: 12, time: "16:47", token: "TKN-8C6E-B91A", partiya: "B2-002", type: "Naqd",   amount: 35_000,  status: "success" },
];

const TYPE_COLOR: Record<string, string> = {
  Naqd: "#22c55e",
  UzCard: "#3b82f6",
  Karta: "#8b5cf6",
};

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
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <p className="font-bold leading-none" style={{ fontSize: 22, color: "var(--text-default)" }}>
        {value}
      </p>
      {sub && <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{sub}</p>}
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
      style={{ background: "var(--bg-second)", borderColor: "var(--border-default)", fontSize: 12 }}
    >
      <p style={{ color: "var(--text-muted)", marginBottom: 2 }}>{label}</p>
      <p className="font-bold" style={{ color: "var(--text-default)" }}>
        {(payload[0].value ?? 0).toLocaleString()} so'm
      </p>
    </div>
  );
}

// ─── Table columns ────────────────────────────────────────────────────────────

const COLUMNS: ColumnDef<TxRow>[] = [
  {
    key: "time",
    header: "Vaqt",
    width: 70,
    render: (row) => (
      <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>{row.time}</span>
    ),
  },
  {
    key: "token",
    header: "Token",
    render: (row) => (
      <span className="font-mono text-xs" style={{ color: "var(--text-default)" }}>{row.token}</span>
    ),
  },
  {
    key: "partiya",
    header: "Partiya",
    render: (row) => (
      <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{row.partiya}</span>
    ),
  },
  {
    key: "type",
    header: "To'lov turi",
    render: (row) => (
      <span
        className="text-[11px] font-bold px-2 py-0.5 rounded-lg"
        style={{ background: `${TYPE_COLOR[row.type]}18`, color: TYPE_COLOR[row.type] }}
      >
        {row.type}
      </span>
    ),
  },
  {
    key: "amount",
    header: "Summa",
    align: "right",
    render: (row) => (
      <span className="font-semibold text-sm" style={{ color: "var(--text-default)" }}>
        {row.amount.toLocaleString()} so'm
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (row) => (
      <CusBadge colorPalette={row.status === "success" ? "green" : "yellow"} variant="subtle" size="sm">
        {row.status === "success" ? (
          <><LuCircleCheck size={11} /> Bajarildi</>
        ) : (
          <><LuClock size={11} /> Kutilmoqda</>
        )}
      </CusBadge>
    ),
  },
];

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptySmena({ onGoToOtchet }: { onGoToOtchet: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4" style={{ color: "var(--text-muted)" }}>
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "var(--bg-hover)" }}
      >
        <LuPower size={28} style={{ color: "var(--text-dim)" }} />
      </div>
      <div className="text-center">
        <p className="font-semibold" style={{ color: "var(--text-3)" }}>Smena ochilmagan</p>
        <p className="text-sm mt-0.5">Tranzaksiyalarni ko'rish uchun Otchet sahifasidan X-otchet oching</p>
      </div>
      <CusButton colorPalette="blue" variant="outline" size="sm" onClick={onGoToOtchet}>
        Otchet sahifasiga o'tish
      </CusButton>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FeatureKassaStats() {
  const { active: smena } = useSmena();
  const navigate = useNavigate();

  const activeTx = smena ? TRANSACTIONS : [];
  const hourlyData = smena ? HOURLY : EMPTY_HOURLY;

  return (
    <div className="p-4 tablet:p-6 flex flex-col gap-5 pb-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-bold" style={{ color: "var(--text-default)" }}>
            Kassa smena kunlik
          </h1>
          {smena ? (
            <span
              className="text-xs font-mono px-2 py-0.5 rounded-lg"
              style={{ background: "#3b82f618", color: "#60a5fa", border: "1px solid #3b82f630" }}
            >
              {smena.name}
            </span>
          ) : (
            <span
              className="text-xs px-2 py-0.5 rounded-lg"
              style={{ background: "#f9731618", color: "#fb923c", border: "1px solid #f9731630" }}
            >
              Smena yopiq
            </span>
          )}
          {smena && (
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <LuActivity size={12} />
              Faol
            </span>
          )}
        </div>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          {smena
            ? `${smena.kassir} · ${smena.date} — ${smena.startTime}dan beri`
            : "Smena ochilmagan. Otchet sahifasidan X-otchet oching."}
        </p>
      </div>

      {/* ── Stat cards ─────────────────────────────────────── */}
      <div className="overflow-x-auto -mx-4 tablet:-mx-6 px-4 tablet:px-6 pb-1">
        <div className="flex gap-3">
          <StatCard icon={LuBanknote}   label="Bugungi daromad"    value={smena ? fmt(MOCK_TOTAL)         : "0"} sub="so'm"  color="#3b82f6" dim={!smena} />
          <StatCard icon={LuWallet}     label="Naqd"               value={smena ? fmt(MOCK_NAQD)          : "0"} sub="so'm"  color="#22c55e" dim={!smena} />
          <StatCard icon={LuCreditCard} label="UzCard"             value={smena ? fmt(MOCK_UZCARD)        : "0"} sub="so'm"  color="#3b82f6" dim={!smena} />
          <StatCard icon={LuCreditCard} label="Humo"               value={smena ? fmt(MOCK_HUMO)          : "0"} sub="so'm"  color="#8b5cf6" dim={!smena} />
          <StatCard icon={LuSmartphone} label="UzumBank"           value={smena ? fmt(MOCK_UZUMBANK)      : "0"} sub="so'm"  color="#06b6d4" dim={!smena} />
          <StatCard icon={LuSmartphone} label="Click"              value={smena ? fmt(MOCK_CLICK)         : "0"} sub="so'm"  color="#f97316" dim={!smena} />
          <StatCard icon={LuSmartphone} label="Payme"              value={smena ? fmt(MOCK_PAYME)         : "0"} sub="so'm"  color="#ef4444" dim={!smena} />
          <StatCard icon={LuTrendingUp} label="Karta sotildi"      value={smena ? String(MOCK_KARTA_SOTILDI) : "0"} sub="bugun" color="#eab308" dim={!smena} />
          <StatCard icon={LuUserCheck}  label="Karta registratsiya" value={smena ? String(MOCK_KARTA_REG)    : "0"} sub="bugun" color="#06b6d4" dim={!smena} />
        </div>
      </div>

      {/* ── Transactions table ─────────────────────────────── */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
      >
        <div
          className="px-4 py-3 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border-default)" }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>Tranzaksiyalar</p>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{activeTx.length} ta yozuv</span>
        </div>

        {!smena ? (
          <EmptySmena onGoToOtchet={() => navigate("/rolekassa/otchet")} />
        ) : (
          <div className="overflow-x-auto">
            <CusTable
              data={activeTx}
              columns={COLUMNS}
              size="md"
              interactive
              stickyHeader
              maxH="340px"
              variant="outline"
            />
          </div>
        )}
      </div>

      {/* ── Hourly chart ───────────────────────────────────── */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
      >
        <div
          className="px-4 py-3 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border-default)" }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>Soatlik daromad</p>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>bugun</span>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourlyData} barSize={28}>
              <CartesianGrid vertical={false} stroke="var(--border-default)" strokeDasharray="3 3" />
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
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-hover)", radius: 4 }} />
              <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} fillOpacity={smena ? 0.85 : 0.25} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
