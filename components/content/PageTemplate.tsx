import { PageBanner } from "@/components/layout/PageBanner";

interface PageTemplateProps {
  title: string;
  route: string;
  template: string;
  children?: React.ReactNode;
}

export function PageTemplate({
  title,
  template,
  children,
}: PageTemplateProps) {
  return (
    <>
      <PageBanner
        eyebrow={template.replace(/Page$/, "").replace(/([a-z])([A-Z])/g, "$1 $2")}
        title={title}
      />
      {children ? <section className="mx-auto w-full max-w-[var(--oak-width-content)] px-[var(--oak-page-x)] py-10">{children}</section> : null}
    </>
  );
}
