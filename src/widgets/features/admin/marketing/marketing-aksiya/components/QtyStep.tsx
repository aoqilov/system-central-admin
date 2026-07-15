interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}

export function QtyStep({ value, onChange, min = 1, max = 20 }: Props) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        type="button"
        aria-label="Уменьшить количество"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-base font-semibold transition-opacity disabled:opacity-30"
        style={{ background: "var(--bg-hover)", color: "var(--text-default)" }}
      >
        −
      </button>
      <span
        className="w-6 text-center text-sm font-semibold tabular-nums"
        style={{ color: "var(--text-default)" }}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Увеличить количество"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-base font-semibold transition-opacity disabled:opacity-30"
        style={{ background: "var(--bg-hover)", color: "var(--text-default)" }}
      >
        +
      </button>
    </div>
  );
}
