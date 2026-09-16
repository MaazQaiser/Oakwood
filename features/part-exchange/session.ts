import { cookies } from "next/headers";
import {
  PX_SESSION_COOKIE,
  PX_SESSION_TTL_MS,
  createPxOpaqueId,
  createPxRecord,
  getPxRecord,
  isPxExpired,
  type PxSessionRecord,
} from "@/features/part-exchange/store";
import type { PxSource } from "@/types/part-exchange";

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(PX_SESSION_TTL_MS / 1000),
  };
}

export async function writePxCookie(id: string): Promise<void> {
  const jar = await cookies();
  jar.set(PX_SESSION_COOKIE, id, cookieOptions());
}

export async function readPxCookieId(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(PX_SESSION_COOKIE)?.value;
}

export async function getPxSession(): Promise<PxSessionRecord | null> {
  const id = await readPxCookieId();
  if (!id) {
    return null;
  }
  const record = getPxRecord(id);
  if (!record) {
    return null;
  }
  return record;
}

export async function getOrCreatePxSession(
  source: PxSource,
): Promise<PxSessionRecord> {
  const existing = await getPxSession();
  if (existing && !isPxExpired(existing)) {
    return existing;
  }

  const id = createPxOpaqueId();
  const record = createPxRecord(id, source);
  await writePxCookie(id);
  return record;
}
