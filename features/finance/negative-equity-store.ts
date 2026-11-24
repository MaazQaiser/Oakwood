export type NegEquityLeadSource =
  | "apply"
  | "soft-search"
  | "email-quote"
  | "callback"
  | "appointment"
  | "human";

export interface NegEquityLeadInput {
  source: NegEquityLeadSource;
  name?: string;
  email?: string;
  telephone?: string;
  bestTime?: string;
  site?: string;
  date?: string;
  time?: string;
  stockId?: string;
  quoteSummary?: string;
  /** Apply is flagged as two agreements for Autoconvert. */
  twoAgreements?: boolean;
}

export interface NegEquityLeadRecord extends NegEquityLeadInput {
  id: string;
  reference: string;
  createdAt: number;
}

const leads = new Map<string, NegEquityLeadRecord>();

function opaqueId(): string {
  return `ne_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function reference(id: string): string {
  return `NE-${id.slice(-6).toUpperCase()}`;
}

export function createNegEquityLead(
  input: NegEquityLeadInput,
): NegEquityLeadRecord {
  const id = opaqueId();
  const record: NegEquityLeadRecord = {
    ...input,
    id,
    reference: reference(id),
    createdAt: Date.now(),
    name: input.name?.trim(),
    email: input.email?.trim().toLowerCase(),
    telephone: input.telephone?.trim(),
    bestTime: input.bestTime?.trim(),
  };
  leads.set(id, record);
  return record;
}
