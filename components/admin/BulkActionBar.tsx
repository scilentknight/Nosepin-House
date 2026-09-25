"use client";

import { Button } from "@/components/ui/Button";

export interface BulkAction {
  key: string;
  label: string;
  variant?: "admin" | "adminOutline" | "danger";
}

interface BulkActionBarProps {
  selectedCount: number;
  actions: BulkAction[];
  onAction: (key: string) => void;
  onClear: () => void;
  isBusy?: boolean;
}

export function BulkActionBar({ selectedCount, actions, onAction, onClear, isBusy }: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
      <span className="text-sm font-medium text-slate-700">{selectedCount} selected</span>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.key}
            type="button"
            size="sm"
            variant={action.variant === "danger" ? "danger" : action.variant ?? "adminOutline"}
            disabled={isBusy}
            onClick={() => onAction(action.key)}
          >
            {action.label}
          </Button>
        ))}
      </div>
      <button type="button" onClick={onClear} className="ml-auto text-xs font-medium text-slate-500 hover:text-slate-700">
        Clear selection
      </button>
    </div>
  );
}
