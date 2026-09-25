"use client";

import { useRef, useState } from "react";
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
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { UploadFolder } from "@/components/admin/ImageUpload";

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

interface GalleryUploadProps {
  label?: string;
  value: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  folder: UploadFolder;
  className?: string;
}

function SortableThumb({
  image,
  onRemove,
  onAltChange,
}: {
  image: GalleryImage;
  onRemove: () => void;
  onAltChange: (alt: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="relative h-28 w-full bg-gray-50">
        <Image src={image.url} alt={image.alt} fill sizes="200px" className="object-cover" />
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="absolute left-1.5 top-1.5 flex h-6 w-6 cursor-grab items-center justify-center rounded-full bg-black/60 text-white active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
            <circle cx="8" cy="6" r="1.4" />
            <circle cx="8" cy="12" r="1.4" />
            <circle cx="8" cy="18" r="1.4" />
            <circle cx="16" cy="6" r="1.4" />
            <circle cx="16" cy="12" r="1.4" />
            <circle cx="16" cy="18" r="1.4" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
          aria-label="Remove image"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <input
        value={image.alt}
        onChange={(e) => onAltChange(e.target.value)}
        placeholder="Alt text"
        className="border-t border-gray-100 px-2 py-1.5 text-xs text-gray-700 outline-none focus:bg-gray-50"
      />
    </div>
  );
}

export function GalleryUpload({ label, value, onChange, folder, className = "" }: GalleryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setIsUploading(true);
    try {
      const uploaded: GalleryImage[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const json = await res.json();
        if (!res.ok) {
          setError(json.message ?? "Upload failed");
          continue;
        }
        uploaded.push({ id: crypto.randomUUID(), url: json.data.url as string, alt: "" });
      }
      onChange([...value, ...uploaded]);
    } finally {
      setIsUploading(false);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = value.findIndex((v) => v.id === active.id);
    const newIndex = value.findIndex((v) => v.id === over.id);
    onChange(arrayMove(value, oldIndex, newIndex));
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={value.map((v) => v.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {value.map((image) => (
              <SortableThumb
                key={image.id}
                image={image}
                onRemove={() => onChange(value.filter((v) => v.id !== image.id))}
                onAltChange={(alt) => onChange(value.map((v) => (v.id === image.id ? { ...v, alt } : v)))}
              />
            ))}

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="flex h-28 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-gray-300 text-xs font-medium text-gray-400 transition-colors hover:border-slate-400 hover:text-slate-600"
            >
              {isUploading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.6}>
                    <path d="M12 4v16m-8-8h16" />
                  </svg>
                  <span>Add images</span>
                </>
              )}
            </button>
          </div>
        </SortableContext>
      </DndContext>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
