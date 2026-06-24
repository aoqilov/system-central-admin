import { useState, useEffect } from "react";
import { LuLink } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";

type RelationStep = "phone" | "otp";

const PHONE_KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["⌫", "0", "CLR"],
] as const;

const MAX_DIGITS = 12; // 998XXXXXXXXX

function formatPhone(digits: string) {
  let result = "+";
  for (let i = 0; i < digits.length; i++) {
    if (i === 3 || i === 5 || i === 8 || i === 10) result += " ";
    result += digits[i];
  }
  return result;
}

function PhoneKey({
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
        height: 80,
        background: bgBase,
        border: red
          ? "1px solid color-mix(in srgb, var(--color-red) 22%, transparent)"
          : "1px solid var(--border-default)",
        color: red ? "var(--color-red)" : "var(--text-default)",
        fontSize: red ? 20 : 28,
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

export function RelationPanel({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState<RelationStep>("phone");
  const [digits, setDigits] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const phone = formatPhone(digits);

  function handlePhoneKey(key: string) {
    if (key === "CLR") { setDigits(""); return; }
    setDigits((prev) => {
      if (key === "⌫") return prev.slice(0, -1);
      if (prev.length >= MAX_DIGITS) return prev;
      return prev + key;
    });
  }

  function handleOtpKey(key: string) {
    if (key === "CLR") { setOtp(""); return; }
    setOtp((prev) => {
      if (key === "⌫") return prev.slice(0, -1);
      if (prev.length >= 4) return prev;
      return prev + key;
    });
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      const handler = step === "phone" ? handlePhoneKey : handleOtpKey;
      if (e.key >= "0" && e.key <= "9") { handler(e.key); return; }
      if (e.key === "Backspace") { handler("⌫"); return; }
      if (e.key === "Escape") { handler("CLR"); return; }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [step]);

  function reset() {
    setStep("phone");
    setDigits("");
    setOtp("");
  }

  function handleSendSms() {
    if (digits.length < MAX_DIGITS) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("otp"); }, 900);
  }

  function handleConfirm() {
    if (otp.trim().length < 4) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); reset(); onSuccess(); }, 900);
  }

  return (
    <div className="flex flex-col gap-3 flex-1">
      {/* Phone display */}
      <div
        className="flex items-end justify-end gap-2 px-4 py-3 rounded-2xl"
        style={{
          background: "var(--bg-second)",
          border: "1px solid var(--border-default)",
          minHeight: 64,
        }}
      >
        <span
          style={{
            fontSize: "1.9rem",
            fontWeight: 700,
            color: digits ? "var(--text-default)" : "var(--text-dim)",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "0.02em",
            lineHeight: 1,
          }}
        >
          {phone}
        </span>
      </div>

      {/* OTP display (only in otp step) */}
      {step === "otp" && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium" style={{ color: "var(--text-default)" }}>
              Tasdiqlash kodi
            </p>
            <button
              className="text-xs underline"
              style={{ color: "var(--text-muted)" }}
              onClick={() => { setStep("phone"); setOtp(""); }}
            >
              Raqamni o'zgartirish
            </button>
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {phone} raqamiga SMS yuborildi
          </p>
          {/* OTP digit boxes */}
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((i) => {
              const ch = otp[i];
              return (
                <div
                  key={i}
                  className="flex-1 flex items-center justify-center rounded-xl font-bold text-2xl"
                  style={{
                    height: 56,
                    background: "var(--bg-input)",
                    border: ch
                      ? "2px solid #3b82f6"
                      : "2px solid var(--border-default)",
                    color: "var(--text-default)",
                    transition: "border-color 0.15s",
                  }}
                >
                  {ch ?? ""}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Numpad — shown for both steps */}
      <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {PHONE_KEYS.flat().map((key, i) => (
          <PhoneKey
            key={`${key}-${i}`}
            label={key}
            onPress={step === "phone" ? handlePhoneKey : handleOtpKey}
            red={key === "⌫" || key === "CLR"}
          />
        ))}
      </div>

      <div className="mt-auto pt-2">
        {step === "phone" ? (
          <CusButton
            colorPalette="blue"
            size="2xl"
            variant="solid"
            className="w-full"
            isDisabled={digits.length < MAX_DIGITS}
            isLoading={loading}
            loadingText="Yuborilmoqda..."
            onClick={handleSendSms}
          >
            SMS yuborish
          </CusButton>
        ) : (
          <CusButton
            colorPalette="green"
            variant="solid"
            className="w-full"
            isLoading={loading}
            loadingText="Tekshirilmoqda..."
            onClick={handleConfirm}
          >
            <LuLink size={16} /> Tasdiqlash
          </CusButton>
        )}
      </div>
    </div>
  );
}
