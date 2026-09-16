import type { FinanceIntentSlug } from "@/types/finance";

export interface FinanceFaqItem {
  question: string;
  answer: string;
}

export interface FinanceExplainerBlock {
  title: string;
  paragraphs: string[];
}

export interface FinanceEducationCard {
  title: string;
  body: string;
}

export interface FinanceEducationStep {
  title: string;
  body: string;
}

export interface FinanceComparisonRow {
  label: string;
  hp: string;
  pcp: string;
}

export interface FinanceRelatedLink {
  href: string;
  label: string;
}

export interface FinanceIntentPageContent {
  slug: FinanceIntentSlug;
  eyebrow: string;
  h1: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  whatThisMeans: FinanceExplainerBlock;
  howOakwoodHelps: FinanceExplainerBlock;
  eligibility: FinanceExplainerBlock;
  education: {
    title: string;
    paragraphs?: string[];
    cards?: FinanceEducationCard[];
    steps?: FinanceEducationStep[];
    comparison?: boolean;
  };
  faqs: FinanceFaqItem[];
  related: FinanceRelatedLink[];
  secondaryCta?: {
    href: string;
    label: string;
    event: "calculator" | "browse" | "px";
  };
}

export interface FinanceHubContent {
  eyebrow: string;
  h1: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  journeyTitle: string;
  guidesTitle: string;
}
