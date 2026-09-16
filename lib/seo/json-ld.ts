import { getVehicleUrl, routes } from "@/config/routes";
import { showrooms } from "@/config/locations";
import type { BreadcrumbItem } from "@/lib/seo";
import type { ShowroomProfile } from "@/types/locations";
import type { VehicleDetail } from "@/types/vehicle-detail";

function offerAvailability(status: VehicleDetail["availability"]): string {
  if (status === "sold" || status === "expired") {
    return "https://schema.org/SoldOut";
  }
  if (status === "reserved") {
    return "https://schema.org/PreOrder";
  }
  return "https://schema.org/InStock";
}

export function createVehicleJsonLd(
  vehicle: VehicleDetail,
  breadcrumbs: BreadcrumbItem[],
) {
  const url = getVehicleUrl(vehicle);
  const bury = showrooms.find((item) => item.slug === "bury");

  const vehicleNode = {
    "@type": ["Vehicle", "Car"],
    "@id": `${url}#vehicle`,
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    brand: { "@type": "Brand", name: vehicle.make },
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileage,
      unitCode: "SMI",
    },
    fuelType: vehicle.fuelType,
    vehicleTransmission: vehicle.transmission,
    color: vehicle.colour,
    bodyType: vehicle.bodyStyle,
    additionalProperty: vehicle.registration
      ? {
          "@type": "PropertyValue",
          name: "Registration",
          value: vehicle.registration,
        }
      : undefined,
    image: vehicle.images.map((image) => image.src),
  };

  const offer = {
    "@type": "Offer",
    "@id": `${url}#offer`,
    url,
    price: vehicle.cashPrice,
    priceCurrency: "GBP",
    availability: offerAvailability(vehicle.availability),
    itemOffered: { "@id": `${url}#vehicle` },
    seller: { "@id": `${routes.home}#dealer` },
  };

  const dealer = {
    "@type": "AutoDealer",
    "@id": `${routes.home}#dealer`,
    name: "Oakwood Motor Company",
    telephone: bury?.telephone,
    address: bury
      ? {
          "@type": "PostalAddress",
          addressLocality: bury.name,
          postalCode: bury.postcode,
          addressRegion: bury.region,
          addressCountry: "GB",
        }
      : undefined,
  };

  const breadcrumbList = {
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href,
    })),
  };

  const video = vehicle.video
    ? {
        "@type": "VideoObject",
        name: vehicle.video.title,
        description: vehicle.video.description,
        thumbnailUrl: vehicle.video.poster,
        uploadDate: vehicle.listedAt,
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [vehicleNode, offer, dealer, breadcrumbList, video].filter(Boolean),
  };
}

export function createFaqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function createLocalBusinessJsonLd(
  profile: ShowroomProfile,
  path: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: `Oakwood Motor Company ${profile.name}`,
    url: path,
    telephone: profile.telephone,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.name,
      postalCode: profile.postcode,
      addressRegion: profile.region,
      addressCountry: "GB",
    },
  };
}

export function createBreadcrumbJsonLd(breadcrumbs: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href,
    })),
  };
}

export function createArticleJsonLd({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  image,
  authorName,
}: {
  headline: string;
  description?: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    url,
    ...(description ? { description } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ?? datePublished
      ? { dateModified: dateModified ?? datePublished }
      : {}),
    ...(image ? { image } : {}),
    ...(authorName ? { author: { "@type": "Person", name: authorName } } : {}),
    publisher: {
      "@type": "Organization",
      name: "Oakwood Motor Company",
    },
  };
}
