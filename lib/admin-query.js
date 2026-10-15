export function parsePagination(searchParams, defaultPageSize = 20) {
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize")) || defaultPageSize));
    return { page, pageSize, skip: (page - 1) * pageSize };
}
