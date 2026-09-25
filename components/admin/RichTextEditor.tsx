"use client";

import dynamic from "next/dynamic";

const CKEditorField = dynamic(() => import("./CKEditorField"), {
  ssr: false,
  loading: () => <div className="min-h-[196px] animate-pulse rounded-lg border border-gray-200 bg-gray-50" />,
});

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ label, value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <CKEditorField value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}
