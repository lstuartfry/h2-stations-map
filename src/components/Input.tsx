import { Field, Input as InputField, Label } from "@headlessui/react";
import clsx from "clsx";

interface Props {
  errorMessage?: string;
  label: string;
  name: string;
  placeholder: string;
}

/**
 * A reusable Input component that generates a label field associated with the input field,
 * and conditionally renders any errors associated with the field.
 */
export default function Input({
  errorMessage,
  label,
  name,
  placeholder,
}: Props) {
  return (
    <Field>
      <Label
        className={clsx(
          "text-sm/6 text-black/60 font-medium",
          errorMessage && "text-red-400"
        )}
      >
        {label}
      </Label>
      <InputField
        className={clsx(
          "border rounded p-2 w-full",
          errorMessage && "border-red-400"
        )}
        name={name}
        placeholder={placeholder}
      />
      {errorMessage && <span className="text-red-400">{errorMessage}</span>}
    </Field>
  );
}
