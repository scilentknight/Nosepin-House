// "use client";

// import { useCallback, useEffect, useState } from "react";
// import Link from "next/link";
// import { Pencil, Copy, Trash2 } from "lucide-react";
// import { Button } from "@/components/ui/Button";
// import { StatusBadge } from "@/components/ui/Badge";
// import { SearchInput } from "@/components/admin/SearchInput";
// import { Pagination } from "@/components/admin/Pagination";
// import { BulkActionBar } from "@/components/admin/BulkActionBar";
// import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

// interface ProductRow {
//   id: string;
//   name: string;
//   sku: string | null;
//   price: number;
//   stock: number;
//   stockStatus: "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER";
//   status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
//   isFeatured: boolean;
//   category: { id: string; name: string };
//   brand: { id: string; name: string } | null;
//   images: { url: string | null }[];
//   _count: { variants: number };
// }

// interface Option {
//   id: string;
//   name: string;
// }

// const PAGE_SIZE = 20;

// export default function ProductsPage() {
//   const [search, setSearch] = useState("");
//   const [categoryId, setCategoryId] = useState("");
//   const [brandId, setBrandId] = useState("");
//   const [status, setStatus] = useState("");
//   const [stockStatus, setStockStatus] = useState("");
//   const [featured, setFeatured] = useState("");
//   const [page, setPage] = useState(1);

//   const [categories, setCategories] = useState<Option[]>([]);
//   const [brands, setBrands] = useState<Option[]>([]);
//   const [rows, setRows] = useState<ProductRow[]>([]);
//   const [total, setTotal] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
//   const [isBusy, setIsBusy] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

//   useEffect(() => {
//     fetch("/api/admin/categories?tree=true")
//       .then((res) => res.json())
//       .then((json) => setCategories(json.data?.categories ?? []));
//     fetch("/api/admin/brands?pageSize=100")
//       .then((res) => res.json())
//       .then((json) => setBrands(json.data?.brands ?? []));
//   }, []);

//   const load = useCallback(() => {
//     setIsLoading(true);
//     const params = new URLSearchParams();
//     if (search) params.set("search", search);
//     if (categoryId) params.set("categoryId", categoryId);
//     if (brandId) params.set("brandId", brandId);
//     if (status) params.set("status", status);
//     if (stockStatus) params.set("stockStatus", stockStatus);
//     if (featured) params.set("featured", featured);
//     params.set("page", String(page));
//     params.set("pageSize", String(PAGE_SIZE));
//     fetch(`/api/admin/products?${params.toString()}`)
//       .then((res) => res.json())
//       .then((json) => {
//         setRows(json.data?.products ?? []);
//         setTotal(json.data?.total ?? 0);
//       })
//       .finally(() => setIsLoading(false));
//   }, [search, categoryId, brandId, status, stockStatus, featured, page]);

//   useEffect(() => {
//     const timer = setTimeout(load, 0);
//     return () => clearTimeout(timer);
//   }, [load]);

//   function toggleSelect(id: string) {
//     setSelectedIds((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });
//   }

//   async function handleBulkAction(action: string) {
//     setIsBusy(true);
//     await fetch("/api/admin/products/bulk", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ids: Array.from(selectedIds), action }),
//     });
//     setIsBusy(false);
//     setSelectedIds(new Set());
//     load();
//   }

//   async function handleDuplicate(id: string) {
//     setIsBusy(true);
//     await fetch(`/api/admin/products/${id}/duplicate`, { method: "POST" });
//     setIsBusy(false);
//     load();
//   }

//   async function handleDelete() {
//     if (!deleteTarget) return;
//     setIsBusy(true);
//     await fetch(`/api/admin/products/${deleteTarget}`, { method: "DELETE" });
//     setIsBusy(false);
//     setDeleteTarget(null);
//     load();
//   }

//   const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
//   const selectClass =
//     "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

//   return (
//     <div>
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-gray-900">
//             Products
//           </h1>
//           <p className="mt-1 text-sm text-gray-500">
//             Manage your product catalog.
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <Link href="/admin/products/trash">
//             <Button variant="adminOutline" size="sm">
//               Trash
//             </Button>
//           </Link>
//           <Link href="/admin/products/new">
//             <Button variant="admin" size="sm">
//               New Product
//             </Button>
//           </Link>
//         </div>
//       </div>

