import api from "@/api-config/axiosInstance";
import type { LoginPayload, LoginResponse, RoleItem } from "../types";

// API role nomini ichki rol nomiga moslashtirish
const API_ROLE_MAP: Record<string, string> = {
  cashier:    "kassa",
  superadmin: "superadmin",
  admin:      "admin",
  operator:   "operator",
  security:   "security",
  cleaner:    "cleaner",
};

export async function loginRequest(
  payload: LoginPayload,
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", {
    data: payload,
  });
  return data;
}

export async function fetchRoleName(roleId: string): Promise<string> {
  const { data } = await api.get<{ data: { roles: RoleItem[] } }>("/roles");
  const match = data.data.roles.find((r) => String(r.id) === roleId);
  const raw = match?.name.toLowerCase() ?? "";
  return API_ROLE_MAP[raw] ?? raw;
}
