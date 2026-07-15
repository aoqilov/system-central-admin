import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, getApiError } from "@/components/sonner-toast/toast";
import {
  fetchAttractions,
  fetchAttractionStats,
  createAttraction,
  updateAttraction,
  deleteAttractions,
} from "@/api/attractions/attractions.api";
import { uploadAttractionFiles } from "@/api/files/files.api";
import type {
  AttractionsParams,
  CreateAttractionPayload,
  UpdateAttractionPayload,
} from "@/types/attraction.types";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const ATTRACTION_KEYS = {
  all: ["attractions"] as const,
  list: (params: AttractionsParams) => ["attractions", params] as const,
  stats: ["attraction-stats"] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useAttractions(params: AttractionsParams = {}) {
  return useQuery({
    queryKey: ATTRACTION_KEYS.list(params),
    queryFn: () => fetchAttractions(params),
    throwOnError: (error) => {
      toast.error("Ошибка загрузки аттракционов", { description: getApiError(error) });
      return false;
    },
  });
}

export function useAttractionStats() {
  return useQuery({
    queryKey: ATTRACTION_KEYS.stats,
    queryFn: fetchAttractionStats,
    throwOnError: (error) => {
      toast.error("Ошибка загрузки статистики", { description: getApiError(error) });
      return false;
    },
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateAttraction() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      fields: Omit<
        CreateAttractionPayload,
        "main_file" | "dashboard_file" | "files"
      >;
      main_file?: File | null;
      dashboard_file?: File | null;
      files?: File[];
    }) => {
      const hasFiles =
        params.main_file ||
        params.dashboard_file ||
        (params.files?.length ?? 0) > 0;
      let fileIds: Pick<
        CreateAttractionPayload,
        "main_file" | "dashboard_file" | "files"
      > = {};

      if (hasFiles) {
        const result = await uploadAttractionFiles({
          main_file: params.main_file,
          dashboard_file: params.dashboard_file,
          files: params.files,
        });
        fileIds = {
          main_file: result.main_file ?? undefined,
          dashboard_file: result.dashboard_file ?? undefined,
          files: result.files.length > 0 ? result.files : undefined,
        };
      }

      await createAttraction({ ...params.fields, ...fileIds });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ATTRACTION_KEYS.all });
      qc.invalidateQueries({ queryKey: ATTRACTION_KEYS.stats });
      toast.success("Аттракцион добавлен");
    },
    onError: (error) => {
      toast.error("Ошибка при добавлении аттракциона", { description: getApiError(error) });
    },
  });
}

export function useUpdateAttraction(attractionId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      fields: Omit<
        UpdateAttractionPayload,
        "main_file" | "dashboard_file" | "files"
      >;
      existingMainFile?: number | null;
      existingDashboardFile?: number | null;
      remainingFileIds?: number[];
      new_main_file?: File | null;
      new_dashboard_file?: File | null;
      new_files?: File[];
    }) => {
      const hasNewFiles =
        params.new_main_file ||
        params.new_dashboard_file ||
        (params.new_files?.length ?? 0) > 0;

      let fileIds: Pick<
        UpdateAttractionPayload,
        "main_file" | "dashboard_file" | "files"
      > = {
        main_file: params.existingMainFile ?? undefined,
        dashboard_file: params.existingDashboardFile ?? undefined,
        files: params.remainingFileIds?.length
          ? params.remainingFileIds
          : undefined,
      };

      if (hasNewFiles) {
        const result = await uploadAttractionFiles({
          main_file: params.new_main_file,
          dashboard_file: params.new_dashboard_file,
          files: params.new_files,
        });
        if (result.main_file != null) fileIds.main_file = result.main_file;
        if (result.dashboard_file != null)
          fileIds.dashboard_file = result.dashboard_file;
        if (result.files.length > 0)
          fileIds.files = [...(params.remainingFileIds ?? []), ...result.files];
      }

      await updateAttraction(attractionId, { ...params.fields, ...fileIds });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ATTRACTION_KEYS.all });
      qc.invalidateQueries({ queryKey: ATTRACTION_KEYS.stats });
      toast.success("Аттракцион обновлён");
    },
    onError: (error) => {
      toast.error("Ошибка при обновлении аттракциона", { description: getApiError(error) });
    },
  });
}

export function useDeleteAttractions() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => deleteAttractions(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ATTRACTION_KEYS.all });
      qc.invalidateQueries({ queryKey: ATTRACTION_KEYS.stats });
      toast.success("Аттракцион удалён");
    },
    onError: (error) => {
      toast.error("Ошибка при удалении аттракциона", { description: getApiError(error) });
    },
  });
}
