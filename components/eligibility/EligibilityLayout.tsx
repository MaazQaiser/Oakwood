"use client";

import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { JourneyChrome } from "@/components/layout/JourneyChrome";
import { Button } from "@/components/ui/Button";
import { MOCK_SCHEMA_NOTICE } from "@/lib/eligibility/copy";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";

export function EligibilityHeader({
  eyebrow = "Finance eligibility",
}: {
  eyebrow?: string;
}) {
  return (
    <p className="text-caption font-semibold uppercase tracking-[0.08em] text-muted">
      {eyebrow}
    </p>
  );
}

export function EligibilityTrustMessage({
  className,
}: {
  className?: string;
}) {
  return (
    <p className={cn("text-caption text-muted", className)}>
      Soft search. No impact on your credit score. No account required.
    </p>
  );
}

export function EligibilityNavigation({
  onBack,
  onContinue,
  continueLabel = "Continue",
  continueDisabled,
  backLabel = "Back",
  backHref,
}: {
  onBack?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  backLabel?: string;
  backHref?: string;
}) {
  return (
    <div className="sticky bottom-[var(--oak-consent-offset,0px)] z-10 -mx-[var(--oak-page-x)] mt-8 border-t border-border bg-page px-[var(--oak-page-x)] py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {onBack ? (
          <Button variant="text" onClick={onBack} className="self-start px-0">
            {backLabel}
          </Button>
        ) : backHref ? (
          <Button variant="text" href={backHref} className="self-start px-0">
            {backLabel}
          </Button>
        ) : (
          <span />
        )}
        {onContinue ? (
          <Button
            onClick={onContinue}
            disabled={continueDisabled}
            className="w-full sm:w-auto"
          >
            {continueLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function EligibilityLayout({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="bg-page">
      <JourneyChrome />
      <Container width="narrow" className="flex min-h-[calc(100dvh-8rem)] flex-col py-6 md:py-10">
        <div className="mx-auto flex w-full max-w-[32rem] flex-1 flex-col">
          {children}
          {footer}
        </div>
      </Container>
    </div>
  );
}

export function EligibilityQuestion({
  id,
  question,
  support,
  why,
}: {
  id: string;
  question: string;
  support?: string;
  why?: string;
}) {
  return (
    <div className="mt-6">
      <h1 id={id} className="text-h2">
        {question}
      </h1>
      {support ? (
        <p className="mt-2 text-body-sm text-muted">{support}</p>
      ) : null}
      {why ? <p className="mt-2 text-caption text-muted">{why}</p> : null}
    </div>
  );
}

export function EligibilityMockNotice() {
  return <p className="mt-4 text-caption text-muted">{MOCK_SCHEMA_NOTICE}</p>;
}

export function EligibilityHomeLink() {
  return (
    <Button variant="text" href={routes.home} className="px-0">
      Oakwood
    </Button>
  );
}
