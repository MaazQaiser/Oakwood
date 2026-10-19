"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/forms/FormControls";
import { Alert } from "@/components/ui/Alert";
import { Container, Section } from "@/components/layout/Container";
import {
  inspectDealResumeToken,
  resumeDealSession,
} from "@/features/deal/actions";
import { getDealUrl, getUsedCarsUrl, routes } from "@/config/routes";
import {
  DEAL_RESUME_EXPIRED_BODY,
  DEAL_RESUME_EXPIRED_REQUEST,
  DEAL_RESUME_EXPIRED_RESTART,
  DEAL_RESUME_EXPIRED_TITLE,
} from "@/lib/deal/copy";

export function DealResume({ token }: { token?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [linkStatus, setLinkStatus] = useState<
    "loading" | "ok" | "expired" | "invalid" | "used" | "missing"
  >(token ? "loading" : "missing");

  useEffect(() => {
    if (!token) {
      setLinkStatus("missing");
      return;
    }
    let cancelled = false;
    void inspectDealResumeToken({ token }).then((result) => {
      if (!cancelled) {
        setLinkStatus(result.status);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

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
      if (result.reason === "expired") {
        setLinkStatus("expired");
        return;
      }
      if (result.reason === "used") {
        setLinkStatus("used");
        return;
      }
      setError(
        "We couldn't match those details. Please check your email and try again.",
      );
      return;
    }
    router.push(getDealUrl(result.dealId, "part-exchange"));
  }

  if (linkStatus === "loading") {
    return (
      <Section>
        <Container width="narrow">
          <p className="text-body text-muted" role="status">
            Checking your resume link…
          </p>
        </Container>
      </Section>
    );
  }

  if (linkStatus === "expired" || linkStatus === "used") {
    return (
      <Section>
        <Container width="narrow">
          <h1 className="text-h2">{DEAL_RESUME_EXPIRED_TITLE}</h1>
          <p className="mt-3 text-body text-muted">{DEAL_RESUME_EXPIRED_BODY}</p>
          <Alert
            title={
              linkStatus === "used"
                ? "This link has already been used."
                : "Expired after seven days"
            }
            tone="warning"
          >
            {DEAL_RESUME_EXPIRED_REQUEST}
          </Alert>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={getUsedCarsUrl()}>
              {DEAL_RESUME_EXPIRED_RESTART}
            </Button>
            <Button href={routes.home} variant="secondary">
              Go to homepage
            </Button>
          </div>
          <p className="mt-4 text-caption text-muted">
            Demo an expired link anytime with{" "}
            <a
              className="text-primary underline-offset-4 hover:underline"
              href="/deal/resume?token=mock-expired"
            >
              /deal/resume?token=mock-expired
            </a>
            .
          </p>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container width="narrow">
        <h1 className="text-h2">Continue your deal</h1>
        <p className="mt-3 text-body text-muted">
          Confirm the email you used when you saved. Your vehicle, valuation,
          part exchange, finance preferences and products are restored. The
          link does not include your rate or a live finance decision.
        </p>
        {!token || linkStatus === "invalid" || linkStatus === "missing" ? (
          <div className="mt-6">
            <Alert title="This resume link is not valid." tone="warning">
              Request a new link from the deal builder, or start again from a
              vehicle. Resume links expire after seven days.
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
          <Button
            onClick={() => void resume()}
            disabled={submitting || !token || linkStatus !== "ok"}
          >
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
