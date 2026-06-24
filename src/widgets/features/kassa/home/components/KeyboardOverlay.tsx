import { useRef } from "react";

const ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["Z", "z", "x", "c", "v", "b", "n", "m", "⌫"],
  ["123", " ", "↵"],
] as const;

// "Z" is a placeholder for the shift key visual (left of z row)
const LABEL: Record<string, string> = {
  Z: "⇧",
  " ": "Probel",
  "↵": "Enter",
  "123": "123",
};

interface Props {
  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;
  onClose: () => void;
}

export function KeyboardOverlay({ value, onChange, onEnter, onClose }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  function handleKey(key: string) {
    if (key === "⌫") { onChange(value.slice(0, -1)); return; }
    if (key === "↵") { onEnter(); return; }
    if (key === "Z" || key === "123") return; // unimplemented modifiers
    onChange(value + key);
  }

  function getFlex(key: string): number {
    if (key === " ") return 4;
    if (key === "↵") return 2;
    if (key === "⌫") return 1.5;
    if (key === "Z") return 1.5;
    if (key === "123") return 1.5;
    return 1;
  }

  function getBg(key: string): string {
    if (key === "↵") return "#1f74d6";
    if (key === "⌫") return "rgba(229,62,62,0.12)";
    if (key === "Z" || key === "123") return "#162030";
    return "#111e2d";
  }

  function getColor(key: string): string {
    if (key === "↵") return "#fff";
    if (key === "⌫") return "#e05454";
    return "#e8edf5";
  }

  return (
    <div
      className="fixed inset-0 flex flex-col justify-end"
      style={{ zIndex: 300, background: "rgba(0,0,0,0.55)" }}
      onPointerDown={(e) => {
        if (!wrapRef.current?.contains(e.target as Node)) onClose();
      }}
    >
      <div
        ref={wrapRef}
        className="flex flex-col gap-1.5 p-3"
        style={{
          background: "#0a1220",
          borderTop: "1px solid #1c2532",
          animation: "kbSlideUp 0.18s ease",
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Value preview */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-1"
          style={{ background: "#0e1521", border: "1px solid #1c2532", minHeight: 48 }}
        >
          <span
            className="flex-1 font-mono text-base"
            style={{ color: value ? "#e8edf5" : "#2a3a4e" }}
          >
            {value || "Skanerlash raqami..."}
          </span>
          <button
            onPointerDown={(e) => { e.preventDefault(); onClose(); }}
            className="text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{ background: "#1c2532", color: "#7a8ba6" }}
          >
            Yopish
          </button>
        </div>

        {ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1.5">
            {row.map((key) => (
              <button
                key={key}
                onPointerDown={(e) => { e.preventDefault(); handleKey(key); }}
                className="flex items-center justify-center rounded-xl font-semibold capitalize"
                style={{
                  flex: getFlex(key),
                  height: 56,
                  background: getBg(key),
                  border: key === "↵" ? "none" : "1px solid #1c2532",
                  color: getColor(key),
                  fontSize: 16,
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  touchAction: "manipulation",
                }}
              >
                {LABEL[key] ?? key}
              </button>
            ))}
          </div>
        ))}
      </div>
      <style>{`@keyframes kbSlideUp { from { transform:translateY(100%) } to { transform:translateY(0) } }`}</style>
    </div>
  );
}
