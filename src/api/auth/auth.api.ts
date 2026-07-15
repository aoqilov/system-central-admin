import api from "@/api-config/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import type {
  LoginPayload,
  LoginResponse,
  AuthEmployee,
  GetMeEmployeeResponse,
} from "@/types/auth.types";

export type MeEmployee = AuthEmployee;

export const ME_KEY = ["me"] as const;

// ----------------------------------------------------------------------------  GET
export async function getMe(): Promise<AuthEmployee> {
  const { data } = await api.get<GetMeEmployeeResponse>("/auth/getme");
  return data.data.employee;
}

export function useMe() {
  return useQuery({ queryKey: ME_KEY, queryFn: getMe });
}

// ---------------------------------------------------------------------------  POST
export async function login(payload: LoginPayload): Promise<string> {
  const { data } = await api.post<LoginResponse>("/auth/login", {
    data: payload,
  });
  return data.data.auth.accessToken;
}
