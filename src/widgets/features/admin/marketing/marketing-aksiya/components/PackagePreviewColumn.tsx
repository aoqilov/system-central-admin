import { LuShoppingCart, LuCalendar, LuTriangleAlert } from "react-icons/lu";
import { getFileUrl } from "@/api/files/files.api";
import type { PreviewLine, DiscountRule } from "../marketing-aksiya.types";

interface Props {
  lines: PreviewLine[];
  rule: DiscountRule | null;
  droppedIds: number[];
}

export function PackagePreviewColumn({ lines, rule, droppedIds }: Props) {
  const hasDiscount = rule !== null && rule.discount > 0;

  const subtotal = lines.reduce((s, l) => s + l.lineOriginal, 0);
  const total = lines.reduce((s, l) => s + l.lineFinal, 0);
  const discountAmount = subtotal - total;

  return (
    <div
      className="rounded-2xl border flex flex-col overflow-hidden"
      style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ borderColor: "var(--border-default)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "var(--bg-hover)" }}
        >
          <LuShoppingCart size={15} style={{ color: "var(--text-muted)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm" style={{ color: "var(--text-default)" }}>
            Состав пакета
          </p>
          {rule?.from && rule?.to && (
            <p
              className="text-xs flex items-center gap-1 mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              <LuCalendar size={11} />
              {rule.from} — {rule.to}
            </p>
          )}
        </div>
        {lines.length > 0 && (
          <span className="text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>
            {lines.length} поз.
          </span>
        )}
      </div>

      {/* Dropped notice */}
      {droppedIds.length > 0 && (
        <div
          className="mx-4 mt-3 flex items-start gap-2 px-3 py-2 rounded-lg text-xs"
          style={{ background: "color-mix(in srgb, var(--color-yellow) 12%, transparent)", color: "var(--color-yellow)" }}
        >
          <LuTriangleAlert size={13} className="shrink-0 mt-0.5" />
          <span>
            {droppedIds.length} аттракцион удалён из системы и убран из пакета
          </span>
        </div>
      )}

      {/* Lines */}
      <div className="overflow-y-auto" style={{ maxHeight: 420 }}>
        {lines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--bg-hover)" }}
            >
              <LuShoppingCart size={22} style={{ color: "var(--text-dim)" }} />
            </div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Выберите аттракционы и нажмите «Добавить в пакет»
            </p>
          </div>
        ) : (
          lines.map((line, i) => (
            <div
              key={line.id}
              className="flex items-center gap-3 px-4 py-3"
              style={{
                borderTop: i > 0 ? "1px solid var(--border-default)" : undefined,
              }}
            >
              <img
                src={getFileUrl(line.attraction.main_file)}
                alt={line.attraction.name}
                className="w-9 h-9 rounded-lg object-cover shrink-0"
                style={{ background: "var(--bg-hover)" }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "var(--text-default)" }}
                >
                  {line.attraction.name}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {line.qty}× {line.unitPrice.toLocaleString()} UZS
                </p>
              </div>
              <div className="text-right shrink-0">
                {hasDiscount && (
                  <p
                    className="text-xs line-through"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {line.lineOriginal.toLocaleString()}
                  </p>
                )}
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-default)" }}
                >
                  {line.lineFinal.toLocaleString()} UZS
                </p>
              </div>
            </div>
          ))
        )}
      </div>

    
    </div>
  );
}
