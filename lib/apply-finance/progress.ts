import type { ApplySectionId, ApplyStep, ApplyStepId } from "@/types/apply-finance";

export function sectionFill(
  steps: ApplyStep[],
  stepId: ApplyStepId,
): Partial<Record<ApplySectionId, number>> {
  const index = steps.findIndex((step) => step.id === stepId);
  if (index < 0) return {};

  const fills: Partial<Record<ApplySectionId, number>> = {};
  const sections = new Set(steps.map((step) => step.section));
  for (const section of sections) {
    const pages = steps.filter((step) => step.section === section);
    const done = pages.filter(
      (step) => steps.findIndex((item) => item.id === step.id) < index,
    ).length;
    fills[section] = pages.length ? done / pages.length : 0;
  }
  return fills;
}

export function mergeFill(
  current: Partial<Record<ApplySectionId, number>>,
  next: Partial<Record<ApplySectionId, number>>,
): Partial<Record<ApplySectionId, number>> {
  const keys = new Set([
    ...Object.keys(current),
    ...Object.keys(next),
  ]) as Set<ApplySectionId>;
  let changed = false;
  const merged: Partial<Record<ApplySectionId, number>> = { ...current };
  for (const key of keys) {
    const value = Math.max(current[key] ?? 0, next[key] ?? 0);
    if ((current[key] ?? 0) !== value) changed = true;
    merged[key] = value;
  }
  return changed ? merged : current;
}

export function timeRemainingLabel(steps: ApplyStep[], stepId: ApplyStepId): string {
  const index = Math.max(
    0,
    steps.findIndex((step) => step.id === stepId),
  );
  const remaining = Math.max(1, steps.length - index);
  const minutes = Math.max(1, Math.ceil((remaining * 15) / 60));
  return minutes === 1
    ? "About 1 minute remaining"
    : `About ${minutes} minutes remaining`;
}
