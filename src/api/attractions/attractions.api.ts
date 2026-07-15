import api from "@/api-config/axiosInstance";
import type {
  Attraction,
  AttractionStats,
  AttractionsResponse,
  AttractionDetailResponse,
  AttractionStatsResponse,
  AttractionsParams,
  CreateAttractionPayload,
  UpdateAttractionPayload,
} from "@/types/attraction.types";
import type { Pagination } from "@/types/common.types";

// ------------------------------------------------------------------------------  GET
export async function fetchAttractions(
  params: AttractionsParams = {},
): Promise<{ attractions: Attraction[]; pagination: Pagination }> {
  const { data } = await api.get<AttractionsResponse>("/attractions", {
    params,
  });
  return data.data;
}

export async function fetchAttractionDetail(
  attractionID: number,
  deviceID?: number,
): Promise<Attraction> {
  const { data } = await api.get<AttractionDetailResponse>("/attraction", {
    params: { attractionID, ...(deviceID != null && { deviceID }) },
  });
  return data.data.attraction;
}

export async function fetchAttractionStats(): Promise<AttractionStats> {
  const { data } = await api.get<AttractionStatsResponse>("/attraction/stats");
  return data.data.attraction_stats;
}

// -------------------------------------------------------------------------------  POST
export async function createAttraction(
  payload: CreateAttractionPayload,
): Promise<void> {
  await api.post("/attractions", { data: payload });
}

// -------------------------------------------------------------------------------  PUT
export async function updateAttraction(
  id: number,
  payload: UpdateAttractionPayload,
): Promise<void> {
  await api.put(`/attractions/${id}`, { data: payload });
}

// -------------------------------------------------------------------------------  DELETE
export async function deleteAttractions(ids: number[]): Promise<void> {
  await api.delete("/attractions", { data: { data: { attractionIDs: ids } } });
}
