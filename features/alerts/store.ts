import { randomBytes } from "crypto";
import type { PriceAlertInput, PriceAlertRecord } from "@/types/price-alert";

const alerts = new Map<string, PriceAlertRecord>();

function opaqueId(): string {
  return randomBytes(16).toString("hex");
}

function reference(id: string): string {
  return `OAK-ALERT-${id.slice(0, 8).toUpperCase()}`;
}

export function createPriceDropAlert(input: PriceAlertInput): PriceAlertRecord {
  const id = opaqueId();
  const record: PriceAlertRecord = {
    id,
    createdAt: Date.now(),
    reference: reference(id),
    stockId: input.stockId,
    email: input.email?.trim() || undefined,
    telephone: input.telephone?.trim() || undefined,
    channels: input.channels,
  };
  alerts.set(id, record);
  return record;
}

export function listPriceDropAlertsForStock(stockId: string): PriceAlertRecord[] {
  return [...alerts.values()].filter((item) => item.stockId === stockId);
}