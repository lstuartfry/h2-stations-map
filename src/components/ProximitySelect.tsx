import { Description, Field, Label, Select } from "@headlessui/react";
import clsx from "clsx";

import { ChevronDownIcon } from "@heroicons/react/20/solid";

const options = ["1", "2", "5", "10", "15", "25"];

type Props = {
  selectedProximityRadius: number;
  onChange: (value: number) => void;
};

export default function ProximitySelect(props: Props) {
  const { selectedProximityRadius, onChange } = props;

  return (
    <div className="absolute top-2 right-12 z-20 bg-white p-4 rounded-md shadow-md">
      <Field>
        <Label className="text-base font-medium text-black">
          Proximity (miles)
        </Label>
        <Description className="text-sm/6 text-black/50 max-w-48">
          Draws a sector on the map highlighting stations within the selected
          proximity to your location.
        </Description>
        <div className="relative">
          <Select
            className={clsx(
              "block w-full appearance-none rounded-lg py-1.5 px-3",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
            )}
            onChange={(e) => onChange(Number(e.target.value))}
            value={selectedProximityRadius}
          >
            {options.map((value) => (
              <option key={value} label={value} value={value} />
            ))}
          </Select>
          <ChevronDownIcon
            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
            aria-hidden="true"
          />
        </div>
      </Field>
    </div>
  );
}
