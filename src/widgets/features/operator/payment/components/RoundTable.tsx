import { LuCheck, LuUsers, LuChevronRight, LuLoader } from "react-icons/lu";
import { PAYMENT_METHOD, fmt, type RoundOrder } from "../types";

interface Props {
  roundOrders: RoundOrder[];
  roundCount: number;
  maxSlots: number;
  goLoading: boolean;
  onGo: () => void;
}

export function RoundTable({ roundOrders, roundCount, maxSlots, goLoading, onGo }: Props) {
  const usedSlots = roundOrders.length;
  const roundFull = usedSlots >= maxSlots;
  const totalAmount = roundOrders.reduce((s, o) => s + o.amount, 0);

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
              {usedSlots} / {maxSlots}
            </span>
          </div>
        </div>

        {/* Body */}
        {roundOrders.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Платежей ещё нет
            </p>
          </div>
        ) : (
          <div className="px-5">
            {roundOrders.map((order, i) => {
              const pm = PAYMENT_METHOD[order.paymentMethod];
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3.5 gap-3"
                  style={
                    i < roundOrders.length - 1
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
                        {order.nfcId}
                      </p>
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-semibold mt-0.5"
                        style={{ background: pm.bg, color: pm.color }}
                      >
                        <pm.Icon size={10} />
                        {pm.label}
                      </span>
                    </div>
                  </div>
                  <p
                    className="font-semibold text-sm shrink-0"
                    style={{ color: "var(--text-default)" }}
                  >
                    {fmt(order.amount)} сум
                  </p>
                </div>
              );
            })}

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
                  {usedSlots} чел.
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
        disabled={roundOrders.length === 0 || goLoading}
        className="w-full rounded-2xl flex items-center justify-center gap-3 font-bold transition-all active:scale-[0.97]"
        style={{
          height: 72,
          fontSize: 22,
          letterSpacing: "0.08em",
          background: roundOrders.length > 0 ? "#3b82f6" : "var(--bg-hover)",
          color: roundOrders.length > 0 ? "#fff" : "var(--text-muted)",
          border: "none",
          cursor: roundOrders.length > 0 && !goLoading ? "pointer" : "not-allowed",
          opacity: roundOrders.length > 0 ? 1 : 0.5,
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
