import api from "@/api-config/axiosInstance";
import type {
  GetMeResponse,
  AssignOperatorPayload,
  AssignOperatorResponse,
  DeleteOperatorResponse,
} from "@/types/cashbox.types";
import type { ApiResponse } from "@/types/common.types";

export async function getCashboxOperatorMe(): Promise<ApiResponse<GetMeResponse>> {
  const { data } = await api.get<ApiResponse<GetMeResponse>>("/cashbox/operators/me");
  return data;
}

export async function assignOperatorToCashbox(
  cashboxID: number,
  payload: AssignOperatorPayload,
): Promise<ApiResponse<AssignOperatorResponse>> {
  const { data } = await api.post<ApiResponse<AssignOperatorResponse>>(
    `/cashbox/${cashboxID}/operators`,
    { data: payload },
  );
  return data;
}

export async function deleteOperatorFromCashbox(
  cashboxID: number,
  operatorID: number,
): Promise<ApiResponse<DeleteOperatorResponse>> {
  const { data } = await api.delete<ApiResponse<DeleteOperatorResponse>>(
    `/cashbox/${cashboxID}/operators/${operatorID}`,
  );
  return data;
}
