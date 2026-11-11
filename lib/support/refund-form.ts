export type RefundPaymentMethod = "bacs" | "card";

export interface StaffRefundFormInput {
  customerName: string;
  registration: string;
  salesExecutive?: string;
  paymentMethod: RefundPaymentMethod;
  accountNumber?: string;
  sortCode?: string;
  cardNumber?: string;
  cardExpiry?: string;
  reason: string;
}

export function validateStaffRefundForm(
  input: StaffRefundFormInput,
): string | undefined {
  if (!input.customerName.trim()) {
    return "Enter the customer name.";
  }
  if (!input.registration.trim()) {
    return "Enter the vehicle registration.";
  }
  if (input.paymentMethod !== "bacs" && input.paymentMethod !== "card") {
    return "Choose how they paid.";
  }
  if (input.paymentMethod === "bacs") {
    const account = (input.accountNumber ?? "").replace(/\D/g, "");
    if (account.length !== 8) {
      return "Enter an 8-digit account number.";
    }
    const sort = (input.sortCode ?? "").replace(/\D/g, "");
    if (sort.length !== 6) {
      return "Enter a 6-digit sort code.";
    }
  }
  if (input.paymentMethod === "card") {
    const card = (input.cardNumber ?? "").replace(/\D/g, "");
    if (card.length !== 16) {
      return "Enter a 16-digit card number.";
    }
    const expiry = (input.cardExpiry ?? "").trim();
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      return "Enter the expiry as MM/YY.";
    }
    const [mm, yy] = expiry.split("/").map(Number);
    if (!mm || mm < 1 || mm > 12) {
      return "Enter a valid expiry month.";
    }
    const now = new Date();
    const expiryDate = new Date(2000 + yy, mm);
    if (expiryDate <= now) {
      return "The card expiry must be in the future.";
    }
  }
  if (!input.reason.trim()) {
    return "Enter the reason for the refund.";
  }
  return undefined;
}

export function formatSortCode(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 6);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
}
