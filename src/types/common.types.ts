export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
