import api from "@/api-config/axiosInstance";
import type { LoginPayload, LoginResponse, RoleItem } from "../types";

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", { data: payload });
  return data;
}

export async function fetchRoleName(roleId: string): Promise<string> {
  try {
    const { data } = await api.get<{ data: { roles: RoleItem[] } }>("/roles");
    const match = data.data.roles.find((r) => String(r.id) === roleId);
    return match?.name.toLowerCase() ?? "admin";
  } catch {
    return "admin";
  }
}
