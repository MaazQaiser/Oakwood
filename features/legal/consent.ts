export const CONSENT_COOKIE_NAME = "oakwood_consent";
export const CONSENT_VERSION = 1;

export interface CookieConsentPreference {
  version: typeof CONSENT_VERSION;
  necessary: true;
  analytics: boolean;
  advertising: boolean;
  timestamp: string;
  wording: string;
}

export function defaultConsentPreference(
  wording: string,
  extras?: Partial<Pick<CookieConsentPreference, "analytics" | "advertising">>,
): CookieConsentPreference {
  return {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: Boolean(extras?.analytics),
    advertising: Boolean(extras?.advertising),
    timestamp: new Date().toISOString(),
    wording,
  };
}

export function parseConsentPreference(value: string | undefined): CookieConsentPreference | null {
  if (!value) {
    return null;
  }
  try {
    const parsed = JSON.parse(value) as Partial<CookieConsentPreference>;
    if (parsed.version !== CONSENT_VERSION || parsed.necessary !== true || !parsed.timestamp || !parsed.wording) {
      return null;
    }
    return {
      version: CONSENT_VERSION,
      necessary: true,
      analytics: Boolean(parsed.analytics),
      advertising: Boolean(parsed.advertising),
      timestamp: parsed.timestamp,
      wording: parsed.wording,
    };
  } catch {
    return null;
  }
}

export function readConsentCookie(): CookieConsentPreference | null {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${CONSENT_COOKIE_NAME}=`));
  if (!match) {
    return null;
  }
  return parseConsentPreference(decodeURIComponent(match.slice(CONSENT_COOKIE_NAME.length + 1)));
}

export function writeConsentCookie(preference: CookieConsentPreference): void {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(preference))}; Path=/; SameSite=Lax`;
}
