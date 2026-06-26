import { LuUserPlus, LuUser, LuUsers } from "react-icons/lu";
import { CusCard, CusCardHeader } from "@/components/shared/card/CusCard";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { OperatorCardHelper } from "./OperatorCardHelper";
import { getFileUrl } from "@/widgets/api-global/files-route/filesApi";
import type { AttractionOperatorDetail } from "../types";

interface Props {
  operator: AttractionOperatorDetail | null;
  onAssignOperator: () => void;
  onAssignHelper: () => void;
}

export function OperatorSection({ operator, onAssignOperator, onAssignHelper }: Props) {
  return (
    <div className="space-y-3">
      {/* ── Box 1: Asosiy operator ── */}
      <CusCard>
        <CusCardHeader icon={LuUser} title="Основной оператор" />

        <div className="p-4">
          {operator ? (
            <div className="flex items-center gap-3">
              {operator.file ? (
                <CusImagePreview
                  src={getFileUrl(operator.file)}
                  alt={`${operator.firstname} ${operator.lastname}`}
                  width={44}
                  height={44}
                  objectFit="cover"
                  borderRadius="50%"
                />
              ) : (
                <div
                  className="shrink-0 flex items-center justify-center text-base font-bold"
                  style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "var(--bg-hover)", color: "var(--text-muted)",
                  }}
                >
                  {operator.firstname?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "var(--text-default)" }}>
                  {operator.firstname} {operator.lastname}
                </p>
                <div className="mt-1">
                  <CusBadge status={operator.status === "active" ? "active" : "fired"} size="sm">
                    {operator.status === "active" ? "Активен" : "Неактивен"}
                  </CusBadge>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center gap-2 py-4"
              style={{ color: "var(--text-muted)" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "var(--bg-hover)", border: "1.5px dashed var(--border-2)" }}
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
            {operator ? "Изменить оператора" : "Назначить оператора"}
          </CusButton>
        </div>
      </CusCard>

      {/* ── Box 2: Helpers ── */}
      <CusCard>
        <CusCardHeader icon={LuUsers} title="Помощники" />

        <div className="p-4">
          {(operator?.assistant_operators?.length ?? 0) > 0 ? (
            <div className="flex flex-col gap-2">
              {operator!.assistant_operators.map((a) => (
                <OperatorCardHelper key={a.id} assistant={a} />
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center gap-2 py-4"
              style={{ color: "var(--text-muted)" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "var(--bg-hover)", border: "1.5px dashed var(--border-2)" }}
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
