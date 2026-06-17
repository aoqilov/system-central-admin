import api from "@/api-config/axiosInstance";
import type {
  EmployeesResponse,
  EmployeeResponse,
  EmployeeStatsResponse,
  RolesResponse,
  CreateEmployeePayload,
  UpdateEmployeePayload,
  EmployeesParams,
} from "../types";

// ---================================================================================= GET
export async function fetchEmployees(params: EmployeesParams = {}) {
  const { data } = await api.get<EmployeesResponse>("/employees", { params });
  return data.data;
}

export async function fetchEmployee(id: number) {
  const { data } = await api.get<EmployeeResponse>(`/employee/${id}`);
  return data.data.employee;
}

export async function fetchEmployeeStats() {
  const { data } = await api.get<EmployeeStatsResponse>("/employee/stats");
  return data.data.employee_stats;
}

export async function fetchRoles() {
  const { data } = await api.get<RolesResponse>("/roles");
  return data.data.roles;
}
// ---================================================================================ POST

export async function createEmployee(payload: CreateEmployeePayload) {
  const { data } = await api.post("/employees", { data: payload });
  return data;
}
// ---================================================================================ PUT

export async function updateEmployee(
  id: number,
  payload: UpdateEmployeePayload,
) {
  const { data } = await api.put(`/employee/${id}`, { data: payload });
  return data;
}

// ---================================================================================ DELETE

export async function deleteEmployees(ids: number[]) {
  const { data } = await api.delete("/employees", {
    data: { data: { employeeIDs: ids } },
  });
  return data;
}
