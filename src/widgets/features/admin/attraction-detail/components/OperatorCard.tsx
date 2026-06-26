import { LuUserPlus } from "react-icons/lu";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusCard } from "@/components/shared/card/CusCard";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { getFileUrl } from "@/widgets/api-global/files-route/filesApi";
import { OperatorCardHelper } from "./OperatorCardHelper";
import type { AttractionOperatorDetail } from "../types";

interface Props {
  operator: AttractionOperatorDetail | null;
  onAssignOpen: () => void;
}

export function OperatorCard({ operator, onAssignOpen }: Props) {
  if (!operator) {
    return (
      <button
        onClick={onAssignOpen}
        className="relative rounded-xl border overflow-hidden w-full"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
          minHeight: 148,
          cursor: "pointer",
        }}
      >
        {/* Blur ghost */}
        <div style={{ filter: "blur(5px)", opacity: 0.2, position: "absolute", inset: 0, display: "flex", pointerEvents: "none" }}>
          <div style={{ width: 120, background: "var(--bg-hover)" }} />
          <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
            <div style={{ width: 130, height: 14, borderRadius: 4, background: "var(--bg-hover)" }} />
            <div style={{ width: 90, height: 11, borderRadius: 4, background: "var(--bg-hover)" }} />
          </div>
        </div>
        {/* Overlay */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "var(--bg-hover)", border: "1.5px dashed var(--border-2)" }}
          >
            <LuUserPlus size={22} style={{ color: "var(--text-muted)" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            Назначить оператора
          </p>
        </div>
      </button>
    );
  }

  return (
    <CusCard>
      <div className="flex" style={{ minHeight: 100 }}>
        {operator.file ? (
          <CusImagePreview
            src={getFileUrl(operator.file)}
            alt={`${operator.firstname} ${operator.lastname}`}
            width={120}
            height="100%"
            objectFit="cover"
          />
        ) : (
          <div
            className="shrink-0 self-stretch flex items-center justify-center text-lg font-bold"
            style={{ width: 120, background: "var(--bg-hover)", color: "var(--text-muted)" }}
          >
            {operator.firstname?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
        )}
        <div className="flex-1 p-4 flex flex-col justify-center gap-1 min-w-0">
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Основной оператор</span>
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

      {(operator.assistant_operators?.length ?? 0) > 0 && (
        <div className="border-t px-4 py-3" style={{ borderColor: "var(--border-default)" }}>
          <p className="text-[11px] mb-2" style={{ color: "var(--text-muted)" }}>Помощники</p>
          <div className="flex flex-wrap gap-2">
            {operator.assistant_operators.map((a) => (
              <OperatorCardHelper key={a.id} assistant={a} />
            ))}
          </div>
        </div>
      )}
    </CusCard>
  );
}
