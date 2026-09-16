import { Alert } from "@/components/ui/Alert";
import { LEGAL_MISSING_INTRO, LEGAL_MISSING_TITLE } from "@/lib/legal/copy";

export function LegalMissingNotice({ items }: { items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Alert title={LEGAL_MISSING_TITLE} tone="warning">
      <p>{LEGAL_MISSING_INTRO}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Alert>
  );
}
