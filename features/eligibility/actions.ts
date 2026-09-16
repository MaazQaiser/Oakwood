"use server";

import {
  consumeResumeToken,
  findSessionByResumeToken,
  isSessionExpired,
  saveResumeToken,
  touchSession,
} from "@/features/eligibility/store";
import {
  createOpaqueId,
  getEligibilitySession,
  getOrCreateEligibilitySession,
  writeSessionCookie,
} from "@/features/eligibility/session";
import { decideEligibility, shouldDelayDecision } from "@/features/eligibility/decision";
import {
  MARKETING_CONSENT_WORDING,
  SOFT_SEARCH_CONSENT_WORDING,
} from "@/lib/eligibility/copy";
import { sanitiseAnswers } from "@/lib/eligibility/questions";
import type {
  EligibilityAnswers,
  EligibilityQuestionId,
  EligibilityUiState,
} from "@/types/eligibility";

function toUiState(
  record: NonNullable<Awaited<ReturnType<typeof getEligibilitySession>>>,
  expired = false,
): EligibilityUiState {
  if (expired) {
    return {
      status: "expired",
      answers: {},
    };
  }

  if (record.outcome && record.outcome !== "error") {
    return {
      status: "complete",
      answers: record.answers,
      questionId: record.questionId,
      outcome: record.outcome,
      display: record.display,
      profileExpiry: record.profile?.expiry,
    };
  }

  if (record.outcome === "error") {
    return {
      status: "in_progress",
      answers: record.answers,
      questionId: record.questionId,
      outcome: "error",
    };
  }

  return {
    status: Object.keys(record.answers).length > 0 ? "in_progress" : "empty",
    answers: record.answers,
    questionId: record.questionId,
  };
}

export async function ensureEligibilitySession(): Promise<{ ok: true }> {
  await getOrCreateEligibilitySession();
  return { ok: true };
}

export async function getEligibilityUiState(): Promise<EligibilityUiState> {
  const record = await getEligibilitySession();
  if (!record) {
    return { status: "empty", answers: {} };
  }
  return toUiState(record, isSessionExpired(record));
}

export async function saveEligibilityProgress(input: {
  answers: EligibilityAnswers;
  questionId: EligibilityQuestionId;
}): Promise<{ ok: true } | { ok: false; expired: true }> {
  const record = await getEligibilitySession();
  if (!record || isSessionExpired(record)) {
    return { ok: false, expired: true };
  }

  touchSession(record.id, {
    answers: sanitiseAnswers(input.answers),
    questionId: input.questionId,
    email: input.answers.email?.trim().toLowerCase() ?? record.email,
  });
  return { ok: true };
}

export async function saveFinanceAssumptions(input: {
  deposit: number;
  term: number;
}): Promise<void> {
  const record = await getEligibilitySession();
  if (!record || isSessionExpired(record) || !record.display) {
    return;
  }

  const deposit = Math.max(0, Math.round(input.deposit));
  const term = Math.max(12, Math.round(input.term));
  touchSession(record.id, {
    answers: { ...record.answers, deposit },
    display: {
      ...record.display,
      deposit,
      term,
    },
  });
}

export async function submitEligibilityCheck(input: {
  answers: EligibilityAnswers;
  consentedAt: string;
}): Promise<
  | { ok: true; state: EligibilityUiState }
  | { ok: false; expired: true }
  | { ok: false; unavailable: true }
> {
  const record = await getOrCreateEligibilitySession();
  if (isSessionExpired(record)) {
    return { ok: false, expired: true };
  }

  const answers = sanitiseAnswers(input.answers);
  if (shouldDelayDecision(answers)) {
    await new Promise((resolve) => {
      setTimeout(resolve, 4500);
    });
  } else {
    await new Promise((resolve) => {
      setTimeout(resolve, 1200);
    });
  }

  const decision = decideEligibility(
    answers,
    `oakwood_${record.id}`,
    new Date(input.consentedAt),
  );

  if (decision.kind === "error") {
    touchSession(record.id, {
      answers,
      email: answers.email?.trim().toLowerCase(),
      outcome: "error",
    });
    return { ok: false, unavailable: true };
  }

  const updated = touchSession(record.id, {
    answers,
    email: answers.email?.trim().toLowerCase(),
    outcome: decision.kind,
    profile: decision.profile,
    display: decision.display,
    financeConsent: {
      granted: true,
      timestamp: input.consentedAt,
      method: "eligibility_soft_search",
      wording: SOFT_SEARCH_CONSENT_WORDING,
    },
    marketingConsent: {
      granted: Boolean(answers.marketingConsent),
      timestamp: input.consentedAt,
      method: "eligibility_soft_search",
      wording: MARKETING_CONSENT_WORDING,
    },
  });

  if (!updated) {
    return { ok: false, unavailable: true };
  }

  return { ok: true, state: toUiState(updated) };
}

export async function createEligibilityResumeLink(input: {
  email: string;
  answers: EligibilityAnswers;
  questionId?: EligibilityQuestionId;
}): Promise<{ ok: true } | { ok: false; expired: true }> {
  const record = await getOrCreateEligibilitySession();
  if (isSessionExpired(record)) {
    return { ok: false, expired: true };
  }

  const email = input.email.trim().toLowerCase();
  touchSession(record.id, {
    answers: sanitiseAnswers({ ...record.answers, ...input.answers, email }),
    questionId: input.questionId ?? record.questionId,
    email,
  });
  saveResumeToken(record.id, createOpaqueId(), email);
  return { ok: true };
}

export async function resumeEligibilitySession(input: {
  token: string;
  email: string;
}): Promise<{ ok: true; state: EligibilityUiState } | { ok: false; reason: "invalid" | "expired" }> {
  const pending = findSessionByResumeToken(input.token);
  if (!pending?.resume) {
    return { ok: false, reason: "invalid" };
  }
  if (pending.resume.expiresAt <= Date.now() || pending.resume.used) {
    return { ok: false, reason: "expired" };
  }

  const record = consumeResumeToken(input.token, input.email);
  if (!record) {
    return { ok: false, reason: "invalid" };
  }

  await writeSessionCookie(record.id);
  return { ok: true, state: toUiState(record, isSessionExpired(record)) };
}
