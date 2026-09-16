"use client";

import { Accordion } from "@/components/ui/Accordion";
import {
  Checkbox,
  Field,
  Select,
  Toggle,
} from "@/components/forms/FormControls";
import {
  AGE_OPTIONS,
  DEPOSIT_OPTIONS,
  MILEAGE_OPTIONS,
  MONTHLY_OPTIONS,
  PRICE_OPTIONS,
  TERM_OPTIONS,
} from "@/components/search/constants";
import { formatNumber, formatPounds } from "@/lib/format/money";
import type { LockedFilters, SearchQuery } from "@/lib/validation/search";
import { splitFilterValues } from "@/lib/validation/search";
import {
  BODY_TYPES,
  CURRENT_YEAR,
  FUEL_TYPES,
  TRANSMISSIONS,
} from "@/lib/vehicles/search";
import { getMakes, getModels, uniqueValues } from "@/lib/vehicles/labels";
import { getSearchCopy } from "@/lib/vehicles/searchCopy";
import { showrooms, stockLocations } from "@/config/locations";
import type { CustomerFinanceMode } from "@/features/eligibility/CustomerFinanceProvider";
import type { VehicleCategory } from "@/types/vehicle";

export function FilterFields({
  query,
  locked,
  financeMode,
  onChange,
  idPrefix = "",
  category = "car",
}: {
  query: SearchQuery;
  locked: LockedFilters;
  financeMode: CustomerFinanceMode;
  onChange: (patch: Partial<SearchQuery>) => void;
  idPrefix?: string;
  category?: VehicleCategory;
}) {
  const copy = getSearchCopy(category);
  const fid = (name: string) => `${idPrefix}${name}`;
  const makes = getMakes(category);
  const models = getModels(query.make ?? locked.make, category);
  const colours = uniqueValues((vehicle) => vehicle.colour, category);
  const bodyTypes =
    category === "van"
      ? uniqueValues((vehicle) => vehicle.bodyStyle, category)
      : [...BODY_TYPES];
  const fuels =
    category === "van"
      ? uniqueValues((vehicle) => vehicle.fuelType, category)
      : [...FUEL_TYPES];
  const transmissions =
    category === "van"
      ? uniqueValues((vehicle) => vehicle.transmission, category)
      : [...TRANSMISSIONS];
  const doorOptions =
    category === "van"
      ? uniqueValues((vehicle) => vehicle.doors, category)
      : ["2", "3", "4", "5"];
  const seatOptions =
    category === "van"
      ? uniqueValues((vehicle) => vehicle.seats, category)
      : ["2", "4", "5", "7"];
  const locations = category === "van" ? showrooms : stockLocations;
  const selectedFuels = splitFilterValues(query.fuel);
  const selectedTransmissions = splitFilterValues(query.transmission);
  const selectedBodies = splitFilterValues(query.body_style);
  const selectedLocations = splitFilterValues(query.location);
  const selectedColours = splitFilterValues(query.colour);
  const eligible = financeMode === "personalised" || financeMode === "ineligible";
  const ageValue = query.min_year
    ? String(CURRENT_YEAR - Number(query.min_year))
    : "";

  function toggleList(
    key: "fuel" | "transmission" | "body_style" | "location" | "colour",
    value: string,
    selected: string[],
  ) {
    const next = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange({ [key]: next.join(",") || undefined });
  }

  return (
    <div>
      <Accordion title="Make & Model" defaultOpen>
        <div className="flex flex-col gap-3">
          <Field htmlFor={fid("filter-make")} label="Make">
            <Select
              id={fid("filter-make")}
              value={query.make ?? ""}
              disabled={Boolean(locked.make)}
              onChange={(event) =>
                onChange({ make: event.target.value || undefined, model: undefined })
              }
            >
              <option value="">Any make</option>
              {makes.map((make) => (
                <option key={make.slug} value={make.slug}>
                  {make.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field htmlFor={fid("filter-model")} label="Model">
            <Select
              id={fid("filter-model")}
              value={query.model ?? ""}
              disabled={Boolean(locked.model) || !(query.make || locked.make)}
              onChange={(event) =>
                onChange({ model: event.target.value || undefined })
              }
            >
              <option value="">Any model</option>
              {models.map((model) => (
                <option key={model.slug} value={model.slug}>
                  {model.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Accordion>

      <Accordion title="Price" defaultOpen>
        <div className="grid grid-cols-2 gap-3">
          <Field htmlFor={fid("filter-min-price")} label="Min">
            <Select
              id={fid("filter-min-price")}
              value={query.min_price ?? ""}
              onChange={(event) =>
                onChange({ min_price: event.target.value || undefined })
              }
            >
              <option value="">Any</option>
              {PRICE_OPTIONS.map((price) => (
                <option key={price} value={price}>
                  {formatPounds(price)}
                </option>
              ))}
            </Select>
          </Field>
          <Field htmlFor={fid("filter-max-price")} label="Max">
            <Select
              id={fid("filter-max-price")}
              value={query.max_price ?? ""}
              onChange={(event) =>
                onChange({ max_price: event.target.value || undefined })
              }
            >
              <option value="">Any</option>
              {PRICE_OPTIONS.map((price) => (
                <option key={price} value={price}>
                  {formatPounds(price)}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Accordion>

      <Accordion title="Monthly payment" defaultOpen>
        <div className="grid grid-cols-2 gap-3">
          <Field htmlFor={fid("filter-monthly-min")} label="Min">
            <Select
              id={fid("filter-monthly-min")}
              value={query.monthly_min ?? ""}
              onChange={(event) =>
                onChange({ monthly_min: event.target.value || undefined })
              }
            >
              <option value="">Any</option>
              {MONTHLY_OPTIONS.map((amount) => (
                <option key={amount} value={amount}>
                  {formatPounds(amount)}
                </option>
              ))}
            </Select>
          </Field>
          <Field htmlFor={fid("filter-monthly-max")} label="Max">
            <Select
              id={fid("filter-monthly-max")}
              value={query.monthly_max ?? query.monthly ?? ""}
              onChange={(event) =>
                onChange({
                  monthly_max: event.target.value || undefined,
                  monthly: undefined,
                })
              }
            >
              <option value="">Any</option>
              {MONTHLY_OPTIONS.map((amount) => (
                <option key={amount} value={amount}>
                  {formatPounds(amount)}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Accordion>

      <Accordion title="Deposit & term">
        <div className="flex flex-col gap-3">
          <Field htmlFor={fid("filter-deposit")} label="Deposit">
            <Select
              id={fid("filter-deposit")}
              value={query.deposit ?? ""}
              onChange={(event) =>
                onChange({ deposit: event.target.value || undefined })
              }
            >
              <option value="">Any</option>
              {DEPOSIT_OPTIONS.map((amount) => (
                <option key={amount} value={amount}>
                  {formatPounds(amount)}
                </option>
              ))}
            </Select>
          </Field>
          <Field htmlFor={fid("filter-term")} label="Term">
            <Select
              id={fid("filter-term")}
              value={query.term ?? ""}
              onChange={(event) =>
                onChange({ term: event.target.value || undefined })
              }
            >
              <option value="">Any</option>
              {TERM_OPTIONS.map((months) => (
                <option key={months} value={months}>
                  {months} months
                </option>
              ))}
            </Select>
          </Field>
          <p className="text-caption">{copy.depositHint}</p>
        </div>
      </Accordion>

      <Accordion title="Age">
        <Field htmlFor={fid("filter-age")} label="Vehicle age">
          <Select
            id={fid("filter-age")}
            value={ageValue}
            onChange={(event) => {
              const years = event.target.value;
              onChange({
                min_year: years
                  ? String(CURRENT_YEAR - Number(years))
                  : undefined,
              });
            }}
          >
            {AGE_OPTIONS.map((option) => (
              <option key={option.label} value={option.years ?? ""}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>
      </Accordion>

      <Accordion title="Mileage">
        <div className="grid grid-cols-2 gap-3">
          <Field htmlFor={fid("filter-min-mileage")} label="Min">
            <Select
              id={fid("filter-min-mileage")}
              value={query.min_mileage ?? ""}
              onChange={(event) =>
                onChange({ min_mileage: event.target.value || undefined })
              }
            >
              <option value="">Any</option>
              {MILEAGE_OPTIONS.map((miles) => (
                <option key={miles} value={miles}>
                  {formatNumber(miles)}
                </option>
              ))}
            </Select>
          </Field>
          <Field htmlFor={fid("filter-max-mileage")} label="Max">
            <Select
              id={fid("filter-max-mileage")}
              value={query.max_mileage ?? ""}
              onChange={(event) =>
                onChange({ max_mileage: event.target.value || undefined })
              }
            >
              <option value="">Any</option>
              {MILEAGE_OPTIONS.map((miles) => (
                <option key={miles} value={miles}>
                  {formatNumber(miles)}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Accordion>

      <Accordion title="Fuel">
        {fuels.map((fuel) => (
          <Checkbox
            key={fuel}
            id={fid(`fuel-${fuel}`)}
            label={fuel}
            checked={selectedFuels.includes(fuel)}
            onChange={() => toggleList("fuel", fuel, selectedFuels)}
          />
        ))}
      </Accordion>

      <Accordion title="Transmission">
        {transmissions.map((transmission) => (
          <Checkbox
            key={transmission}
            id={fid(`transmission-${transmission}`)}
            label={transmission}
            checked={selectedTransmissions.includes(transmission)}
            onChange={() =>
              toggleList("transmission", transmission, selectedTransmissions)
            }
          />
        ))}
      </Accordion>

      {bodyTypes.length > 0 ? (
        <Accordion title={copy.bodyFilterTitle}>
          {bodyTypes.map((body) => (
            <Checkbox
              key={body}
              id={fid(`body-${body}`)}
              label={body}
              checked={selectedBodies.some(
                (item) => item.toLowerCase() === body.toLowerCase(),
              )}
              onChange={() => toggleList("body_style", body, selectedBodies)}
            />
          ))}
        </Accordion>
      ) : null}

      <Accordion title="Colour">
        {colours.map((colour) => (
          <Checkbox
            key={colour}
            id={fid(`colour-${colour}`)}
            label={colour}
            checked={selectedColours.includes(colour)}
            onChange={() => toggleList("colour", colour, selectedColours)}
          />
        ))}
      </Accordion>

      <Accordion title="Doors & seats">
        <div className="grid grid-cols-2 gap-3">
          <Field htmlFor={fid("filter-doors")} label="Doors">
            <Select
              id={fid("filter-doors")}
              value={query.doors ?? ""}
              onChange={(event) =>
                onChange({ doors: event.target.value || undefined })
              }
            >
              <option value="">Any</option>
              {doorOptions.map((doors) => (
                <option key={doors} value={doors}>
                  {doors}
                </option>
              ))}
            </Select>
          </Field>
          <Field htmlFor={fid("filter-seats")} label="Seats">
            <Select
              id={fid("filter-seats")}
              value={query.seats ?? ""}
              onChange={(event) =>
                onChange({ seats: event.target.value || undefined })
              }
            >
              <option value="">Any</option>
              {seatOptions.map((seats) => (
                <option key={seats} value={seats}>
                  {seats}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Accordion>

      <Accordion title="Location" defaultOpen>
        {locations.map((location) => (
          <Checkbox
            key={location.slug}
            id={fid(`location-${location.slug}`)}
            label={location.name}
            checked={
              selectedLocations.includes(location.slug) ||
              locked.location === location.slug
            }
            disabled={Boolean(locked.location)}
            onChange={() =>
              toggleList("location", location.slug, selectedLocations)
            }
          />
        ))}
      </Accordion>

      <Accordion title="Affordable to me" defaultOpen>
        <Toggle
          id={fid("affordable-to-me")}
          label="Affordable to me"
          checked={query.affordable === "1"}
          disabled={!eligible}
          onChange={(event) =>
            onChange({
              affordable: event.target.checked ? "1" : undefined,
            })
          }
        />
        <p className="mt-2 text-caption">
          {eligible ? copy.affordableHintEligible : copy.affordableHintGuest}
        </p>
        {query.affordable === "1" ? (
          <button
            type="button"
            className="mt-2 min-h-11 text-left text-body-sm text-primary"
            onClick={() => onChange({ affordable: undefined })}
          >
            Clear affordable filter
          </button>
        ) : null}
      </Accordion>
    </div>
  );
}
