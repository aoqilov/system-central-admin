import { LuSend, LuCircleCheck, LuClock, LuFerrisWheel, LuPlay, LuUsers, LuBanknote } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { fmt } from "../types";

interface Props {
  sentAt: string | null;
  attractionCount: number;
  totalRounds: number;
  totalCards: number;
  totalRevenue: number;
  onSend: () => void;
}

export function IncomingSendBox({ sentAt, attractionCount, totalRounds, totalCards, totalRevenue, onSend }: Props) {
  return (
    <div
      className="rounded-2xl border p-4 flex flex-col tablet:flex-row tablet:items-center gap-4"
      style={{
        background: sentAt ? "#22c55e0a" : "var(--bg-second)",
        borderColor: sentAt ? "#22c55e40" : "var(--border-default)",
      }}
    >
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          {sentAt
            ? <LuCircleCheck size={16} style={{ color: "#22c55e" }} />
            : <LuSend size={16} style={{ color: "#3b82f6" }} />
          }
          <p className="font-semibold text-sm" style={{ color: sentAt ? "#22c55e" : "var(--text-default)" }}>
            {sentAt ? "Отправлено в бухгалтерию" : "Отправить в бухгалтерию"}
          </p>
          {sentAt && (
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              <LuClock size={11} style={{ display: "inline", marginRight: 3 }} />
              {sentAt}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1">
          {[
            { Icon: LuFerrisWheel, label: `${attractionCount} привл.` },
            { Icon: LuPlay,        label: `${totalRounds} round` },
            { Icon: LuUsers,       label: `${totalCards} карт` },
            { Icon: LuBanknote,    label: `${fmt(totalRevenue)} сум` },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <Icon size={12} style={{ color: "var(--text-muted)" }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {sentAt ? (
        <CusBadge colorPalette="green" dot size="md">Отправлено</CusBadge>
      ) : (
        <CusButton colorPalette="blue" size="sm" onClick={onSend}>
          <LuSend size={14} /> Отправить в бухгалтерию
        </CusButton>
      )}
    </div>
  );
}
