"use client";

export interface OrderFilters {
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  from: string;
  to: string;
  search: string;
}

export const EMPTY_FILTERS: OrderFilters = {
  status: "",
  paymentStatus: "",
  paymentMethod: "",
  from: "",
  to: "",
  search: "",
};

export function OrderFilterBar({
  filters,
  onChange,
}: {
  filters: OrderFilters;
  onChange: (filters: OrderFilters) => void;
}) {
  function set<K extends keyof OrderFilters>(key: K, value: OrderFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  const inputClass =
    "w-full sm:w-auto rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-soft sm:flex-row sm:flex-wrap sm:items-center">
      <input
        type="text"
        placeholder="Search order #, name, email..."
        value={filters.search}
        onChange={(e) => set("search", e.target.value)}
        className={`${inputClass} sm:min-w-[200px] sm:flex-1`}
      />
      <select value={filters.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>
        <option value="">All statuses</option>
        <option value="PROCESSING">Processing</option>
        <option value="SHIPPED">Shipped</option>
        <option value="DELIVERED">Delivered</option>
        <option value="RETURNED">Returned</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      <select
        value={filters.paymentStatus}
        onChange={(e) => set("paymentStatus", e.target.value)}
        className={inputClass}
      >
        <option value="">All payment statuses</option>
        <option value="PENDING">Pending</option>
        <option value="PAID">Paid</option>
        <option value="FAILED">Failed</option>
      </select>
      <select
        value={filters.paymentMethod}
        onChange={(e) => set("paymentMethod", e.target.value)}
        className={inputClass}
      >
        <option value="">All payment methods</option>
        <option value="COD">COD</option>
        <option value="ONLINE">eSewa</option>
      </select>
      <div className="flex gap-2">
        <input type="date" value={filters.from} onChange={(e) => set("from", e.target.value)} className={inputClass} />
        <input type="date" value={filters.to} onChange={(e) => set("to", e.target.value)} className={inputClass} />
      </div>
    </div>
  );
}
