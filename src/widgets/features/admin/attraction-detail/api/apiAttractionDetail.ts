import api from "@/api-config/axiosInstance";
import type {
  AttractionDetail,
  AttractionDetailResponse,
  AttractionOperatorRecord,
  AssignAttractionOperatorBody,
  AssignAttractionOperatorResponse,
} from "../types";

export async function fetchAttractionDetail(
  id: number,
): Promise<AttractionDetail> {
  const { data } = await api.get<AttractionDetailResponse>(`/attraction/${id}`);
  return data.data.attraction;
}

export async function assignAttractionOperator(
  attractionId: number,
  body: AssignAttractionOperatorBody,
): Promise<AttractionOperatorRecord> {
  const { data } = await api.post<AssignAttractionOperatorResponse>(
    `/attractions/${attractionId}/operators`,
    { data: body },
  );
  return data.data["attraction-operator"];
}
