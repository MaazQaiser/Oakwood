import { Field, Select } from "@/components/forms/FormControls";
import { supportEnquiryTypes } from "@/lib/support/content";
import { CONTACT_CHOOSE_HELP } from "@/lib/support/copy";
import type { SupportEnquiryType } from "@/types/support";

export function EnquiryTypeSelector({
  value,
  onChange,
  id = "enquiry-type",
}: {
  value: SupportEnquiryType | "";
  onChange: (value: SupportEnquiryType | "") => void;
  id?: string;
}) {
  return (
    <Field htmlFor={id} label={CONTACT_CHOOSE_HELP}>
      <Select
        id={id}
        name="enquiryType"
        required
        value={value}
        onChange={(event) =>
          onChange(event.target.value as SupportEnquiryType | "")
        }
      >
        <option value="">Select a topic</option>
        {supportEnquiryTypes.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>
    </Field>
  );
}
