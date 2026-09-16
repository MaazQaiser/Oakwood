import { Button } from "@/components/ui/Button";
import { Container, Grid, Section } from "@/components/layout/Container";
import { SectionIntro } from "@/components/home/SectionIntro";
import { LocationCard } from "@/components/locations/LocationCard";
import { showroomProfiles } from "@/config/locations";
import { getLocationUrl, routes } from "@/config/routes";

export { LocationCard } from "@/components/locations/LocationCard";

export function LocationSection() {
  return (
    <Section>
      <Container>
        <SectionIntro
          align="center"
          eyebrow="Visit Oakwood"
          heading="Find your nearest Oakwood."
        >
          Visit us in Bury or Chorley and see your next car in person.
        </SectionIntro>
        <Grid columns="two" className="mt-8">
          {showroomProfiles.map((profile) => (
            <LocationCard
              key={profile.slug}
              profile={profile}
              href={getLocationUrl(profile.slug)}
              headingLevel="h3"
            />
          ))}
        </Grid>
        <p className="mt-6 text-center">
          <Button href={routes.locations} variant="text">
            All locations
          </Button>
        </p>
      </Container>
    </Section>
  );
}
