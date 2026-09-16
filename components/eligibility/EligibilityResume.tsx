"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/forms/FormControls";
import { Alert } from "@/components/ui/Alert";
import {
  EligibilityHeader,
  EligibilityLayout,
} from "@/components/eligibility/EligibilityLayout";
import { useEligibilityJourney } from "@/components/eligibility/EligibilityJourneyProvider";
import { resumeEligibilitySession } from "@/features/eligibility/actions";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { routes } from "@/config/routes";

export function EligibilityResume({ token }: { token?: string }) {
  const router = useRouter();
  const journey = useEligibilityJourney();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function resume() {
    if (!token) {
      setError("This resume link is missing. Please request a new one.");
      return;
    }
    if (!email.trim()) {
      setError("Enter the email you used to save your check.");
      return;
    }

    setSubmitting(true);
    const result = await resumeEligibilitySession({ token, email });
    setSubmitting(false);

    if (!result.ok) {
      setError(
        result.reason === "expired"
          ? "This link has expired. Please start again."
          : "We couldn't match those details. Please check your email and try again.",
      );
      return;
    }

    trackEvent(analyticsEvents.eligibilityResumed);
    journey.applyUiState(result.state);
    if (result.state.status === "complete") {
      router.push(routes.eligibilityResult);
      return;
    }
    router.push(routes.eligibilityQuestions);
  }

  return (
    <EligibilityLayout>
      <EligibilityHeader />
      <h1 className="mt-3 text-h2">Continue your eligibility check</h1>
      <p className="mt-3 text-body text-muted">
        Confirm the email we sent the link to. We&apos;ll restore your answers
        without showing any finance details in the address bar.
      </p>
      {!token ? (
        <div className="mt-6">
          <Alert title="This resume link is not valid." tone="warning">
            Request a new link from the eligibility check, or start again.
          </Alert>
        </div>
      ) : null}
      <div className="mt-6">
        <Field htmlFor="resume-verify-email" label="Email" error={error}>
          <Input
            id="resume-verify-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            error={Boolean(error)}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => void resume()} busy={submitting} disabled={!token}>
          Continue
        </Button>
        <Button href={routes.eligibility} variant="text">
          Start again
        </Button>
      </div>
    </EligibilityLayout>
  );
}
