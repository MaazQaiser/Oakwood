import { HelpTopQuestions } from "@/components/support/HelpTopQuestions";
import type { AftersalesFaqItem } from "@/types/aftersales";
import type { HelpTopicId } from "@/lib/support/help-hub";

export function AftersalesFaq({
  items,
  heading = "Top questions",
  topicId = "servicing",
}: {
  items?: AftersalesFaqItem[];
  heading?: string;
  topicId?: Exclude<HelpTopicId, "all">;
}) {
  void items;
  return <HelpTopQuestions topicId={topicId} heading={heading} />;
}
