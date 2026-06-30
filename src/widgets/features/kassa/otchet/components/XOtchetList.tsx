import { LuFileText, LuPlus, LuPower } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import type { CashboxReport } from "../types";
import { XOtchetCard } from "./XOtchetCard";
import { buildXHtml, openPrint } from "../otchet.helpers";

interface Props {
  xreports: CashboxReport[];
  activeX: CashboxReport | null;
  canOpenNew: boolean;
  onOpenNew: () => void;
  onPause: (id: number) => void;
  onClose: (id: number) => void;
}

export function XOtchetList({
  xreports,
  activeX,
  canOpenNew,
  onOpenNew,
  onPause,
  onClose,
}: Props) {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium" style={{ color: "var(--text-2)" }}>
            X-otchetlar
          </p>
          {canOpenNew && (
            <div className="flex justify-end pt-1">
              <CusButton
                colorPalette="green"
                size="sm"
                variant="outline"
                onClick={onOpenNew}
              >
                <LuPlus size={13} /> Yangi X-otchet ochish
              </CusButton>
            </div>
          )}
        </div>

        {xreports.length === 0 ? (
          <div
            className="flex flex-col items-center py-10 gap-3 rounded-xl border"
            style={{
              borderColor: "var(--border-default)",
              background: "var(--bg-hover)",
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--bg-second)" }}
            >
              <LuFileText size={22} style={{ color: "var(--text-dim)" }} />
            </div>
            <div className="text-center">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-3)" }}
              >
                X-otchet ochilmagan
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                Ishni boshlash uchun yangi X-otchet oching
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {xreports.map((item) => (
              <XOtchetCard
                key={item.id}
                item={item}
                onPause={() => onPause(item.id)}
                onClose={() => onClose(item.id)}
                onPrintCopy={() => openPrint(buildXHtml(item, true))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
