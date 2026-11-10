"use client";

import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { JourneyChrome } from "@/components/layout/JourneyChrome";
import { Button } from "@/components/ui/Button";
import {
  ELIGIBILITY_TRUST_LINE,
  MOCK_SCHEMA_NOTICE,
} from "@/lib/eligibility/copy";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";

export function EligibilityHeader(_props?: { eyebrow?: string }) {
  return null;
}

export function EligibilityTrustMessage({
  className,
}: {
  className?: string;
}) {
  return (
    <p className={cn("text-caption text-muted", className)}>
      {ELIGIBILITY_TRUST_LINE}
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
  className,
  pinned,
}: {
  onBack?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  backLabel?: string;
  backHref?: string;
  className?: string;
  pinned?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative z-10 bg-page py-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
        pinned ? "mt-0 border-t border-border" : "mt-8",
        className,
      )}
    >
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
            aria-label={continueLabel}
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
  pinFooter = false,
}: {
  children: ReactNode;
  footer?: ReactNode;
  pinFooter?: boolean;
}) {
  return (
    <div className="bg-page">
      <JourneyChrome />
      <Container
        width="narrow"
        className={
          pinFooter
            ? "flex h-[calc(100dvh-var(--oak-header-height))] flex-col overflow-hidden py-4 pb-[calc(1rem+var(--oak-consent-offset,0px))] md:py-6"
            : "flex min-h-[calc(100dvh-8rem)] flex-col py-6 pb-[calc(1.5rem+var(--oak-consent-offset,0px))] md:py-10"
        }
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-[32rem] flex-1 flex-col",
            pinFooter && "min-h-0",
          )}
        >
          {pinFooter ? (
            <>
              {children}
              {footer ? <div className="shrink-0">{footer}</div> : null}
            </>
          ) : (
            <>
              {children}
              {footer}
            </>
          )}
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
  return (
    <p className="mt-10 border-t border-border pt-6 text-body-sm text-muted">
      {MOCK_SCHEMA_NOTICE}
    </p>
  );
}

export function EligibilityHomeLink() {
  return (
    <Button variant="text" href={routes.home} className="px-0">
      Oakwood
    </Button>
  );
}
