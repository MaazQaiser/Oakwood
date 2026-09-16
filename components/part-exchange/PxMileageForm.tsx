import { EligibilityNumberInput } from "@/components/eligibility/controls";
import { PX_MILEAGE_HELPER } from "@/lib/part-exchange/copy";

export function PxMileageForm({
  id = "px-mileage",
  value,
  error,
  onChange,
}: {
  id?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-6">
      <EligibilityNumberInput
        id={id}
        label="Mileage"
        hint={PX_MILEAGE_HELPER}
        error={error}
        value={value}
        onChange={onChange}
        placeholder="62000"
      />
    </div>
  );
}
