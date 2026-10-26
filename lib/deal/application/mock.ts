/** Brief pause so the saving state is visible. Not a lender round-trip. */
export function mockSubmitDelayMs(): number {
  return 900;
}

export function applicationReference(dealId: string): string {
  const seed = dealId.replace(/[^a-zA-Z0-9]/g, "").slice(-8);
  return `APP-${seed.toUpperCase() || "DEMO01"}`;
}
