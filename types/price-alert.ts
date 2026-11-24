export type PriceAlertChannel = "email" | "sms" | "whatsapp";

export interface PriceAlertInput {
  stockId: string;
  email?: string;
  telephone?: string;
  channels: PriceAlertChannel[];
}

export interface PriceAlertRecord extends PriceAlertInput {
  id: string;
  createdAt: number;
  reference: string;
}