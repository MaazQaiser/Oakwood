"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { IconButton } from "@/components/ui/Button";
import { IconClose } from "@/components/ui/icons";

function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  // Closes we trigger ourselves (cleanup, incl. Strict Mode's dev re-run)
  // must not reach onClose, or the dialog unmounts itself on open.
  const programmaticClose = useRef(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!open) {
      return;
    }

    // Remember the trigger so keyboard users land back on it after closing;
    // the dialog unmounts before close, so the browser can't restore it.
    const trigger =
      document.activeElement instanceof HTMLElement &&
      !node?.contains(document.activeElement)
        ? document.activeElement
        : null;

    if (node && !node.open) {
      node.showModal();
    }

    return () => {
      if (node?.open) {
        programmaticClose.current = true;
        node.close();
      }
      if (trigger?.isConnected) {
        trigger.focus();
      }
    };
  }, [open]);

  const handleClose = () => {
    if (programmaticClose.current) {
      programmaticClose.current = false;
      return;
    }
    onClose();
  };

  return { ref, handleClose };
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
  const { ref, handleClose } = useDialog(open, onClose);

  if (!open) {
    return null;
  }

  const width =
    size === "wide"
      ? "w-[min(100%-1rem,72rem)]"
      : "w-[min(100%-2rem,32rem)]";

  return (
    <dialog
      ref={ref}
      className={`oak-modal z-[var(--oak-z-modal)] ${width} rounded-xl border border-border bg-surface p-0 shadow-lg backdrop:bg-[var(--oak-overlay)]`}
      onClose={handleClose}
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
  const { ref, handleClose } = useDialog(open, onClose);

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
      onClose={handleClose}
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
