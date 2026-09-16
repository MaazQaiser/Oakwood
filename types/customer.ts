export interface CustomerConsent {
  brand: string;
  granted: boolean;
  capturedAt?: string;
  method?: string;
  wordingShown?: string;
}

export interface Customer {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  telephone?: string;
  postcode?: string;
  consents: CustomerConsent[];
}
