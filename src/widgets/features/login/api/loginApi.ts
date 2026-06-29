import api from "@/api-config/axiosInstance";
import { RoleTypes } from "@/const/constData";
import type { LoginPayload, LoginResponse, RoleItem } from "../types";

const API_ROLE_MAP: Partial<Record<string, RoleTypes>> = {
  superadmin:      RoleTypes.SUPERADMIN,
  cashier:         RoleTypes.CASHIER,
  head_cashier:    RoleTypes.HEAD_CASHIER,
  operator:        RoleTypes.OPERATOR,
  head_operator:   RoleTypes.HEAD_OPERATOR,
  head_accountant: RoleTypes.HEAD_ACCOUNTANT,
};

export async function loginRequest(
  payload: LoginPayload,
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", {
    data: payload,
  });
  return data;
}

export async function fetchRoleName(roleId: string): Promise<RoleTypes> {
  const { data } = await api.get<{ data: { roles: RoleItem[] } }>("/roles");
  const match = data.data.roles.find((r) => String(r.id) === roleId);
  const raw = match?.name.toLowerCase() ?? "";
  return (API_ROLE_MAP[raw] ?? raw) as RoleTypes;
}
