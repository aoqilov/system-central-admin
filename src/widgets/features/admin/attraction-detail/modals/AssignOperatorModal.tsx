import { LuCheck } from "react-icons/lu";
import { CusButton } from "../../../../../components/ui/buttons/CusButton";
import { CusDialog } from "../../../../../components/ui/dialog/CusDialog";
import type { Employee } from "../../../../../data/employees";

interface Props {
  open: boolean;
  onClose: () => void;
  candidates: Employee[];
  selectedEmp: number | null;
  onSelect: (id: number) => void;
  onConfirm: () => void;
}

export function AssignOperatorModal({
  open,
  onClose,
  candidates,
  selectedEmp,
  onSelect,
  onConfirm,
}: Props) {
  return (
    <CusDialog
      open={open}
      onClose={onClose}
      title="Operator biriktirish"
      description="Attraksion uchun xodimni tanlang"
      size="md"
      footer={
        <>
          <CusButton variant="outline" onClick={onClose}>
            Bekor qilish
          </CusButton>
          <CusButton isDisabled={selectedEmp === null} onClick={onConfirm}>
            Biriktirish
          </CusButton>
        </>
      }
    >
      <div className="space-y-2">
        {candidates.map((emp) => {
          const isSelected = selectedEmp === emp.id;
          return (
            <button
              key={emp.id}
              onClick={() => onSelect(emp.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left"
              style={{
                background: isSelected ? "var(--bg-hover)" : "transparent",
                border: `1px solid ${isSelected ? "var(--border-2)" : "var(--border-default)"}`,
                cursor: "pointer",
                transition: "background 0.15s, border-color 0.15s",
              }}
            >
              <img
                src={emp.avatarUrl ?? `https://i.pravatar.cc/150?u=${emp.id}`}
                alt={emp.fullName ?? emp.firstName}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--text-default)" }}>
                  {emp.fullName ?? `${emp.firstName} ${emp.lastName}`}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {emp.role}
                </p>
              </div>
              {isSelected && (
                <LuCheck size={16} style={{ color: "#22c55e", flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </div>
    </CusDialog>
  );
}
