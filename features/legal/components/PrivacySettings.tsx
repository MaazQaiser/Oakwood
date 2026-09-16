"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Dialogs";
import { Checkbox } from "@/components/forms/FormControls";
import { useConsent } from "@/features/legal/components/ConsentProvider";
import { routes } from "@/config/routes";
import {
  CONSENT_ADVERTISING_HELP,
  CONSENT_ADVERTISING_LABEL,
  CONSENT_ANALYTICS_HELP,
  CONSENT_ANALYTICS_LABEL,
  CONSENT_COOKIE_POLICY,
  CONSENT_MARKETING_NOTE,
  CONSENT_NECESSARY_HELP,
  CONSENT_NECESSARY_LABEL,
  CONSENT_PRIVACY_POLICY,
  CONSENT_SAVE,
  CONSENT_SETTINGS_TITLE,
} from "@/lib/legal/copy";

export function PrivacySettings() {
  const { preference, settingsOpen, closeSettings, savePreference } = useConsent();
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    if (settingsOpen) {
      setAnalytics(Boolean(preference?.analytics));
      setAdvertising(Boolean(preference?.advertising));
    }
  }, [preference, settingsOpen]);

  return (
    <Drawer
      open={settingsOpen}
      title={CONSENT_SETTINGS_TITLE}
      onClose={closeSettings}
      footer={
        <Button
          type="button"
          className="w-full"
          onClick={() => savePreference({ analytics, advertising })}
        >
          {CONSENT_SAVE}
        </Button>
      }
    >
      <fieldset className="space-y-6">
        <legend className="sr-only">{CONSENT_SETTINGS_TITLE}</legend>
        <div>
          <Checkbox
            id="consent-necessary"
            name="necessary"
            label={CONSENT_NECESSARY_LABEL}
            checked
            disabled
          />
          <p className="mt-1 text-caption text-muted">{CONSENT_NECESSARY_HELP}</p>
        </div>
        <div>
          <Checkbox
            id="consent-analytics"
            name="analytics"
            label={CONSENT_ANALYTICS_LABEL}
            checked={analytics}
            onChange={(event) => setAnalytics(event.target.checked)}
          />
          <p className="mt-1 text-caption text-muted">{CONSENT_ANALYTICS_HELP}</p>
        </div>
        <div>
          <Checkbox
            id="consent-advertising"
            name="advertising"
            label={CONSENT_ADVERTISING_LABEL}
            checked={advertising}
            onChange={(event) => setAdvertising(event.target.checked)}
          />
          <p className="mt-1 text-caption text-muted">{CONSENT_ADVERTISING_HELP}</p>
        </div>
      </fieldset>
      <p className="mt-6 text-caption text-muted">{CONSENT_MARKETING_NOTE}</p>
      <p className="mt-4 flex flex-col gap-1">
        <Link
          href={routes.cookiePolicy}
          className="inline-flex min-h-11 items-center text-body-sm text-primary underline-offset-4 hover:underline"
        >
          {CONSENT_COOKIE_POLICY}
        </Link>
        <Link
          href={routes.privacyPolicy}
          className="inline-flex min-h-11 items-center text-body-sm text-primary underline-offset-4 hover:underline"
        >
          {CONSENT_PRIVACY_POLICY}
        </Link>
      </p>
    </Drawer>
  );
}

export function PrivacySettingsButton({ className }: { className?: string }) {
  const { openSettings } = useConsent();
  return (
    <button
      type="button"
      onClick={openSettings}
      className={
        className ??
        "inline-flex min-h-11 items-center text-body-sm text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      }
    >
      Privacy settings
    </button>
  );
}
