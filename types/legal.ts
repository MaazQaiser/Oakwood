export type LegalDocumentSlug =
  | "terms"
  | "privacy"
  | "cookies"
  | "distance-selling"
  | "regulatory"
  | "vehicle-purchase"
  | "reservation"
  | "cancellation-refund"
  | "delivery"
  | "accessibility";

export interface LegalSubsection {
  id: string;
  title: string;
  paragraphs: string[];
}

export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  subsections?: LegalSubsection[];
}

export interface LegalRelatedLink {
  href: string;
  label: string;
}

export interface LegalDocument {
  slug: LegalDocumentSlug;
  title: string;
  path: string;
  canonicalPath: string;
  metaTitle: string;
  metaDescription: string;
  hubLabel: string;
  hubDescription: string;
  intro?: string;
  lastUpdated?: string;
  missing: string[];
  sections: LegalSection[];
  related: LegalRelatedLink[];
}

export interface LegalHubItem {
  href: string;
  label: string;
  description: string;
}
