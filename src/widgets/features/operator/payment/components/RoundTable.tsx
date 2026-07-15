import { LuCheck, LuUsers, LuChevronRight, LuLoader } from "react-icons/lu";
import { fmt, type RoundTransaction } from "../types";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CARD_TYPE_META } from "@/widgets/features/admin/nfc/nfc-classic/nfc.types";

interface Props {
  transactions: RoundTransaction[];
  peopleCount: number;
  totalAmount: number;
  roundCount: number;
  maxSlots: number;
  goLoading: boolean;
  onGo: () => void;
}

export function RoundTable({
  transactions,
  peopleCount,
  totalAmount,
  roundCount,
  maxSlots,
  goLoading,
  onGo,
}: Props) {
  const roundFull = peopleCount >= maxSlots;

  return (
    <div className="flex flex-col gap-3">
      {/* Round table */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div className="flex items-center gap-4 justify-between w-full">
            <p
              className="text-xl font-semibold"
              style={{ color: "var(--text-default)" }}
            >
              Round
            </p>
            <span
              className="px-2.5 py-1 rounded-lg text-2xl font-bold"
              style={{ background: "#3b82f6", color: "#fff" }}
            >
              #{roundCount}
            </span>
            <span
              className="px-2 py-0.5 rounded-lg text-2xl font-bold"
              style={{
                background: roundFull ? "#22c55e18" : "#3b82f618",
                color: roundFull ? "#22c55e" : "#60a5fa",
              }}
            >
              {peopleCount} / {maxSlots}
            </span>
          </div>
        </div>

        {/* Body */}
        {transactions.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Платежей ещё нет
            </p>
          </div>
        ) : (
          <div className="px-5">
            {transactions.map((tx, i) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3.5 gap-3"
                style={
                  i < transactions.length - 1
                    ? { borderBottom: "1px solid var(--border-default)" }
                    : undefined
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "#22c55e18" }}
                  >
                    <LuCheck size={16} style={{ color: "#22c55e" }} />
                  </div>
                  <div>
                    <p
                      className="text-sm font-mono font-semibold"
                      style={{ color: "var(--text-default)" }}
                    >
                      {tx.card.card}
                    </p>
                    <CusBadge
                      colorPalette={CARD_TYPE_META[tx.card.type]?.scheme ?? "gray"}
                      size="xs"
                      variant="subtle"
                    >
                      {CARD_TYPE_META[tx.card.type]?.label ?? tx.card.type}
                    </CusBadge>
                  </div>
                </div>
                <p
                  className="font-semibold text-sm shrink-0"
                  style={{ color: "var(--text-default)" }}
                >
                  {fmt(tx.amount)} сум
                </p>
              </div>
            ))}

            {/* Footer total */}
            <div
              className="flex items-center justify-between py-4 border-t"
              style={{ borderColor: "var(--border-default)" }}
            >
              <div className="flex items-center gap-1.5">
                <LuUsers size={14} style={{ color: "var(--text-muted)" }} />
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-2)" }}
                >
                  {peopleCount} чел.
                </p>
              </div>
              <p
                className="font-bold text-base"
                style={{ color: "var(--text-default)" }}
              >
                {fmt(totalAmount)} сум
              </p>
            </div>
          </div>
        )}
      </div>

      {/* GO button */}
      <button
        onClick={onGo}
        disabled={transactions.length === 0 || goLoading}
        className="w-full rounded-2xl flex items-center justify-center gap-3 font-bold transition-all active:scale-[0.97]"
        style={{
          height: 72,
          fontSize: 22,
          letterSpacing: "0.08em",
          background: transactions.length > 0 ? "#3b82f6" : "var(--bg-hover)",
          color: transactions.length > 0 ? "#fff" : "var(--text-muted)",
          border: "none",
          cursor: transactions.length > 0 && !goLoading ? "pointer" : "not-allowed",
          opacity: transactions.length > 0 ? 1 : 0.5,
        }}
      >
        {goLoading ? (
          <LuLoader size={24} className="animate-spin" />
        ) : (
          <>GO <LuChevronRight size={24} /></>
        )}
      </button>
    </div>
  );
}
