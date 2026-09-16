import { Field, Input } from "@/components/forms/FormControls";
import { PX_MANUAL_FALLBACK } from "@/lib/part-exchange/copy";

export function PxRegistrationForm({
  id = "px-registration",
  value,
  error,
  onChange,
  onManual,
}: {
  id?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onManual?: () => void;
}) {
  return (
    <div className="mt-6 space-y-4">
      <Field
        label="Registration number"
        htmlFor={id}
        error={error}
      >
        <Input
          id={id}
          name="registration"
          autoComplete="off"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          maxLength={10}
          value={value}
          error={Boolean(error)}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className="uppercase tracking-[0.12em]"
          inputMode="text"
        />
      </Field>
      {onManual ? (
        <button
          type="button"
          className="inline-flex min-h-11 items-center text-body-sm text-primary underline-offset-4 hover:underline"
          onClick={onManual}
        >
          {PX_MANUAL_FALLBACK}
        </button>
      ) : null}
    </div>
  );
}
