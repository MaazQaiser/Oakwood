import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Card } from "@/components/cards/Card";
import { Container, Grid, Section } from "@/components/layout/Container";
import { SectionIntro } from "@/components/home/SectionIntro";
import { BlogCard } from "@/features/content/components/BlogCard";
import { BlogHero } from "@/features/content/components/BlogHero";
import { ContentTopicLink } from "@/features/content/components/ContentTopicLink";
import { ContentViewTracker } from "@/features/content/components/ContentViewTracker";
import { getBlogTopicUrl, routes } from "@/config/routes";
import {
  getFeaturedArticle,
  listContentByTopic,
  listContentByType,
  toHubItem,
  contentTopics,
} from "@/content/editorial";
import {
  CONTENT_ALL_LABEL,
  CONTENT_CMS_NOTICE,
  CONTENT_FINANCE_LABEL,
  CONTENT_GUIDES_LABEL,
  CONTENT_HUB_EYEBROW,
  CONTENT_HUB_H1,
  CONTENT_HUB_INTRO,
  CONTENT_LATEST_LABEL,
  CONTENT_MODEL_LABEL,
  CONTENT_TOPICS_LABEL,
} from "@/lib/content/copy";
import { financeGuides } from "@/lib/mock/home";
import { createBreadcrumbs } from "@/lib/seo";

export function BlogHub({ topic }: { topic?: string }) {
  const featured = getFeaturedArticle();
  const featuredItem = featured ? toHubItem(featured) : undefined;
  const articles = listContentByType("article")
    .filter((entry) => entry.slug !== featured?.slug)
    .map(toHubItem);
  const latest = listContentByTopic(topic)
    .filter((entry) => entry.slug !== featured?.slug)
    .map(toHubItem);
  const guides = listContentByType("model-guide")
    .filter((entry) => entry.featured)
    .map(toHubItem);
  const popularGuides =
    guides.length > 0
      ? guides
      : listContentByType("model-guide").slice(0, 4).map(toHubItem);
  const modelContent = listContentByType("model-guide").map(toHubItem);
  const comparisons = listContentByType("comparison").map(toHubItem);
  const filtered = Boolean(topic && topic !== "all");

  return (
    <>
      <ContentViewTracker slug="hub" type="article" />
      <Section className="pb-0">
        <Container>
          <Breadcrumbs
            items={createBreadcrumbs([
              { label: "Home", href: routes.home },
              { label: "Blog", href: routes.blog },
            ])}
          />
        </Container>
      </Section>
      <section className="border-b border-border bg-surface">
        <Container className="py-10 md:py-16">
          <SectionIntro
            eyebrow={CONTENT_HUB_EYEBROW}
            heading={CONTENT_HUB_H1}
            headingLevel="h1"
          >
            <p>{CONTENT_HUB_INTRO}</p>
          </SectionIntro>
        </Container>
      </section>
      <Section>
        <Container>
          <nav aria-label={CONTENT_TOPICS_LABEL} className="mb-8">
            <p className="text-label">{CONTENT_TOPICS_LABEL}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {contentTopics.map((item) => (
                <li key={item.id}>
                  <ContentTopicLink
                    href={getBlogTopicUrl(item.id === "all" ? undefined : item.id)}
                    topic={item.id}
                    current={
                      item.id === "all"
                        ? !filtered
                        : topic === item.id
                    }
                  >
                    {item.id === "all" ? CONTENT_ALL_LABEL : item.label}
                  </ContentTopicLink>
                </li>
              ))}
            </ul>
          </nav>

          {!filtered ? (
            <>
              <BlogHero featured={featuredItem} />
              {articles.length > 0 ? (
                <section className="mt-12" aria-labelledby="latest-articles-heading">
                  <h2 id="latest-articles-heading" className="text-h2">
                    {CONTENT_LATEST_LABEL}
                  </h2>
                  <Grid columns="cards" className="mt-6">
                    {articles.map((item) => (
                      <BlogCard key={item.slug} item={item} headingLevel="h3" />
                    ))}
                  </Grid>
                </section>
              ) : null}
              {popularGuides.length > 0 ? (
                <section className="mt-12" aria-labelledby="popular-guides-heading">
                  <h2 id="popular-guides-heading" className="text-h2">
                    {CONTENT_GUIDES_LABEL}
                  </h2>
                  <Grid columns="cards" className="mt-6">
                    {popularGuides.map((item) => (
                      <BlogCard key={item.slug} item={item} headingLevel="h3" />
                    ))}
                  </Grid>
                </section>
              ) : null}
              <section className="mt-12" aria-labelledby="finance-content-heading">
                <h2 id="finance-content-heading" className="text-h2">
                  {CONTENT_FINANCE_LABEL}
                </h2>
                <Grid columns="cards" className="mt-6">
                  {financeGuides.map((guide) => (
                    <Card key={guide.href} as="article">
                      <h3 className="text-h4">
                        <Link
                          href={guide.href}
                          className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                          {guide.title}
                        </Link>
                      </h3>
                      <p className="mt-2 text-body-sm text-muted">{guide.description}</p>
                    </Card>
                  ))}
                </Grid>
              </section>
              {modelContent.length > 0 || comparisons.length > 0 ? (
                <section className="mt-12" aria-labelledby="model-content-heading">
                  <h2 id="model-content-heading" className="text-h2">
                    {CONTENT_MODEL_LABEL}
                  </h2>
                  <Grid columns="cards" className="mt-6">
                    {comparisons.map((item) => (
                      <BlogCard key={item.slug} item={item} headingLevel="h3" />
                    ))}
                    {modelContent.slice(0, 6).map((item) => (
                      <BlogCard key={item.slug} item={item} headingLevel="h3" />
                    ))}
                  </Grid>
                </section>
              ) : null}
            </>
          ) : (
            <section aria-labelledby="filtered-content-heading">
              <h2 id="filtered-content-heading" className="text-h2">
                {contentTopics.find((item) => item.id === topic)?.label ?? CONTENT_LATEST_LABEL}
              </h2>
              {latest.length > 0 ? (
                <Grid columns="cards" className="mt-6">
                  {latest.map((item) => (
                    <BlogCard key={item.slug} item={item} headingLevel="h3" />
                  ))}
                </Grid>
              ) : (
                <p className="mt-4 text-body-sm text-muted">
                  No published guides in this topic yet.
                </p>
              )}
            </section>
          )}
          <p className="mt-12 text-caption text-muted">{CONTENT_CMS_NOTICE}</p>
        </Container>
      </Section>
    </>
  );
}
