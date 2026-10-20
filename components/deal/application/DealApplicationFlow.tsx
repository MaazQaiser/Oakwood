"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/Loading";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { ApplicationDealSummary } from "@/components/deal/application/ApplicationDealSummary";
import { ApplicationOutcome } from "@/components/deal/application/ApplicationOutcome";
import {
  AddressSection,
  BankSection,
  EmploymentSection,
  IncomeSection,
  LicenceSection,
  PersonalSection,
} from "@/components/deal/application/ApplicationSectionForms";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import { getDealUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import {
  APP_BACK,
  APP_CONTINUE,
  APP_NOT_CREDIT_DECISION,
  APP_PROGRESS_LABEL,
  APP_SECTION_TITLES,
  APP_SUBMIT,
  APP_SUBMIT_ERROR,
  APP_SUBMITTING,
  APP_SUPPORTING,
  APP_TITLE,
} from "@/lib/deal/application/copy";
import {
  buildMockApplicationResult,
  mockSubmitDelayMs,
  shouldMockSubmitFail,
} from "@/lib/deal/application/mock";
import {
  getApplicationSections,
  initialApplicationDraft,
} from "@/lib/deal/application/sections";
import {
  validateSection,
  type SectionErrors,
} from "@/lib/deal/application/validation";
import type {
  DealApplicationFormState,
  DealApplicationSectionId,
  DealFinanceApplicationDraft,
} from "@/types/deal-application";

function ApplicationProgress({
  sectionId,
  sections,
}: {
  sectionId: DealApplicationSectionId;
  sections: ReturnType<typeof getApplicationSections>;
}) {
  const index = Math.max(
    0,
    sections.findIndex((section) => section.id === sectionId),
  );
  const current = index + 1;
  const total = sections.length;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-caption font-semibold! text-muted">
          {APP_PROGRESS_LABEL(current, total)}
        </p>
        <p className="text-caption text-muted">
          {Math.round((current / total) * 100)}%
        </p>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label={APP_PROGRESS_LABEL(current, total)}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
      <ol className="hidden gap-1 sm:flex sm:flex-wrap">
        {sections.map((section, i) => (
          <li
            key={section.id}
            className={cn(
              "rounded-full px-2.5 py-1 text-caption",
              i === index
                ? "bg-primary text-white"
                : i < index
                  ? "bg-primary-soft text-primary"
                  : "bg-page-tint text-muted",
            )}
          >
            {section.title}
            {section.optional ? " · optional" : ""}
          </li>
        ))}
      </ol>
    </div>
  );
}

function SectionBody({
  sectionId,
  form,
  errors,
  onChange,
}: {
  sectionId: DealApplicationSectionId;
  form: DealApplicationFormState;
  errors: SectionErrors;
  onChange: (next: DealApplicationFormState) => void;
}) {
  switch (sectionId) {
    case "personal":
      return (
        <PersonalSection form={form} errors={errors} onChange={onChange} />
      );
    case "address":
      return (
        <AddressSection form={form} errors={errors} onChange={onChange} />
      );
    case "employment":
      return (
        <EmploymentSection form={form} errors={errors} onChange={onChange} />
      );
    case "income":
      return <IncomeSection form={form} errors={errors} onChange={onChange} />;
    case "bank":
      return <BankSection form={form} errors={errors} onChange={onChange} />;
    case "licence":
      return (
        <LicenceSection form={form} errors={errors} onChange={onChange} />
      );
    default:
      return null;
  }
}

