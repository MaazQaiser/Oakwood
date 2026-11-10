import { routes } from "@/config/routes";
import {
  HELP_FAQS,
  type HelpTopicId,
} from "@/lib/support/help-hub";

export function HelpTopQuestions({
  topicId,
  heading = "Top questions",
  limit = 3,
}: {
  topicId: Exclude<HelpTopicId, "all">;
  heading?: string;
  limit?: number;
}) {
  const items = HELP_FAQS.filter((faq) => faq.topicId === topicId).slice(
    0,
    limit,
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={`help-top-${topicId}-heading`}>
      <h2 id={`help-top-${topicId}-heading`} className="text-h3">
        {heading}
      </h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`${routes.help}#${item.id}`}
              className="text-body-sm font-semibold text-primary"
            >
              {item.question}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4">
        <a
          href={`${routes.help}#${topicId}`}
          className="text-body-sm font-semibold text-primary"
        >
          Browse all {topicId === "servicing" ? "servicing" : topicId} questions →
        </a>
      </p>
    </section>
  );
}
