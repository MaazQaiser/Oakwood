"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { IconButton } from "@/components/ui/Button";
import { IconClose } from "@/components/ui/icons";

function useDialog(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!open) {
      return;
    }

    if (node && !node.open) {
      node.showModal();
    }

    return () => {
      if (node?.open) {
        node.close();
      }
    };
  }, [open]);

  return ref;
}

export function Modal({
  open,
  title,
  children,
  onClose,
  size = "default",
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: "default" | "wide";
}) {
  const ref = useDialog(open);

  if (!open) {
    return null;
  }

  return (
    <dialog
      ref={ref}
      className={
        size === "wide"
          ? "w-[min(100%-1rem,72rem)] rounded-xl border border-border bg-surface p-0 shadow-lg backdrop:bg-[var(--oak-overlay)]"
          : "w-[min(100%-2rem,32rem)] rounded-xl border border-border bg-surface p-0 shadow-lg backdrop:bg-[var(--oak-overlay)]"
      }
      onClose={onClose}
    >
      <div className="flex items-start justify-between gap-4 px-5 py-4">
        <h2 className="text-h3">{title}</h2>
        <IconButton label="Close" onClick={onClose}>
          <IconClose />
        </IconButton>
      </div>
      <div className="px-5 pb-5">{children}</div>
    </dialog>
  );
}

export function Drawer({
  open,
  title,
  children,
  onClose,
  size = "side",
  footer,
  headerAction,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: "side" | "full";
  footer?: ReactNode;
  headerAction?: ReactNode;
}) {
  const ref = useDialog(open);

  if (!open) {
    return null;
  }

  const full = size === "full";

  return (
    <dialog
      ref={ref}
      aria-label={title}
      className={
        full
          ? "fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none rounded-none border-0 bg-surface p-0 shadow-lg backdrop:bg-[var(--oak-overlay)]"
          : "m-0 ml-auto h-full max-h-none w-[min(100%,22rem)] max-w-none rounded-none border-0 bg-surface p-0 shadow-lg backdrop:bg-[var(--oak-overlay)]"
      }
      onClose={onClose}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
          <h2 className="text-h3">{title}</h2>
          <div className="flex items-center gap-1">
            {headerAction}
            <IconButton label="Close" onClick={onClose}>
              <IconClose />
            </IconButton>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
        {footer ? (
          <div className="sticky bottom-0 border-t border-border bg-surface px-4 py-3">
            {footer}
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
