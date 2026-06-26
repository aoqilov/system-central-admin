import { LuCheck, LuX } from "react-icons/lu";
import { fmt, type DialogState } from "../types";

interface Props {
  open: boolean;
  state: DialogState;
  message: string;
  amount?: number;
  cardBalance?: number;
  onClose: () => void;
}

export function PaymentDialog({
  open,
  state,
  message,
  amount,
  cardBalance,
  onClose,
}: Props) {
  if (!open) return null;
  const loading = state === "loading";
  const success = state === "success";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
      onClick={loading ? undefined : onClose}
    >
      <div
        className="w-full max-w-[320px] rounded-2xl p-6 flex flex-col items-center gap-4"
        style={{
          background: "var(--bg-main)",
          border: "1px solid var(--border-default)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {loading && (
          <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        )}
        {success && (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "#22c55e20" }}
          >
            <LuCheck size={32} style={{ color: "#22c55e" }} />
          </div>
        )}
        {!loading && !success && (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "#ef444420" }}
          >
            <LuX size={32} style={{ color: "#ef4444" }} />
          </div>
        )}

        <div className="text-center space-y-1">
          <p
            className="text-base font-bold"
            style={{
              color: loading
                ? "var(--text-default)"
                : success
                  ? "#22c55e"
                  : "#ef4444",
            }}
          >
            {loading ? "Проверяется..." : message}
          </p>
          {success && amount !== undefined && (
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--text-default)" }}
            >
              {fmt(amount)}{" "}
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                сум
              </span>
            </p>
          )}
          {state === "insufficient" && cardBalance !== undefined && (
            <div
              className="mt-2 px-4 py-2.5 rounded-xl"
              style={{ background: "var(--bg-hover)" }}
            >
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Баланс карты
              </p>
              <p
                className="text-lg font-bold mt-0.5"
                style={{ color: "var(--text-default)" }}
              >
                {fmt(cardBalance)}{" "}
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  сум
                </span>
              </p>
            </div>
          )}
          {loading && (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Пожалуйста, подождите...
            </p>
          )}
        </div>

        {!loading && (
          <button
            onClick={onClose}
            className="w-full rounded-xl font-semibold text-sm transition-all active:scale-[0.97]"
            style={{
              height: 48,
              background: success ? "#22c55e18" : "#ef444418",
              color: success ? "#22c55e" : "#ef4444",
              border: `1px solid ${success ? "#22c55e40" : "#ef444440"}`,
            }}
          >
            Закрыть
          </button>
        )}
      </div>
    </div>
  );
}
