import { reservationConfig } from "@/config/reservation";
import { formatPounds } from "@/lib/format/money";

export function formatHoldPeriod(days: number = reservationConfig.holdDurationDays): string {
  return days === 1 ? "1 day" : `${days} days`;
}

export function reservationAmountLabel(
  amount: number = reservationConfig.amount,
): string {
  return formatPounds(amount);
}

export function reserveCtaLabel(amount: number = reservationConfig.amount): string {
  return `Reserve for ${formatPounds(amount)}`;
}

export function payAndReserveLabel(amount: number = reservationConfig.amount): string {
  return `Pay ${formatPounds(amount)} and reserve`;
}

export function formatReservationDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) {
    return "";
  }
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[Number(match[2]) - 1];
  if (!month) {
    return "";
  }
  return `${Number(match[3])} ${month} ${match[1]}`;
}

export function maskReservationEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) {
    return email;
  }
  const visible = local.slice(0, 1);
  return `${visible}•••@${domain}`;
}
