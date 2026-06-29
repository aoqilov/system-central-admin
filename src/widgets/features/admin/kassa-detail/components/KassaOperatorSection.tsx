import { LuUserPlus, LuUser } from "react-icons/lu";
import { CusCard, CusCardHeader } from "@/components/shared/card/CusCard";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { KassaOperatorCard } from "./KassaOperatorCard";
import type { CashboxOperator } from "@/widgets/features/admin/kassa/types";

interface Props {
  operators: CashboxOperator[];
  onAssign: () => void;
  onRemove: (operatorId: number) => void;
  removingIds?: number[];
}

export function KassaOperatorSection({
  operators,
  onAssign,
  onRemove,
  removingIds = [],
}: Props) {
  return (
    <CusCard>
      <CusCardHeader icon={LuUser} title="Кассиры" />

      <div className="p-4">
        {operators.length > 0 ? (
          <div className="flex flex-col gap-2">
            {operators.map((op) => (
              <KassaOperatorCard
                key={op.id}
                operator={op}
                onRemove={onRemove}
                isRemoving={removingIds.includes(op.id)}
              />
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-2 py-4"
            style={{ color: "var(--text-muted)" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: "var(--bg-hover)",
                border: "1.5px dashed var(--border-2)",
              }}
            >
              <LuUserPlus size={18} />
            </div>
            <p className="text-xs">Кассир не назначен</p>
          </div>
        )}
      </div>

      {operators.length < 3 && (
        <div className="px-4 pb-4">
          <CusButton
            size="sm"
            variant="outline"
            colorPalette="blue"
            leftIcon={<LuUserPlus size={13} />}
            onClick={onAssign}
            style={{ width: "100%" }}
          >
            {operators.length > 0 ? "Добавить кассира" : "Назначить кассира"}
          </CusButton>
        </div>
      )}
    </CusCard>
  );
}
