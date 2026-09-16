import {
  cloneElement,
  isValidElement,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const control = isValidElement(children)
    ? cloneElement(
        children as ReactElement<{ "aria-describedby"?: string }>,
        describedBy ? { "aria-describedby": describedBy } : {},
      )
    : children;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-label">
        {label}
      </label>
      {control}
      {hint && !error ? (
        <p id={hintId} className="text-caption text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-caption text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const controlClass =
  "min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-body text-ink placeholder:text-subtle disabled:cursor-not-allowed disabled:bg-page disabled:text-subtle";

export function Input({
  className,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      className={cn(controlClass, error && "border-danger", className)}
      aria-invalid={error || undefined}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  error,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select
      className={cn(controlClass, error && "border-danger", className)}
      aria-invalid={error || undefined}
      {...props}
    >
      {children}
    </select>
  );
}

export function SearchInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="search"
      className={cn(controlClass, "min-w-0", className)}
      {...props}
    />
  );
}

export function Checkbox({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const id = props.id ?? props.name;
  return (
    <label htmlFor={id} className="flex min-h-11 items-center gap-3 text-body-sm">
      <input
        type="checkbox"
        id={id}
        className="h-5 w-5 accent-primary"
        {...props}
      />
      {label}
    </label>
  );
}

export function Radio({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const id = props.id ?? `${props.name}-${props.value}`;
  return (
    <label htmlFor={id} className="flex min-h-11 items-center gap-3 text-body-sm">
      <input
        type="radio"
        id={id}
        className="h-5 w-5 accent-primary"
        {...props}
      />
      {label}
    </label>
  );
}

export function Toggle({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const id = props.id ?? props.name;
  return (
    <label htmlFor={id} className="flex min-h-11 items-center justify-between gap-4">
      <span className="text-label">{label}</span>
      <input
        type="checkbox"
        id={id}
        role="switch"
        className="peer sr-only"
        {...props}
      />
      <span
        aria-hidden="true"
        className="relative h-7 w-12 rounded-full bg-border-strong peer-checked:bg-primary peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
      />
    </label>
  );
}

export function Slider({
  label,
  value,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  value: number;
}) {
  const id = props.id ?? props.name;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-label">
          {label}
        </label>
        <output htmlFor={id} className="financial-number financial-number--sm text-primary">
          {value}
        </output>
      </div>
      <input
        id={id}
        type="range"
        value={value}
        className="h-11 w-full accent-primary"
        {...props}
      />
    </div>
  );
}
