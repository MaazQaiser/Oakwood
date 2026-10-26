"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Dialogs";
import { Field, Input } from "@/components/forms/FormControls";
import { saveValuationDecline } from "@/features/part-exchange/actions";
import { emailError, telephoneError } from "@/lib/aftersales/validation";
import { cn } from "@/lib/cn";
import {
  VE_DECLINE_BETTER,
  VE_DECLINE_CALLBACK,
  VE_DECLINE_CALLBACK_THANKS,
  VE_DECLINE_CHANGE,
  VE_DECLINE_DISMISS,
  VE_DECLINE_ELSEWHERE,
  VE_DECLINE_EMAIL,
  VE_DECLINE_EXPECTED,
  VE_DECLINE_FAILED,
  VE_DECLINE_PHONE,
  VE_DECLINE_SUBMIT,
  VE_DECLINE_TITLE,
} from "@/lib/valuation-entry/copy";

export type ValuationDeclineContext = {
  sessionId: string;
  stockId: string;
  registration: string;
  mileage?: number;
  estimatedValue?: number;
};

export function BeforeYouGoModal({
  open,
  context,
  onClose,
}: {
  open: boolean;
  context: ValuationDeclineContext;
  onClose: () => void;
}) {
  const [expected, setExpected] = useState("");
  const [elsewhere, setElsewhere] = useState("");
  const [changeMind, setChangeMind] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailMessage, setEmailMessage] = useState<string>();
  const [phoneMessage, setPhoneMessage] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [sending, setSending] = useState<"callback" | "anonymous" | null>(null);
  const [sent, setSent] = useState(false);
  const posting = useRef(false);

  const feedback = {
    sessionId: context.sessionId,
    stockId: context.stockId,
    registration: context.registration,
    mileage: context.mileage,
    estimatedValue: context.estimatedValue,
    expected,
    elsewhere,
    changeMind,
  };

  async function sendCallback() {
    if (posting.current) {
      return;
    }
    const nextEmail = emailError(email);
    const nextPhone = telephoneError(phone);
    setEmailMessage(nextEmail);
    setPhoneMessage(nextPhone);
    setFormError(undefined);
    if (nextEmail || nextPhone) {
      return;
    }
    posting.current = true;
    setSending("callback");
    const result = await saveValuationDecline({
      ...feedback,
      mode: "callback",
      email,
      phone,
    });
    posting.current = false;
    setSending(null);
    if (!result.ok) {
      setFormError(VE_DECLINE_FAILED);
      return;
    }
    setSent(true);
  }

  async function closeAnonymously() {
    if (posting.current || sent) {
      if (sent) {
        onClose();
      }
      return;
    }
    posting.current = true;
    setSending("anonymous");
    const result = await saveValuationDecline({
      ...feedback,
      mode: "anonymous",
    });
    posting.current = false;
    setSending(null);
    if (!result.ok) {
      setFormError(VE_DECLINE_FAILED);
      return;
    }
    onClose();
  }

  return (
    <Modal
      open={open}
      title={VE_DECLINE_TITLE}
      onClose={() => {
        if (sent) {
          onClose();
          return;
        }
        void closeAnonymously();
      }}
    >
      {sent ? (
        <div className="space-y-4">
          <p className="text-body-sm" role="status">
            {VE_DECLINE_CALLBACK_THANKS}
          </p>
          <Button className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-body-sm text-muted">{VE_DECLINE_BETTER}</p>
          <Field htmlFor="ve-decline-expected" label={VE_DECLINE_EXPECTED}>
            <Input
              id="ve-decline-expected"
              placeholder="Optional"
              value={expected}
              onChange={(event) => setExpected(event.target.value)}
            />
          </Field>
          <Field htmlFor="ve-decline-elsewhere" label={VE_DECLINE_ELSEWHERE}>
            <Input
              id="ve-decline-elsewhere"
              placeholder="Optional"
              value={elsewhere}
              onChange={(event) => setElsewhere(event.target.value)}
            />
          </Field>
          <Field htmlFor="ve-decline-change" label={VE_DECLINE_CHANGE}>
            <textarea
              id="ve-decline-change"
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              htmlFor="ve-decline-email"
              label={VE_DECLINE_EMAIL}
              error={emailMessage}
            >
              <Input
                id="ve-decline-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                error={Boolean(emailMessage)}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailMessage(undefined);
                }}
              />
            </Field>
            <Field
              htmlFor="ve-decline-phone"
              label={VE_DECLINE_PHONE}
              error={phoneMessage}
            >
              <Input
                id="ve-decline-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                error={Boolean(phoneMessage)}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setPhoneMessage(undefined);
                }}
              />
            </Field>
          </div>
          {formError ? (
            <p className="text-caption text-danger" role="alert">
              {formError}
            </p>
          ) : null}
          <div className="flex flex-col gap-2">
            <Button
              className="w-full"
              busy={sending === "callback"}
              onClick={() => void sendCallback()}
            >
              {VE_DECLINE_SUBMIT}
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              busy={sending === "anonymous"}
              onClick={() => void closeAnonymously()}
            >
              {VE_DECLINE_DISMISS}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
