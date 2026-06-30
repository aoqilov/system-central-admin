import {
  LuCheck,
  LuX,
  LuClock,
  LuCircleCheck,
  LuCircleX,
} from "react-icons/lu";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusTable, type ColumnDef } from "@/components/ui/table/CusTable";
import { fmtDateTime } from "@/utils/dateUtils";
import type { DailyZReport } from "../types";

function fmt(n: number) {
  return n.toLocaleString();
}

export interface TableRowState {
  smenaYopildi?: boolean;
  isConfirmPending?: boolean;
  isRejectPending?: boolean;
}

interface Props {
  reports: DailyZReport[];
  rowState: Record<number, TableRowState>;
  onSmenaToggle: (id: number) => void;
  onConfirm: (id: number) => void;
  onReject: (id: number) => void;
}

export function IncomingKassaTable({
  reports,
  rowState,
  onSmenaToggle,
  onConfirm,
  onReject,
}: Props) {
  const columns: ColumnDef<DailyZReport>[] = [
    {
      key: "cashbox",
      header: "Касса",
      width: 180,
      render: (row) => {
        const op = `${row.operator.firstname} ${row.operator.lastname}`;
        const name = row.cashbox_name;
        return (
          <div>
            <p
              className="font-semibold text-xs"
              style={{ color: "var(--text-default)" }}
            >
              {name}
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
      header: "Тип оплаты",
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
      key: "status",
      header: "Статус",
      width: 120,
      align: "center",
      render: (row) => {
        const s = row.status;
        return (
          <CusBadge
            colorPalette={
              s === "confirmed" ? "green" : s === "cancelled" ? "red" : "gray"
            }
            variant="subtle"
            size="sm"
          >
            {s === "confirmed"
              ? "Подтверждено"
              : s === "cancelled"
                ? "Отказ"
                : "Ожидание"}
          </CusBadge>
        );
      },
    },
    {
      key: "actions",
      header: "Действия",
      width: 230,
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
        if (s === "cancelled" || s === "open") {
          return (
            <div
              className="flex items-center justify-center gap-1 text-xs font-medium"
              style={{ color: "#ef4444" }}
            >
              <LuCircleX size={13} /> Отклонено
            </div>
          );
        }
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
            {/* <CusButton
              size="xs"
              colorPalette={rs.smenaYopildi ? "green" : "gray"}
              variant={rs.smenaYopildi ? "surface" : "outline"}
              onClick={() => onSmenaToggle(row.id)}
            >
              {rs.smenaYopildi ? (
                <LuCheck size={12} />
              ) : (
                <LuClock size={12} />
              )}
              Смена
            </CusButton> */}

            {/* <CusButton
              size="xs"
              colorPalette="red"
              variant="outline"
              isLoading={rs.isRejectPending}
              onClick={() => onReject(row.id)}
            >
              <LuX size={12} /> Отказ
            </CusButton> */}
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
