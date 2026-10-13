export const LAST_VIEWED_STOCK_COOKIE = "oakwood_last_viewed_stock";
export const LAST_VIEWED_STOCK_KEY = "oakwood:last-viewed-stock";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function setLastViewedStockId(stockId: string): void {
  if (typeof document === "undefined" || !stockId) {
    return;
  }
  try {
    window.localStorage.setItem(LAST_VIEWED_STOCK_KEY, stockId);
  } catch {
    // Ignore storage failures.
  }
  document.cookie = `${LAST_VIEWED_STOCK_COOKIE}=${encodeURIComponent(stockId)}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function readLastViewedStockIdClient(): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  try {
    const fromStorage = window.localStorage.getItem(LAST_VIEWED_STOCK_KEY);
    if (fromStorage) {
      return fromStorage;
    }
  } catch {
    // Ignore storage failures.
  }
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LAST_VIEWED_STOCK_COOKIE}=`));
  if (!match) {
    return undefined;
  }
  return decodeURIComponent(match.split("=").slice(1).join("="));
}
