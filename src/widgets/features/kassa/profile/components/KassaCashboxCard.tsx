import { LuBanknote, LuCircleCheck, LuCircleOff, LuMapPin } from "react-icons/lu";
import type { Cashbox } from "@/widgets/features/admin/kassa/types";

const STATUS_MAP: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  active: { icon: LuCircleCheck, color: "#22c55e", label: "Aktivna" },
  inactive: { icon: LuCircleOff, color: "#64748b", label: "Neaktivna" },
  maintenance: { icon: LuCircleOff, color: "#eab308", label: "Xizmat ko'rsatish" },
  closed: { icon: LuCircleOff, color: "#ef4444", label: "Yopiq" },
};

interface Props {
  cashbox: Cashbox;
}

export function KassaCashboxCard({ cashbox }: Props) {
  const status = STATUS_MAP[cashbox.status] ?? STATUS_MAP.inactive;
  const StatusIcon = status.icon;

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
    >
      <div
        className="flex items-center gap-3 px-5 py-3.5 border-b"
        style={{ borderColor: "var(--border-default)" }}
      >
        <LuBanknote size={16} className="text-blue-400 shrink-0" />
        <p className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>
          Mening kassam
        </p>
      </div>

      <div className="px-5 py-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p
            className="font-bold truncate"
            style={{ fontSize: 18, color: "var(--text-default)" }}
          >
            {cashbox.name}
          </p>
          {cashbox.place && (
            <div className="flex items-center gap-1.5 mt-1">
              <LuMapPin size={12} style={{ color: "var(--text-muted)" }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {cashbox.place}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <StatusIcon size={14} style={{ color: status.color }} />
          <span className="text-xs font-medium" style={{ color: status.color }}>
            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
}
