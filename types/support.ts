export type SupportEnquiryType =
  | "buying"
  | "finance"
  | "part-exchange"
  | "reservation"
  | "servicing"
  | "mot"
  | "warranty"
  | "delivery"
  | "existing-order"
  | "general";

export type SupportComplaintCategory =
  | "buying"
  | "finance"
  | "reservation"
  | "part-exchange"
  | "aftersales"
  | "delivery"
  | "other";

export type SupportFaqCategory =
  | "buying"
  | "finance"
  | "vehicles"
  | "part-exchange"
  | "reservation"
  | "delivery"
  | "servicing"
  | "mot"
  | "warranty"
  | "journey";

export interface SupportFaqItem {
  id: string;
  category: SupportFaqCategory;
  question: string;
  answer: string;
  href?: string;
  hrefLabel?: string;
}

export interface SupportVehicleContext {
  stockId: string;
  label: string;
  href: string;
}

export interface SupportPathway {
  href: string;
  title: string;
  body: string;
}
