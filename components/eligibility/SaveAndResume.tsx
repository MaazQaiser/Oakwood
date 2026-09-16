"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/forms/FormControls";
import { createEligibilityResumeLink } from "@/features/eligibility/actions";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { validateQuestion, getQuestionById } from "@/lib/eligibility/questions";
import type { EligibilityAnswers, EligibilityQuestionId } from "@/types/eligibility";

export function SaveAndResume({
  answers,
  questionId,
  ctaLabel = "Save and finish later",
}: {
  answers: EligibilityAnswers;
  questionId?: EligibilityQuestionId;
  ctaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(answers.email ?? "");
  const [error, setError] = useState<string>();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save() {
    const emailQuestion = getQuestionById("email");
    const emailError = emailQuestion
      ? validateQuestion(emailQuestion, { ...answers, email })
      : "Enter a valid email address.";
    if (emailError) {
      setError(emailError);
      return;
    }

    setSaving(true);
    setError(undefined);
    const result = await createEligibilityResumeLink({
      email,
      answers: { ...answers, email },
      questionId,
    });
    setSaving(false);

    if (!result.ok) {
      setError("Your session has expired. Please start again.");
      return;
    }

    setSaved(true);
    trackEvent(analyticsEvents.eligibilitySaved);
  }

  if (saved) {
    return (
      <p className="text-caption text-muted" role="status">
        We&apos;ve sent a secure link to finish later. It doesn&apos;t include
        your finance result.
      </p>
    );
  }

  if (!open) {
    return (
      <Button variant="text" className="px-0" onClick={() => setOpen(true)}>
        {ctaLabel}
      </Button>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-label">Save and finish later</p>
      <p className="mt-1 text-caption text-muted">
        We&apos;ll email a time-limited link. It won&apos;t include your finance
        details.
      </p>
      <div className="mt-3">
        <Field htmlFor="resume-email" label="Email" error={error}>
          <Input
            id="resume-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            error={Boolean(error)}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        <Button onClick={() => void save()} busy={saving} size="sm">
          Email me a link
        </Button>
        <Button variant="text" size="sm" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
