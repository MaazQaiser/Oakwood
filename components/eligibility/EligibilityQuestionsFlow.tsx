"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  EligibilityConsent,
  EligibilityCurrencyInput,
  EligibilityNumberInput,
  EligibilityPostcodeInput,
  EligibilitySingleChoice,
  EligibilityTextInput,
} from "@/components/eligibility/controls";
import {
  EligibilityHeader,
  EligibilityLayout,
  EligibilityMockNotice,
  EligibilityNavigation,
  EligibilityQuestion,
  EligibilityTrustMessage,
} from "@/components/eligibility/EligibilityLayout";
import { EligibilityProgress } from "@/components/eligibility/EligibilityProgress";
import { EligibilitySummary } from "@/components/eligibility/EligibilitySummary";
import { EligibilityProcessing } from "@/components/eligibility/EligibilityProcessing";
import { SaveAndResume } from "@/components/eligibility/SaveAndResume";
import { useEligibilityJourney } from "@/components/eligibility/EligibilityJourneyProvider";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  getEligibilityUiState,
  saveEligibilityProgress,
  submitEligibilityCheck,
} from "@/features/eligibility/actions";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { MARKETING_CONSENT_WORDING } from "@/lib/eligibility/copy";
import {
  getVisibleQuestions,
  parseCurrency,
  sanitiseAnswers,
  validateQuestion,
} from "@/lib/eligibility/questions";
import { routes } from "@/config/routes";
import type {
  EligibilityAnswers,
  EligibilityQuestion as EligibilityQuestionConfig,
} from "@/types/eligibility";

function answerToString(
  answers: EligibilityAnswers,
  question: EligibilityQuestionConfig,
): string {
  const value = answers[question.id];
  if (value === undefined || value === false) {
    return "";
  }
  return String(value);
}

function FieldControl({
  question,
  answers,
  error,
  onPatch,
}: {
  question: EligibilityQuestionConfig;
  answers: EligibilityAnswers;
  error?: string;
  onPatch: (patch: Partial<EligibilityAnswers>) => void;
}) {
  const headingId = `${question.id}-question`;
  const current = answerToString(answers, question);
  const [draft, setDraft] = useState(current);

  if (question.type === "single" || question.type === "yesno") {
    return (
      <EligibilitySingleChoice
        name={question.id}
        labelledBy={headingId}
        options={question.options ?? []}
        value={current || undefined}
        onChange={(value) =>
          onPatch({ [question.id]: value } as Partial<EligibilityAnswers>)
        }
      />
    );
  }

  if (question.type === "currency" || question.type === "deposit") {
    return (
      <div className="flex flex-col gap-4">
        {question.type === "deposit" && question.options ? (
          <EligibilitySingleChoice
            name={`${question.id}-chips`}
            labelledBy={headingId}
            options={question.options}
            value={
              question.options.some((option) => option.value === current)
                ? current
                : undefined
            }
            onChange={(value) => {
              setDraft(value);
              onPatch({ deposit: Number(value) });
            }}
          />
        ) : null}
        <EligibilityCurrencyInput
          id={question.id}
          label={question.placeholder ?? "Amount"}
          hint={question.type === "deposit" ? "Or enter another amount" : undefined}
          error={error}
          value={draft}
          placeholder={question.placeholder}
          onChange={(value) => {
            setDraft(value);
            if (value.trim() === "") {
              onPatch({ [question.id]: undefined } as Partial<EligibilityAnswers>);
              return;
            }
            const amount = parseCurrency(value);
            if (amount !== undefined) {
              onPatch({ [question.id]: amount } as Partial<EligibilityAnswers>);
            }
          }}
        />
      </div>
    );
  }

  if (question.type === "number") {
    return (
      <EligibilityNumberInput
        id={question.id}
        label={question.placeholder ?? "Number"}
        error={error}
        value={current}
        placeholder={question.placeholder}
        onChange={(value) =>
          onPatch({
            [question.id]: value === "" ? undefined : Number(value),
          } as Partial<EligibilityAnswers>)
        }
      />
    );
  }

  if (question.type === "postcode") {
    return (
      <EligibilityPostcodeInput
        id={question.id}
        label="Postcode"
        error={error}
        value={current}
        placeholder={question.placeholder}
        onChange={(value) => onPatch({ postcode: value })}
      />
    );
  }

  if (question.type === "consent") {
    return (
      <EligibilityConsent
        id={question.id}
        label={MARKETING_CONSENT_WORDING}
        checked={Boolean(answers.marketingConsent)}
        onChange={(checked) => onPatch({ marketingConsent: checked })}
        note="Your marketing preferences are separate from your finance eligibility check."
      />
    );
  }

  const type =
    question.type === "email" ? "email" : question.type === "tel" ? "tel" : "text";

  return (
    <EligibilityTextInput
      id={question.id}
      label={question.placeholder ?? "Your answer"}
      error={error}
      value={current}
      type={type}
      inputMode={question.inputMode}
      placeholder={question.placeholder}
      autoComplete={
        question.id === "firstName"
          ? "given-name"
          : question.id === "email"
            ? "email"
            : question.id === "mobile"
              ? "tel"
              : undefined
      }
      onChange={(value) =>
        onPatch({ [question.id]: value } as Partial<EligibilityAnswers>)
      }
    />
  );
}

