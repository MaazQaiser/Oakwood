"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { routes } from "@/config/routes";
import { guaranteeCopy } from "@/lib/guarantee/copy";
import { cn } from "@/lib/cn";

export function GuaranteeTermsCheckbox({
  checked,
  onChange,
  error,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  className?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={cn("space-y-1", className)}>
      <label htmlFor={id} className="flex min-h-11 items-start gap-3 text-body-sm">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span>
          I have read the{" "}
          <Link
            href={routes.thirtyDayGuaranteeTerms}
            className="text-primary underline-offset-4 hover:underline"
          >
            {guaranteeCopy.programmeName} terms
          </Link>
          . I understand they are in addition to my legal rights.
        </span>
      </label>
      {error ? (
        <p id={errorId} className="text-caption text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}