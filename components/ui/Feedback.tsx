import type { ReactNode } from "react";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/Loading";
import { cn } from "@/lib/cn";

export function EmptyState({
  title,
  children,
  actions,
  className,
}: {
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface px-5 py-8",
        className,
      )}
    >
      <h2 className="text-h3">{title}</h2>
      {children ? (
        <div className="mt-2 text-body text-muted">{children}</div>
      ) : null}
      {actions ? (
        <div className="mt-6 flex flex-wrap gap-3">{actions}</div>
      ) : null}
    </div>
  );
}

export function ErrorState({
  title,
  children,
  actions,
  tone = "warning",
}: {
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
  tone?: "warning" | "danger" | "info";
}) {
  return (
    <Alert title={title} tone={tone}>
      {children}
      {actions ? (
        <div className="mt-3 flex flex-wrap gap-2">{actions}</div>
      ) : null}
    </Alert>
  );
}

export function ProcessingState({
  label = "Updating",
}: {
  label?: string;
}) {
  return <LoadingState label={label} />;
}
