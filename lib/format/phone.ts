export function toTelHref(telephone: string): string {
  const digits = telephone.replace(/[^\d+]/g, "");
  if (digits.startsWith("00")) {
    return `tel:+${digits.slice(2)}`;
  }
  if (digits.startsWith("0")) {
    return `tel:+44${digits.slice(1)}`;
  }
  return `tel:${digits}`;
}
