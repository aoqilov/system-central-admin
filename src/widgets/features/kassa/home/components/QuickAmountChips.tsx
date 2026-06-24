interface Props {
  cardAmount: string;
  onFull: () => void;
  onAdd: (n: number) => void;
  disabled?: boolean;
}

export function QuickAmountChips({ cardAmount, onFull, onAdd, disabled }: Props) {
  const fullLabel = cardAmount
    ? `To'liq — ${Number(cardAmount).toLocaleString("uz-UZ")} so'm`
    : "To'liq summa";

  const chips: { label: string; action: () => void; primary?: boolean }[] = [
    { label: fullLabel, action: onFull, primary: true },
    { label: "+10 000", action: () => onAdd(10_000) },
    { label: "+50 000", action: () => onAdd(50_000) },
    { label: "+100 000", action: () => onAdd(100_000) },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {chips.map((chip) => (
        <button
          key={chip.label}
          onPointerDown={(e) => { e.preventDefault(); if (!disabled) chip.action(); }}
          disabled={disabled}
          className="px-3.5 rounded-xl text-sm font-semibold"
          style={{
            height: 40,
            background: chip.primary
              ? "rgba(31,116,214,0.12)"
              : "#111e2d",
            border: chip.primary
              ? "1px solid rgba(31,116,214,0.3)"
              : "1px solid #1c2532",
            color: chip.primary ? "#4fa3f7" : "#7a8ba6",
            opacity: disabled ? 0.45 : 1,
            cursor: disabled ? "not-allowed" : "pointer",
            touchAction: "manipulation",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
