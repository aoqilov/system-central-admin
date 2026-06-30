import { LuClock, LuCircleCheck } from "react-icons/lu";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusButton } from "@/components/ui/buttons/CusButton";

interface Props {
  kassaCount: number;
  kartaSum: number;
  totalWithDiscount: number;
  sentAt: string | null;
  acceptedAt: string | null;
  onAccept: () => void;
}

export function BuxAcceptBar({
  kassaCount,
  kartaSum,
  totalWithDiscount,
  sentAt,
  acceptedAt,
  onAccept,
}: Props) {
  return (
    <div
      className="rounded-2xl border p-4 flex flex-col tablet:flex-row tablet:items-center gap-4"
      style={{
        background: acceptedAt ? "#22c55e0a" : "var(--bg-second)",
        borderColor: acceptedAt ? "#22c55e40" : "var(--border-default)",
      }}
    >
      <div className="flex-1 flex flex-col gap-1.5">
        {sentAt && (
          <div className="flex items-center gap-2">
            <LuClock size={14} style={{ color: "var(--text-muted)" }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Отправлено кассой:{" "}
              <span className="font-semibold" style={{ color: "var(--text-default)" }}>
                {sentAt}
              </span>
            </span>
          </div>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Касс: <b style={{ color: "var(--text-default)" }}>{kassaCount}</b>
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Продано карт:{" "}
            <b style={{ color: "#eab308" }}>{kartaSum} шт.</b>
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Выручка:{" "}
            <b style={{ color: "#22c55e" }}>
              {(totalWithDiscount / 1_000_000).toFixed(2)} млн сум
            </b>
          </span>
        </div>
      </div>

      {acceptedAt ? (
        <div className="flex items-center gap-2 shrink-0">
          <LuCircleCheck size={16} color="#22c55e" />
          <span className="text-sm font-semibold" style={{ color: "#22c55e" }}>
            Принято
          </span>
          <CusBadge colorPalette="green" variant="subtle" size="sm">
            {acceptedAt}
          </CusBadge>
        </div>
      ) : (
        <CusButton
          colorPalette="green"
          size="sm"
          className="shrink-0"
          onClick={onAccept}
        >
          <LuCircleCheck size={14} /> Принять отчёт
        </CusButton>
      )}
    </div>
  );
}
