import { LuPlay, LuBanknote } from "react-icons/lu";
import { type CardCounts, STAT_COLS, fmt } from "../types";

interface Props {
  totalRounds: number;
  totalCards: CardCounts;
  totalRevenue: number;
}

export function IncomingStatCards({ totalRounds, totalCards, totalRevenue }: Props) {
  return (
    <div className="grid grid-cols-4 tablet:grid-cols-8 gap-2">
      {/* Round */}
      <div
        className="flex flex-col gap-1.5 rounded-xl border p-3"
        style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
      >
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Round</span>
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: "#60a5fa18" }}>
            <LuPlay size={11} style={{ color: "#60a5fa" }} />
          </div>
        </div>
        <p className="font-bold leading-none" style={{ fontSize: 20, color: "#60a5fa" }}>{totalRounds}</p>
      </div>

      {/* Card type cols */}
      {STAT_COLS.map((c) => {
        const val = totalCards[c.key];
        const isDefault = c.color === "var(--text-default)";
        const col = isDefault ? "#6b7280" : c.color;
        return (
          <div
            key={c.key}
            className="flex flex-col gap-1.5 rounded-xl border p-3"
            style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-semibold truncate" style={{ color: "var(--text-muted)" }}>{c.label}</span>
              <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: `${col}18` }}>
                <c.icon size={11} style={{ color: col }} />
              </div>
            </div>
            <p className="font-bold leading-none" style={{ fontSize: 20, color: isDefault ? "var(--text-default)" : c.color }}>
              {val > 0 ? val : "—"}
            </p>
          </div>
        );
      })}

      {/* Итого */}
      <div
        className="flex flex-col gap-1.5 rounded-xl border p-3"
        style={{ background: "var(--bg-second)", borderColor: "#22c55e40" }}
      >
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-semibold truncate" style={{ color: "var(--text-muted)" }}>Итого</span>
          <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: "#22c55e18" }}>
            <LuBanknote size={11} style={{ color: "#22c55e" }} />
          </div>
        </div>
        <p className="font-bold leading-none" style={{ fontSize: 18, color: "#22c55e" }}>{fmt(totalRevenue)}</p>
        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>сум</p>
      </div>
    </div>
  );
}
