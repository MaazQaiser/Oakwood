import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Signed, cookie-backed copies of the in-memory session stores.
 *
 * Each feature store is a module-level Map, which a serverless instance only
 * holds for its own lifetime. A refresh that lands on a cold or different
 * instance used to lose the visitor's progress ("We couldn't find this deal").
 * Sessions now write a copy of their record here and re-seed the Map from it.
 *
 * Records carry state such as eligibility outcomes and paid reservations, so
 * the payload is HMAC-signed and anything that fails verification is ignored.
 */

const DEV_SECRET = "oakwood-dev-session-secret";

function secret(): string {
  const value = process.env.SESSION_COOKIE_SECRET?.trim();
  if (value) {
    return value;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_COOKIE_SECRET must be set in production. Refusing to sign session cookies with the development secret.",
    );
  }
  return DEV_SECRET;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function encode(value: unknown): string {
  const payload = Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decode(raw: string): unknown {
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) {
    return null;
  }
  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

/** Bumped on every touch; ignored when deciding whether a record changed. */
const VOLATILE_KEYS = new Set(["updatedAt", "expiresAt"]);

function contentKey(value: unknown): string {
  return JSON.stringify(value, (key, item: unknown) => {
    if (VOLATILE_KEYS.has(key)) {
      return undefined;
    }
    if (item && typeof item === "object" && !Array.isArray(item)) {
      return Object.fromEntries(
        Object.entries(item as Record<string, unknown>).sort(([a], [b]) =>
          a.localeCompare(b),
        ),
      );
    }
    return item;
  });
}

export async function readStateCookie(name: string): Promise<unknown> {
  const jar = await cookies();
  const raw = jar.get(name)?.value;
  return raw ? decode(raw) : null;
}

/**
 * Server Functions / Route Handlers only. Skips the write when nothing but
 * timestamps changed: any cookie write from a Server Action re-renders the
 * page, so writing on every read-only or repeat call would refresh the UI and
 * can loop with effects that call actions on render.
 */
export async function writeStateCookie(
  name: string,
  value: unknown,
  maxAgeMs: number,
): Promise<void> {
  if (value === null || value === undefined) {
    return;
  }
  const current = await readStateCookie(name);
  if (current !== null && contentKey(current) === contentKey(value)) {
    return;
  }
  const jar = await cookies();
  jar.set(name, encode(value), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(maxAgeMs / 1000),
  });
}

export function isRecordWithId(
  value: unknown,
): value is { id: string; updatedAt: number } {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    typeof (value as { id?: unknown }).id === "string" &&
    typeof (value as { updatedAt?: unknown }).updatedAt === "number"
  );
}
