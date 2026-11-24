"use server";

import { createPriceDropAlert } from "@/features/alerts/store";
import type { PriceAlertChannel } from "@/types/price-alert";

const CHANNELS: PriceAlertChannel[] = ["email", "sms", "whatsapp"];

function isChannel(value: string): value is PriceAlertChannel {
  return CHANNELS.includes(value as PriceAlertChannel);
}

export async function submitPriceDropAlert(input: {
  stockId: string;
  email?: string;
  telephone?: string;
  channels: string[];
}): Promise<{ ok: true; reference: string } | { ok: false; error: string }> {
  const channels = input.channels.filter(isChannel);
  if (channels.length === 0) {
    return { ok: false, error: "Choose at least one alert channel." };
  }
  if (channels.includes("email") && !input.email?.trim()) {
    return { ok: false, error: "Enter an email address for email alerts." };
  }
  if (
    (channels.includes("sms") || channels.includes("whatsapp")) &&
    !input.telephone?.trim()
  ) {
    return { ok: false, error: "Enter a mobile number for SMS or WhatsApp alerts." };
  }

  const record = createPriceDropAlert({
    stockId: input.stockId,
    email: input.email,
    telephone: input.telephone,
    channels,
  });

  return { ok: true, reference: record.reference };
}