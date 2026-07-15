import { useState } from "react";
import dayjs from "dayjs";
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
import { CusPagination } from "../../../../../../components/ui/table/CusPagination";
import { useCashboxTransactions } from "../hooks/useApiLiveMonitorKassa";
import type { CashboxTransaction, ZReportCashbox } from "../types";
import { span } from "framer-motion/client";

function payLabel(tx: CashboxTransaction): string {
  if (tx.payment_type === "cash") return "Наличные";
  if (tx.payment_type === "card")
    return tx.payment_card_type === "humo" ? "Humo" : "UzCard";
  if (tx.payment_service_type === "uzum") return "UzumBank";
  if (tx.payment_service_type === "click") return "Click";
  if (tx.payment_service_type === "payme") return "Payme";
  return "Онлайн";
}

const PAY_COLOR: Record<string, string> = {
  Наличные: "var(--color-green)",
  UzCard: "var(--color-blue)",
  Humo: "#38bdf8",
  UzumBank: "#ec4899",
  Click: "#1e40af",
  Payme: "#f97316",
  Онлайн: "var(--color-cyan)",
};

const STATUS_CFG = {
  success: {
    label: "Успешно",
    color: "var(--color-green)",
    icon: LuCircleCheck,
  },
  pending: { label: "Ожидание", color: "var(--color-yellow)", icon: LuClock },
  failed: { label: "Ошибка", color: "var(--color-red)", icon: LuCircleX },
} as const;

const columns: ColumnDef<CashboxTransaction>[] = [
  {
    key: "id",
    header: "#id",
    render: (tx) => <span>#{tx.id}</span>,
  },
  {
    key: "created_at",
    header: "Время",
    render: (tx) => (
      <span
        className="font-mono text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        {dayjs(tx.created_at).format("HH:mm:ss")}
      </span>
    ),
  },
  {
    key: "card",
    header: "Карта",
    render: (tx) => (
      <span className="text-xs" style={{ color: "var(--text-2)" }}>
        {tx.card.card}
      </span>
    ),
  },
  {
    key: "operator",
    header: "Кассир",
    render: (tx) => (
      <span className="text-xs" style={{ color: "var(--text-3)" }}>
        {tx.operator.firstname} {tx.operator.lastname}
      </span>
    ),
  },
  {
    key: "amount",
    header: "Сумма",
    align: "right",
    render: (tx) => (
      <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
        {tx.amount.toLocaleString("ru-RU")}
      </span>
    ),
  },
  {
    key: "payment_type",
    header: "Оплата",
    render: (tx) => {
      const label = payLabel(tx);
      const color = PAY_COLOR[label] ?? "var(--text-muted)";
      return (
        <span
          style={{
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
            background: `${color}18`,
            color,
          }}
        >
          {label}
        </span>
      );
    },
  },
  {
    key: "status",
    header: "Статус",
    render: (tx) => {
      const st = STATUS_CFG[tx.status] ?? STATUS_CFG.pending;
      const Icon = st.icon;
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
          <Icon size={13} />
          {st.label}
        </span>
      );
    },
  },
];

interface Props {
  cashboxes: ZReportCashbox[];
}

export function KassaTransactionFeed({ cashboxes }: Props) {
  const [cashboxID, setCashboxID] = useState<number | null>(
    cashboxes[0]?.id ?? null,
  );
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const { transactions, pagination, isLoading } = useCashboxTransactions({
    cashboxID,
    page,
    limit: LIMIT,
  });

  const kassaOptions = cashboxes.map((c) => ({
    label: c.name || `Касса #${c.id}`,
    value: String(c.id),
  }));

  function handleKassaChange(v: unknown) {
    setCashboxID(v ? Number(v) : null);
    setPage(1);
  }

  return (
    <CusCard>
      <CusCardHeader
        icon={LuActivity}
        title={`Живые транзакции -- ${dayjs().format("DD.MM")}`}
        iconColor="var(--color-green)"
        action={
          <div className="flex items-center gap-3">
            <div style={{ width: 160 }}>
              <CusSelect
                options={kassaOptions}
                value={cashboxID ? String(cashboxID) : undefined}
                onChange={handleKassaChange}
                placeholder="Все кассы"
                size="sm"
              />
            </div>
            <div className="flex items-center gap-1.5"></div>
          </div>
        }
      />

      <CusTable<CashboxTransaction>
        data={transactions}
        maxH="400px"
        stickyHeader
        variant="outline"
        colorHeader="var(--bg-hover)"
        size="sm"
        columns={columns}
        isLoading={isLoading}
      />

      {pagination && pagination.totalPages > 1 && (
        <div
          className="px-4 py-3 border-t"
          style={{ borderColor: "var(--border-default)" }}
        >
          <CusPagination
            count={pagination.total}
            pageSize={LIMIT}
            page={pagination.page}
            onPageChange={setPage}
          />
        </div>
      )}
    </CusCard>
  );
}
