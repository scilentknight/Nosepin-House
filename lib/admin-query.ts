export interface PaginationParams {
  page: number;
  pageSize: number;
  skip: number;
}

export function parsePagination(searchParams: URLSearchParams, defaultPageSize = 20): PaginationParams {
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize")) || defaultPageSize));
  return { page, pageSize, skip: (page - 1) * pageSize };
}
