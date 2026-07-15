import { LuPower } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";

export function EmptySmena({ onGoToOtchet }: { onGoToOtchet: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-4"
      style={{ color: "var(--text-muted)" }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "var(--bg-hover)" }}
      >
        <LuPower size={28} style={{ color: "var(--text-dim)" }} />
      </div>
      <div className="text-center">
        <p className="font-semibold" style={{ color: "var(--text-3)" }}>
          Смена не открыта
        </p>
        <p className="text-sm mt-0.5">
          Для просмотра транзакций откройте X-отчёт на странице «Отчёт»
        </p>
      </div>
      <CusButton colorPalette="blue" variant="outline" size="sm" onClick={onGoToOtchet}>
        Перейти к отчёту
      </CusButton>
    </div>
  );
}
