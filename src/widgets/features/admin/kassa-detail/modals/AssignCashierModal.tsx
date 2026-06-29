import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LuCheck, LuSearch, LuUser } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { fetchEmployees } from "@/widgets/features/admin/employees/api/employeesApi";
import { assignOperatorToCashbox } from "../api/apiKassaDetail";
import { getFileUrl } from "@/widgets/api-global/files-route/filesApi";
import { EmployeeStatusTypes } from "@/const/constData";
import type { ApiEmployee } from "@/widgets/features/admin/employees/types";

interface Props {
  open: boolean;
  cashboxId: number;
  assignedId?: number[];
  onClose: () => void;
}

export function AssignCashierModal({ open, cashboxId, assignedId = [], onClose }: Props) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedEmp, setSelectedEmp] = useState<number | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      assignOperatorToCashbox(cashboxId, { operator: selectedEmp!, type: "main" }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cashbox-detail", String(cashboxId)],
      });
      handleClose();
    },
  });

  function handleClose() {
    onClose();
    setSearch("");
    setSelectedEmp(null);
  }

  const { data, isLoading } = useQuery({
    queryKey: ["employees-assign-cashier"],
    queryFn: () => fetchEmployees({ limit: 100, roles: 2 }),
    enabled: open,
  });

  const employees: ApiEmployee[] = data?.employees ?? [];

  const filtered = search.trim()
    ? employees.filter(
        (e) =>
          e.fullname?.toLowerCase().includes(search.toLowerCase()) ||
          e.phone_number?.includes(search),
      )
    : employees;

  return (
    <CusDialog
      open={open}
      onClose={handleClose}
      title="Назначить кассира"
      description="Выберите сотрудника для кассы"
      size="md"
      footer={
        <>
          <CusButton variant="outline" onClick={handleClose}>
            Отмена
          </CusButton>
          <CusButton
            colorPalette="blue"
            isDisabled={selectedEmp === null || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Сохранение..." : "Назначить"}
          </CusButton>
        </>
      }
    >
      <div className="space-y-3">
        <CusInput
          placeholder="Поиск по имени или телефону..."
          leftElement={<LuSearch size={14} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {isLoading ? (
          <div
            className="flex justify-center py-8"
            style={{ color: "var(--text-muted)" }}
          >
            <p className="text-sm">Загрузка...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-8"
            style={{ color: "var(--text-muted)" }}
          >
            <LuUser size={28} />
            <p className="text-sm">Сотрудники не найдены</p>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {filtered.map((emp) => {
              const isSelected = selectedEmp === emp.id;
              const isAssigned = assignedId.includes(emp.id);
              return (
                <button
                  key={emp.id}
                  type="button"
                  disabled={isAssigned}
                  onClick={() => !isAssigned && setSelectedEmp(emp.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left"
                  style={{
                    background: isSelected ? "var(--bg-hover)" : "transparent",
                    border: `1px solid ${isSelected ? "var(--border-2)" : "var(--border-default)"}`,
                    cursor: isAssigned ? "not-allowed" : "pointer",
                    opacity: isAssigned ? 0.5 : 1,
                    transition: "background 0.15s, border-color 0.15s",
                  }}
                >
                  {emp.file ? (
                    <CusImagePreview
                      src={getFileUrl(emp.file)}
                      alt={emp.fullname}
                      width={36}
                      height={36}
                      objectFit="cover"
                      borderRadius="50%"
                      preview={false}
                    />
                  ) : (
                    <div
                      className="shrink-0 flex items-center justify-center text-sm font-bold"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "var(--bg-input)",
                        color: "var(--text-muted)",
                        flexShrink: 0,
                      }}
                    >
                      {emp.firstname?.charAt(0)?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--text-default)" }}
                    >
                      {emp.firstname} {emp.lastname}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {emp.phone_number}
                    </p>
                  </div>
                  {isAssigned ? (
                    <CusBadge colorPalette="green" variant="surface" size="sm">
                      Назначен
                    </CusBadge>
                  ) : (
                    <CusBadge status={emp.status as EmployeeStatusTypes} size="sm" />
                  )}
                  {isSelected && (
                    <LuCheck size={16} style={{ color: "#22c55e", flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </CusDialog>
  );
}
