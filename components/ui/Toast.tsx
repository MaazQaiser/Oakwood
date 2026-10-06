"use client";

import Link from "next/link";
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

interface ToastAction {
  href: string;
  label: string;
}

interface ToastItem {
  id: number;
  title: string;
  tone: ToastTone;
  action?: ToastAction;
}

interface ToastContextValue {
  pushToast: (title: string, tone?: ToastTone, action?: ToastAction) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = useCallback(
    (title: string, tone: ToastTone = "info", action?: ToastAction) => {
      const id = Date.now();
      setToasts((current) => [...current, { id, title, tone, action }]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, 4000);
    },
    [],
  );

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed right-4 bottom-[calc(1rem+var(--oak-compare-offset,0px)+var(--oak-consent-offset,0px))] z-[var(--oak-z-toast)] flex flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            tone={toast.tone}
            action={toast.action}
          />
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
  action,
}: {
  title: string;
  tone?: ToastTone;
  action?: ToastAction;
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
      {action ? (
        <>
          {" "}
          <Link
            href={action.href}
            className="font-semibold text-primary underline underline-offset-2"
          >
            {action.label}
          </Link>
        </>
      ) : null}
    </p>
  );
}
