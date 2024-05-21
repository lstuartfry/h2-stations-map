import { Button } from "@headlessui/react";

export default function EnableGPSButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      className="rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white data-[hover]:bg-gray-600 data-[active]:scale-95"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
