import { useState } from "react";
import clsx from "clsx";
import {
  Button,
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

/**
 * A dialogue displayed to the user when the application is first loaded.
 */
const WelcomeDialog = ({
  loaded,
  onGeolocationEnable,
}: {
  loaded: boolean;
  onGeolocationEnable: () => void;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-white/50">
        <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 shadow-lg">
          <DialogTitle className="font-bold">
            Welcome to H2 Stations Map
          </DialogTitle>
          <Description>Enable location services to get started.</Description>
          <Button
            className={clsx(
              "items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white",
              !loaded ? "inline-flex" : "hidden"
            )}
            onClick={onGeolocationEnable}
          >
            Enable
          </Button>
          <Button
            className={clsx(
              "items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white",
              loaded ? "inline-flex" : "hidden"
            )}
            onClick={() => setIsOpen(false)}
          >
            close
          </Button>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default WelcomeDialog;
