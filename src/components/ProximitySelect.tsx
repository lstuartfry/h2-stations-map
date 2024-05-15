import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

const options = [1, 2, 5, 10, 15, 25];

type Props = {
  selectedProximityRadius: number;
  onChange: (value: number) => void;
};

export default function ProximitySelect(props: Props) {
  const { selectedProximityRadius, onChange } = props;

  return (
    <div className="absolute z-20 right-12 px-3 py-1 top-3 rounded-md flex items-center bg-white">
      (mi)
      <Listbox value={selectedProximityRadius} onChange={onChange}>
        <ListboxButton className="relative block w-full py-1.5 pr-8 pl-3 hover:bg-slate-100">
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
            className="rounded-xl bg-white borderp-1 mt-2 z-20"
          >
            {options.map((option) => (
              <ListboxOption
                key={option}
                value={option}
                className="group flex cursor-pointer items-center gap-2 py-1.5 px-3 hover:bg-slate-100"
              >
                <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                <div>{option}</div>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </Listbox>
    </div>
  );
}
