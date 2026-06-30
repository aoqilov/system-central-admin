import { useState } from "react";
import { LuActivity, LuCircleCheck, LuCircleX, LuClock } from "react-icons/lu";
import {
  CusCard,
  CusCardHeader,
} from "../../../../../../components/shared/card/CusCard";
import {
  CusTable,
  type ColumnDef,
} from "../../../../../../components/ui/table/CusTable";
import CusSelect from "../../../../../../components/ui/select/CusSelect";

type PaymentType = "Наличные" | "UzCard" | "Карта";
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
  Наличные: "var(--color-green)",
  UzCard: "var(--color-blue)",
  Карта: "var(--color-purple)",
};

const STATUS_CFG: Record<
  TxStatus,
  { label: string; color: string; icon: typeof LuCircleCheck }
> = {
  success: {
    label: "Успешно",
    color: "var(--color-green)",
    icon: LuCircleCheck,
  },
  pending: { label: "Ожидание", color: "var(--color-yellow)", icon: LuClock },
  failed: { label: "Ошибка", color: "var(--color-red)", icon: LuCircleX },
};

const transactions: Transaction[] = [
  {
    id: 1,
    time: "17:44",
    kassaName: "Главная касса",
    cashier: "Aziz N.",
    amount: 45_000,
    paymentType: "Наличные",
    status: "success",
  },
  {
    id: 2,
    time: "17:43",
    kassaName: "Касса #7",
    cashier: "Sherzod T.",
    amount: 120_000,
    paymentType: "UzCard",
    status: "success",
  },
  {
    id: 3,
    time: "17:42",
    kassaName: "Касса #2",
    cashier: "Dilnoza M.",
    amount: 60_000,
    paymentType: "Карта",
    status: "pending",
  },
  {
    id: 4,
    time: "17:41",
    kassaName: "Касса #4",
    cashier: "Jasur K.",
    amount: 90_000,
    paymentType: "Наличные",
    status: "success",
  },
  {
    id: 5,
    time: "17:40",
    kassaName: "Касса #5",
    cashier: "Feruza O.",
    amount: 30_000,
    paymentType: "UzCard",
    status: "success",
  },
  {
    id: 6,
    time: "17:39",
    kassaName: "Главная касса",
    cashier: "Aziz N.",
    amount: 75_000,
    paymentType: "Карта",
    status: "failed",
  },
  {
    id: 7,
    time: "17:38",
    kassaName: "Касса #2",
    cashier: "Dilnoza M.",
    amount: 45_000,
    paymentType: "Наличные",
    status: "success",
  },
  {
    id: 8,
    time: "17:37",
    kassaName: "Касса #7",
    cashier: "Sherzod T.",
    amount: 150_000,
    paymentType: "UzCard",
    status: "success",
  },
  {
    id: 9,
    time: "17:36",
    kassaName: "Касса #4",
    cashier: "Jasur K.",
    amount: 60_000,
    paymentType: "Карта",
    status: "success",
  },
  {
    id: 10,
    time: "17:35",
    kassaName: "Касса #5",
    cashier: "Feruza O.",
    amount: 45_000,
    paymentType: "Наличные",
    status: "success",
  },
  {
    id: 11,
    time: "17:34",
    kassaName: "Главная касса",
    cashier: "Aziz N.",
    amount: 90_000,
    paymentType: "UzCard",
    status: "success",
  },
  {
    id: 12,
    time: "17:33",
    kassaName: "Касса #7",
    cashier: "Sherzod T.",
    amount: 30_000,
    paymentType: "Наличные",
    status: "pending",
  },
  {
    id: 13,
    time: "17:32",
    kassaName: "Касса #2",
    cashier: "Dilnoza M.",
    amount: 120_000,
    paymentType: "Карта",
    status: "success",
  },
  {
    id: 14,
    time: "17:31",
    kassaName: "Касса #4",
    cashier: "Jasur K.",
    amount: 45_000,
    paymentType: "UzCard",
    status: "success",
  },
  {
    id: 15,
    time: "17:30",
    kassaName: "Касса #5",
    cashier: "Feruza O.",
    amount: 75_000,
    paymentType: "Наличные",
    status: "success",
  },
];

const columns: ColumnDef<Transaction>[] = [
  {
    key: "time",
    header: "Время",
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
    header: "Касса",
    render: (tx) => (
      <span style={{ color: "var(--text-2)" }}>{tx.kassaName}</span>
    ),
  },
  {
    key: "cashier",
    header: "Кассир",
    render: (tx) => (
      <span style={{ color: "var(--text-3)" }}>{tx.cashier}</span>
    ),
  },
  {
    key: "amount",
    header: "Сумма",
    align: "right",
    render: (tx) => (
      <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
        {tx.amount.toLocaleString()}
      </span>
    ),
  },
  {
    key: "paymentType",
    header: "Оплата",
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
    header: "Статус",
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

const KASSA_OPTIONS = Array.from(new Set(transactions.map((t) => t.kassaName))).map(
  (name) => ({ label: name, value: name })
);

export function KassaTransactionFeed() {
  const [kassaFilter, setKassaFilter] = useState<string>("");

  const filtered = kassaFilter
    ? transactions.filter((t) => t.kassaName === kassaFilter)
    : transactions;

  return (
    <CusCard>
      <CusCardHeader
        icon={LuActivity}
        title="Живые транзакции"
        iconColor="var(--color-green)"
        action={
          <div className="flex items-center gap-3">
            <div style={{ width: 160 }}>
              <CusSelect
                options={KASSA_OPTIONS}
                value={kassaFilter || undefined}
                onChange={(v) => setKassaFilter(v as string)}
                placeholder="Все кассы"
                size="sm"
                clearable
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "var(--color-green)" }}
              />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Live
              </span>
            </div>
          </div>
        }
      />
      <CusTable<Transaction>
        data={filtered}
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