export function DealApplicationFlow() {
  const { dealId, draft, setFinanceApplication, navigateTo } = useDealBuilder();
  const headingId = useId();
  const sections = useMemo(() => getApplicationSections(), []);
  const [appDraft, setAppDraft] = useState<DealFinanceApplicationDraft>(() =>
    initialApplicationDraft(draft.financeApplication, draft.decision),
  );
  const [errors, setErrors] = useState<SectionErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [phase, setPhase] = useState<"form" | "submitting" | "outcome">(
    draft.financeApplication?.result ? "outcome" : "form",
  );

  const sectionId = appDraft.section;
  const sectionMeta =
    sections.find((section) => section.id === sectionId) ?? sections[0]!;
  const sectionIndex = sections.findIndex((section) => section.id === sectionId);

  useEffect(() => {
    trackEvent(analyticsEvents.applicationStarted, { dealId });
  }, [dealId]);

  const [savedNote, setSavedNote] = useState(false);

  function persist(next: DealFinanceApplicationDraft) {
    setAppDraft(next);
    setFinanceApplication(next);
    setSavedNote(true);
  }

  function updateForm(form: DealApplicationFormState) {
    persist({
      ...appDraft,
      form,
      submitError: undefined,
      result: undefined,
    });
    setErrors({});
    if (phase === "outcome") {
      setPhase("form");
    }
  }

  function goToSection(nextId: DealApplicationSectionId) {
    persist({ ...appDraft, section: nextId, submitError: undefined });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    if (sectionIndex <= 0) {
      navigateTo(getDealUrl(dealId, "reserve"));
      return;
    }
    goToSection(sections[sectionIndex - 1]!.id);
  }

  function handleContinue() {
    const nextErrors = validateSection(sectionId, appDraft.form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstKey = Object.keys(nextErrors)[0];
      if (firstKey) {
        const el = document.querySelector(`[id*="${firstKey}"], #app-${firstKey}`);
        if (el instanceof HTMLElement) el.focus();
      }
      return;
    }

    if (sectionIndex >= sections.length - 1) {
      void submitApplication();
      return;
    }
    goToSection(sections[sectionIndex + 1]!.id);
  }

  async function submitApplication() {
    if (submitting) return;
    setSubmitting(true);
    setPhase("submitting");
    persist({ ...appDraft, submitError: undefined });

    await new Promise((resolve) =>
      window.setTimeout(resolve, mockSubmitDelayMs()),
    );

    if (shouldMockSubmitFail(appDraft.form)) {
      const failed: DealFinanceApplicationDraft = {
        ...appDraft,
        submitError: APP_SUBMIT_ERROR,
        result: undefined,
      };
      persist(failed);
      setSubmitting(false);
      setPhase("form");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const result = buildMockApplicationResult(dealId, appDraft.form);
    // Form values stay saved for resume. Confirmation UI never echoes bank digits.
    const confirmed: DealFinanceApplicationDraft = {
      section: "licence",
      form: appDraft.form,
      result,
      submitError: undefined,
    };
    persist(confirmed);
    setSubmitting(false);
    setPhase("outcome");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (phase === "outcome" && appDraft.result) {
    return <ApplicationOutcome result={appDraft.result} />;
  }

  if (phase === "submitting") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16">
        <LoadingState label={APP_SUBMITTING} />
        <p className="max-w-sm text-center text-caption text-muted">
          Mock submission only — nothing is sent to a live lender.
        </p>
      </div>
    );
  }

  const isLast = sectionIndex >= sections.length - 1;

  return (
    <div className="flex flex-1 flex-col">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:items-start lg:gap-8">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-[var(--oak-header-height)] z-10 -mx-4 mb-4 bg-page-tint/95 px-4 py-2 backdrop-blur lg:hidden">
            <ApplicationDealSummary compact />
          </div>

          <div className="flex-1 space-y-5 pb-5">
            <Button
              type="button"
              variant="text"
              className="min-h-9 self-start px-1"
              onClick={() => navigateTo(getDealUrl(dealId, "reserve"))}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Back to your next step
            </Button>

            <header>
              <p className="oak-eyebrow">{APP_TITLE}</p>
              <h1
                id={headingId}
                className="mt-2 text-[1.75rem] font-semibold! leading-tight tracking-[-0.03em] text-navy sm:text-[2.15rem]"
              >
                {sectionMeta.title}
              </h1>
              <p className="mt-2 text-body-sm text-secondary">{APP_SUPPORTING}</p>
            </header>

            <ApplicationProgress sectionId={sectionId} sections={sections} />
            {savedNote ? (
              <p className="text-caption text-muted" role="status">
                Progress saved on this deal.
              </p>
            ) : null}

            {appDraft.submitError ? (
              <Alert title={appDraft.submitError} tone="danger">
                Tip for this prototype: remove the word &quot;error&quot; from
                your name and try again.
              </Alert>
            ) : null}

            <Alert title={APP_NOT_CREDIT_DECISION} tone="info" />

            <section
              className="rounded-card bg-surface p-5 shadow-card sm:p-7"
              aria-labelledby={headingId}
            >
              <h2 className="sr-only">{APP_SECTION_TITLES[sectionId]}</h2>
              <SectionBody
                sectionId={sectionId}
                form={appDraft.form}
                errors={errors}
                onChange={updateForm}
              />
            </section>
          </div>

          <DealStepFooter
            showMonthly={false}
            onBack={handleBack}
            backLabel={sectionIndex <= 0 ? "Back to deal" : APP_BACK}
            onContinue={handleContinue}
            continueLabel={isLast ? APP_SUBMIT : APP_CONTINUE}
            busy={submitting}
          />
        </div>

        <aside className="hidden lg:sticky lg:top-[calc(var(--oak-header-height)+1.5rem)] lg:block">
          <ApplicationDealSummary />
        </aside>
      </div>
    </div>
  );
}
