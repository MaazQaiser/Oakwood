import { routes } from "@/config/routes";
import type { BreadcrumbItem } from "@/lib/seo";
import type { LockedFilters, SearchQuery } from "@/lib/validation/search";
import {
  getInventoryTitle,
  getLocationName,
  getMakeName,
  getModelName,
} from "@/lib/vehicles/labels";
import { getSearchCopy } from "@/lib/vehicles/searchCopy";
import type { VehicleCategory } from "@/types/vehicle";

export interface InventoryPageContext {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  basePath: string;
  locked: LockedFilters;
  variant: "inventory" | "search";
  category: VehicleCategory;
  searchAction: string;
}

export function getInventoryContext(
  locked: LockedFilters = {},
  options?: {
    basePath?: string;
    variant?: "inventory" | "search";
    query?: SearchQuery;
    category?: VehicleCategory;
  },
): InventoryPageContext {
  const variant = options?.variant ?? "inventory";
  const category = options?.category ?? "car";
  const copy = getSearchCopy(category);
  const makeName = getMakeName(locked.make, category);
  const modelName = getModelName(locked.make, locked.model, category);
  const locationName = getLocationName(locked.location);
  const hubHref = copy.hubHref;
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: routes.home },
    { label: copy.hubLabel, href: hubHref },
  ];

  if (locked.location && category === "car") {
    breadcrumbs.push({
      label: locationName ?? locked.location,
      href: `${routes.usedCars}/location/${locked.location}`,
    });
  }

  if (locked.make) {
    const makeHref =
      locked.location && category === "car"
        ? `${routes.usedCars}/location/${locked.location}/${locked.make}`
        : `${hubHref}/${locked.make}`;
    breadcrumbs.push({
      label: makeName ?? locked.make,
      href: makeHref,
    });
  }

  if (locked.model) {
    const modelHref =
      locked.location && category === "car"
        ? `${routes.usedCars}/location/${locked.location}/${locked.make}/${locked.model}`
        : `${hubHref}/${locked.make}/${locked.model}`;
    breadcrumbs.push({
      label: modelName ?? locked.model,
      href: modelHref,
    });
  }

  if (variant === "search" && breadcrumbs.length === 2) {
    breadcrumbs.push({ label: "Search", href: routes.search });
  }

  const title =
    variant === "search" && !locked.make && !locked.location
      ? getSearchHeading(options?.query, category)
      : getInventoryTitle(locked, category);

  const basePath =
    options?.basePath ??
    (variant === "search"
      ? routes.search
      : category === "van"
        ? routes.usedVans
        : routes.usedCars);

  const searchAction =
    category === "van" || variant === "search" ? basePath : routes.search;

  const description =
    !locked.make && !locked.model && !locked.location
      ? copy.landingDescription
      : getSeoCopy({
          title,
          description: copy.landingDescription,
          breadcrumbs,
          basePath,
          locked,
          variant,
          category,
          searchAction,
        }).paragraph;

  return {
    title,
    description,
    breadcrumbs,
    basePath,
    locked,
    variant,
    category,
    searchAction,
  };
}

function titleCaseBody(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  return value
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getSearchHeading(
  query?: SearchQuery,
  category: VehicleCategory = "car",
): string {
  const copy = getSearchCopy(category);

  if (!query) {
    return category === "van" ? "Search used vans" : "Search used cars";
  }

  const make = getMakeName(query.make, category);
  const model = getModelName(query.make, query.model, category);
  const location = getLocationName(query.location);
  const body = titleCaseBody(query.body_style);

  if (make || model || location) {
    return getInventoryTitle(
      {
        make: query.make,
        model: query.model,
        location: query.location,
      },
      category,
    );
  }

  if (body) {
    return `Used ${body} ${copy.nounPlural === "vans" ? "Vans" : "Cars"} for Sale`;
  }

  if (query.q) {
    return "Search results";
  }

  return category === "van" ? "Search used vans" : "Search used cars";
}

export function getSeoCopy(context: InventoryPageContext): {
  heading: string;
  paragraph: string;
} {
  const category = context.category ?? "car";
  const product = category === "van" ? "vans" : "cars";
  const make = getMakeName(context.locked.make, category);
  const model = getModelName(context.locked.make, context.locked.model, category);
  const location = getLocationName(context.locked.location);

  if (make && model && location) {
    return {
      heading: `Used ${make} ${model} ${product} in ${location}`,
      paragraph: `Browse used ${make} ${model} ${product} available through Oakwood in ${location}. Monthly figures are shown first so you can see what fits your budget, with finance options and vehicle preparation included before you reserve.`,
    };
  }

  if (make && location) {
    return {
      heading: `Used ${make} ${product} in ${location}`,
      paragraph: `Explore used ${make} ${product} at Oakwood in ${location}. Check finance eligibility to see personalised monthly figures, then compare specification, price and location before you choose.`,
    };
  }

  if (make && model) {
    return {
      heading: `Used ${make} ${model} ${product} at Oakwood`,
      paragraph:
        category === "van"
          ? `Find used ${make} ${model} vans for sale with Oakwood. We show monthly payments first, alongside cash price, key specification and the branch where the van is stored.`
          : `Find used ${make} ${model} cars for sale with Oakwood. We show monthly payments first, alongside cash price, key specification and the branch where the car is stored.`,
    };
  }

  if (make) {
    return {
      heading: `Used ${make} ${product} at Oakwood`,
      paragraph:
        category === "van"
          ? `Shop used ${make} vans with finance-first monthly figures. Oakwood prepares vehicles at Bury and Chorley, and can help you check eligibility before you browse.`
          : `Shop used ${make} cars with finance-first monthly figures. Oakwood prepares vehicles at Bury and Chorley, and can help you check eligibility before you browse.`,
    };
  }

  if (location) {
    return {
      heading: `Used ${product} in ${location}`,
      paragraph: `Used ${product} available in ${location} through Oakwood Motor Company. Compare monthly payments, specification and finance options, then reserve when you are ready.`,
    };
  }

  if (category === "van") {
    return {
      heading: "Used vans at Oakwood",
      paragraph:
        "Browse available Oakwood vans and find one that fits your budget. Monthly payments are shown first, with cash price, specification and location so you can compare vans at Bury and Chorley, then check eligibility, build a deal or reserve.",
    };
  }

  return {
    heading: "Used Cars at Oakwood",
    paragraph:
      "Oakwood Motor Company is a finance-first used-car marketplace. Browse cars by monthly payment, cash price and specification, with stock available around Bury, Chorley and nearby locations. Vehicles are prepared before sale, and you can check finance eligibility in around 60 seconds without affecting your credit score.",
  };
}
