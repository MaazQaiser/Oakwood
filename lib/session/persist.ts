import { persistAftersalesSessions } from "@/features/aftersales/session";
import { persistEligibilitySession } from "@/features/eligibility/session";
import { persistPxSession } from "@/features/part-exchange/session";
import { persistReservation } from "@/features/reservation/session";

/**
 * Wrap a Server Action so the visitor's session records are copied to their
 * signed state cookies once it finishes (see lib/session/state-cookie.ts).
 * Covers every mutation path in the action without per-return bookkeeping;
 * unchanged records are not rewritten, so read-only actions stay cookie-free.
 */
export function withSessionPersistence<Args extends unknown[], Result>(
  action: (...args: Args) => Promise<Result>,
): (...args: Args) => Promise<Result> {
  return async (...args: Args) => {
    try {
      return await action(...args);
    } finally {
      await persistEligibilitySession();
      await persistPxSession();
      await persistReservation();
      await persistAftersalesSessions();
    }
  };
}
