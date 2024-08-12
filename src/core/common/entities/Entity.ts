// Offset based Pagination
export interface Pagination<T> {
  page: number;
  data: T[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
