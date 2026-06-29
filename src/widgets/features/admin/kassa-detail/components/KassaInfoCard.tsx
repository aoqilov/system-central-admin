import { LuBanknote, LuMapPin } from "react-icons/lu";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusCard as Card } from "@/components/shared/card/CusCard";
import { CashboxStatusBadge, CashboxStatusLabel } from "@/const/constData";
import type { Cashbox } from "../../kassa/types";

interface Props {
  kassa: Cashbox;
}

export function KassaInfoCard({ kassa }: Props) {
  return (
    <Card>
      <div className="flex" style={{ minHeight: 148 }}>
        <div
          className="shrink-0 self-stretch flex items-center justify-center rounded-l-xl"
          style={{ width: 120, background: "var(--bg-hover)" }}
        >
          <LuBanknote size={40} style={{ color: "var(--text-muted)" }} />
        </div>
        <div className="flex-1 p-5 min-w-0 flex flex-col justify-center">
          <h1
            className="text-xl font-semibold leading-tight truncate"
            style={{ color: "var(--text-default)" }}
          >
            {kassa.name}
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <LuMapPin size={11} style={{ color: "var(--text-muted)" }} />
            <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
              {kassa.place}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <CusBadge status={CashboxStatusBadge[kassa.status]} size="sm">
              {CashboxStatusLabel[kassa.status]}
            </CusBadge>
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: "var(--bg-hover)", color: "var(--text-2)" }}
            >
              #{kassa.id}
            </span>
          </div>
          {kassa.description && (
            <p className="text-xs mt-2.5" style={{ color: "var(--text-muted)" }}>
              {kassa.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
