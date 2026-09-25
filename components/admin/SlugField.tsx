"use client";

import { useEffect, useRef, useState } from "react";
import { slugify } from "@/lib/slug";
import { Input } from "@/components/ui/Input";

interface SlugFieldProps {
  value: string;
  onChange: (slug: string) => void;
  sourceValue: string;
  prefix?: string;
  label?: string;
}

export function SlugField({ value, onChange, sourceValue, prefix, label = "Slug" }: SlugFieldProps) {
  const [touched, setTouched] = useState(false);
  const lastAutoValue = useRef("");

  useEffect(() => {
    if (touched) return;
    const generated = slugify(sourceValue);
    lastAutoValue.current = generated;
    onChange(generated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceValue, touched]);

  return (
    <div className="flex flex-col gap-1.5">
      <Input
        label={label}
        value={value}
        onChange={(e) => {
          setTouched(true);
          onChange(slugify(e.target.value));
        }}
      />
      {prefix && value && <p className="text-xs text-gray-400">{prefix}{value}</p>}
    </div>
  );
}
