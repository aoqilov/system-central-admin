import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCashboxes,
  fetchCashboxStats,
  createCashbox,
  updateCashbox,
  deleteCashboxes,
} from "@/api/cashboxes/cashboxes.api";
import type {
  CashboxesParams,
  CreateCashboxPayload,
  UpdateCashboxPayload,
} from "@/types/cashbox.types";
import { toast, getApiError } from "@/components/sonner-toast/toast";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const KASSA_KEYS = {
  all: ["cashboxes"] as const,
  list: (params: CashboxesParams) => ["cashboxes", params] as const,
  stats: ["cashbox-stats"] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useKassas(params: CashboxesParams = {}) {
  return useQuery({
    queryKey: KASSA_KEYS.list(params),
    queryFn: () => fetchCashboxes(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useKassaStats() {
  return useQuery({
    queryKey: KASSA_KEYS.stats,
    queryFn: fetchCashboxStats,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateKassa() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCashboxPayload) => createCashbox(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KASSA_KEYS.all });
      qc.invalidateQueries({ queryKey: KASSA_KEYS.stats });
      toast.success("Касса успешно создана");
    },
    onError: (error) => {
      console.error("Ошибка при создании кассы:", error);
      toast.error("Ошибка при создании кассы", {
        description: getApiError(error),
      });
    },
  });
}

export function useUpdateKassa(kassaId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCashboxPayload) =>
      updateCashbox(kassaId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KASSA_KEYS.all });
      qc.invalidateQueries({ queryKey: KASSA_KEYS.stats });
      toast.success("Касса успешно обновлена");
    },
    onError: (error) => {
      toast.error("Ошибка при обновлении кассы", {
        description: getApiError(error),
      });
    },
  });
}

export function useDeleteKassas() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => deleteCashboxes(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KASSA_KEYS.all });
      qc.invalidateQueries({ queryKey: KASSA_KEYS.stats });
      toast.success("Кассы успешно удалены");
    },
    onError: (error) => {
      toast.error("Ошибка при удалении касс", {
        description: getApiError(error),
      });
    },
  });
}
