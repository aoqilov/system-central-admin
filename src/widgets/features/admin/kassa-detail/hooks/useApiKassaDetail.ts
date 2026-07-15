import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useQueryToast } from "@/hooks/useQueryToast";
import { fetchCashbox } from "@/api/cashboxes/cashboxes.api";
import {
  assignOperatorToCashbox,
  deleteOperatorFromCashbox,
} from "@/api/cashboxes-operators/cashboxes-operators.api";
import { fetchEmployees } from "@/api/employees/employees.api";
import type { AssignOperatorPayload } from "@/types/cashbox.types";
import { toast, getApiError } from "@/components/sonner-toast/toast";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const KASSA_DETAIL_KEYS = {
  detail: (id: string) => ["cashbox-detail", id] as const,
  assignCashiers: ["employees-assign-cashier"] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useCashboxDetail(id: string | undefined) {
  return useQuery({
    queryKey: KASSA_DETAIL_KEYS.detail(id ?? ""),
    queryFn: () => fetchCashbox(Number(id)),
    enabled: !!id,
  });
}

export function useAssignableCashiers(enabled: boolean) {
  const query = useQuery({
    queryKey: KASSA_DETAIL_KEYS.assignCashiers,
    queryFn: () =>
      fetchEmployees({ limit: 100, roles: 2, statuses: "active,inactive" }),
    enabled,
  });

  useQueryToast(query, "Ошибка при загрузке");

  return query;
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useAssignCashier(cashboxId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignOperatorPayload) =>
      assignOperatorToCashbox(cashboxId, payload),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: KASSA_DETAIL_KEYS.detail(String(cashboxId)),
      });
      toast.success("Кассир успешно назначен");
    },
    onError: (error) => {
      toast.error("Ошибка при назначении кассира", {
        description: getApiError(error),
      });
    },
  });
}

export function useRemoveCashierOperator(cashboxId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (operatorId: number) =>
      deleteOperatorFromCashbox(cashboxId, operatorId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: KASSA_DETAIL_KEYS.detail(String(cashboxId)),
      });
      toast.success("Кассир успешно удалён");
    },
    onError: (error) => {
      toast.error("Ошибка при удалении кассира", {
        description: getApiError(error),
      });
    },
  });
}
