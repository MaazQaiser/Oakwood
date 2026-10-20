"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Dialogs";
import { Field, Input } from "@/components/forms/FormControls";
import { cn } from "@/lib/cn";
import {
  VE_DECLINE_CALLBACK,
  VE_DECLINE_CHANGE,
  VE_DECLINE_DISMISS,
  VE_DECLINE_ELSEWHERE,
  VE_DECLINE_EMAIL,
  VE_DECLINE_EXPECTED,
  VE_DECLINE_INTRO,
  VE_DECLINE_PHONE,
  VE_DECLINE_SUBMIT,
  VE_DECLINE_THANKS,
  VE_DECLINE_TITLE,
} from "@/lib/valuation-entry/copy";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

export type ExitIntelSource = "entry_hook" | "step4_cta_abandon";

/**
 * Shared “Before you go” intel capture (Deal Builder v4 Decision 16).
 * Used on valuation decline and Step 4 CTA abandonment.
 */
export function ExitIntelModal({
  open,
  onClose,
  source,
  idPrefix = "exit-intel",
}: {
  open: boolean;
  onClose: () => void;
  source: ExitIntelSource;
  idPrefix?: string;
}) {
  const [expected, setExpected] = useState("");
  const [elsewhere, setElsewhere] = useState("");
  const [changeMind, setChangeMind] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>();

  function resetAndClose() {
    setSubmitted(false);
    setError(undefined);
    onClose();
  }

  async function submit() {
    if (email && !email.includes("@")) {
      setError("Enter a valid email address, or leave it blank.");
      return;
    }
    setError(undefined);
    setSending(true);
    await new Promise((resolve) => {
      window.setTimeout(resolve, 700);
    });
    trackEvent(analyticsEvents.pxValuationCompleted, {
      source,
      path:
        source === "step4_cta_abandon"
          ? "step4_cta_abandoned"
          : "valuation_rejected",
      expected: expected || undefined,
      elsewhere: elsewhere || undefined,
      changeMind: changeMind || undefined,
      hasContact: Boolean(email || phone),
    });
    setSending(false);
    setSubmitted(true);
  }

  return (
    <Modal open={open} title={VE_DECLINE_TITLE} onClose={resetAndClose}>
      {submitted ? (
        <div className="space-y-4">
          <p className="text-body-sm" role="status">
            {VE_DECLINE_THANKS}
          </p>
          <Button className="w-full" onClick={resetAndClose}>
            Close
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-body-sm text-muted">{VE_DECLINE_INTRO}</p>
          <Field
            htmlFor={`${idPrefix}-expected`}
            label={VE_DECLINE_EXPECTED}
          >
            <Input
              id={`${idPrefix}-expected`}
              placeholder="Optional"
              value={expected}
              onChange={(event) => setExpected(event.target.value)}
            />
          </Field>
          <Field
            htmlFor={`${idPrefix}-elsewhere`}
            label={VE_DECLINE_ELSEWHERE}
          >
            <Input
              id={`${idPrefix}-elsewhere`}
              placeholder="Optional"
              value={elsewhere}
              onChange={(event) => setElsewhere(event.target.value)}
            />
          </Field>
          <Field htmlFor={`${idPrefix}-change`} label={VE_DECLINE_CHANGE}>
            <textarea
              id={`${idPrefix}-change`}
              rows={3}
              placeholder="Optional"
              value={changeMind}
              onChange={(event) => setChangeMind(event.target.value)}
              className={cn(
                "min-h-24 w-full rounded-xl border border-border-input bg-surface px-3 py-2 text-sm font-medium text-ink placeholder:text-subtle",
              )}
            />
          </Field>
          <p className="text-caption text-muted">{VE_DECLINE_CALLBACK}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              htmlFor={`${idPrefix}-email`}
              label={VE_DECLINE_EMAIL}
              error={error}
            >
              <Input
                id={`${idPrefix}-email`}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>
            <Field htmlFor={`${idPrefix}-phone`} label={VE_DECLINE_PHONE}>
              <Input
                id={`${idPrefix}-phone`}
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </Field>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row-reverse">
            <Button
              className="w-full sm:w-auto"
              busy={sending}
              onClick={() => void submit()}
            >
              {sending ? "Sending" : VE_DECLINE_SUBMIT}
            </Button>
            <Button
              className="w-full sm:w-auto"
              variant="secondary"
              onClick={resetAndClose}
            >
              {VE_DECLINE_DISMISS}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
