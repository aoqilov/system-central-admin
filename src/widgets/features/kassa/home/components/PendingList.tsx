import { LuClock, LuHash, LuArrowLeft, LuX } from "react-icons/lu";
import type { PendingItem } from "../types";

interface Props {
  items: PendingItem[];
  onRestore: (id: string) => void;
  onRemove: (id: string) => void;
}

export function PendingList({ items, onRestore, onRemove }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <LuClock size={13} style={{ color: "var(--text-muted)" }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Kutilayotganlar
        </span>
        <span
          className="text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
          style={{ background: "var(--color-yellow)", color: "#000", opacity: 0.85 }}
        >
          {items.length}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: "color-mix(in srgb, var(--color-yellow) 8%, var(--bg-second))",
              border: "1px solid color-mix(in srgb, var(--color-yellow) 25%, transparent)",
            }}
          >
            <LuHash size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <span
              className="flex-1 text-sm font-medium truncate"
              style={{ color: "var(--text-default)", fontVariantNumeric: "tabular-nums" }}
            >
              {item.qrInfo.raqam}
            </span>
            <span className="text-xs shrink-0" style={{ color: "var(--text-dim)" }}>
              {item.savedAt.toLocaleTimeString("uz", { hour: "2-digit", minute: "2-digit" })}
            </span>
            <button
              onClick={() => onRestore(item.id)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors shrink-0"
              style={{
                color: "var(--color-blue)",
                background: "color-mix(in srgb, var(--color-blue) 10%, transparent)",
              }}
            >
              <LuArrowLeft size={12} />
              Qaytish
            </button>
            <button
              onClick={() => onRemove(item.id)}
              className="p-1 rounded-lg transition-colors shrink-0"
              style={{ color: "var(--text-dim)" }}
            >
              <LuX size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
