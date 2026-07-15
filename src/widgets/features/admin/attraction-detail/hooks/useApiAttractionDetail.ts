import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAttractionDetail } from "@/api/attractions/attractions.api";
import {
  assignAttractionOperator,
  removeAttractionOperator,
} from "@/api/attraction-operators/attraction-operators.api";
import { fetchEmployees } from "@/api/employees/employees.api";
import type { AssignAttractionOperatorBody } from "@/types/attraction.types";
import { toast, getApiError } from "@/components/sonner-toast/toast";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const ATTRACTION_DETAIL_KEYS = {
  detail: (id: string) => ["attraction-detail", id] as const,
  assignEmployees: ["employees-assign"] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useAttractionDetail(id: string | undefined) {
  return useQuery({
    queryKey: ATTRACTION_DETAIL_KEYS.detail(id ?? ""),
    queryFn: () => fetchAttractionDetail(Number(id)),
    enabled: !!id,
    throwOnError: (error) => {
      toast.error("Ошибка загрузки аттракциона", {
        description: getApiError(error),
      });
      return false;
    },
  });
}

export function useAssignableEmployees(enabled: boolean) {
  return useQuery({
    queryKey: ATTRACTION_DETAIL_KEYS.assignEmployees,
    queryFn: () => fetchEmployees({ limit: 100, roles: 4 }),

    enabled,
    throwOnError: (error) => {
      toast.error("Ошибка загрузки сотрудников", {
        description: getApiError(error),
      });
      return false;
    },
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useAssignAttractionOperator(attractionId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: AssignAttractionOperatorBody) =>
      assignAttractionOperator(attractionId, body),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ATTRACTION_DETAIL_KEYS.detail(String(attractionId)),
      });
      toast.success("Оператор назначен");
    },
    onError: (error) => {
      toast.error("Ошибка назначения оператора", {
        description: getApiError(error),
      });
    },
  });
}

export function useRemoveAttractionOperator(attractionId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (operatorId: number) =>
      removeAttractionOperator(attractionId, operatorId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ATTRACTION_DETAIL_KEYS.detail(String(attractionId)),
      });
      toast.success("Оператор удалён");
    },
    onError: (error) => {
      toast.error("Ошибка удаления оператора", {
        description: getApiError(error),
      });
    },
  });
}
