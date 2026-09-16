import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";

interface PageTemplateProps {
  title: string;
  route: string;
  template: string;
  children?: ReactNode;
}

export function PageTemplate({
  title,
  route,
  template,
  children,
}: PageTemplateProps) {
  return (
    <Container className="py-8 md:py-12">
      <header className="space-y-2">
        <p className="text-caption text-muted">
          Route: {route} · Template: {template}
        </p>
        <h1 className="text-h1">{title}</h1>
      </header>
      {children ? <section className="mt-6">{children}</section> : null}
    </Container>
  );
}
