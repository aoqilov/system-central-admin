import type { Pagination } from "./common.types";

export type AttractionStatus = "active" | "inactive" | "maintenance" | "closed";
export type AttractionOperatorType = "main" | "assistant";

export interface AttractionOperatorItem {
  id: number;
  firstname: string;
  lastname: string;
  file: number | null;
  type: AttractionOperatorType;
}

export interface Attraction {
  id: number;
  name: string;
  manufacturer: string;
  category: number;
  status: AttractionStatus;
  dashboard_file: number | null;
  main_file: number | null;
  files: number[];
  price: number;
  duration: number;
  seats: number;
  age_limit: number;
  min_height: number;
  max_weight: number;
  description: string;
  operators: AttractionOperatorItem[];
  device: number | null;
}

export interface AttractionStats {
  attractions: number;
  active: number;
  inactive: number;
  maintenance: number;
  closed: number;
}

export interface AttractionCategory {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface AttractionOperatorRecord {
  id: number;
  attraction: number;
  type: AttractionOperatorType;
  status: "active" | "inactive";
  operator: {
    id: number;
    firstname: string;
    lastname: string;
    file: number | null;
  };
}

// ─── Response wrappers ────────────────────────────────────────────────────────

export interface AttractionsResponse {
  statusCode: number;
  data: {
    attractions: Attraction[];
    pagination: Pagination;
  };
}

export interface AttractionDetailResponse {
  statusCode: number;
  data: { attraction: Attraction };
}

export interface AttractionStatsResponse {
  statusCode: number;
  data: { attraction_stats: AttractionStats };
}

export interface CategoriesResponse {
  statusCode: number;
  data: { categories: AttractionCategory[] };
}

export interface AssignAttractionOperatorResponse {
  statusCode: number;
  data: { "attraction-operator": AttractionOperatorRecord };
}

// ─── Query params ─────────────────────────────────────────────────────────────

export interface AttractionsParams {
  search?: string;
  categories?: number;
  statuses?: string;
  page?: number;
  limit?: number;
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface CreateAttractionPayload {
  name: string;
  manufacturer: string;
  dashboard_file?: number | null;
  main_file?: number | null;
  files?: number[];
  price: number;
  duration: number;
  seats: number;
  age_limit: number;
  min_height: number;
  max_weight: number;
  description?: string;
}

export interface UpdateAttractionPayload extends Partial<CreateAttractionPayload> {
  status?: AttractionStatus;
  device?: number | null;
}

export interface AssignAttractionOperatorBody {
  operator: number;
  type: AttractionOperatorType;
}
