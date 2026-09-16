import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import {
  ELIGIBILITY_SESSION_COOKIE,
  SESSION_TTL_MS,
  createSessionRecord,
  getSessionRecord,
  isSessionExpired,
  type EligibilitySessionRecord,
} from "@/features/eligibility/store";

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

/** Isolated from marketing/CMS pages. Cookie holds an opaque session id only. */
export async function getEligibilitySession(): Promise<EligibilitySessionRecord | null> {
  const id = await readSessionId();
  if (!id) {
    return null;
  }
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
