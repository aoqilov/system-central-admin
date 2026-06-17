import { LuActivity, LuCircleCheck, LuCircleX, LuClock } from "react-icons/lu";
import {
  CusCard,
  CusCardHeader,
} from "../../../../../../components/shared/card/CusCard";
import {
  CusTable,
  type ColumnDef,
} from "../../../../../../components/ui/table/CusTable";

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

const columns: ColumnDef<Transaction>[] = [
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
      <span style={{ color: "var(--text-2)" }}>{tx.kassaName}</span>
    ),
  },
  {
    key: "cashier",
    header: "Kassir",
    render: (tx) => (
      <span style={{ color: "var(--text-3)" }}>{tx.cashier}</span>
    ),
  },
  {
    key: "amount",
    header: "Miqdor",
    align: "right",
    render: (tx) => (
      <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
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
];

export function KassaTransactionFeed() {
  return (
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
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
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
        columns={columns}
      />
    </CusCard>
  );
}
