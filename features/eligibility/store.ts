import type { FinanceProfile } from "@/types/finance";
import type {
  EligibilityAnswers,
  EligibilityConsentRecord,
  EligibilityOutcomeKind,
  EligibilityQuestionId,
  EligibilityResultDisplay,
} from "@/types/eligibility";

export const ELIGIBILITY_SESSION_COOKIE = "oakwood_eligibility_session";
export const SESSION_TTL_MS = 4 * 60 * 60 * 1000;
export const RESUME_TTL_MS = 24 * 60 * 60 * 1000;

export interface EligibilitySessionRecord {
  id: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
  answers: EligibilityAnswers;
  questionId?: EligibilityQuestionId;
  marketingConsent?: EligibilityConsentRecord;
  financeConsent?: EligibilityConsentRecord;
  outcome?: EligibilityOutcomeKind;
  profile?: FinanceProfile;
  display?: EligibilityResultDisplay;
  email?: string;
  resume?: {
    token: string;
    email: string;
    expiresAt: number;
    used: boolean;
  };
}

const sessions = new Map<string, EligibilitySessionRecord>();
const resumeIndex = new Map<string, string>();

function isFresh(record: EligibilitySessionRecord, now: number): boolean {
  return record.expiresAt > now;
}

export function createSessionRecord(id: string, now = Date.now()): EligibilitySessionRecord {
  const record: EligibilitySessionRecord = {
    id,
    createdAt: now,
    updatedAt: now,
    expiresAt: now + SESSION_TTL_MS,
    answers: {},
  };
  sessions.set(id, record);
  return record;
}

export function getSessionRecord(id: string, now = Date.now()): EligibilitySessionRecord | null {
  const record = sessions.get(id);
  if (!record) {
    return null;
  }
  if (!isFresh(record, now)) {
    return { ...record, outcome: record.outcome, answers: record.answers };
  }
  return record;
}

export function isSessionExpired(record: EligibilitySessionRecord, now = Date.now()): boolean {
  return record.expiresAt <= now;
}

export function touchSession(
  id: string,
  patch: Partial<EligibilitySessionRecord>,
  now = Date.now(),
): EligibilitySessionRecord | null {
  const current = sessions.get(id);
  if (!current) {
    return null;
  }
  const next: EligibilitySessionRecord = {
    ...current,
    ...patch,
    id: current.id,
    createdAt: current.createdAt,
    updatedAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };
  sessions.set(id, next);
  return next;
}

export function saveResumeToken(
  sessionId: string,
  token: string,
  email: string,
  now = Date.now(),
): EligibilitySessionRecord | null {
  const current = sessions.get(sessionId);
  if (!current || isSessionExpired(current, now)) {
    return null;
  }

  if (current.resume?.token) {
    resumeIndex.delete(current.resume.token);
  }

  const record = touchSession(sessionId, {
    email,
    resume: {
      token,
      email: email.trim().toLowerCase(),
      expiresAt: now + RESUME_TTL_MS,
      used: false,
    },
  }, now);

  resumeIndex.set(token, sessionId);
  return record;
}

export function consumeResumeToken(
  token: string,
  email: string,
  now = Date.now(),
): EligibilitySessionRecord | null {
  const sessionId = resumeIndex.get(token);
  if (!sessionId) {
    return null;
  }
  const record = sessions.get(sessionId);
  if (!record?.resume) {
    return null;
  }
  if (record.resume.used || record.resume.expiresAt <= now) {
    return null;
  }
  if (record.resume.email !== email.trim().toLowerCase()) {
    return null;
  }

  const next = touchSession(sessionId, {
    resume: { ...record.resume, used: true },
  }, now);
  resumeIndex.delete(token);
  return next;
}

export function findSessionByResumeToken(token: string): EligibilitySessionRecord | null {
  const sessionId = resumeIndex.get(token);
  return sessionId ? sessions.get(sessionId) ?? null : null;
}