export function EligibilityQuestionsFlow() {
  const router = useRouter();
  const journey = useEligibilityJourney();
  const restored = useRef(false);
  const [error, setError] = useState<string>();
  const [timedOut, setTimedOut] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (restored.current) {
      return;
    }
    restored.current = true;
    void getEligibilityUiState().then((state) => {
      if (state.status === "complete") {
        journey.applyUiState(state);
        router.replace(routes.eligibilityResult);
        return;
      }
      if (state.status === "expired") {
        journey.applyUiState(state);
        return;
      }
      if (state.status === "in_progress") {
        journey.applyUiState(state);
      } else {
        journey.setMachine("QUESTION");
      }
    });
  }, [journey, router]);

  const visible = useMemo(
    () => getVisibleQuestions(journey.answers),
    [journey.answers],
  );
  const index = Math.max(
    0,
    visible.findIndex((question) => question.id === journey.questionId),
  );
  const current = visible[index] ?? visible[0];

  useEffect(() => {
    if (journey.machine !== "QUESTION" || !current) {
      return;
    }
    trackEvent(analyticsEvents.eligibilityQuestionViewed, {
      question: current.id,
      stage: current.stage,
    });
  }, [current, journey.machine]);

  function patchAnswers(patch: Partial<EligibilityAnswers>) {
    setError(undefined);
    journey.setAnswers(sanitiseAnswers({ ...journey.answers, ...patch }));
  }

  async function persist(nextId = current?.id) {
    if (!nextId) {
      return true;
    }
    const result = await saveEligibilityProgress({
      answers: journey.answers,
      questionId: nextId,
    });
    if (!result.ok) {
      journey.setMachine("EXPIRED");
      return false;
    }
    return true;
  }

  async function goNext() {
    if (!current) {
      return;
    }
    const message = validateQuestion(current, journey.answers);
    if (message) {
      setError(message);
      return;
    }

    trackEvent(analyticsEvents.eligibilityQuestionCompleted, {
      question: current.id,
    });

    const nextVisible = getVisibleQuestions(journey.answers);
    const nextIndex = nextVisible.findIndex((item) => item.id === current.id) + 1;
    if (nextIndex >= nextVisible.length) {
      journey.setMachine("REVIEW");
      await persist(current.id);
      return;
    }

    const next = nextVisible[nextIndex];
    journey.setQuestionId(next.id);
    setError(undefined);
    await persist(next.id);
  }

  async function goBack() {
    if (journey.machine === "REVIEW") {
      journey.setMachine("QUESTION");
      trackEvent(analyticsEvents.eligibilityQuestionBack, { from: "review" });
      return;
    }

    if (!current || index === 0) {
      trackEvent(analyticsEvents.eligibilityAbandoned);
      router.push(routes.eligibility);
      return;
    }

    const previous = visible[index - 1];
    journey.setQuestionId(previous.id);
    setError(undefined);
    trackEvent(analyticsEvents.eligibilityQuestionBack, {
      question: current.id,
    });
    await persist(previous.id);
  }

  async function submit() {
    journey.setMachine("SUBMITTING");
    setTimedOut(false);
    setUnavailable(false);
    trackEvent(analyticsEvents.eligibilitySubmitted);

    const timeout = window.setTimeout(() => setTimedOut(true), 3500);
    const result = await submitEligibilityCheck({
      answers: journey.answers,
      consentedAt: new Date().toISOString(),
    });
    window.clearTimeout(timeout);

    if (!result.ok && "expired" in result) {
      journey.setMachine("EXPIRED");
      return;
    }

    if (!result.ok) {
      setUnavailable(true);
      journey.setMachine("ERROR");
      return;
    }

    journey.applyUiState(result.state);
    router.push(routes.eligibilityResult);
  }

  if (journey.machine === "EXPIRED") {
    return (
      <EligibilityLayout>
        <EligibilityHeader />
        <h1 className="mt-4 text-h2">Your session has expired.</h1>
        <p className="mt-3 text-body text-muted">
          Please verify your details to continue.
        </p>
        <div className="mt-8">
          <Button href={routes.eligibility}>Start eligibility check</Button>
        </div>
      </EligibilityLayout>
    );
  }

  if (journey.machine === "ERROR" || unavailable) {
    return (
      <EligibilityLayout
        footer={
          <EligibilityNavigation
            backHref={routes.usedCars}
            backLabel="Continue browsing cars"
          />
        }
      >
        <EligibilityHeader />
        <h1 className="mt-4 text-h2">
          Your eligibility check is temporarily unavailable.
        </h1>
        <p className="mt-3 text-body text-muted">
          You can try again, keep browsing, or speak to Oakwood.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => {
              setUnavailable(false);
              void submit();
            }}
          >
            Try again
          </Button>
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

  if (journey.machine === "SUBMITTING") {
    return (
      <EligibilityLayout>
        <EligibilityHeader />
        <div className="mt-6">
          <EligibilityProcessing
            timedOut={timedOut}
            onKeepWaiting={() => setTimedOut(false)}
          />
        </div>
      </EligibilityLayout>
    );
  }

  if (journey.machine === "REVIEW") {
    return (
      <EligibilityLayout
        footer={
          <>
            <EligibilityNavigation
              onBack={() => void goBack()}
              onContinue={() => void submit()}
              continueLabel="Check my eligibility"
            />
            <EligibilityTrustMessage />
          </>
        }
      >
        <Button variant="text" className="self-start px-0" onClick={() => void goBack()}>
          Back
        </Button>
        <EligibilityHeader />
        <div className="mt-6">
          <EligibilitySummary answers={journey.answers} />
        </div>
        <p className="mt-4 text-caption text-muted">
          By continuing you agree we can run a soft search using the details
          you&apos;ve provided.{" "}
          <a className="text-primary underline-offset-4 hover:underline" href={routes.privacyPolicy}>
            Privacy policy
          </a>
        </p>
      </EligibilityLayout>
    );
  }

  if (!current) {
    return null;
  }

  const headingId = `${current.id}-question`;

  return (
    <EligibilityLayout
      footer={
        <>
          <div className="mt-6">
            <SaveAndResume answers={journey.answers} questionId={current.id} />
          </div>
          <EligibilityNavigation
            onBack={() => void goBack()}
            onContinue={() => void goNext()}
          />
          <EligibilityTrustMessage />
        </>
      }
    >
      <Button variant="text" className="self-start px-0" onClick={() => void goBack()}>
        Back
      </Button>
      <div className="mt-4">
        <EligibilityHeader />
        <div className="mt-3">
          <EligibilityProgress
            stage={current.stage}
            step={index + 1}
            total={visible.length}
          />
        </div>
      </div>
      <EligibilityQuestion
        id={headingId}
        question={current.question}
        support={current.support}
        why={current.why}
      />
      <div className="mt-6">
        <FieldControl
          key={current.id}
          question={current}
          answers={journey.answers}
          error={error}
          onPatch={patchAnswers}
        />
      </div>
      {error ? (
        <div className="mt-4">
          <Alert title={error} tone="warning" />
        </div>
      ) : null}
      {current.id === "partExchange" && journey.answers.partExchange === "yes" ? (
        <div className="mt-4">
          <Button
            href={routes.valuation}
            variant="secondary"
            onClick={() => void persist(current.id)}
          >
            Get a valuation
          </Button>
        </div>
      ) : null}
      <EligibilityMockNotice />
    </EligibilityLayout>
  );
}
