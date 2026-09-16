"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/forms/FormControls";
import { Alert } from "@/components/ui/Alert";
import { Container, Section } from "@/components/layout/Container";
import { resumeDealSession } from "@/features/deal/actions";
import { getDealUrl, getUsedCarsUrl } from "@/config/routes";

export function DealResume({ token }: { token?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function resume() {
    if (!token) {
      setError("This resume link is missing. Please request a new one.");
      return;
    }
    if (!email.trim()) {
      setError("Enter the email you used to save this deal.");
      return;
    }
    setSubmitting(true);
    const result = await resumeDealSession({ token, email });
    setSubmitting(false);
    if (!result.ok) {
      setError(
        result.reason === "expired"
          ? "This link has expired. Please start again from the vehicle."
          : "We couldn't match those details. Please check your email and try again.",
      );
      return;
    }
    router.push(getDealUrl(result.dealId));
  }

  return (
    <Section>
      <Container width="narrow">
        <h1 className="text-h2">Continue your deal</h1>
        <p className="mt-3 text-body text-muted">
          Confirm the email we sent the link to. The link does not include your
          rate, monthly payment or finance profile.
        </p>
        {!token ? (
          <div className="mt-6">
            <Alert title="This resume link is not valid." tone="warning">
              Request a new link from the deal builder, or start again from a
              vehicle.
            </Alert>
          </div>
        ) : null}
        <div className="mt-6">
          <Field htmlFor="deal-resume-email" label="Email" error={error}>
            <Input
              id="deal-resume-email"
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
          <Button onClick={() => void resume()} disabled={submitting || !token}>
            Continue
          </Button>
          <Button href={getUsedCarsUrl()} variant="text">
            Browse cars
          </Button>
        </div>
      </Container>
    </Section>
  );
}
