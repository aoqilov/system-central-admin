import {
  LuCheck,
  LuCircleCheck,
  LuCircleX,
  LuClock,
  LuRotateCcw,
} from "react-icons/lu";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusTable, type ColumnDef } from "@/components/ui/table/CusTable";
import { fmtDateTime } from "@/utils/dateUtils";
import type { DailyZReport } from "@/types/report.types";

function fmt(n: number) {
  return n.toLocaleString();
}

export interface TableRowState {
  smenaYopildi?: boolean;
  isConfirmPending?: boolean;
  isReopenPending?: boolean;
}

interface Props {
  reports: DailyZReport[];
  rowState: Record<number, TableRowState>;
  onSmenaToggle: (id: number) => void;
  onConfirm: (id: number) => void;
  onReject: (id: number) => void;
  onReopen?: (cashboxId: number, reportId: number) => void;
}

export function IncomingKassaTable({
  reports,
  rowState,
  onConfirm,
  onReopen,
}: Props) {
  const columns: ColumnDef<DailyZReport>[] = [
    {
      key: "cashbox",
      header: "Касса / Оператор",
      width: 200,
      render: (row) => {
        const op = row.operator
          ? `${row.operator.firstname} ${row.operator.lastname}`
          : "Оператор не указан";
        return (
          <div>
            <p
              className="font-semibold text-xs"
              style={{ color: "var(--text-default)" }}
            >
              {row.cashbox_name}
            </p>
            <p
              className="text-[11px] mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              {row.cashbox_place}
            </p>
            <p
              className="text-[11px] mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              {op} · {fmtDateTime(row.opened_at)}
            </p>
          </div>
        );
      },
    },
    {
      key: "payments",
      header: "Тип оплаты (сум)",
      children: [
        {
          key: "cash",
          header: "Нал",
          width: 90,
          align: "right",
          render: (r) => <span className="text-xs">{fmt(r.cash_amount)}</span>,
        },
        {
          key: "uzcard",
          header: "UzCard",
          width: 90,
          align: "right",
          render: (r) => (
            <span className="text-xs">{fmt(r.uzcard_amount)}</span>
          ),
        },
        {
          key: "humo",
          header: "Humo",
          width: 90,
          align: "right",
          render: (r) => <span className="text-xs">{fmt(r.humo_amount)}</span>,
        },
        {
          key: "uzum",
          header: "Uzum",
          width: 80,
          align: "right",
          render: (r) => <span className="text-xs">{fmt(r.uzum_amount)}</span>,
        },
        {
          key: "click",
          header: "Click",
          width: 80,
          align: "right",
          render: (r) => <span className="text-xs">{fmt(r.click_amount)}</span>,
        },
        {
          key: "payme",
          header: "Payme",
          width: 80,
          align: "right",
          render: (r) => <span className="text-xs">{fmt(r.payme_amount)}</span>,
        },
      ],
    },
    {
      key: "total",
      header: "Итого",
      width: 110,
      align: "right",
      render: (row) => (
        <span
          className="font-semibold text-xs"
          style={{ color: "var(--text-default)" }}
        >
          {fmt(row.total_amount)}
        </span>
      ),
    },
    {
      key: "txn",
      header: "Транзакции",
      width: 90,
      align: "center",
      render: (row) => (
        <span className="text-xs" style={{ color: "var(--text-2)" }}>
          {row.transactions_count}
        </span>
      ),
    },
    {
      key: "xreports",
      header: "X-отч.",
      width: 70,
      align: "center",
      render: (row) => (
        <span className="text-xs" style={{ color: "var(--text-2)" }}>
          {row.xreports_count}
        </span>
      ),
    },
    {
      key: "status",
      header: "Статус",
      width: 130,
      align: "center",
      render: (row) => {
        const s = row.status;
        if (s === "confirmed")
          return (
            <CusBadge colorPalette="green" variant="subtle" size="sm">
              Подтверждено
            </CusBadge>
          );
        if (s === "cancelled")
          return (
            <CusBadge colorPalette="red" variant="subtle" size="sm">
              Отказ
            </CusBadge>
          );
        if (s === "closed")
          return (
            <CusBadge colorPalette="orange" variant="subtle" size="sm">
              Ожидание
            </CusBadge>
          );
        return (
          <CusBadge colorPalette="blue" variant="subtle" size="sm">
            Активная
          </CusBadge>
        );
      },
    },
    {
      key: "actions",
      header: "Действия",
      width: 200,
      align: "center",
      render: (row) => {
        const s = row.status;
        const rs = rowState[row.id] ?? {};

        if (s === "confirmed") {
          return (
            <div
              className="flex items-center justify-center gap-1 text-xs font-medium"
              style={{ color: "#22c55e" }}
            >
              <LuCircleCheck size={13} /> Подтверждено
            </div>
          );
        }
        if (s === "cancelled") {
          return (
            <div
              className="flex items-center justify-center gap-1 text-xs font-medium"
              style={{ color: "#ef4444" }}
            >
              <LuCircleX size={13} /> Отказ
            </div>
          );
        }
        if (s === "open") {
          return (
            <div
              className="flex items-center justify-center gap-1 text-xs font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              <LuClock size={13} /> Активная смена
            </div>
          );
        }
        // closed — tasdiqlash yoki qayta ochish
        return (
          <div className="flex items-center justify-center gap-1.5">
            <CusButton
              size="xs"
              colorPalette="green"
              variant="outline"
              isLoading={rs.isConfirmPending}
              onClick={() => onConfirm(row.id)}
            >
              <LuCheck size={12} /> Проверил
            </CusButton>
            <CusButton
              size="xs"
              colorPalette="red"
              variant="outline"
              isLoading={rs.isReopenPending}
              onClick={() => onReopen?.(row.cashbox_id, row.id)}
            >
              <LuRotateCcw size={12} /> Продолжить
            </CusButton>
          </div>
        );
      },
    },
  ];

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      <div className="overflow-x-auto">
        <CusTable
          data={reports}
          columns={columns}
          variant="outline"
          size="sm"
          interactive
          stickyHeader
          showColumnBorder
          maxH="calc(100vh - 280px)"
        />
      </div>
    </div>
  );
}
