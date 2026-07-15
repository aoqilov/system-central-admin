import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, getApiError } from "@/components/sonner-toast/toast";
import {
  fetchEmployees,
  fetchEmployeeStats,
  createEmployee,
  updateEmployee,
  deleteEmployees,
} from "@/api/employees/employees.api";
import { fetchRoles } from "@/api/roles/roles.api";
import { uploadFile } from "@/api/files/files.api";
import type {
  EmployeesParams,
  CreateEmployeePayload,
  UpdateEmployeePayload,
} from "@/types/employee.types";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const EMPLOYEE_KEYS = {
  all: ["employees"] as const,
  list: (params: EmployeesParams) => ["employees", params] as const,
  stats: ["employee-stats"] as const,
  roles: ["roles"] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useEmployees(params: EmployeesParams = {}) {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.list(params),
    queryFn: () => fetchEmployees(params),
  });
}

export function useEmployeeStats() {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.stats,
    queryFn: fetchEmployeeStats,
  });
}

export function useRoles() {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.roles,
    queryFn: fetchRoles,
    staleTime: Infinity,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateEmployee() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      fields: Omit<CreateEmployeePayload, "file">;
      file?: File | null;
    }) => {
      let fileId: number | null = null;
      if (params.file) {
        fileId = await uploadFile(params.file);
      }
      await createEmployee({ ...params.fields, file: fileId });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EMPLOYEE_KEYS.all });
      qc.invalidateQueries({ queryKey: EMPLOYEE_KEYS.stats });
      toast.success("Сотрудник успешно добавлен");
    },
    onError: (error) => {
      toast.error("Ошибка при добавлении сотрудника", { description: getApiError(error) });
    },
  });
}

export function useUpdateEmployee() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: number;
      payload: Omit<UpdateEmployeePayload, "file">;
      new_file?: File | null;
    }) => {
      const payload: UpdateEmployeePayload = { ...params.payload };
      if (params.new_file) {
        payload.file = await uploadFile(params.new_file);
      }
      await updateEmployee(params.id, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EMPLOYEE_KEYS.all });
      qc.invalidateQueries({ queryKey: EMPLOYEE_KEYS.stats });
      toast.success("Данные сотрудника обновлены");
    },
    onError: (error) => {
      toast.error("Ошибка при обновлении сотрудника", { description: getApiError(error) });
    },
  });
}

export function useDeleteEmployees() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => deleteEmployees(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EMPLOYEE_KEYS.all });
      qc.invalidateQueries({ queryKey: EMPLOYEE_KEYS.stats });
      toast.success("Сотрудники удалены");
    },
    onError: (error) => {
      toast.error("Ошибка при удалении сотрудников", { description: getApiError(error) });
    },
  });
}
