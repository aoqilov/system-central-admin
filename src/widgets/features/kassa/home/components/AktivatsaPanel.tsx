import { useState, useEffect } from "react";
import { CusButton } from "@/components/ui/buttons/CusButton";
import type { PayType, KartaType } from "../types";
import { topupCard } from "../api/apiKassaHomePay";

export type { PayType, KartaType };

interface Props {
  nfc: string;
  payType: PayType;
  kartaType: KartaType;
  provider: "payme" | "click" | "uzum-bank";
  onSuccess: () => void;
}

const KEYS_TOP = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
] as const;

const KEYS_BOT = [
  ["0", "00"],
  ["⌫", "CLR"],
] as const;

function formatSumma(raw: string) {
  if (!raw) return "";
  return raw.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function NumKey({
  label,
  onPress,
  red = false,
}: {
  label: string;
  onPress: (key: string) => void;
  red?: boolean;
}) {
  const bgBase = red
    ? "color-mix(in srgb, var(--color-red) 10%, transparent)"
    : "var(--bg-hover)";
  const bgHover = red
    ? "color-mix(in srgb, var(--color-red) 18%, transparent)"
    : "var(--bg-input)";
  return (
    <button
      onPointerDown={(e) => { e.preventDefault(); onPress(label); }}
      className="flex items-center justify-center rounded-xl font-bold select-none"
      style={{
        height: 68,
        background: bgBase,
        border: red
          ? "1px solid color-mix(in srgb, var(--color-red) 22%, transparent)"
          : "1px solid var(--border-default)",
        color: red ? "var(--color-red)" : "var(--text-default)",
        fontSize: red ? 22 : 32,
        fontVariantNumeric: "tabular-nums",
        touchAction: "manipulation",
        userSelect: "none",
        WebkitUserSelect: "none",
        cursor: "pointer",
      }}
      onPointerEnter={(e) => { e.currentTarget.style.background = bgHover; }}
      onPointerLeave={(e) => { e.currentTarget.style.background = bgBase; }}
    >
      {label}
    </button>
  );
}

export function AktivatsaPanel({ nfc, payType, kartaType, provider, onSuccess }: Props) {
  const [summa, setSumma]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key >= "0" && e.key <= "9") { handleKey(e.key); return; }
      if (e.key === "Backspace") { handleKey("⌫"); return; }
      if (e.key === "Escape") { handleKey("CLR"); return; }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleKey(key: string) {
    setError(null);
    if (key === "CLR") { setSumma(""); return; }
    setSumma((prev) => {
      if (key === "⌫") return prev.slice(0, -1);
      if (key === "00") {
        if (!prev) return prev;
        const next = prev + "00";
        return next.length > 12 ? prev : next;
      }
      if (key === "0" && !prev) return prev;
      const next = prev + key;
      return next.length > 12 ? prev : next;
    });
  }

  async function handleSubmit() {
    if (!nfc || !summa) return;
    setLoading(true);
    setError(null);
    try {
      await topupCard({
        nfc,
        amount: Number(summa),
        payment_type: payType === "naqd" ? "cash" : payType === "karta" ? "card" : "online",
        ...(payType === "karta" && { payment_card_type: kartaType }),
        ...(payType === "online" && { payment_service_type: provider === "uzum-bank" ? "uzum" : provider }),
      });
      setSumma("");
      onSuccess();
    } catch {
      setError("To'lov amalga oshmadi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  }

  const display = summa ? formatSumma(summa) : "0";

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto flex flex-col gap-3">
        {/* Amount display */}
        <div
          className="flex items-end justify-end gap-2 px-4 py-3 rounded-2xl"
          style={{
            background: "var(--bg-second)",
            border: `1px solid ${error ? "#ef444440" : "var(--border-default)"}`,
            minHeight: 64,
          }}
        >
          <span
            style={{
              fontSize: summa.length > 9 ? "1.6rem" : "2.2rem",
              fontWeight: 700,
              color: summa ? "var(--text-default)" : "var(--text-dim)",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.01em",
              lineHeight: 1,
              transition: "font-size 0.1s",
            }}
          >
            {display}
          </span>
          <span
            className="pb-1 font-semibold text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            UZS
          </span>
        </div>

        {error && (
          <p className="text-xs text-center" style={{ color: "#ef4444" }}>
            {error}
          </p>
        )}

        {/* Numpad */}
        <div className="flex flex-col gap-1.5">
          <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {KEYS_TOP.flat().map((key, i) => (
              <NumKey key={`${key}-${i}`} label={key} onPress={handleKey} />
            ))}
          </div>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            {KEYS_BOT.flat().map((key, i) => {
              const isRed = key === "⌫" || key === "CLR";
              return <NumKey key={`${key}-${i}`} label={key} onPress={handleKey} red={isRed} />;
            })}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="shrink-0 pt-3">
        <CusButton
          size="2xl"
          colorPalette="blue"
          variant="solid"
          className="w-full"
          isDisabled={!summa || !nfc}
          isLoading={loading}
          loadingText="Bajarilmoqda..."
          onClick={handleSubmit}
        >
          Aktivatsa / To'ldirish
        </CusButton>
      </div>
    </div>
  );
}
