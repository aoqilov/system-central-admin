import api from "@/api-config/axiosInstance";
import type {
  AttractionOperatorRecord,
  AssignAttractionOperatorResponse,
  AssignAttractionOperatorBody,
} from "@/types/attraction.types";

// ---------------------------------------------------------------  POST
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

// ---------------------------------------------------------------  DELETE
export async function removeAttractionOperator(
  attractionId: number,
  operatorId: number,
): Promise<void> {
  await api.delete(`/attractions/${attractionId}/operators/${operatorId}`);
}
