import { CONTENT_MISSING_INTRO, CONTENT_MISSING_TITLE } from "@/lib/content/copy";

export function ContentMissingNotice({ items }: { items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <aside
      className="rounded-md border border-border bg-page px-4 py-4"
      aria-labelledby="content-missing-title"
    >
      <h2 id="content-missing-title" className="text-h4">
        {CONTENT_MISSING_TITLE}
      </h2>
      <p className="mt-2 text-body-sm text-muted">{CONTENT_MISSING_INTRO}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-body-sm text-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
