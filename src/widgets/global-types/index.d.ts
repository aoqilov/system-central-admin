export {};

declare global {
  interface PaginationSchema {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}
