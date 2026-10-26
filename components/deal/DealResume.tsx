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
import { emailError } from "@/lib/aftersales/validation";
import { getDealUrl, getUsedCarsUrl, routes } from "@/config/routes";
import {
  DEAL_RESUME_BODY,
  DEAL_RESUME_CHECKING,
  DEAL_RESUME_EXPIRED_BODY,
  DEAL_RESUME_EXPIRED_REQUEST,
  DEAL_RESUME_EXPIRED_RESTART,
  DEAL_RESUME_EXPIRED_TITLE,
  DEAL_RESUME_INVALID_BODY,
  DEAL_RESUME_INVALID_TITLE,
  DEAL_RESUME_MISMATCH,
  DEAL_RESUME_TITLE,
  DEAL_RESUME_USED_BODY,
  DEAL_RESUME_USED_TITLE,
  DEAL_RESUME_VERIFY_EMAIL,
  DEAL_RESUME_VERIFY_SUBMIT,
} from "@/lib/deal/copy";

export function DealResume({ token }: { token?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [linkStatus, setLinkStatus] = useState<
    | "loading"
    | "ok"
    | "expired"
    | "invalid"
    | "used"
    | "missing"
    | "expired-confirmed"
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
    const emailMessage = emailError(email);
    if (emailMessage) {
      setError(emailMessage);
      return;
    }
    setSubmitting(true);
    setError(undefined);
    if (linkStatus === "used" || linkStatus === "expired") {
      const checked = await reopenUsedDealSession({ token, email });
      setSubmitting(false);
      if (!checked.ok) {
        setError(DEAL_RESUME_MISMATCH);
        return;
      }
      if (checked.status === "expired") {
        setLinkStatus("expired-confirmed");
        return;
      }
      router.push(getDealUrl(checked.dealId, checked.step));
      return;
    }
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
      setError(DEAL_RESUME_MISMATCH);
      return;
    }
    router.push(getDealUrl(result.dealId, result.step));
  }

  if (linkStatus === "loading") {
    return (
      <Section>
        <Container width="narrow">
          <p className="text-body text-muted" role="status">
            {DEAL_RESUME_CHECKING}
          </p>
        </Container>
      </Section>
    );
  }

  if (linkStatus === "expired-confirmed") {
    return (
      <Section>
        <Container width="narrow">
          <h1 className="text-h2">{DEAL_RESUME_EXPIRED_TITLE}</h1>
          <p className="mt-3 text-body text-muted">{DEAL_RESUME_EXPIRED_BODY}</p>
          <div className="mt-4">
            <Alert title="Expired after seven days" tone="warning">
              {DEAL_RESUME_EXPIRED_REQUEST}
            </Alert>
          </div>
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

  const needsReverification = linkStatus === "expired" || linkStatus === "used";
  const title = needsReverification
    ? linkStatus === "used"
      ? DEAL_RESUME_USED_TITLE
      : DEAL_RESUME_EXPIRED_TITLE
    : DEAL_RESUME_TITLE;
  const body = needsReverification
    ? linkStatus === "used"
      ? DEAL_RESUME_USED_BODY
      : DEAL_RESUME_EXPIRED_BODY
    : DEAL_RESUME_BODY;
  const canVerify = Boolean(token) && linkStatus === "ok";

  return (
    <Section>
      <Container width="narrow">
        <h1 className="text-h2">{title}</h1>
        <p className="mt-3 text-body text-muted">{body}</p>
        {!token || linkStatus === "invalid" || linkStatus === "missing" ? (
          <div className="mt-6">
            <Alert title={DEAL_RESUME_INVALID_TITLE} tone="warning">
              {DEAL_RESUME_INVALID_BODY}
            </Alert>
          </div>
        ) : null}
        {canVerify || needsReverification ? (
          <div className="mt-6">
            <Field htmlFor="deal-resume-email" label="Email" error={error}>
              <Input
                id="deal-resume-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                error={Boolean(error)}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(undefined);
                }}
              />
            </Field>
            <p className="mt-2 text-caption text-muted">
              {DEAL_RESUME_VERIFY_EMAIL}
            </p>
          </div>
        ) : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => void resume()}
            busy={submitting}
            disabled={submitting || (!canVerify && !needsReverification)}
          >
            {needsReverification ? DEAL_RESUME_VERIFY_SUBMIT : "Continue"}
          </Button>
          <Button href={getUsedCarsUrl()} variant="text">
            Browse cars
          </Button>
        </div>
      </Container>
    </Section>
  );
}
