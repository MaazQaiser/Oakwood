import { cookies } from "next/headers";
import {
  PX_SESSION_COOKIE,
  PX_SESSION_TTL_MS,
  createPxOpaqueId,
  createPxRecord,
  getPxRecord,
  isPxExpired,
  restorePxRecord,
  type PxSessionRecord,
} from "@/features/part-exchange/store";
import {
  isRecordWithId,
  readStateCookie,
  writeStateCookie,
} from "@/lib/session/state-cookie";

const PX_STATE_COOKIE = "oakwood_px_state";
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

async function hydratePxSession(id: string): Promise<void> {
  const saved = await readStateCookie(PX_STATE_COOKIE);
  if (isRecordWithId(saved) && saved.id === id) {
    restorePxRecord(saved as PxSessionRecord);
  }
}

/** Copy the bound session to its state cookie. Server Functions only. */
export async function persistPxSession(): Promise<void> {
  const id = await readPxCookieId();
  if (!id) {
    return;
  }
  await hydratePxSession(id);
  await writeStateCookie(PX_STATE_COOKIE, getPxRecord(id), PX_SESSION_TTL_MS);
}

export async function getPxSession(): Promise<PxSessionRecord | null> {
  const id = await readPxCookieId();
  if (!id) {
    return null;
  }
  await hydratePxSession(id);
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
