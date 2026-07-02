import { useState, useRef, useEffect } from "react";
import { LuWifi } from "react-icons/lu";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { fmt } from "../types";

interface Props {
  roundFull: boolean;
  dialogOpen: boolean;
  focusTrigger: number;
  price: number;
  maxSlots: number;
  onSubmit: (nfcId: string) => void;
}

export function NfcZone({ roundFull, dialogOpen, focusTrigger, price, maxSlots, onSubmit }: Props) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial autofocus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Autofocus after each dialog close
  useEffect(() => {
    if (!roundFull) inputRef.current?.focus();
  }, [focusTrigger, roundFull]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    const id = value.trim();
    if (id.length >= 4 && !roundFull && !dialogOpen) {
      onSubmit(id);
      setValue("");
    }
  }

  const active = focused && !roundFull;

  return (
    <div className="flex flex-col gap-3">
      {/* Price card */}
      <div
        className="rounded-2xl border flex items-center justify-between px-5 py-4"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Цена за 1 человека
        </p>
        <p className="font-bold text-xl" style={{ color: "var(--text-default)" }}>
          {fmt(price)}{" "}
          <span className="text-sm font-normal" style={{ color: "var(--text-muted)" }}>
            сум
          </span>
        </p>
      </div>

      {/* Scanner zone */}
      <div
        className="relative rounded-2xl border overflow-hidden flex flex-col items-center gap-5 py-8 px-5"
        style={{
          background: active ? "#3b82f60a" : "var(--bg-second)",
          borderColor: active ? "#3b82f650" : "var(--border-default)",
          transition: "background 0.25s, border-color 0.25s",
          opacity: roundFull ? 0.55 : 1,
        }}
      >
        <style>{`
          @keyframes nfc-scan-line {
            0%   { top: 0%;   opacity: 0; }
            8%   { opacity: 1; }
            92%  { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
        `}</style>

        {/* Scanning line — only when focused */}
        {active && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 2,
              background:
                "linear-gradient(90deg, transparent 0%, #3b82f6 40%, #93c5fd 50%, #3b82f6 60%, transparent 100%)",
              boxShadow: "0 0 8px #3b82f6aa",
              animation: "nfc-scan-line 1.8s ease-in-out infinite",
            }}
          />
        )}

        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: active ? "#3b82f618" : "var(--bg-hover)",
            animation: active
              ? "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite"
              : undefined,
            transition: "background 0.25s",
          }}
        >
          <LuWifi
            size={36}
            style={{
              color: active ? "#60a5fa" : "var(--text-muted)",
              transition: "color 0.25s",
            }}
          />
        </div>

        {/* Status text */}
        <p
          className="text-base font-semibold"
          style={{
            color: roundFull
              ? "var(--text-muted)"
              : active
                ? "#60a5fa"
                : "var(--text-2)",
            transition: "color 0.25s",
          }}
        >
          {roundFull
            ? "Раунд заполнен"
            : active
              ? "Сканирование активно..."
              : "Поднесите NFC карту"}
        </p>

        {/* Input */}
        <div className="w-full">
          <CusInput
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="NFC ID..."
            disabled={roundFull}
            leftElement={
              <LuWifi size={14} style={{ color: "var(--text-muted)" }} />
            }
            inputSize="lg"
            clearable
            onClear={() => setValue("")}
          />
        </div>

        {/* Helper */}
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {roundFull
            ? `${maxSlots}/${maxSlots} мест занято`
            : "Считыватель карт готов"}
        </p>
      </div>
    </div>
  );
}
