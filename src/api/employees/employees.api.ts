import api from "@/api-config/axiosInstance";
import type {
  ApiEmployee,
  EmployeeStats,
  EmployeesResponse,
  EmployeeResponse,
  EmployeeStatsResponse,
  EmployeesParams,
  CreateEmployeePayload,
  UpdateEmployeePayload,
} from "@/types/employee.types";
import type { Pagination } from "@/types/common.types";

export async function fetchEmployees(
  params: EmployeesParams = {},
): Promise<{ employees: ApiEmployee[]; pagination: Pagination }> {
  const { data } = await api.get<EmployeesResponse>("/employees", { params });
  return data.data;
}

export async function fetchEmployee(id: number): Promise<ApiEmployee> {
  const { data } = await api.get<EmployeeResponse>(`/employee/${id}`);
  return data.data.employee;
}

export async function fetchEmployeeStats(): Promise<EmployeeStats> {
  const { data } = await api.get<EmployeeStatsResponse>("/employee/stats");
  return data.data.employee_stats;
}

export async function createEmployee(
  payload: CreateEmployeePayload,
): Promise<void> {
  await api.post("/employees", { data: payload });
}

export async function updateEmployee(
  id: number,
  payload: UpdateEmployeePayload,
): Promise<void> {
  await api.put(`/employee/${id}`, { data: payload });
}

export async function deleteEmployees(ids: number[]): Promise<void> {
  await api.delete("/employees", { data: { data: { employeeIDs: ids } } });
}
