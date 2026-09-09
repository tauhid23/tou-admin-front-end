"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";

type ToastType = "success" | "error";
type Toast = {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
};

type ToastContextValue = {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, description?: string) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((current) => [...current, { id, type, title, description }]);
      window.setTimeout(() => removeToast(id), 4200);
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      success: (title: string, description?: string) => showToast("success", title, description),
      error: (title: string, description?: string) => showToast("error", title, description),
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const Icon = toast.type === "success" ? CheckCircle2 : XCircle;
          return (
            <div
              key={toast.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-950/10"
              role="status"
            >
              <div className="flex gap-3">
                <Icon
                  className={`mt-0.5 h-5 w-5 shrink-0 ${
                    toast.type === "success" ? "text-emerald-600" : "text-rose-600"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-950">{toast.title}</p>
                  {toast.description && (
                    <p className="mt-1 text-sm leading-5 text-slate-500">{toast.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
