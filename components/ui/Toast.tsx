"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type ToastTone = "info" | "success" | "danger";

interface ToastItem {
  id: number;
  title: string;
  tone: ToastTone;
}

interface ToastContextValue {
  pushToast: (title: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = useCallback((title: string, tone: ToastTone = "info") => {
    const id = Date.now();
    setToasts((current) => [...current, { id, title, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[var(--oak-z-toast)] flex flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} title={toast.title} tone={toast.tone} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export function Toast({
  title,
  tone = "info",
}: {
  title: string;
  tone?: ToastTone;
}) {
  const tones = {
    info: "bg-surface text-ink",
    success: "bg-success-soft text-ink",
    danger: "bg-danger-soft text-ink",
  };

  return (
    <p
      className={cn(
        "pointer-events-auto rounded-md border border-border px-4 py-3 text-body-sm shadow-md",
        tones[tone],
      )}
    >
      {title}
    </p>
  );
}
