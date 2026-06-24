const ROWS = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  ["0", "00", "del"],
] as const;

interface Props {
  onKey: (key: string) => void;
  disabled?: boolean;
}

export function NumPad({ onKey, disabled }: Props) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
      {ROWS.flat().map((key) => {
        const isDel = key === "del";
        return (
          <button
            key={key}
            disabled={disabled}
            onPointerDown={(e) => {
              e.preventDefault();
              if (!disabled) onKey(key);
            }}
            className="flex items-center justify-center rounded-xl select-none font-bold transition-all"
            style={{
              height: 64,
              background: isDel ? "rgba(229,62,62,0.1)" : "#111e2d",
              border: isDel
                ? "1px solid rgba(229,62,62,0.22)"
                : "1px solid #1c2532",
              color: isDel ? "#e05454" : "#e8edf5",
              fontSize: isDel ? 22 : 24,
              fontVariantNumeric: "tabular-nums",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.45 : 1,
              userSelect: "none",
              WebkitUserSelect: "none",
              touchAction: "manipulation",
            }}
            onPointerEnter={(e) => {
              if (!disabled) {
                e.currentTarget.style.background = isDel
                  ? "rgba(229,62,62,0.18)"
                  : "#1a2a3a";
                e.currentTarget.style.transform = "scale(0.97)";
              }
            }}
            onPointerLeave={(e) => {
              e.currentTarget.style.background = isDel
                ? "rgba(229,62,62,0.1)"
                : "#111e2d";
              e.currentTarget.style.transform = "";
            }}
          >
            {isDel ? "⌫" : key}
          </button>
        );
      })}
    </div>
  );
}
