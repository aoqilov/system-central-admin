import {
  LuBanknote,
  LuActivity,
  LuWallet,
  LuCreditCard,
  LuArrowUpDown,
  LuCircleCheck,
  LuCircleX,
  LuClock,
  LuLayoutGrid,
  LuTrendingUp,
  LuRefreshCw,
} from "react-icons/lu";
import { CusCard, CusCardHeader } from "../components/shared/card/CusCard";
import { BarListChart } from "../components/charts/chakra/BarListChart";
import { CusTable, type ColumnDef } from "../components/ui/table/CusTable";

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentType = "Naqd" | "UzCard" | "Karta";
type TxStatus = "success" | "pending" | "failed";

interface Transaction {
  id: number;
  time: string;
  kassaName: string;
  cashier: string;
  amount: number;
  paymentType: PaymentType;
  status: TxStatus;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const transactions: Transaction[] = [
  {
    id: 1,
    time: "17:44",
    kassaName: "Bosh Kassa",
    cashier: "Aziz N.",
    amount: 45_000,
    paymentType: "Naqd",
    status: "success",
  },
  {
    id: 2,
    time: "17:43",
    kassaName: "Kassa #7",
    cashier: "Sherzod T.",
    amount: 120_000,
    paymentType: "UzCard",
    status: "success",
  },
  {
    id: 3,
    time: "17:42",
    kassaName: "Kassa #2",
    cashier: "Dilnoza M.",
    amount: 60_000,
    paymentType: "Karta",
    status: "pending",
  },
  {
    id: 4,
    time: "17:41",
    kassaName: "Kassa #4",
    cashier: "Jasur K.",
    amount: 90_000,
    paymentType: "Naqd",
    status: "success",
  },
  {
    id: 5,
    time: "17:40",
    kassaName: "Kassa #5",
    cashier: "Feruza O.",
    amount: 30_000,
    paymentType: "UzCard",
    status: "success",
  },
  {
    id: 6,
    time: "17:39",
    kassaName: "Bosh Kassa",
    cashier: "Aziz N.",
    amount: 75_000,
    paymentType: "Karta",
    status: "failed",
  },
  {
    id: 7,
    time: "17:38",
    kassaName: "Kassa #2",
    cashier: "Dilnoza M.",
    amount: 45_000,
    paymentType: "Naqd",
    status: "success",
  },
  {
    id: 8,
    time: "17:37",
    kassaName: "Kassa #7",
    cashier: "Sherzod T.",
    amount: 150_000,
    paymentType: "UzCard",
    status: "success",
  },
  {
    id: 9,
    time: "17:36",
    kassaName: "Kassa #4",
    cashier: "Jasur K.",
    amount: 60_000,
    paymentType: "Karta",
    status: "success",
  },
  {
    id: 10,
    time: "17:35",
    kassaName: "Kassa #5",
    cashier: "Feruza O.",
    amount: 45_000,
    paymentType: "Naqd",
    status: "success",
  },
  {
    id: 11,
    time: "17:34",
    kassaName: "Bosh Kassa",
    cashier: "Aziz N.",
    amount: 90_000,
    paymentType: "UzCard",
    status: "success",
  },
  {
    id: 12,
    time: "17:33",
    kassaName: "Kassa #7",
    cashier: "Sherzod T.",
    amount: 30_000,
    paymentType: "Naqd",
    status: "pending",
  },
  {
    id: 13,
    time: "17:32",
    kassaName: "Kassa #2",
    cashier: "Dilnoza M.",
    amount: 120_000,
    paymentType: "Karta",
    status: "success",
  },
  {
    id: 14,
    time: "17:31",
    kassaName: "Kassa #4",
    cashier: "Jasur K.",
    amount: 45_000,
    paymentType: "UzCard",
    status: "success",
  },
  {
    id: 15,
    time: "17:30",
    kassaName: "Kassa #5",
    cashier: "Feruza O.",
    amount: 75_000,
    paymentType: "Naqd",
    status: "success",
  },
];

const kassaRevenue = [
  { label: "Bosh Kassa", value: 4_850_000, color: "var(--color-blue)" },
  { label: "Kassa #7", value: 3_780_000, color: "var(--color-purple)" },
  { label: "Kassa #2", value: 3_210_000, color: "var(--color-cyan)" },
  { label: "Kassa #4", value: 2_640_000, color: "var(--color-green)" },
  { label: "Kassa #5", value: 1_920_000, color: "var(--color-yellow)" },
];

const paymentBreakdown = [
  { label: "Naqd pul", value: 6_450_000, color: "var(--color-green)" },
  { label: "UzCard", value: 5_280_000, color: "var(--color-blue)" },
  { label: "Karta to'ldirish", value: 2_670_000, color: "var(--color-purple)" },
];

const selfPayBreakdown = [
  { label: "Payme", value: 5_870_000, color: "#1fce6b" },
  { label: "Click", value: 4_350_000, color: "#1a73e8" },
  { label: "Uzumbank", value: 3_120_000, color: "#f97316" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(2)} mln` : v.toLocaleString();

const fmtFull = (v: number) => `${v.toLocaleString()} so'm`;

const PAYMENT_COLOR: Record<PaymentType, string> = {
  Naqd: "var(--color-green)",
  UzCard: "var(--color-blue)",
  Karta: "var(--color-purple)",
};

const STATUS_CFG: Record<
  TxStatus,
  { label: string; color: string; icon: typeof LuCircleCheck }
> = {
  success: {
    label: "Muvaffaq",
    color: "var(--color-green)",
    icon: LuCircleCheck,
  },
  pending: { label: "Kutilmoqda", color: "var(--color-yellow)", icon: LuClock },
  failed: { label: "Xato", color: "var(--color-red)", icon: LuCircleX },
};

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

// ─── Main page ────────────────────────────────────────────────────────────────

const LiveMonitorKassa = () => {
  const activeCount = 5;
  const inactiveCount = 2;
  const maintenanceCount = 1;

  return (
    <div className="space-y-4">
      {/* ── Row 1: stat cards ─────────────────────────────── */}
      <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-6 gap-4">
        <StatCard
          label="Bugungi daromad"
          value={fmt(16_400_000)}
          sub="so'm"
          color="var(--color-blue)"
          icon={LuBanknote}
        />
        <StatCard
          label="Tranzaksiyalar"
          value="411"
          sub="bugun"
          color="var(--color-cyan)"
          icon={LuArrowUpDown}
        />
        <StatCard
          label="Naqd pul"
          value={fmt(6_450_000)}
          sub={`${Math.round((6_450_000 / 16_400_000) * 100)}%`}
          color="var(--color-green)"
          icon={LuWallet}
        />
        <StatCard
          label="UzCard"
          value={fmt(5_280_000)}
          sub={`${Math.round((5_280_000 / 16_400_000) * 100)}%`}
          color="var(--color-purple)"
          icon={LuCreditCard}
        />
        <StatCard
          label="Karta to'ldirish"
          value={fmt(2_670_000)}
          sub={`${Math.round((2_670_000 / 16_400_000) * 100)}%`}
          color="var(--color-yellow)"
          icon={LuTrendingUp}
        />

        {/* Kassa statusi — keng karta */}
        <CusCard className="p-4 flex flex-col gap-3 desktop:col-span-1">
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Kassalar holati
            </span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--bg-hover)" }}
            >
              <LuLayoutGrid size={15} style={{ color: "var(--text-muted)" }} />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <div className="text-center">
              <p
                className="text-xl font-bold"
                style={{ color: "var(--color-green)" }}
              >
                {activeCount}
              </p>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                Faol
              </p>
            </div>
            <div className="text-center">
              <p
                className="text-xl font-bold"
                style={{ color: "var(--color-gray)" }}
              >
                {inactiveCount}
              </p>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                Nofaol
              </p>
            </div>
            <div className="text-center">
              <p
                className="text-xl font-bold"
                style={{ color: "var(--color-yellow)" }}
              >
                {maintenanceCount}
              </p>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                Ta'mirda
              </p>
            </div>
          </div>
        </CusCard>
      </div>

      {/* ── Row 2: main body ──────────────────────────────── */}
      <div className="grid grid-cols-1 desktop:grid-cols-[3fr_2fr] gap-4 items-start">
        {/* Left — live transaction feed + self-pay chart */}
        <div className="flex flex-col gap-4">
          <CusCard>
            <CusCardHeader
              icon={LuActivity}
              title="Jonli tranzaksiyalar"
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
            <CusTable<Transaction>
              data={transactions}
              maxH="400px"
              stickyHeader
              variant="outline"
              colorHeader="var(--bg-hover)"
              size="sm"
              columns={
                [
                  {
                    key: "time",
                    header: "Vaqt",
                    render: (tx) => (
                      <span
                        className="font-mono text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {tx.time}
                      </span>
                    ),
                  },
                  {
                    key: "kassaName",
                    header: "Kassa",
                    render: (tx) => (
                      <span style={{ color: "var(--text-2)" }}>
                        {tx.kassaName}
                      </span>
                    ),
                  },
                  {
                    key: "cashier",
                    header: "Kassir",
                    render: (tx) => (
                      <span style={{ color: "var(--text-3)" }}>
                        {tx.cashier}
                      </span>
                    ),
                  },
                  {
                    key: "amount",
                    header: "Miqdor",
                    align: "right",
                    render: (tx) => (
                      <span
                        style={{
                          fontWeight: 600,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {tx.amount.toLocaleString()}
                      </span>
                    ),
                  },
                  {
                    key: "paymentType",
                    header: "To'lov",
                    render: (tx) => (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          background: `${PAYMENT_COLOR[tx.paymentType]}18`,
                          color: PAYMENT_COLOR[tx.paymentType],
                        }}
                      >
                        {tx.paymentType}
                      </span>
                    ),
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (tx) => {
                      const st = STATUS_CFG[tx.status];
                      const StIcon = st.icon;
                      return (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 12,
                            color: st.color,
                          }}
                        >
                          <StIcon size={13} />
                          {st.label}
                        </span>
                      );
                    },
                  },
                ] satisfies ColumnDef<Transaction>[]
              }
            />
          </CusCard>
        </div>

        {/* Right — charts */}
        <div className="flex flex-col gap-4">
          {/* Kassalar daromadi */}
          <CusCard>
            <CusCardHeader
              icon={LuBanknote}
              title="Kassalar daromadi"
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
                data={kassaRevenue}
                valueFormatter={fmtFull}
                sort="desc"
                barHeight={34}
                gap={10}
                labelWidth="38%"
              />
            </div>
          </CusCard>
          <CusCard>
            <CusCardHeader
              icon={LuTrendingUp}
              title="Mijoz o'z-hisobini toldirgan to'lovi"
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
                data={selfPayBreakdown}
                valueFormatter={fmtFull}
                sort="desc"
                barHeight={34}
                gap={10}
                labelWidth="38%"
              />
            </div>
          </CusCard>

          {/* To'lov usullari */}
        </div>
      </div>
    </div>
  );
};

export default LiveMonitorKassa;
