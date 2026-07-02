import api from "@/api-config/axiosInstance";
import { useQuery } from "@tanstack/react-query";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MeEmployee {
  id: number;
  firstname: string;
  lastname: string;
  fullname: string;
  date_of_birth: string;
  phone_number: string;
  telegram_username: string;
  role: number;
  salary: number;
  status: string;
  file: number;
}

interface GetMeResponse {
  statusCode: number;
  data: {
    employee: MeEmployee;
  };
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const getMe = async (): Promise<MeEmployee> => {
  const { data } = await api.get<GetMeResponse>("/auth/getme");
  return data.data.employee;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const ME_KEY = ["me"] as const;

export function useMe() {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: getMe,
  });
}
