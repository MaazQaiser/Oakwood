import { HelpContactCards } from "@/features/support/help/HelpContactCards";
import { HelpFaqClient } from "@/features/support/help/HelpFaqClient";
import { createFaqJsonLd } from "@/lib/seo/json-ld";
import { HELP_FAQS } from "@/lib/support/help-hub";

export function HelpHubPage() {
  const jsonLd = createFaqJsonLd(
    HELP_FAQS.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HelpFaqClient />
      <HelpContactCards />
    </>
  );
}
