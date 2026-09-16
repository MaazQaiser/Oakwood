import { Field, Input, Select } from "@/components/forms/FormControls";

const FUEL_OPTIONS = ["Petrol", "Diesel", "Hybrid", "Electric", "Other"];
const TRANSMISSION_OPTIONS = ["Manual", "Automatic"];

export function PxManualVehicleForm({
  year,
  make,
  model,
  variant,
  fuelType,
  transmission,
  error,
  onChange,
}: {
  year: string;
  make: string;
  model: string;
  variant: string;
  fuelType: string;
  transmission: string;
  error?: string;
  onChange: (field: string, value: string) => void;
}) {
  return (
    <div className="mt-6 space-y-4">
      <Field htmlFor="px-year" label="Year" error={error && !year ? error : undefined}>
        <Input
          id="px-year"
          name="year"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          value={year}
          onChange={(event) => onChange("year", event.target.value.replace(/[^\d]/g, ""))}
        />
      </Field>
      <Field htmlFor="px-make" label="Make">
        <Input
          id="px-make"
          name="make"
          autoComplete="off"
          value={make}
          onChange={(event) => onChange("make", event.target.value)}
        />
      </Field>
      <Field htmlFor="px-model" label="Model">
        <Input
          id="px-model"
          name="model"
          autoComplete="off"
          value={model}
          onChange={(event) => onChange("model", event.target.value)}
        />
      </Field>
      <Field htmlFor="px-variant" label="Variant" hint="Optional">
        <Input
          id="px-variant"
          name="variant"
          autoComplete="off"
          value={variant}
          onChange={(event) => onChange("variant", event.target.value)}
        />
      </Field>
      <Field htmlFor="px-fuel" label="Fuel">
        <Select
          id="px-fuel"
          name="fuelType"
          value={fuelType}
          onChange={(event) => onChange("fuelType", event.target.value)}
        >
          <option value="">Choose fuel type</option>
          {FUEL_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Field>
      <Field htmlFor="px-transmission" label="Transmission">
        <Select
          id="px-transmission"
          name="transmission"
          value={transmission}
          onChange={(event) => onChange("transmission", event.target.value)}
        >
          <option value="">Choose transmission</option>
          {TRANSMISSION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Field>
      {error ? (
        <p className="text-caption text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