//       <div className="mt-6 flex flex-wrap items-center gap-3">
//         <SearchInput
//           value={search}
//           onChange={(v) => {
//             setSearch(v);
//             setPage(1);
//           }}
//           placeholder="Search by name or SKU..."
//           className="w-full sm:w-64"
//         />
//         <select
//           value={categoryId}
//           onChange={(e) => {
//             setCategoryId(e.target.value);
//             setPage(1);
//           }}
//           className={selectClass}
//         >
//           <option value="">All categories</option>
//           {categories.map((c) => (
//             <option key={c.id} value={c.id}>
//               {c.name}
//             </option>
//           ))}
//         </select>
//         <select
//           value={brandId}
//           onChange={(e) => {
//             setBrandId(e.target.value);
//             setPage(1);
//           }}
//           className={selectClass}
//         >
//           <option value="">All brands</option>
//           {brands.map((b) => (
//             <option key={b.id} value={b.id}>
//               {b.name}
//             </option>
//           ))}
//         </select>
//         <select
//           value={status}
//           onChange={(e) => {
//             setStatus(e.target.value);
//             setPage(1);
//           }}
//           className={selectClass}
//         >
//           <option value="">All statuses</option>
//           <option value="DRAFT">Draft</option>
//           <option value="PUBLISHED">Published</option>
//           <option value="ARCHIVED">Archived</option>
//         </select>
//         <select
//           value={stockStatus}
//           onChange={(e) => {
//             setStockStatus(e.target.value);
//             setPage(1);
//           }}
//           className={selectClass}
//         >
//           <option value="">All stock</option>
//           <option value="IN_STOCK">In stock</option>
//           <option value="OUT_OF_STOCK">Out of stock</option>
//           <option value="ON_BACKORDER">On backorder</option>
//         </select>
//         <select
//           value={featured}
//           onChange={(e) => {
//             setFeatured(e.target.value);
//             setPage(1);
//           }}
//           className={selectClass}
//         >
//           <option value="">Featured & non-featured</option>
//           <option value="true">Featured only</option>
//         </select>
//       </div>

//       <div className="mt-4">
//         <BulkActionBar
//           selectedCount={selectedIds.size}
//           isBusy={isBusy}
//           onClear={() => setSelectedIds(new Set())}
//           onAction={handleBulkAction}
//           actions={[
//             { key: "publish", label: "Publish" },
//             { key: "unpublish", label: "Unpublish" },
//             { key: "archive", label: "Archive" },
//             { key: "feature", label: "Feature" },
//             { key: "unfeature", label: "Unfeature" },
//             { key: "delete", label: "Delete", variant: "danger" },
//           ]}
//         />
//       </div>

