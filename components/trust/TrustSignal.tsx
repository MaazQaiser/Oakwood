import { Button } from "@/components/ui/Button";

export function TrustSignal({
  title,
  copy,
  href,
  cta = "Learn more",
}: {
  title: string;
  copy: string;
  href?: string;
  cta?: string;
}) {
  return (
    <article>
      <h3 className="text-h4">{title}</h3>
      <p className="mt-2 text-body-sm text-muted">{copy}</p>
      {href ? (
        <p className="mt-3">
          <Button href={href} variant="text">
            {cta}
          </Button>
        </p>
      ) : null}
    </article>
  );
}
