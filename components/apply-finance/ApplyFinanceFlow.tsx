"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ApplyStepBody } from "@/components/apply-finance/ApplyStepBody";
import { ApplyStepper } from "@/components/apply-finance/ApplyStepper";
import {
  EligibilityLayout,
  EligibilityNavigation,
} from "@/components/eligibility/EligibilityLayout";
import { SaveAndResume } from "@/components/eligibility/SaveAndResume";
import { Button } from "@/components/ui/Button";
import { routes } from "@/config/routes";
import {
  ensureEligibilitySession,
  getEligibilityUiState,
  saveEligibilityProgress,
  submitEligibilityCheck,
} from "@/features/eligibility/actions";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { mergeFill, sectionFill, timeRemainingLabel } from "@/lib/apply-finance/progress";
import {
  commitChoice,
  getApplySteps,
  getStepperSections,
  nextStepId,
  validateApplyStep,
} from "@/lib/apply-finance/steps";
import { toEligibilityAnswers } from "@/lib/apply-finance/to-eligibility";
import type {
  ApplicationData,
  ApplyFieldErrors,
  ApplySectionId,
  ApplyStepId,
} from "@/types/apply-finance";

export function ApplyFinanceFlow() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<"form" | "decision" | "error" | "expired">("form");
  const [data, setData] = useState<ApplicationData>({});
  const [stepId, setStepId] = useState<ApplyStepId>("budget");
  const [progress, setProgress] = useState<Partial<Record<ApplySectionId, number>>>({});
  const [errors, setErrors] = useState<ApplyFieldErrors>({});
  const [timedOut, setTimedOut] = useState(false);
  const returnTo = useRef<ApplyStepId | null>(null);
  const knownSteps = useRef<ApplyStepId[] | null>(null);
  const stepTrail = useRef<ApplyStepId[]>([]);
  const choiceTimer = useRef<number | null>(null);
  const submitting = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const steps = useMemo(() => getApplySteps(data), [data]);
  const sections = useMemo(() => getStepperSections(data), [data]);
  const current = steps.find((step) => step.id === stepId) ?? steps[0];

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const state = await getEligibilityUiState();
      if (cancelled) return;
      if (state.status === "complete") {
        router.replace(routes.eligibilityResult);
        return;
      }
      if (state.status === "expired") {
        setPhase("expired");
        setReady(true);
        return;
      }
      await ensureEligibilitySession();
      const draft = state.answers.applyDraft;
      if (draft?.data && draft.stepId) {
        setData(draft.data);
        setStepId(draft.stepId);
        setProgress(draft.progress ?? {});
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (steps.some((step) => step.id === stepId)) {
      stepTrail.current = steps.map((step) => step.id);
      return;
    }
    if (!ready) return;
    const trail = stepTrail.current;
    const missingAt = trail.indexOf(stepId);
    for (let index = missingAt - 1; index >= 0; index -= 1) {
      if (steps.some((step) => step.id === trail[index])) {
        setStepId(trail[index]);
        return;
      }
    }
    if (steps[0]) setStepId(steps[0].id);
  }, [ready, steps, stepId]);

  useEffect(() => {
    if (!ready || phase !== "form" || !current) return;
    setProgress((previous) => mergeFill(previous, sectionFill(steps, current.id)));
  }, [ready, phase, steps, current]);

  useEffect(() => {
    if (!ready || phase !== "form" || !current) return;
    const draft = { data, stepId: current.id, progress };
    const handle = window.setTimeout(() => {
      void saveEligibilityProgress({
        answers: { ...toEligibilityAnswers(data), applyDraft: draft },
        questionId: "email",
      });
    }, 400);
    return () => window.clearTimeout(handle);
  }, [ready, phase, data, progress, current]);

  useEffect(() => {
    if (!ready || phase !== "form") return;
    headingRef.current?.focus();
    setErrors({});
    trackEvent(analyticsEvents.eligibilityQuestionViewed, {
      question: current?.id,
      stage: current?.section,
    });
  }, [ready, phase, current?.id, current?.section]);

  useEffect(() => {
    return () => {
      if (choiceTimer.current) window.clearTimeout(choiceTimer.current);
    };
  }, []);

  function clearEdit() {
    returnTo.current = null;
    knownSteps.current = null;
  }

  function advance(nextData: ApplicationData, fromId: ApplyStepId) {
    const target = nextStepId(
      getApplySteps(nextData),
      fromId,
      returnTo.current,
      knownSteps.current,
    );
    if (!target) return;
    if (target === returnTo.current) clearEdit();
    setStepId(target);
    trackEvent(analyticsEvents.eligibilityQuestionCompleted, { question: fromId });
  }

  function choose(value: string) {
    if (!current || current.kind !== "choice") return;
    const next = commitChoice(current.id, data, value);
    const fromId = current.id;
    setData(next);
    setErrors({});
    if (choiceTimer.current) window.clearTimeout(choiceTimer.current);
    choiceTimer.current = window.setTimeout(() => advance(next, fromId), 180);
  }

  function goBack() {
    if (choiceTimer.current) window.clearTimeout(choiceTimer.current);
    clearEdit();
    const index = steps.findIndex((step) => step.id === current?.id);
    if (index <= 0) {
      trackEvent(analyticsEvents.eligibilityAbandoned);
      router.push(routes.eligibility);
      return;
    }
    trackEvent(analyticsEvents.eligibilityQuestionBack, { question: current?.id });
    setStepId(steps[index - 1].id);
  }

  function beginSectionEdit(section: ApplySectionId) {
    const snapshot = getApplySteps(data);
    knownSteps.current = snapshot.filter((step) => step.section !== section).map((step) => step.id);
    returnTo.current = "consent";
    const first = snapshot.find((step) => step.section === section);
    if (first) setStepId(first.id);
  }

  function beginStepEdit(target: ApplyStepId) {
    const snapshot = getApplySteps(data);
    knownSteps.current = snapshot.map((step) => step.id).filter((id) => id !== target);
    returnTo.current = current?.id === "ja-review" ? "ja-review" : "consent";
    setStepId(target);
  }

  async function submit() {
    if (submitting.current) return;
    submitting.current = true;
    setPhase("decision");
    setProgress((previous) => ({ ...previous, review: 1, decision: 1 }));
    setTimedOut(false);
    trackEvent(analyticsEvents.eligibilitySubmitted);
    const timeout = window.setTimeout(() => setTimedOut(true), 3500);
    const result = await submitEligibilityCheck({
      answers: {
        ...toEligibilityAnswers(data),
        applyDraft: {
          data,
          stepId: "consent",
          progress: { ...progress, review: 1, decision: 1 },
        },
      },
      consentedAt: new Date().toISOString(),
    });
    window.clearTimeout(timeout);

    if (!result.ok && "expired" in result) {
      submitting.current = false;
      setPhase("expired");
      return;
    }
    if (!result.ok) {
      submitting.current = false;
      setPhase("error");
      return;
    }
    router.push(routes.eligibilityResult);
  }

  function continueStep() {
    if (!current) return;
    const fieldErrors = validateApplyStep(current.id, data);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    if (current.id === "consent") {
      void submit();
      return;
    }
    advance(data, current.id);
  }

  if (!ready) {
    return (
      <EligibilityLayout>
        <p className="text-body text-muted">Loading your application…</p>
      </EligibilityLayout>
    );
  }

  if (phase === "expired") {
    return (
      <EligibilityLayout>
        <h1 className="text-h2">Your session has expired.</h1>
        <p className="mt-3 text-body text-muted">Please start again to continue.</p>
        <div className="mt-8">
          <Button href={routes.eligibility}>Start again</Button>
        </div>
      </EligibilityLayout>
    );
  }

  if (phase === "error") {
    return (
      <EligibilityLayout>
        <ApplyStepper
          label="Decision"
          segments={sections.map((section) => ({
            id: section.id,
            fill: section.id === "decision" || section.id === "review" ? 1 : progress[section.id] ?? 0,
          }))}
        />
        <h1 className="mt-6 text-h2">Your finance check is temporarily unavailable.</h1>
        <p className="mt-3 text-body text-muted">
          You can try again, keep browsing, or speak to Oakwood.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => void submit()}>Try again</Button>
          <Button href={routes.usedCars} variant="secondary">
            Continue browsing cars
          </Button>
          <Button href={routes.bookingEnquiry} variant="text">
            Speak to Oakwood
          </Button>
        </div>
      </EligibilityLayout>
    );
  }

  const deciding = phase === "decision";
  const label = deciding
    ? "Decision"
    : (sections.find((section) => section.id === current?.section)?.label ?? "Quick Start");
  const headingId = `${current?.id ?? "apply"}-question`;

  return (
    <EligibilityLayout
      pinFooter
      footer={
        deciding || !current ? null : (
          <>
            <EligibilityNavigation
              pinned
              onBack={goBack}
              onContinue={current.kind === "choice" ? undefined : continueStep}
              continueLabel={current.id === "consent" ? "Submit" : "Continue"}
            />
            {current.kind !== "choice" ? (
              <div className="mt-2">
                <SaveAndResume
                  answers={{
                    ...toEligibilityAnswers(data),
                    applyDraft: { data, stepId: current.id, progress },
                  }}
                  questionId="email"
                />
              </div>
            ) : null}
          </>
        )
      }
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <ApplyStepper
          label={label}
          time={deciding || !current ? undefined : timeRemainingLabel(steps, current.id)}
          segments={sections.map((section) => ({
            id: section.id,
            fill:
              deciding && (section.id === "decision" || section.id === "review")
                ? 1
                : (progress[section.id] ?? 0),
          }))}
        />

        <div
          className="relative z-0 min-h-0 flex-1 overflow-y-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onKeyDown={(event) => {
            if (event.key !== "Enter" || event.defaultPrevented || deciding || !current) return;
            if (current.kind === "choice") return;
            const target = event.target as HTMLElement;
            if (target.tagName === "BUTTON" || target.tagName === "A" || target.tagName === "SUMMARY") {
              return;
            }
            event.preventDefault();
            continueStep();
          }}
        >
        {deciding ? (
          <div className="mt-6" role="status" aria-live="polite">
            <h1 className="text-h2">{timedOut ? "Still checking lenders" : "Checking lenders"}</h1>
            <p className="mt-3 text-body text-muted">
              {timedOut
                ? "This is taking a little longer than expected."
                : "This is a soft search only. It won't affect your credit score."}
            </p>
            {timedOut ? (
              <div className="mt-8">
                <Button onClick={() => setTimedOut(false)}>Keep waiting</Button>
              </div>
            ) : (
              <div className="mt-8 h-1 overflow-hidden rounded-full bg-border" aria-hidden="true">
                <div className="h-full w-1/3 animate-pulse rounded-full bg-primary" />
              </div>
            )}
          </div>
        ) : current ? (
          <>
            <h1 id={headingId} ref={headingRef} tabIndex={-1} className="mt-6 text-h2 outline-none">
              {current.title}
            </h1>
            {current.support ? (
              <p className="mt-2 text-body-sm text-muted">{current.support}</p>
            ) : null}
            <div className="mt-6">
              <ApplyStepBody
                key={current.id}
                step={current}
                data={data}
                errors={errors}
                labelledBy={headingId}
                onChange={(patch) => {
                  setData((previous) => ({ ...previous, ...patch }));
                  setErrors({});
                }}
                onChoice={choose}
                onEditSection={beginSectionEdit}
                onEditStep={beginStepEdit}
              />
            </div>
          </>
        ) : null}
        </div>
      </div>
    </EligibilityLayout>
  );
}
