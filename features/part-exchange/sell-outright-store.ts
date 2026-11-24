import { randomBytes } from "crypto";

export interface SellOutrightLead {
  id: string;
  createdAt: number;
  name: string;
  email: string;
  mobile: string;
  registration: string;
  mileage?: number;
  intent: "sell-only";
  destination: "SCI";
}

const leads = new Map<string, SellOutrightLead>();

export function saveSellOutrightLead(
  input: Omit<SellOutrightLead, "id" | "createdAt" | "intent" | "destination">,
): SellOutrightLead {
  const lead: SellOutrightLead = {
    id: randomBytes(12).toString("hex"),
    createdAt: Date.now(),
    intent: "sell-only",
    destination: "SCI",
    ...input,
  };
  leads.set(lead.id, lead);
  return lead;
}

export function listSellOutrightLeads(): SellOutrightLead[] {
  return Array.from(leads.values()).sort((a, b) => b.createdAt - a.createdAt);
}