//       <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft">
//         {isLoading ? (
//           <p className="p-8 text-center text-sm text-gray-500">Loading...</p>
//         ) : rows.length === 0 ? (
//           <p className="p-8 text-center text-sm text-gray-500">
//             No products found.
//           </p>
//         ) : (
//           <>
//             <div className="hidden overflow-x-auto md:block">
//               <table className="w-full min-w-[760px] text-left text-sm">
//                 <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
//                   <tr>
//                     <th className="w-10 px-4 py-3">Image</th>
//                     <th className="px-4 py-3">Product</th>
//                     <th className="px-4 py-3">SKU</th>
//                     <th className="px-4 py-3">Category</th>
//                     <th className="px-4 py-3">Price</th>
//                     <th className="px-4 py-3">Stock</th>
//                     <th className="px-4 py-3">Status</th>
//                     <th className="px-4 py-3 text-center">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {rows.map((p) => (
//                     <tr key={p.id}>
//                       <td className="px-4 py-3">
//                         <input
//                           type="checkbox"
//                           checked={selectedIds.has(p.id)}
//                           onChange={() => toggleSelect(p.id)}
//                           className="h-4 w-4 rounded border-gray-300"
//                         />
//                       </td>
//                       <td className="px-4 py-3">
//                         <Link
//                           href={`/admin/products/${p.id}`}
//                           className="flex items-center gap-3 font-medium text-gray-900 hover:text-slate-600"
//                         >
//                           {p.images[0]?.url && (
//                             <img
//                               src={p.images[0].url}
//                               alt=""
//                               className="h-9 w-9 rounded-lg object-cover"
//                             />
//                           )}
//                           <span>
//                             {p.name}
//                             {p.isFeatured && (
//                               <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
//                                 Featured
//                               </span>
//                             )}
//                             {p._count.variants > 0 && (
//                               <span className="ml-2 text-xs font-normal text-gray-400">
//                                 {p._count.variants} variants
//                               </span>
//                             )}
//                           </span>
//                         </Link>
//                       </td>
//                       <td className="px-4 py-3 text-gray-500">{p.sku}</td>
//                       <td className="px-4 py-3 text-gray-500">
//                         {p.category?.name}
//                       </td>
//                       <td className="px-4 py-3 text-gray-700">
//                         Rs {p.price.toLocaleString()}
//                       </td>
//                       <td className="px-4 py-3 text-gray-500">{p.stock}</td>
//                       <td className="px-4 py-3">
//                         <StatusBadge status={p.status} />
//                       </td>
//                       <td className="px-4 py-3 text-right">
//                         <div className="flex items-center justify-end gap-1">
//                           <Link
//                             href={`/admin/products/${p.id}`}
//                             title="Edit"
//                             aria-label="Edit"
//                             className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-slate-700"
//                           >
//                             <Pencil className="h-4 w-4" />
//                           </Link>
//                           <button
//                             type="button"
//                             onClick={() => handleDuplicate(p.id)}
//                             title="Duplicate"
//                             aria-label="Duplicate"
//                             className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-slate-700"
//                           >
//                             <Copy className="h-4 w-4" />
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => setDeleteTarget(p.id)}
//                             title="Move to trash"
//                             aria-label="Move to trash"
//                             className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <ul className="divide-y divide-gray-100 md:hidden">
//               {rows.map((p) => (
//                 <li key={p.id} className="flex items-center gap-3 px-4 py-3">
//                   <input
//                     type="checkbox"
//                     checked={selectedIds.has(p.id)}
//                     onChange={() => toggleSelect(p.id)}
//                     className="h-4 w-4 shrink-0 rounded border-gray-300"
//                   />
//                   <Link
//                     href={`/admin/products/${p.id}`}
//                     className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900"
//                   >
//                     {p.name}
//                   </Link>
//                   <StatusBadge status={p.status} />
//                   <Link
//                     href={`/admin/products/${p.id}`}
//                     title="Edit"
//                     aria-label="Edit"
//                     className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
//                   >
//                     <Pencil className="h-4 w-4" />
//                   </Link>
//                   <button
//                     type="button"
//                     onClick={() => handleDuplicate(p.id)}
//                     title="Duplicate"
//                     aria-label="Duplicate"
//                     className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
//                   >
//                     <Copy className="h-4 w-4" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setDeleteTarget(p.id)}
//                     title="Move to trash"
//                     aria-label="Move to trash"
//                     className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </li>
//               ))}
//             </ul>
//             <div className="px-2">
//               <Pagination
//                 page={page}
//                 totalPages={totalPages}
//                 total={total}
//                 pageSize={PAGE_SIZE}
//                 onPageChange={setPage}
//               />
//             </div>
//           </>
//         )}
//       </div>

//       <ConfirmDialog
//         open={deleteTarget !== null}
//         title="Move product to trash?"
//         description="You can restore it later from the trash."
//         confirmLabel="Move to trash"
//         danger
//         isBusy={isBusy}
//         onConfirm={handleDelete}
//         onCancel={() => setDeleteTarget(null)}
//       />
//     </div>
//   );
// }

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Copy, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { BulkActionBar } from "@/components/admin/BulkActionBar";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface ProductRow {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  stock: number;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;

  category: {
    id: string;
    name: string;
  };

  brand: {
    id: string;
    name: string;
  } | null;

  /*
   * Featured image is the primary/main product image.
   */
  featuredImage: string | null;

  /*
   * Gallery images are kept separately.
   */
  images: {
    url: string | null;
  }[];

  _count: {
    variants: number;
  };
}

interface Option {
  id: string;
  name: string;
}

