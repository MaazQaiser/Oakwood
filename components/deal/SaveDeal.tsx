"use client";

import { useId, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/forms/FormControls";
import { createDealResumeLink } from "@/features/deal/actions";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { emailError, telephoneError } from "@/lib/aftersales/validation";
import {
  DEAL_EMAIL_DEAL,
  DEAL_SAVE_CONFIRM,
  DEAL_SAVE_CTA,
  DEAL_SAVE_FAILED,
  DEAL_SAVE_INTRO,
  DEAL_SAVE_MOBILE_HINT,
  DEAL_SAVE_RESUME_LABEL,
  DEAL_SAVE_RETURN,
  DEAL_SESSION_EXPIRED,
} from "@/lib/deal/copy";
import { cn } from "@/lib/cn";

export function SaveDeal({
  defaultOpen = false,
  triggerLabel = "Save this deal",
  compact = false,
  prompt = false,
}: {
  defaultOpen?: boolean;
  triggerLabel?: string;
  compact?: boolean;
  /** Popup layout: stacked fields and a text link instead of a save button. */
  prompt?: boolean;
} = {}) {
  const { dealId, draft, markSaved } = useDealBuilder();
  const emailId = useId();
  const phoneId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string>();
  const [phoneError, setPhoneError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resumePath, setResumePath] = useState("");

  async function save() {
    const nextEmail = emailError(email);
    const nextPhone = phone.trim() ? telephoneError(phone) : undefined;
    setError(nextEmail);
    setPhoneError(nextPhone);
    setFormError(undefined);
    if (nextEmail || nextPhone) {
      return;
    }
    setSaving(true);
    const result = await createDealResumeLink({
      dealId,
      email,
      phone: phone.trim() || undefined,
      step: draft.resumeStep,
    });
    setSaving(false);
    if (!result.ok) {
      setFormError(
        result.reason === "expired" ? DEAL_SESSION_EXPIRED : DEAL_SAVE_FAILED,
      );
      return;
    }
    setResumePath(result.resumePath);
    setSaved(true);
    markSaved();
  }

  if (saved && resumePath) {
    const absolute =
      typeof window !== "undefined"
        ? `${window.location.origin}${resumePath}`
        : resumePath;
    return (
      <div className="space-y-2" role="status">
        <p className="text-body-sm font-semibold! text-ink">{DEAL_SAVE_CONFIRM}</p>
        <p className="text-caption text-muted">{DEAL_SAVE_RETURN}</p>
        <p className="text-caption text-muted">{DEAL_SAVE_RESUME_LABEL}</p>
        <p className="break-all rounded-[14px] bg-page-tint px-3 py-2 text-caption text-ink">
          {absolute}
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <Button variant="text" className="px-0" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "w-full",
        !compact && "rounded-lg border border-border bg-page p-4",
        compact && "mt-2",
      )}
    >
      {!compact && !prompt ? (
        <>
          <p className="text-label">{DEAL_EMAIL_DEAL}</p>
          <p className="mt-1 text-caption text-muted">{DEAL_SAVE_INTRO}</p>
        </>
      ) : compact && !prompt ? (
        <p className="text-caption text-muted">{DEAL_SAVE_INTRO}</p>
      ) : null}
      <div className={cn("grid gap-3", prompt ? "grid-cols-1" : "mt-3 sm:grid-cols-2")}>
        <Field htmlFor={emailId} label="Email" error={error}>
          <Input
            id={emailId}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            error={Boolean(error)}
            onChange={(event) => {
              setEmail(event.target.value);
              setError(undefined);
              setFormError(undefined);
            }}
          />
        </Field>
        <Field
          htmlFor={phoneId}
          label="Mobile"
          hint={DEAL_SAVE_MOBILE_HINT}
          error={phoneError}
        >
          <Input
            id={phoneId}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            error={Boolean(phoneError)}
            onChange={(event) => {
              setPhone(event.target.value);
              setPhoneError(undefined);
            }}
          />
        </Field>
      </div>
      {formError ? (
        <div className="mt-3">
          <Alert title={formError} tone="warning">
            <Button className="mt-3" size="sm" onClick={() => void save()}>
              Try again
            </Button>
          </Alert>
        </div>
      ) : null}
      <div className={cn("mt-3 flex flex-wrap gap-3", prompt && "mt-4")}>
        {prompt ? (
          <button
            type="button"
            className="text-body-sm font-semibold text-primary underline-offset-4 hover:underline disabled:opacity-50"
            disabled={saving}
            onClick={() => void save()}
          >
            {saving ? "Saving…" : DEAL_SAVE_CTA}
          </button>
        ) : (
          <Button onClick={() => void save()} busy={saving} size="sm">
            {saving ? "Saving…" : DEAL_SAVE_CTA}
          </Button>
        )}
        {!defaultOpen && !prompt ? (
          <Button variant="text" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        ) : null}
      </div>
    </div>
  );
}
