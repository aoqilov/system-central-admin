import { LuUserPlus } from "react-icons/lu";
import { CusBadge } from "../../../../../components/ui/badge/CusBadge";
import {
  CusCard as Card,
} from "../../../../../components/shared/card/CusCard";
import { EmployeeStatus, type Employee } from "../../../../../data/employees";

interface Props {
  operator: Employee | null;
  helpers: { emp: Employee; relationdate: string }[];
  connectedDate: string;
  connectedDays: number;
  onAssignOpen: () => void;
}

export function OperatorCard({
  operator,
  helpers,
  connectedDate,
  connectedDays,
  onAssignOpen,
}: Props) {
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
          textAlign: "left",
        }}
      >
        <div
          style={{
            filter: "blur(5px)",
            opacity: 0.2,
            pointerEvents: "none",
            position: "absolute",
            inset: 0,
            display: "flex",
          }}
        >
          <div
            style={{
              width: 120,
              background: "var(--bg-hover)",
              borderRadius: "12px 0 0 12px",
            }}
          />
          <div
            className="flex-1 p-5"
            style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}
          >
            <div className="rounded" style={{ width: 130, height: 14, background: "var(--bg-hover)" }} />
            <div className="rounded" style={{ width: 90, height: 11, background: "var(--bg-hover)" }} />
            <div className="rounded" style={{ width: 60, height: 20, marginTop: 4, background: "var(--bg-hover)" }} />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "var(--bg-hover)", border: "1.5px dashed var(--border-2)" }}
          >
            <LuUserPlus size={22} style={{ color: "var(--text-muted)" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            Operator biriktirish
          </p>
        </div>
      </button>
    );
  }

  return (
    <Card>
      <div className="flex" style={{ minHeight: 148 }}>
        <div className="shrink-0 self-stretch" style={{ width: 120 }}>
          <img
            src={operator.avatarUrl ?? `https://i.pravatar.cc/150?u=${operator.id}`}
            alt={operator.fullName ?? operator.firstName}
            className="w-full h-full object-cover"
            style={{ display: "block" }}
          />
        </div>
        <div className="flex-1 p-4 min-w-0 flex flex-col justify-center">
          <span className="text-[11px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
            Asosiy operator
          </span>
          <p className="text-sm font-semibold leading-tight truncate" style={{ color: "var(--text-default)" }}>
            {operator.fullName ?? `${operator.firstName} ${operator.lastName}`}
          </p>
          <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
            {connectedDate}
            <span
              className="ml-2 px-1.5 py-0.5 rounded text-xs font-medium"
              style={{ background: "var(--bg-hover)", color: "var(--text-2)" }}
            >
              {connectedDays} kun
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <CusBadge
              status={operator.status === EmployeeStatus.ACTIVE ? "active" : "fired"}
              size="sm"
            >
              {operator.status}
            </CusBadge>
            {operator.currency && (
              <CusBadge colorPalette="gray" variant="surface" size="sm">
                {operator.currency}
              </CusBadge>
            )}
          </div>
        </div>
      </div>

      {helpers.length > 0 && (
        <div className="border-t px-4 py-3" style={{ borderColor: "var(--border-default)" }}>
          <p className="text-[11px] mb-2" style={{ color: "var(--text-muted)" }}>Yordamchilar</p>
          <div className="flex flex-wrap gap-2">
            {helpers.map(({ emp, relationdate }) => (
              <div
                key={emp.id}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                style={{ background: "var(--bg-hover)", border: "1px solid var(--border-default)" }}
              >
                <img
                  src={emp.avatarUrl ?? `https://i.pravatar.cc/150?u=${emp.id}`}
                  alt={emp.fullName ?? emp.firstName}
                  style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                />
                <div>
                  <p className="text-[11px] font-medium leading-tight" style={{ color: "var(--text-default)" }}>
                    {emp.fullName ?? `${emp.firstName} ${emp.lastName}`}
                  </p>
                  <p className="text-[10px] leading-tight" style={{ color: "var(--text-muted)" }}>
                    {relationdate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
