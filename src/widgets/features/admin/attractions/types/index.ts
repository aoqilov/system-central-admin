// --- Stats
export interface AttractionStats {
  attractions: number;
  active: number;
  inactive: number;
  maintenance: number;
  closed: number;
}

export interface AttractionStatsResponse {
  statusCode: number;
  data: {
    attraction_stats: AttractionStats;
  };
}

// --- List
export interface AssistantOperator {
  id: number;
  firstname: string;
  lastname: string;
  file: number;
}

export interface AttractionOperator {
  id: number;
  attraction: number;
  firstname: string;
  lastname: string;
  status: string;
  file: number;
  assistant_operators: AssistantOperator[];
}

export interface Attraction {
  id: number;
  name: string;
  manufacturer: string;
  category: number;
  status: string;
  dashboard_file: number;
  main_file: number;
  files: number[];
  price: number;
  duration: number;
  seats: number;
  age_limit: number;
  min_height: number;
  max_weight: number;
  description: string;
  operator: AttractionOperator;
}

export interface PaginationSchema {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AttractionsResponse {
  statusCode: number;
  data: {
    attractions: Attraction[];
    pagination: PaginationSchema;
  };
}

export interface AttractionsParams {
  search?: string;
  categories?: number;
  statuses?: string;
  page?: number;
  limit?: number;
}

// --- Create
export interface CreateAttractionPayload {
  name: string;
  manufacturer: string;
  category: number;
  dashboard_file?: number;
  main_file?: number;
  files?: number[];
  price: number;
  duration: number;
  seats: number;
  age_limit: number;
  min_height: number;
  max_weight: number;
  description?: string;
}

// --- Update
export interface UpdateAttractionPayload extends Partial<CreateAttractionPayload> {
  status?: string;
}

// --- Categories
export interface AttractionCategory {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface CategoriesResponse {
  statusCode: number;
  data: {
    categories: AttractionCategory[];
  };
}
