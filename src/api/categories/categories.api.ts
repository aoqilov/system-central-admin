import api from "@/api-config/axiosInstance";
import type { AttractionCategory, CategoriesResponse } from "@/types/attraction.types";

export async function fetchCategories(): Promise<AttractionCategory[]> {
  const { data } = await api.get<CategoriesResponse>("/categories");
  return data.data.categories;
}
