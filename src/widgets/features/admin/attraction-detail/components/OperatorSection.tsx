import { LuUserPlus, LuUser, LuUsers } from "react-icons/lu";
import { CusCard, CusCardHeader } from "@/components/shared/card/CusCard";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { OperatorCardHelper } from "./OperatorCardHelper";
import type { AttractionOperatorItem } from "../types";

interface Props {
  mainOperators: AttractionOperatorItem[];
  helpers: AttractionOperatorItem[];
  onAssignOperator: () => void;
  onAssignHelper: () => void;
  onRemoveOperator: (operatorId: number) => void;
  onRemoveHelper: (operatorId: number) => void;
  removingIds?: number[];
}

export function OperatorSection({
  mainOperators,
  helpers,
  onAssignOperator,
  onAssignHelper,
  onRemoveOperator,
  onRemoveHelper,
  removingIds = [],
}: Props) {
  return (
    <div className="space-y-3">
      {/* ── Box 1: Asosiy operatorlar ── */}
      <CusCard>
        <CusCardHeader icon={LuUser} title="Основной оператор" />

        <div className="p-4">
          {mainOperators.length > 0 ? (
            <div className="flex flex-col gap-2">
              {mainOperators.map((op) => (
                <OperatorCardHelper
                  key={op.id}
                  assistant={op}
                  onRemove={onRemoveOperator}
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
              <p className="text-xs">Оператор не назначен</p>
            </div>
          )}
        </div>

        <div className="px-4 pb-4">
          <CusButton
            size="sm"
            variant="outline"
            colorPalette="blue"
            leftIcon={<LuUserPlus size={13} />}
            onClick={onAssignOperator}
            style={{ width: "100%" }}
          >
            {mainOperators.length > 0 ? "Добавить" : "Назначить оператора"}
          </CusButton>
        </div>
      </CusCard>

      {/* ── Box 2: Helpers ── */}
      <CusCard>
        <CusCardHeader icon={LuUsers} title="Помощники" />

        <div className="p-4">
          {helpers.length > 0 ? (
            <div className="flex flex-col gap-2">
              {helpers.map((a) => (
                <OperatorCardHelper
                  key={a.id}
                  assistant={a}
                  onRemove={onRemoveHelper}
                  isRemoving={removingIds.includes(a.id)}
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
                <LuUsers size={18} />
              </div>
              <p className="text-xs">Помощники не назначены</p>
            </div>
          )}
        </div>

        <div className="px-4 pb-4">
          <CusButton
            size="sm"
            variant="outline"
            colorPalette="green"
            leftIcon={<LuUserPlus size={13} />}
            onClick={onAssignHelper}
            style={{ width: "100%" }}
          >
            Добавить помощника
          </CusButton>
        </div>
      </CusCard>
    </div>
  );
}
