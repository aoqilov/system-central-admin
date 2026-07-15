import { useQuery } from "@tanstack/react-query";
import { fetchEmployee } from "@/api/employees/employees.api";
import { fetchRoles } from "@/api/roles/roles.api";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const EMPLOYEE_DETAIL_KEYS = {
  detail: (id: string) => ["employee", id] as const,
  roles: ["roles"] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useEmployeeDetail(id: string | undefined) {
  return useQuery({
    queryKey: EMPLOYEE_DETAIL_KEYS.detail(id ?? ""),
    queryFn: () => fetchEmployee(Number(id)),
    enabled: !!id,
  });
}

export function useRoles() {
  return useQuery({
    queryKey: EMPLOYEE_DETAIL_KEYS.roles,
    queryFn: fetchRoles,
    staleTime: Infinity,
  });
}
