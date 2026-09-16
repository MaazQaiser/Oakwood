"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/forms/FormControls";
import { createDealResumeLink } from "@/features/deal/actions";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DEAL_SAVE_INTRO } from "@/lib/deal/copy";

export function SaveDeal() {
  const { dealId, markSaved } = useDealBuilder();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    setSaving(true);
    setError(undefined);
    const result = await createDealResumeLink({ dealId, email });
    setSaving(false);
    if (!result.ok) {
      setError("This deal session has expired. Please start again from the vehicle.");
      return;
    }
    setSaved(true);
    markSaved();
  }

  if (saved) {
    return (
      <p className="text-caption text-muted" role="status">
        We&apos;ve sent a secure link. It doesn&apos;t include your finance result
        or monthly payment.
      </p>
    );
  }

  if (!open) {
    return (
      <Button variant="text" className="px-0" onClick={() => setOpen(true)}>
        Save this deal
      </Button>
    );
  }

  return (
    <div className="w-full rounded-lg border border-border bg-page p-4">
      <p className="text-label">Save this deal for later</p>
      <p className="mt-1 text-caption text-muted">{DEAL_SAVE_INTRO}</p>
      <div className="mt-3">
        <Field htmlFor="deal-save-email" label="Email" error={error}>
          <Input
            id="deal-save-email"
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
        <Button onClick={() => void save()} disabled={saving} size="sm">
          Email me a link
        </Button>
        <Button variant="text" size="sm" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
