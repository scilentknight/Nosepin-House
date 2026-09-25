"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { BannerFormModal, EMPTY_BANNER, type BannerFormValues } from "@/components/admin/banners/BannerFormModal";

interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  image: string;
  linkUrl: string | null;
  buttonText: string | null;
  sortOrder: number;
  active: boolean;
}

type ModalState = { mode: "create" } | { mode: "edit"; banner: Banner } | null;

function toFormValues(banner: Banner): BannerFormValues {
  return {
    title: banner.title,
    subtitle: banner.subtitle ?? "",
    image: banner.image,
    linkUrl: banner.linkUrl ?? "",
    buttonText: banner.buttonText ?? "",
    active: banner.active,
  };
}

function SortableRow({
  banner,
  onEdit,
  onDelete,
}: {
  banner: Banner;
  onEdit: (banner: Banner) => void;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: banner.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 border-b border-gray-100 bg-white px-3 py-2.5 ${isDragging ? "opacity-50" : ""}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="flex h-6 w-6 shrink-0 cursor-grab items-center justify-center text-gray-300 hover:text-gray-500 active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
        <Image src={banner.image} alt="" fill sizes="80px" className="object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{banner.title}</p>
        {banner.subtitle && <p className="truncate text-xs text-gray-500">{banner.subtitle}</p>}
      </div>

      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
          banner.active ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
        }`}
      >
        {banner.active ? "Active" : "Inactive"}
      </span>

      <button
        type="button"
        onClick={() => onEdit(banner)}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-slate-700"
        aria-label="Edit"
        title="Edit"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(banner.id)}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
        aria-label="Delete"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    fetch("/api/admin/banners")
      .then((res) => res.json())
      .then((json) => setBanners(json.data ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = banners.findIndex((b) => b.id === active.id);
    const newIndex = banners.findIndex((b) => b.id === over.id);
    const reordered = arrayMove(banners, oldIndex, newIndex);
    setBanners(reordered);

    const items = reordered.map((b, index) => ({ id: b.id, sortOrder: index }));
    fetch("/api/admin/banners/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
  }

  async function handleCreate(values: BannerFormValues) {
    const res = await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok) return { ok: false, message: json.message };
    load();
    return { ok: true };
  }

  async function handleUpdate(id: number, values: BannerFormValues) {
    const res = await fetch(`/api/admin/banners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok) return { ok: false, message: json.message };
    load();
    return { ok: true };
  }

  async function handleDelete() {
    if (deleteTarget === null) return;
    setIsBusy(true);
    await fetch(`/api/admin/banners/${deleteTarget}`, { method: "DELETE" });
    setIsBusy(false);
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Home Banners</h1>
          <p className="mt-1 text-sm text-gray-500">Manage the hero carousel slides shown on the storefront homepage.</p>
        </div>
        <Button variant="admin" size="sm" onClick={() => setModal({ mode: "create" })}>
          New Banner
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft">
        {isLoading ? (
          <p className="p-8 text-center text-sm text-gray-500">Loading...</p>
        ) : banners.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">No banners yet. Create one to populate the homepage hero.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={banners.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              {banners.map((banner) => (
                <SortableRow
                  key={banner.id}
                  banner={banner}
                  onEdit={(b) => setModal({ mode: "edit", banner: b })}
                  onDelete={(id) => setDeleteTarget(id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {modal?.mode === "create" && (
        <BannerFormModal
          key="create"
          title="New Banner"
          initial={EMPTY_BANNER}
          submitLabel="Create banner"
          onSubmit={handleCreate}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.mode === "edit" && (
        <BannerFormModal
          key={modal.banner.id}
          title="Edit Banner"
          initial={toFormValues(modal.banner)}
          submitLabel="Save changes"
          onSubmit={(values) => handleUpdate(modal.banner.id, values)}
          onClose={() => setModal(null)}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete banner?"
        description="This will permanently remove the slide from the homepage."
        confirmLabel="Delete"
        danger
        isBusy={isBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
