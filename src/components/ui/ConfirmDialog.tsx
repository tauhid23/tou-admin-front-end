"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";

type ConfirmDialogTone = "danger" | "default";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmDialogTone;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  const danger = tone === "danger";

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-md rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-start gap-4 p-5">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
              danger ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-700"
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h2 id="confirm-dialog-title" className="text-base font-bold text-slate-950">
                {title}
              </h2>
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close confirmation dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
          </div>
        </div>

        <div className="grid gap-2 border-t border-slate-100 p-4 sm:flex sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              danger ? "bg-rose-600 hover:bg-rose-700" : "bg-slate-950 hover:bg-slate-800"
            }`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
