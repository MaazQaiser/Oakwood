import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import {
  ELIGIBILITY_SESSION_COOKIE,
  SESSION_TTL_MS,
  createSessionRecord,
  getSessionRecord,
  isSessionExpired,
  restoreSessionRecord,
  type EligibilitySessionRecord,
} from "@/features/eligibility/store";
import {
  isRecordWithId,
  readStateCookie,
  writeStateCookie,
} from "@/lib/session/state-cookie";

const ELIGIBILITY_STATE_COOKIE = "oakwood_eligibility_state";

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  };
}

export function createOpaqueId(): string {
  return randomBytes(16).toString("hex");
}

export async function readSessionId(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(ELIGIBILITY_SESSION_COOKIE)?.value;
}

export async function writeSessionCookie(id: string): Promise<void> {
  const jar = await cookies();
  jar.set(ELIGIBILITY_SESSION_COOKIE, id, cookieOptions());
}

async function hydrateEligibilitySession(id: string): Promise<void> {
  const saved = await readStateCookie(ELIGIBILITY_STATE_COOKIE);
  if (isRecordWithId(saved) && saved.id === id) {
    restoreSessionRecord(saved as EligibilitySessionRecord);
  }
}

/** Copy the bound session to its state cookie. Server Functions only. */
export async function persistEligibilitySession(): Promise<void> {
  const id = await readSessionId();
  if (!id) {
    return;
  }
  await hydrateEligibilitySession(id);
  const record = getSessionRecord(id);
  await writeStateCookie(
    ELIGIBILITY_STATE_COOKIE,
    record && { ...record, resume: undefined },
    SESSION_TTL_MS,
  );
}

/** Isolated from marketing/CMS pages. The id cookie is opaque; state lives in a signed cookie. */
export async function getEligibilitySession(): Promise<EligibilitySessionRecord | null> {
  const id = await readSessionId();
  if (!id) {
    return null;
  }
  await hydrateEligibilitySession(id);
  const record = getSessionRecord(id);
  if (!record || isSessionExpired(record)) {
    return record ? { ...record } : null;
  }
  return record;
}

export async function getOrCreateEligibilitySession(): Promise<EligibilitySessionRecord> {
  const existing = await getEligibilitySession();
  if (existing && !isSessionExpired(existing)) {
    return existing;
  }

  const id = createOpaqueId();
  const record = createSessionRecord(id);
  await writeSessionCookie(id);
  return record;
}
