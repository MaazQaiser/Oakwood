"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/forms/FormControls";
import { Alert } from "@/components/ui/Alert";
import { Container, Section } from "@/components/layout/Container";
import {
  inspectDealResumeToken,
  reopenUsedDealSession,
  resumeDealSession,
} from "@/features/deal/actions";
import { getDealUrl, getUsedCarsUrl, routes } from "@/config/routes";
import {
  DEAL_RESUME_EXPIRED_BODY,
  DEAL_RESUME_EXPIRED_REQUEST,
  DEAL_RESUME_EXPIRED_RESTART,
  DEAL_RESUME_EXPIRED_TITLE,
  DEAL_RESUME_USED_BODY,
  DEAL_RESUME_USED_TITLE,
  DEAL_RESUME_VERIFY_EMAIL,
} from "@/lib/deal/copy";

export function DealResume({ token }: { token?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [linkStatus, setLinkStatus] = useState<
    "loading" | "ok" | "expired" | "invalid" | "used" | "missing" | "expired-confirmed"
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
      setError(DEAL_RESUME_VERIFY_EMAIL);
      return;
    }
    setSubmitting(true);
    if (linkStatus === "used" || linkStatus === "expired") {
      const checked = await reopenUsedDealSession({ token, email });
      setSubmitting(false);
      if (!checked.ok) {
        setError(
          "We couldn't match those details. Please check your email and try again.",
        );
        return;
      }
      if (checked.status === "expired") {
        setLinkStatus("expired-confirmed");
        return;
      }
      router.push(getDealUrl(checked.dealId, "part-exchange"));
      return;
    }
    const result = await resumeDealSession({ token, email });
    setSubmitting(false);
    if (!result.ok) {
      if (result.reason === "expired") {
        setLinkStatus("expired");
        setError(undefined);
        return;
      }
      if (result.reason === "used") {
        setLinkStatus("used");
        setError(undefined);
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

  if (linkStatus === "expired-confirmed" || (linkStatus === "expired" && token === "mock-expired")) {
    return (
      <Section>
        <Container width="narrow">
          <h1 className="text-h2">{DEAL_RESUME_EXPIRED_TITLE}</h1>
          <p className="mt-3 text-body text-muted">{DEAL_RESUME_EXPIRED_BODY}</p>
          <Alert title="Expired after seven days" tone="warning">
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
        </Container>
      </Section>
    );
  }

  if (linkStatus === "expired" || linkStatus === "used") {
    return (
      <Section>
        <Container width="narrow">
          <h1 className="text-h2">
            {linkStatus === "used"
              ? DEAL_RESUME_USED_TITLE
              : DEAL_RESUME_EXPIRED_TITLE}
          </h1>
          <p className="mt-3 text-body text-muted">
            {linkStatus === "used"
              ? DEAL_RESUME_USED_BODY
              : DEAL_RESUME_EXPIRED_BODY}
          </p>
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
              disabled={submitting}
            >
              {linkStatus === "used" ? "Continue this deal" : "Confirm email"}
            </Button>
            <Button href={getUsedCarsUrl()} variant="text">
              Browse cars
            </Button>
          </div>
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
