"use client";

import { useEffect, useState } from "react";
import { Wallet, ShoppingBag, Users, Package } from "lucide-react";
import { StatTile } from "@/components/admin/dashboard/StatTile";
import { RevenueChart } from "@/components/admin/dashboard/RevenueChart";
import { OrdersByStatusChart } from "@/components/admin/dashboard/OrdersByStatusChart";
import { TopProductsChart } from "@/components/admin/dashboard/TopProductsChart";
import { formatPrice } from "@/lib/format";

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueByDay: { date: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
  topProducts: { name: string; quantity: number }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch("/api/admin/dashboard")
        .then((res) => res.json())
        .then((json) => setData(json.data ?? null))
        .finally(() => setIsLoading(false));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">An overview of your store&apos;s performance.</p>

      {isLoading || !data ? (
        <p className="mt-8 text-sm text-gray-500">Loading dashboard…</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile label="Total Revenue" value={formatPrice(data.totalRevenue)} icon={<Wallet className="h-5 w-5" />} />
            <StatTile label="Total Orders" value={data.totalOrders.toLocaleString()} icon={<ShoppingBag className="h-5 w-5" />} />
            <StatTile label="Customers" value={data.totalCustomers.toLocaleString()} icon={<Users className="h-5 w-5" />} />
            <StatTile label="Published Products" value={data.totalProducts.toLocaleString()} icon={<Package className="h-5 w-5" />} />
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Revenue — last 30 days</h2>
            <div className="mt-4">
              <RevenueChart data={data.revenueByDay} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Orders by Status</h2>
              <div className="mt-4">
                <OrdersByStatusChart data={data.ordersByStatus} />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Top Selling Products</h2>
              <div className="mt-4">
                <TopProductsChart data={data.topProducts} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
