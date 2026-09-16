export function Skeleton({
  className = "h-4 w-full",
}: {
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-pulse rounded-md bg-border ${className}`}
    />
  );
}

export function LoadingState({
  label = "Loading",
}: {
  label?: string;
}) {
  return (
    <p className="inline-flex items-center gap-3 text-body-sm text-muted" role="status">
      <span
        className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary"
        aria-hidden="true"
      />
      {label}
    </p>
  );
}