const PAGE_SIZE = 20;

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [status, setStatus] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [featured, setFeatured] = useState("");
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState<Option[]>([]);
  const [brands, setBrands] = useState<Option[]>([]);

  const [rows, setRows] = useState<ProductRow[]>([]);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [isBusy, setIsBusy] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  /*
   * ============================================================
   * LOAD FILTER OPTIONS
   * ============================================================
   */

  useEffect(() => {
    fetch("/api/admin/categories?tree=true")
      .then((res) => res.json())
      .then((json) => {
        setCategories(json.data?.categories ?? []);
      })
      .catch((error) => {
        console.error("Failed to load categories:", error);
      });

    fetch("/api/admin/brands?pageSize=100")
      .then((res) => res.json())
      .then((json) => {
        setBrands(json.data?.brands ?? []);
      })
      .catch((error) => {
        console.error("Failed to load brands:", error);
      });
  }, []);

  /*
   * ============================================================
   * LOAD PRODUCTS
   * ============================================================
   */

  const load = useCallback(async () => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (categoryId) {
        params.set("categoryId", categoryId);
      }

      if (brandId) {
        params.set("brandId", brandId);
      }

      if (status) {
        params.set("status", status);
      }

      if (stockStatus) {
        params.set("stockStatus", stockStatus);
      }

      if (featured) {
        params.set("featured", featured);
      }

      params.set("page", String(page));
      params.set("pageSize", String(PAGE_SIZE));

      const res = await fetch(`/api/admin/products?${params.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const json = await res.json();

      console.log("========== PRODUCTS API ==========");
      console.log("HTTP status:", res.status);
      console.log("Response:", json);
      console.log("Products:", json?.data?.products);
      console.log("Total:", json?.data?.total);
      console.log("==================================");

      if (!res.ok) {
        throw new Error(json?.message || "Failed to load products");
      }

      const products = Array.isArray(json?.data?.products)
        ? json.data.products
        : [];

      const totalCount =
        typeof json?.data?.total === "number"
          ? json.data.total
          : products.length;

      setRows(products);
      setTotal(totalCount);
    } catch (error) {
      console.error("Failed to load products:", error);

      setRows([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [search, categoryId, brandId, status, stockStatus, featured, page]);

  /*
   * ============================================================
   * RELOAD WHEN FILTERS CHANGE
   * ============================================================
   */

  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 300);

    return () => clearTimeout(timer);
  }, [load]);

  /*
   * ============================================================
   * SELECT PRODUCT
   * ============================================================
   */

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  /*
   * ============================================================
   * BULK ACTION
   * ============================================================
   */

  async function handleBulkAction(action: string) {
    if (selectedIds.size === 0) {
      return;
    }

    setIsBusy(true);

    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: Array.from(selectedIds),
          action,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "Bulk action failed");
      }

      setSelectedIds(new Set());

      await load();
    } catch (error) {
      console.error("Bulk action failed:", error);
    } finally {
      setIsBusy(false);
    }
  }

  /*
   * ============================================================
   * DUPLICATE PRODUCT
   * ============================================================
   */

  async function handleDuplicate(id: string) {
    setIsBusy(true);

    try {
      const res = await fetch(`/api/admin/products/${id}/duplicate`, {
        method: "POST",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "Failed to duplicate product");
      }

      await load();
    } catch (error) {
      console.error("Failed to duplicate product:", error);
    } finally {
      setIsBusy(false);
    }
  }

  /*
   * ============================================================
   * DELETE PRODUCT
   * ============================================================
   */

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    setIsBusy(true);

    try {
      const res = await fetch(`/api/admin/products/${deleteTarget}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "Failed to delete product");
      }

      setDeleteTarget(null);

      setSelectedIds((previous) => {
        const next = new Set(previous);
        next.delete(deleteTarget);
        return next;
      });

      await load();
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setIsBusy(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const selectClass =
    "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

  return (
    <div>
      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your product catalog.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/admin/products/trash">
            <Button variant="adminOutline" size="sm">
              Trash
            </Button>
          </Link>

          <Link href="/admin/products/new">
            <Button variant="admin" size="sm">
              New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* ======================================================
          FILTERS
          ====================================================== */}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search by name or SKU..."
          className="w-full sm:w-64"
        />

        {/* Category */}
        <select
          value={categoryId}
          onChange={(event) => {
            setCategoryId(event.target.value);
            setPage(1);
          }}
          className={selectClass}
        >
          <option value="">All categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Brand */}
        <select
          value={brandId}
          onChange={(event) => {
            setBrandId(event.target.value);
            setPage(1);
          }}
          className={selectClass}
        >
          <option value="">All brands</option>

          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className={selectClass}
        >
          <option value="">All statuses</option>

          <option value="DRAFT">Draft</option>

          <option value="PUBLISHED">Published</option>

          <option value="ARCHIVED">Archived</option>
        </select>

        {/* Stock */}
        <select
          value={stockStatus}
          onChange={(event) => {
            setStockStatus(event.target.value);
            setPage(1);
          }}
          className={selectClass}
        >
          <option value="">All stock</option>

          <option value="IN_STOCK">In stock</option>

          <option value="OUT_OF_STOCK">Out of stock</option>

          <option value="ON_BACKORDER">On backorder</option>
        </select>

        {/* Featured */}
        <select
          value={featured}
          onChange={(event) => {
            setFeatured(event.target.value);
            setPage(1);
          }}
          className={selectClass}
        >
          <option value="">Featured & non-featured</option>

          <option value="true">Featured only</option>
        </select>
      </div>

      {/* ======================================================
          BULK ACTIONS
          ====================================================== */}

      <div className="mt-4">
        <BulkActionBar
          selectedCount={selectedIds.size}
          isBusy={isBusy}
          onClear={() => setSelectedIds(new Set())}
          onAction={handleBulkAction}
          actions={[
            {
              key: "publish",
              label: "Publish",
            },
            {
              key: "unpublish",
              label: "Unpublish",
            },
            {
              key: "archive",
              label: "Archive",
            },
            {
              key: "feature",
              label: "Feature",
            },
            {
              key: "unfeature",
              label: "Unfeature",
            },
            {
              key: "delete",
              label: "Delete",
              variant: "danger",
            },
          ]}
        />
      </div>

      {/* ======================================================
          PRODUCTS TABLE
          ====================================================== */}

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft">
        {isLoading ? (
          <p className="p-8 text-center text-sm text-gray-500">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">
            No products found.
          </p>
        ) : (
          <>
            {/* ==================================================
                DESKTOP TABLE
                ================================================== */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="w-10 px-4 py-3"></th>

                    <th className="px-4 py-3">Product</th>

                    <th className="px-4 py-3">SKU</th>

                    <th className="px-4 py-3">Category</th>

                    <th className="px-4 py-3">Price</th>

                    <th className="px-4 py-3">Stock</th>

                    <th className="px-4 py-3">Status</th>

                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {rows.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      {/* Checkbox */}
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </td>

                      {/* Product */}
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="flex items-center gap-3 font-medium text-gray-900 hover:text-slate-600"
                        >
                          {product.featuredImage && (
                            <img
                              src={product.featuredImage}
                              alt={product.name}
                              className="h-10 w-18 rounded object-cover"
                            />
                          )}

                          <span>
                            {product.name}

                            {product.isFeatured && (
                              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                                Featured
                              </span>
                            )}

                            {product._count.variants > 0 && (
                              <span className="ml-2 text-xs font-normal text-gray-400">
                                {product._count.variants} variants
                              </span>
                            )}
                          </span>
                        </Link>
                      </td>

                      {/* SKU */}
                      <td className="px-4 py-3 text-gray-500">
                        {product.sku ?? "—"}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 text-gray-500">
                        {product.category?.name ?? "—"}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 text-gray-700">
                        Rs {product.price.toLocaleString()}
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3 text-gray-500">
                        {product.stock}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={product.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Edit */}
                          <Link
                            href={`/admin/products/${product.id}`}
                            title="Edit"
                            aria-label="Edit"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-slate-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          {/* Duplicate */}
                          <button
                            type="button"
                            onClick={() => handleDuplicate(product.id)}
                            title="Duplicate"
                            aria-label="Duplicate"
                            disabled={isBusy}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-slate-700 disabled:opacity-50"
                          >
                            <Copy className="h-4 w-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(product.id)}
                            title="Move to trash"
                            aria-label="Move to trash"
                            disabled={isBusy}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ==================================================
                MOBILE LIST
                ================================================== */}

            <ul className="divide-y divide-gray-100 md:hidden">
              {rows.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedIds.has(product.id)}
                    onChange={() => toggleSelect(product.id)}
                    className="h-4 w-4 shrink-0 rounded border-gray-300"
                  />

                  {/* Featured Image */}
                  {product.featuredImage && (
                    <img
                      src={product.featuredImage}
                      alt={product.name}
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                  )}

                  {/* Product */}
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900"
                  >
                    {product.name}
                  </Link>

                  {/* Status */}
                  <StatusBadge status={product.status} />

                  {/* Edit */}
                  <Link
                    href={`/admin/products/${product.id}`}
                    title="Edit"
                    aria-label="Edit"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>

                  {/* Duplicate */}
                  <button
                    type="button"
                    onClick={() => handleDuplicate(product.id)}
                    title="Duplicate"
                    aria-label="Duplicate"
                    disabled={isBusy}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Copy className="h-4 w-4" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(product.id)}
                    title="Move to trash"
                    aria-label="Move to trash"
                    disabled={isBusy}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            {/* ==================================================
                PAGINATION
                ================================================== */}

            <div className="px-2">
              <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>

      {/* ======================================================
          DELETE CONFIRMATION
          ====================================================== */}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Move product to trash?"
        description="You can restore it later from the trash."
        confirmLabel="Move to trash"
        danger
        isBusy={isBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
