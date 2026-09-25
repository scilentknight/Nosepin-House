"use client";

import { Button } from "@/components/ui/Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
  isBusy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  danger,
  isBusy,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-soft-lg">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="adminOutline" size="sm" onClick={onCancel} disabled={isBusy}>
            Cancel
          </Button>
          <Button variant={danger ? "danger" : "admin"} size="sm" onClick={onConfirm} isLoading={isBusy}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
