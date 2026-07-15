import { LuCircleCheck, LuClock } from "react-icons/lu";
import { CusTable, type ColumnDef } from "@/components/ui/table/CusTable";
import { CusPagination } from "@/components/ui/table/CusPagination";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { fmtDateTime } from "@/utils/dateUtils";
import type { CashboxTransaction } from "../types";
import { EmptySmena } from "./EmptySmena";

function payLabel(r: CashboxTransaction): string {
  if (r.payment_type === "cash") return "Наличные";
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

const COLUMNS: ColumnDef<CashboxTransaction>[] = [
  {
    key: "id",
    header: "#id",
    width: 30,
    render: (row) => <span>{row.id}</span>,
  },
  {
    key: "created_at",
    header: "Время",
    width: 130,
    render: (row) => (
      <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
        {fmtDateTime(row.created_at)}
      </span>
    ),
  },
  {
    key: "card",
    header: "Карта",
    render: (row) => (
      <span className="font-mono text-xs" style={{ color: "var(--text-default)" }}>
        {row.card.card}
      </span>
    ),
  },
  {
    key: "operator",
    header: "Кассир",
    render: (row) => (
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
        {row.operator.firstname} {row.operator.lastname}
      </span>
    ),
  },
  {
    key: "payment_type",
    header: "Тип оплаты",
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
      <span className="font-semibold text-sm" style={{ color: "var(--text-default)" }}>
        {row.amount.toLocaleString()} сум
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (row) => (
      <CusBadge
        colorPalette={row.status === "success" ? "green" : row.status === "failed" ? "red" : "yellow"}
        variant="subtle"
        size="sm"
      >
        {row.status === "success" ? (
          <><LuCircleCheck size={11} /> Выполнено</>
        ) : row.status === "failed" ? (
          <><LuClock size={11} /> Ошибка</>
        ) : (
          <><LuClock size={11} /> В ожидании</>
        )}
      </CusBadge>
    ),
  },
];

interface Props {
  hasActiveSmena: boolean;
  transactions: CashboxTransaction[];
  txTotal: number;
  txLoading: boolean;
  txPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onGoToOtchet: () => void;
}

export function TransactionsTable({
  hasActiveSmena,
  transactions,
  txTotal,
  txLoading,
  txPage,
  pageSize,
  onPageChange,
  onGoToOtchet,
}: Props) {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
    >
      <div
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: "var(--border-default)" }}
      >
        <p className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>
          Транзакции
        </p>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {txTotal} записей
        </span>
      </div>

      {!hasActiveSmena ? (
        <EmptySmena onGoToOtchet={onGoToOtchet} />
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
          {txTotal > pageSize && (
            <div
              className="flex justify-end px-4 py-3 border-t"
              style={{ borderColor: "var(--border-default)" }}
            >
              <CusPagination
                count={txTotal}
                pageSize={pageSize}
                page={txPage}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
