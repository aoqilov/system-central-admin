import api from "@/api-config/axiosInstance";
import type { RoleItem, RolesResponse } from "@/types/role.types";

export async function fetchRoles(): Promise<RoleItem[]> {
  const { data } = await api.get<RolesResponse>("/roles");
  return data.data.roles;
}
