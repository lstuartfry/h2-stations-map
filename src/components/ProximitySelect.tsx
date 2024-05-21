import { Description, Field, Label, Select, Switch } from "@headlessui/react";
import clsx from "clsx";

import { ChevronDownIcon } from "@heroicons/react/20/solid";

const options = ["1", "2", "5", "10", "15", "25"];

type Props = {
  selectedProximityRadius: number;
  checked: boolean;
  onChange: (value: number) => void;
  onToggleSector: () => void;
};

export default function ProximitySelect(props: Props) {
  const { selectedProximityRadius, checked, onChange, onToggleSector } = props;

  return (
    <div className="absolute top-2 right-12 z-20 bg-white p-4 rounded-md shadow-md flex">
      <div>
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
                "block w-full appearance-none rounded-lg py-1.5 px-3 border",
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
              className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black/65"
              aria-hidden="true"
            />
          </div>
        </Field>
      </div>
      <div className="flex flex-col text-base font-medium">
        show sector
        <Switch
          checked={checked}
          onChange={onToggleSector}
          className="mt-1 group inline-flex h-6 w-14 px-1 items-center rounded-full bg-gray-200 transition data-[checked]:bg-yellow-400"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
          />
        </Switch>
      </div>
    </div>
  );
}
