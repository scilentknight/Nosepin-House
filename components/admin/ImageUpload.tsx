"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export type UploadFolder = "categories" | "brands" | "products" | "variants" | "banners" | "invoices" | "payment" | "avatars";

interface ImageUploadProps {
  label?: string;
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  folder: UploadFolder;
  className?: string;
  size?: "sm" | "lg";
  /** Use "contain" for non-square brand marks/logos that shouldn't be cropped. Defaults to "cover" for photo-style images. */
  fit?: "cover" | "contain";
  /** Override the upload endpoint — defaults to the admin-only uploader. Customer-facing forms should pass "/api/upload". */
  uploadEndpoint?: string;
}

export function ImageUpload({
  label,
  value,
  onChange,
  folder,
  className = "",
  size = "lg",
  fit = "cover",
  uploadEndpoint = "/api/admin/upload",
}: ImageUploadProps) {
  const boxSize = size === "sm" ? "h-9 w-9" : "h-36 w-36";
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-6 w-6";
  const removeBtnSize = size === "sm" ? "h-4 w-4" : "h-6 w-6";
  const removeIconSize = size === "sm" ? "h-2.5 w-2.5" : "h-3.5 w-3.5";
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch(uploadEndpoint, { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message ?? "Upload failed");
        return;
      }
      onChange(json.data.url as string);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) upload(file);
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}

      {value ? (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 ${boxSize}`}>
          <Image
            src={value}
            alt=""
            fill
            sizes={size === "sm" ? "36px" : "144px"}
            className={fit === "contain" ? "object-contain p-1.5" : "object-cover"}
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className={`absolute right-0.5 top-0.5 flex items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 ${removeBtnSize}`}
            aria-label="Remove image"
          >
            <svg viewBox="0 0 24 24" className={removeIconSize} fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          disabled={isUploading}
          className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed text-xs font-medium transition-colors ${boxSize} ${
            isDragging ? "border-slate-500 bg-slate-50 text-slate-700" : "border-gray-300 text-gray-400 hover:border-slate-400 hover:text-slate-600"
          }`}
        >
          {isUploading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
          ) : size === "sm" ? (
            <svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke="currentColor" strokeWidth={1.6}>
              <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
            </svg>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke="currentColor" strokeWidth={1.6}>
                <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
              </svg>
              <span>Drop or click</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
