export function formatPounds(
  value: number,
  options?: { exact?: boolean },
): string {
  const absolute = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (options?.exact) {
    const [pounds, pence] = absolute.toFixed(2).split(".");
    return `${sign}£${withCommas(pounds)}.${pence}`;
  }

  return `${sign}£${withCommas(String(Math.round(absolute)))}`;
}

export function formatApr(value: number): string {
  const rounded = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return `${rounded}% APR`;
}

export function formatAprFloor(value: number): string {
  return `${formatApr(value)} or better`;
}

export function formatTerm(months: number): string {
  return `${months} months`;
}

export function formatNumber(value: number): string {
  return withCommas(String(Math.round(value)));
}

function withCommas(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
