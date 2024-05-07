import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

const options = [1, 2, 5, 10, 15, 25];

type Props = {
  selectedProximityRadius: number;
  onChange: (value: number) => void;
};

export default function ProximitySelect(props: Props) {
  const { selectedProximityRadius, onChange } = props;

  return (
    <div className="absolute z-10 mx-auto bg-white">
      Desired proximity
      <Listbox value={selectedProximityRadius} onChange={onChange}>
        <ListboxButton
          className={clsx(
            "relative block w-full rounded-lg py-1.5 pr-8 pl-3 text-left text-sm",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
          )}
        >
          {selectedProximityRadius}
          <ChevronDownIcon
            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black/60"
            aria-hidden="true"
          />
        </ListboxButton>
        <Transition
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions
            anchor="bottom"
            className="w-[var(--button-width)] rounded-xl border border-white/5 p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none"
          >
            {options.map((option) => (
              <ListboxOption
                key={option}
                value={option}
                className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
              >
                <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                <div className="text-sm">{option}</div>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </Listbox>
    </div>
  );
}
