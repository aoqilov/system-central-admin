import type React from "react";
import type { PayType } from "../types";
import { LuBanknote, LuCreditCard, LuSmartphone, LuX } from "react-icons/lu";

interface Props {
  amount: string;
  payType: PayType;
  onCancel: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

const PAY_INFO: Record<PayType, { label: string; Icon: React.ElementType }> = {
  naqd: { label: "Naqd pul", Icon: LuBanknote },
  karta: { label: "Karta", Icon: LuCreditCard },
  online: { label: "Online to'lov", Icon: LuSmartphone },
};

export function ConfirmSheet({ amount, payType, onCancel, onConfirm, isProcessing }: Props) {
  const formatted = Number(amount || "0").toLocaleString("uz-UZ");
  const { label, Icon } = PAY_INFO[payType];

  return (
    <div
      className="fixed inset-0 flex flex-col justify-end"
      style={{ zIndex: 250, background: "rgba(0,0,0,0.65)" }}
      onPointerDown={isProcessing ? undefined : onCancel}
    >
      <div
        className="flex flex-col gap-5 p-6"
        style={{
          background: "#0e1521",
          borderTop: "1px solid #1c2532",
          borderRadius: "20px 20px 0 0",
          animation: "cfSlideUp 0.2s ease",
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg" style={{ color: "#e8edf5" }}>
            To'lovni tasdiqlash
          </span>
          {!isProcessing && (
            <button
              onClick={onCancel}
              className="flex items-center justify-center rounded-xl"
              style={{ width: 40, height: 40, background: "#1c2532", color: "#7a8ba6" }}
            >
              <LuX size={18} />
            </button>
          )}
        </div>

        {/* Summary card */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: "#0b1018", border: "1px solid #1c2532" }}
        >
          <div className="flex items-baseline justify-between">
            <span className="text-base" style={{ color: "#7a8ba6" }}>
              Summa
            </span>
            <span
              className="font-bold"
              style={{
                color: "#e8edf5",
                fontSize: 32,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              {formatted}{" "}
              <span
                style={{ fontSize: 18, fontWeight: 400, color: "#4a6580" }}
              >
                UZS
              </span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base" style={{ color: "#7a8ba6" }}>
              To'lov turi
            </span>
            <div className="flex items-center gap-2">
              <Icon size={18} style={{ color: "#7a8ba6" }} />
              <span className="font-semibold text-base" style={{ color: "#e8edf5" }}>
                {label}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center rounded-xl font-semibold"
            style={{
              height: 56,
              background: "transparent",
              border: "1px solid #1c2532",
              color: "#7a8ba6",
              opacity: isProcessing ? 0.4 : 1,
              touchAction: "manipulation",
            }}
          >
            Bekor qilish
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-xl font-bold"
            style={{
              flex: 2,
              height: 56,
              background: "#2ea36b",
              color: "#fff",
              border: "none",
              opacity: isProcessing ? 0.8 : 1,
              touchAction: "manipulation",
            }}
          >
            {isProcessing ? (
              <>
                <span
                  className="rounded-full border-2 animate-spin"
                  style={{
                    width: 20,
                    height: 20,
                    borderColor: "rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                  }}
                />
                Bajarilmoqda...
              </>
            ) : (
              "✓  Tasdiqlash"
            )}
          </button>
        </div>
      </div>
      <style>{`@keyframes cfSlideUp { from { transform:translateY(100%) } to { transform:translateY(0) } }`}</style>
    </div>
  );
}
