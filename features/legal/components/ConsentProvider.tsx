"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultConsentPreference,
  readConsentCookie,
  writeConsentCookie,
  type CookieConsentPreference,
} from "@/features/legal/consent";
import { CONSENT_BANNER_WORDING } from "@/lib/legal/copy";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

interface ConsentContextValue {
  preference: CookieConsentPreference | null;
  bannerVisible: boolean;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  saveNecessaryOnly: () => void;
  savePreference: (input: Pick<CookieConsentPreference, "analytics" | "advertising">) => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<CookieConsentPreference | null>(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setPreference(readConsentCookie());
    setReady(true);
  }, []);

  const persist = useCallback((next: CookieConsentPreference) => {
    writeConsentCookie(next);
    setPreference(next);
    trackEvent(analyticsEvents.consentPreferenceUpdated, {
      analytics: next.analytics,
      advertising: next.advertising,
    });
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      preference,
      bannerVisible: ready && !preference,
      settingsOpen,
      openSettings: () => {
        setSettingsOpen(true);
        trackEvent(analyticsEvents.privacySettingsOpened);
      },
      closeSettings: () => setSettingsOpen(false),
      saveNecessaryOnly: () => {
        persist(defaultConsentPreference(CONSENT_BANNER_WORDING));
        setSettingsOpen(false);
      },
      savePreference: (input) => {
        persist(defaultConsentPreference(CONSENT_BANNER_WORDING, input));
        setSettingsOpen(false);
      },
    }),
    [persist, preference, ready, settingsOpen],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return context;
}
