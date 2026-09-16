export interface ProcessStep {
  number: string;
  title: string;
  copy: string;
  href?: string;
  cta?: string;
}

export interface TrustPageCopy {
  eyebrow: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
}

export interface TrustSection {
  title: string;
  body: string;
}
