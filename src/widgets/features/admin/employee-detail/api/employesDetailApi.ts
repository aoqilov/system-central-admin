import api from "@/api-config/axiosInstance";
import type {
  ApiEmployee,
  EmployeeDetailResponse,
  RolesResponse,
  RoleItem,
} from "../types";

// ---================================================================================= GET

export async function fetchEmployeeById(id: number): Promise<ApiEmployee> {
  const { data } = await api.get<EmployeeDetailResponse>(`/employee/${id}`);
  return data.data.employee;
}

export async function fetchRoles(): Promise<RoleItem[]> {
  const { data } = await api.get<RolesResponse>("/roles");
  return data.data.roles;
}
