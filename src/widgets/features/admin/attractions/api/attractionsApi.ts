import api from "@/api-config/axiosInstance";
import type {
  AttractionStatsResponse,
  AttractionsResponse,
  AttractionsParams,
  CreateAttractionPayload,
  UpdateAttractionPayload,
  CategoriesResponse,
} from "../types";

// ---================================================================================= GET

export async function fetchAttractions(params: AttractionsParams = {}) {
  const { data } = await api.get<AttractionsResponse>("/attractions", {
    params,
  });
  return data.data;
}

export async function fetchAttractionStats() {
  const { data } = await api.get<AttractionStatsResponse>("/attraction/stats");
  return data.data.attraction_stats;
}
// ---================================================================================= GET (categories)

export async function fetchAttractionsCategory() {
  const { data } = await api.get<CategoriesResponse>("/categories");
  return data.data.categories;
}

// ---================================================================================ POST

export async function createAttraction(payload: CreateAttractionPayload) {
  const { data } = await api.post("/attractions", { data: payload });
  return data;
}

// ---================================================================================ DELETE

export async function deleteAttractions(ids: number[]) {
  const { data } = await api.delete("/attractions", {
    data: { data: { attractionIDs: ids } },
  });
  return data;
}

// ---================================================================================= PUT

export async function updateAttraction(
  id: number,
  payload: UpdateAttractionPayload,
) {
  const { data } = await api.put(`/attractions/${id}`, { data: payload });
  return data;
}
