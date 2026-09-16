"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useConsent } from "@/features/legal/components/ConsentProvider";
import { routes } from "@/config/routes";
import {
  CONSENT_BANNER_BODY,
  CONSENT_BANNER_TITLE,
  CONSENT_COOKIE_POLICY,
  CONSENT_NECESSARY_ONLY,
  CONSENT_OPEN_SETTINGS,
} from "@/lib/legal/copy";

export function ConsentBanner() {
  const { bannerVisible, saveNecessaryOnly, openSettings } = useConsent();
  const bannerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const banner = bannerRef.current;

    if (!bannerVisible || !banner) {
      root.style.removeProperty("--oak-consent-offset");
      return;
    }

    const applyOffset = () => {
      root.style.setProperty("--oak-consent-offset", `${banner.offsetHeight}px`);
    };

    applyOffset();
    const observer = new ResizeObserver(applyOffset);
    observer.observe(banner);

    return () => {
      observer.disconnect();
      root.style.removeProperty("--oak-consent-offset");
    };
  }, [bannerVisible]);

  if (!bannerVisible) {
    return null;
  }

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-body"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-4"
    >
      <div className="mx-auto max-w-[var(--oak-width-narrow)]">
        <h2 id="cookie-banner-title" className="text-h3">
          {CONSENT_BANNER_TITLE}
        </h2>
        <p id="cookie-banner-body" className="mt-2 text-body-sm text-muted">
          {CONSENT_BANNER_BODY}{" "}
          <Link
            href={routes.cookiePolicy}
            className="text-primary underline-offset-4 hover:underline"
          >
            {CONSENT_COOKIE_POLICY}
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button type="button" onClick={saveNecessaryOnly} className="w-full sm:w-auto">
            {CONSENT_NECESSARY_ONLY}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={openSettings}
            className="w-full sm:w-auto"
          >
            {CONSENT_OPEN_SETTINGS}
          </Button>
        </div>
      </div>
    </div>
  );
}
