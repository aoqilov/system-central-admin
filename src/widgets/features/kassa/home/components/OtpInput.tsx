import { useRef } from "react";
import type React from "react";

export function OtpInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(4, " ").slice(0, 4).split("");

  function handleChange(i: number, ch: string) {
    if (!/^\d?$/.test(ch)) return;
    const arr = digits.map((d) => (d === " " ? "" : d));
    arr[i] = ch;
    onChange(arr.join(""));
    if (ch && i < 3) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i]?.trim() && i > 0)
      refs.current[i - 1]?.focus();
  }

  return (
    <div className="flex gap-2">
      {[0, 1, 2, 3].map((i) => {
        const filled = digits[i] && digits[i] !== " ";
        return (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={filled ? digits[i] : ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-full text-center text-xl font-bold rounded-xl border-2 outline-none transition-all"
            style={{
              height: 56,
              background: "var(--bg-input)",
              borderColor: filled ? "#3b82f6" : "var(--border-default)",
              color: "var(--text-default)",
              caretColor: "#3b82f6",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#3b82f6";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.18)";
            }}
            onBlur={(e) => {
              const f = digits[i] && digits[i] !== " ";
              e.currentTarget.style.borderColor = f ? "#3b82f6" : "var(--border-default)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        );
      })}
    </div>
  );
}
