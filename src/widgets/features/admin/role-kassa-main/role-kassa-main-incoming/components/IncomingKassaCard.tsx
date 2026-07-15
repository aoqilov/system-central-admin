import {
  LuBanknote,
  LuWallet,
  LuCreditCard,
  LuSmartphone,
  LuTrendingUp,
  LuUserCheck,
  LuCheck,
  LuX,
  LuFileText,
  LuCircleCheck,
  LuCircleX,
  LuClock,
} from "react-icons/lu";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { fmtDateTime } from "@/utils/dateUtils";
import type { DailyZReport } from "@/types/report.types";
import { IncomingStatCard } from "./IncomingStatCard";

function fmt(n: number) {
  return n.toLocaleString();
}

interface Props {
  report: DailyZReport;
  isConfirmPending?: boolean;
  isReopenPending?: boolean;
  onConfirm: () => void;
  onReject?: () => void;
  onReopen?: () => void;
}

export function IncomingKassaCard({
  report,
  isConfirmPending,
  isReopenPending,
  onConfirm,
  onReopen,
}: Props) {

  const isConfirmed = report.status === "confirmed";
  const isCancelled = report.status === "cancelled";
  const isPending = report.status === "closed"; // closed = waiting for confirmation

  const kassaLabel = report.cashbox_name;
  const op = report.operator
    ? `${report.operator.firstname} ${report.operator.lastname}`
    : "Оператор не указан";

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "var(--bg-second)",
        borderColor: isConfirmed
          ? "#22c55e50"
          : isCancelled
            ? "#ef444450"
            : "var(--border-default)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-3.5 border-b"
        style={{
          borderColor: isConfirmed
            ? "#22c55e30"
            : isCancelled
              ? "#ef444430"
              : "var(--border-default)",
          background: isConfirmed
            ? "#22c55e08"
            : isCancelled
              ? "#ef444408"
              : "transparent",
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: isConfirmed
              ? "#22c55e18"
              : isCancelled
                ? "#ef444418"
                : "var(--bg-hover)",
          }}
        >
          {isConfirmed ? (
            <LuCircleCheck size={16} style={{ color: "#22c55e" }} />
          ) : isCancelled ? (
            <LuCircleX size={16} style={{ color: "#ef4444" }} />
          ) : (
            <LuFileText size={16} style={{ color: "var(--text-muted)" }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-semibold text-sm"
              style={{ color: "var(--text-default)" }}
            >
              {kassaLabel}
            </span>
            <CusBadge
              colorPalette={
                isConfirmed ? "green" : isCancelled ? "red" : "gray"
              }
              variant="subtle"
              size="sm"
            >
              {isConfirmed
                ? "Подтверждено"
                : isCancelled
                  ? "Отказ"
                  : "Ожидание"}
            </CusBadge>
          </div>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {op} · {fmtDateTime(report.opened_at)}
            {report.closed_at
              ? ` → ${fmtDateTime(report.closed_at)}`
              : ""} · {report.transactions_count} транзакции
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p
            className="font-bold text-sm"
            style={{ color: "var(--text-default)" }}
          >
            {fmt(report.total_amount)} сум
          </p>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            итого
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="overflow-x-auto px-4 py-4">
        <div className="flex gap-3">
          <IncomingStatCard
            icon={LuBanknote}
            label="Выручка за день"
            value={fmt(report.total_amount)}
            sub="сум"
            color="#3b82f6"
          />
          <IncomingStatCard
            icon={LuWallet}
            label="Наличные"
            value={fmt(report.cash_amount)}
            sub="сум"
            color="#22c55e"
          />
          <IncomingStatCard
            icon={LuCreditCard}
            label="UzCard"
            value={fmt(report.uzcard_amount)}
            sub="сум"
            color="#3b82f6"
          />
          <IncomingStatCard
            icon={LuCreditCard}
            label="Humo"
            value={fmt(report.humo_amount)}
            sub="сум"
            color="#8b5cf6"
          />
          <IncomingStatCard
            icon={LuSmartphone}
            label="UzumBank"
            value={fmt(report.uzum_amount)}
            sub="сум"
            color="#06b6d4"
          />
          <IncomingStatCard
            icon={LuSmartphone}
            label="Click"
            value={fmt(report.click_amount)}
            sub="сум"
            color="#f97316"
          />
          <IncomingStatCard
            icon={LuSmartphone}
            label="Payme"
            value={fmt(report.payme_amount)}
            sub="сум"
            color="#ef4444"
          />
          <IncomingStatCard
            icon={LuTrendingUp}
            label="Продано карт"
            value={String(report.activated_cards_count)}
            sub="сегодня"
            color="#eab308"
          />
          <IncomingStatCard
            icon={LuUserCheck}
            label="Рег. карт"
            value={String(report.relationed_cards_count)}
            sub="сегодня"
            color="#06b6d4"
          />
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-end gap-2 px-4 py-3 border-t"
        style={{ borderColor: "var(--border-default)" }}
      >
        {isPending ? (
          <>
            {/* <CusButton
              size="xs"
              colorPalette={smenaYopildi ? "green" : "gray"}
              variant={smenaYopildi ? "surface" : "outline"}
              onClick={() => setSmenaYopildi((p) => !p)}
            >
              {smenaYopildi ? <LuCheck size={13} /> : <LuClock size={13} />}
              Смена закрыта?
            </CusButton> */}
            <CusButton
              size="xs"
              colorPalette="green"
              variant="outline"
              isLoading={isConfirmPending}
              onClick={onConfirm}
            >
              <LuCheck size={13} /> Проверил
            </CusButton>
            <CusButton
              size="xs"
              colorPalette="red"
              variant="outline"
              isLoading={isReopenPending}
              onClick={() => onReopen?.()}
            >
              <LuX size={13} /> Продолжить смена !
            </CusButton>
          </>
        ) : isConfirmed ? (
          <div
            className="flex items-center gap-1.5 text-sm font-medium py-1"
            style={{ color: "#22c55e" }}
          >
            <LuCircleCheck size={15} /> Подтверждено
          </div>
        ) : (
          <div
            className="flex items-center gap-1.5 text-sm font-medium py-1"
            style={{ color: "#3b82f6" }}
          >
            <LuClock size={15} /> Активная смена
          </div>
        )}
      </div>
    </div>
  );
}
