"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Check, ChevronLeft } from "lucide-react";
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
  APP_SAVED,
  APP_SAVING,
  APP_SECTION_SHORT,
  APP_SECTION_TITLES,
  APP_SUBMIT,
  APP_SUBMIT_ERROR,
  APP_SUBMITTING,
  APP_SUPPORTING,
  APP_TITLE,
} from "@/lib/deal/application/copy";
import { submitEmbeddedApplication } from "@/lib/deal/application/submit";
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
  onSelect,
}: {
  sectionId: DealApplicationSectionId;
  sections: ReturnType<typeof getApplicationSections>;
  onSelect: (id: DealApplicationSectionId) => void;
}) {
  const index = Math.max(
    0,
    sections.findIndex((section) => section.id === sectionId),
  );
  const current = index + 1;
  const total = sections.length;
  const label = APP_PROGRESS_LABEL(current, total);

  return (
    <nav aria-label="Application progress" className="space-y-3">
      <p className="text-caption font-semibold! text-muted">{label}</p>
      <ol
        className={cn(
          "grid grid-cols-3 gap-x-2 gap-y-3",
          total > 5 ? "sm:grid-cols-6" : "sm:grid-cols-5",
        )}
      >
        {sections.map((section, i) => {
          const done = i < index;
          const active = i === index;
          const body = (
            <>
              <span
                aria-hidden
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full text-caption font-semibold!",
                  active && "bg-primary text-white",
                  done && "bg-primary-soft text-primary",
                  !active && !done && "bg-page-tint text-muted",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span className="max-w-full text-center text-caption leading-tight">
                {APP_SECTION_SHORT[section.id]}
              </span>
              {section.optional ? (
                <span className="text-[0.7rem] font-normal text-muted">Optional</span>
              ) : null}
            </>
          );
          return (
            <li key={section.id} className="min-w-0">
              {done ? (
                <button
                  type="button"
                  onClick={() => onSelect(section.id)}
                  className="flex w-full flex-col items-center gap-1 text-center text-ink"
                >
                  {body}
                </button>
              ) : (
                <div
                  className={cn(
                    "flex w-full flex-col items-center gap-1 text-center",
                    active ? "font-semibold! text-navy" : "text-muted",
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
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
  const { dealId, draft, autosave, setFinanceApplication, navigateTo } =
    useDealBuilder();
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

  const [savedNote, setSavedNote] = useState(
    () => Boolean(draft.financeApplication),
  );

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
    const pending: DealFinanceApplicationDraft = {
      ...appDraft,
      submitError: undefined,
    };
    setSubmitting(true);
    setPhase("submitting");
    persist(pending);

    const submitted = await submitEmbeddedApplication({
      dealId,
      draft,
      application: pending,
      form: pending.form,
    });

    if (!submitted.ok) {
      persist({
        ...pending,
        submitError: APP_SUBMIT_ERROR,
        result: undefined,
      });
      setSubmitting(false);
      setPhase("form");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    persist({
      section: "licence",
      form: pending.form,
      result: submitted.result,
      submitError: undefined,
    });
    setSubmitting(false);
    setPhase("outcome");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const isLast = sectionIndex >= sections.length - 1;
  const showOutcome = phase === "outcome" && appDraft.result;
  const progressStatus =
    autosave === "saving"
      ? APP_SAVING
      : autosave === "error"
        ? null
        : savedNote
          ? APP_SAVED
          : null;

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

            {showOutcome && appDraft.result ? (
              <ApplicationOutcome result={appDraft.result} />
            ) : (
              <>
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

                <ApplicationProgress
                  sectionId={sectionId}
                  sections={sections}
                  onSelect={goToSection}
                />
                {progressStatus ? (
                  <p className="text-caption text-muted" role="status">
                    {progressStatus}
                  </p>
                ) : null}

                {appDraft.submitError ? (
                  <Alert title={appDraft.submitError} tone="danger" />
                ) : null}

                <Alert title={APP_NOT_CREDIT_DECISION} tone="info" />

                <section
                  className="rounded-card bg-surface p-5 shadow-card sm:p-7"
                  aria-labelledby={headingId}
                >
                  {phase === "submitting" ? (
                    <div className="flex flex-col items-center gap-3 py-10 text-center">
                      <LoadingState label={APP_SUBMITTING} />
                      <p className="max-w-sm text-caption text-muted">
                        Your answers stay on this deal. An advisor confirms the rate
                        with you by phone.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h2 className="sr-only">{APP_SECTION_TITLES[sectionId]}</h2>
                      <SectionBody
                        sectionId={sectionId}
                        form={appDraft.form}
                        errors={errors}
                        onChange={updateForm}
                      />
                    </>
                  )}
                </section>
              </>
            )}
          </div>

          {showOutcome || phase === "submitting" ? null : (
            <DealStepFooter
              showMonthly={false}
              onBack={handleBack}
              backLabel={sectionIndex <= 0 ? "Back to deal" : APP_BACK}
              onContinue={handleContinue}
              continueLabel={isLast ? APP_SUBMIT : APP_CONTINUE}
              busy={submitting}
            />
          )}
        </div>

        <aside className="hidden lg:sticky lg:top-[calc(var(--oak-header-height)+1.5rem)] lg:block">
          <ApplicationDealSummary />
        </aside>
      </div>
    </div>
  );
}
